// WEBRTC SERVICE FILE

//file received callback typescript
declare global { 
    interface Window {
        onFileReceivedCallback?: (fileData: {name: string, size: number, url: string}) => void
    }
}

// RTC CONFIGURATION FOR LAN (NO STUNS) and WAN (stun)
let peerRTC_config: RTCConfiguration;
export function selectConfig(
    selectedNetwork: 'LAN' | 'WAN' | null
) {
    //if network is LAN no stuns servers (local transfer)
    if (selectedNetwork === 'LAN') {
        peerRTC_config = {
            iceServers: [],
            iceTransportPolicy: 'all'
        }
    }
    //else if network is WAN create stun server for stability
    else {
        peerRTC_config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ],
            iceTransportPolicy: 'all'
        }
    }
}

//peer connection and peer data channel states
export let peerConnection: RTCPeerConnection | null = null
export let peerDataChannel: RTCDataChannel | null = null

//ice candidates in queue state
const iceCandidatesQueue: RTCIceCandidateInit[] = []

//cleaning up exists connection before new one
function cleanupExistingConnection() {
    if (peerDataChannel) {
        peerDataChannel.close()
        peerDataChannel = null
    }
    if (peerConnection) {
        peerConnection.close()
        peerConnection = null
    }
}

//adding ICE candidates or pushing to queue when to early (before desciptions)
export async function addIceCandidateSafe(candidate: RTCIceCandidateInit) {
    if (peerConnection && peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (e) {
            console.error("ERR: Adding ICE error", e)
        }
    } else {
        iceCandidatesQueue.push(candidate)
    }
}

//flushing ice candidates in queue (adding to peerConnection)
export async function flushIceCandidates() {
    if (peerConnection && peerConnection.remoteDescription) {
        while (iceCandidatesQueue.length > 0) {
            const candidate = iceCandidatesQueue.shift()
            if (candidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            }
        }
    }
}

//create offer by host and sending it to peer
export async function createAndSendOffer(socket: WebSocket): Promise<void> {
    cleanupExistingConnection()//before new offer, cleaning old connection
    peerConnection = new RTCPeerConnection(peerRTC_config)//new peerConnection

    //sending ICE candidates to peer
    peerConnection.onicecandidate = (e) => {
        if (e.candidate && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'ICE_CANDIDATES',
                candidate: e.candidate
            }))
        }
    }

    peerDataChannel = peerConnection.createDataChannel('fileTransfer')//creating file data channel
    peerDataChannel.binaryType = 'arraybuffer'

    //logs for file channel (can be removed)
    peerDataChannel.onopen = () => console.log('LOG: RTC data channel is open.')
    peerDataChannel.onclose = () => console.error('ERR: RTC data channel is close!')

    const offer = await peerConnection.createOffer()//creating and set offer
    await peerConnection.setLocalDescription(offer)

    //sending offer when socket is open
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'SIGNAL_OFFER', sdp: peerConnection.localDescription }))
    }
}

//answering offer from host
export async function handleAnswerOffer(
    offerSdp: RTCSessionDescriptionInit,
    socket: WebSocket,
    returnProgress: (progress: number) => void,
    returnBytesInSec: (bytesInSec: number) => void,
    returnETA: (seconds: number) => void,
    returnSumControl: (ok: boolean) => void
) {
    return new Promise<void>(async (resolve, reject) => {
        cleanupExistingConnection()//cleaning exist connection
        peerConnection = new RTCPeerConnection(peerRTC_config)//creating new connection

        //when ice canidate, sent it to host
        peerConnection.onicecandidate = (e) => {
            if (e.candidate && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'ICE_CANDIDATES',
                    candidate: e.candidate
                }))
            }
        }

        //when host has opened the data channel connect to channel
        peerConnection.ondatachannel = (e: RTCDataChannelEvent) => {
            peerDataChannel = e.channel
            peerDataChannel.binaryType = 'arraybuffer'
            peerDataChannel.onopen = () => console.log('LOG: Peer has connected to data channel.')

            let downloadFinished = false

            //when host has sent the file, start receiving it
            getFile(peerDataChannel, (fileData) => {
                downloadFinished = true
                if (window.onFileReceivedCallback) {
                    window.onFileReceivedCallback(fileData)
                }
                resolve()
            },
                //progress 0-100 for progressbar
                (progress) => {
                    returnProgress(progress)
                },
                //bytes in second
                (bytesInSec) => {
                    returnBytesInSec(bytesInSec)
                },
                //remaining time
                (seconds) => {
                    returnETA(seconds)
                },
                (sumControlBoolean) => {
                    returnSumControl(sumControlBoolean)
                }

            )
            //when channel is close, log it
            peerDataChannel.onclose = () => {
                if (downloadFinished) {
                    return
                }
                reject()
            }
        }

        //peer sets host sdp and flush ICE
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp))
        await flushIceCandidates()

        //peer creates yours answer and sends it to host
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "SIGNAL_ANSWER",
                sdp: peerConnection.localDescription
            }))
        }
    }
    )
}
    

//host answers sdp from peer and sets it
export async function handleSetRemoteAnswer(answerSdp: RTCSessionDescriptionInit) {
    if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answerSdp))
        await flushIceCandidates()
    }
}

//sending file
export function sendFile(file: File, onProgress?: (clampedProgress: number) => void, onBytesInSec?: (BytesInSec: number) => void, onETA?: (seconds: number) => void) {
    return new Promise<void>(async(resolve, reject) => {
        let lastProgress = -1//progress (for progress bar)
        //when peer data chaneel doesnt exists or is not open throw error
        if (!peerDataChannel || peerDataChannel.readyState !== 'open') {
            console.error('ERR: Channel is not open!')
            reject()
            return
        }

        const channel = peerDataChannel

        const SIZE = 256 * 1024 //256kb chunk max
        const arrayBuffer = await file.arrayBuffer()//launching arraybuffer
        const totalSize = arrayBuffer.byteLength//total size of file
        let offset = 0//sended size
        let lastUpdateTime = performance.now()
        let lastBytesSend = 0

        //Crypto API
        // only chunk of hash (avoid crash)
        const hashChunkSize = 5 * 1024 * 1024
        const firstChunk = file.slice(0, Math.min(file.size, hashChunkSize))
        const lastChunk = file.slice(Math.max(0, file.size - hashChunkSize), file.size)
        
        const blob = new Blob([firstChunk, lastChunk])
        const hashArrayBuffer = await blob.arrayBuffer()
        const hash = await crypto.subtle.digest('SHA-256', hashArrayBuffer)//control sum
        const hashArray = Array.from(new Uint8Array(hash))//changes to HEX
        const fileHash = hashArray.map(a => a.toString(16).padStart(2, '0')).join('')


        channel.send(JSON.stringify({
            type: 'SEND_FILE',
            fileName: file.name,
            fileSize: file.size,
            fileHash: fileHash
        }))

        await new Promise(resolve => setTimeout(resolve, 50))//cooldown for small devices
        channel.bufferedAmountLowThreshold = 256 * 1024 // 256 kb size of chunk

        const sendChunks = () => {
            //when size of sended chunks is bigger than total size of file and
            //buffer amount is smaller than 4mb send chunk
            while (offset < arrayBuffer.byteLength && channel.bufferedAmount < 4 * 1024 * 1024) {
                const chunk = arrayBuffer.slice(offset, offset + SIZE)//slicing file (256kb next chunk)
                channel.send(chunk)//sending to peer
                offset += SIZE//adding sended chunk size to offset

                //send speed (for information)
                const now = performance.now()
                const timeElapsed = (now - lastUpdateTime) / 1000//time in seconds
                if (timeElapsed >= 1) {
                    const BytesThisTime = offset - lastBytesSend//all sent bytes - last all sent bytes
                    const BytesInSec = (BytesThisTime / timeElapsed)//in B/s

                    //ETA
                    const remainingBytes = totalSize - offset//total size of file - all sent bytes
                    const seconds = BytesInSec > 0 ? remainingBytes / BytesInSec : 0//sec left

                    //sending props
                    if (onBytesInSec) onBytesInSec(BytesInSec)
                    if (onETA) onETA(seconds)

                    //refresh and update
                    lastUpdateTime = now
                    lastBytesSend = offset
                }

                //progress (for progress bar)
                const currentProgress = Math.floor((offset / totalSize) * 100)
                const clampedProgress = Math.min(100, currentProgress)
                //refresh progress every new number (optimization)
                if (lastProgress !== clampedProgress) {
                    lastProgress = clampedProgress
                    if (onProgress) {
                        onProgress(clampedProgress)
                    }
                }

                //when file was sent to peer clear buffer
                if (offset >= totalSize) {
                    channel.onbufferedamountlow = null
                    lastProgress = -1
                    resolve()
                }
            }
        }

        //when buffer send chunk
        channel.onbufferedamountlow = () => {
            sendChunks()
        }

        //starting first sending
        sendChunks()
    }
)}


//getting file (peer)
export function getFile(
    channel: RTCDataChannel, 
    onFileReady?: (fileData: { name: string, size: number, url: string }) => void, 
    onProgress?: (progress: number) => void,
    onBytesInSec?: (bytesInSec: number) => void,
    onETA?: (seconds: number) => void,
    sumControl?: (ok: boolean) => void
) {
    let fileMetadata: { name: string, size: number } | null = null//file metadatas, name and size
    let receivedSize: number = 0//received size
    let lastUpdateTime = performance.now()
    let lastBytesSend = 0

    //variables for arraybuffer disk saver
    let chunksController: ReadableStreamDefaultController<Uint8Array> | null = null 

    channel.binaryType = 'arraybuffer'
    let lastProgress = -1//progress (for progressbar)

    let hostSumControl = ''

    //listening to channel
    channel.onmessage = async (e) => {
        if (typeof e.data === 'string') {
            try {
                const data = JSON.parse(e.data)
                // when host starts to send file save metadatas and reset variables
                if (data.type === 'SEND_FILE') {
                    fileMetadata = { name: data.fileName, size: data.fileSize }
                    receivedSize = 0
                    lastProgress = -1
                    hostSumControl = data.fileHash

                    //new readable stream
                    chunksController = null
                    const newReadable = new ReadableStream<Uint8Array>({
                        start(controller) {
                            chunksController = controller
                        }
                    })
                    //sets to global variable
                    ;(window as any).__currentStreamReader = newReadable
                }
            }
            catch (err) {
                console.error('ERR: Parse error!')
            }
            return
        }

        const chunk = e.data as ArrayBuffer//get chunk
        receivedSize += chunk.byteLength//update received size (RECEIVED + CHUNK SIZE)

        //saving to stream
        if (chunksController) {
            chunksController.enqueue(new Uint8Array(chunk))
        }

        //ETA and bytes peer second
        const now = performance.now()
        const timeElapsed = (now - lastUpdateTime) / 1000//time in seconds
        if (timeElapsed >= 1) {
            const BytesThisTime = receivedSize - lastBytesSend//all sent bytes - last all sent bytes
            const BytesInSec = (BytesThisTime / timeElapsed)//in B/s

            //ETA
            const remainingBytes = (fileMetadata?.size || 0) - receivedSize//total size of file - all sent bytes
            const seconds = BytesInSec > 0 ? remainingBytes / BytesInSec : 0//sec left

            //sending props
            if (onBytesInSec) onBytesInSec(BytesInSec)
            if (onETA) onETA(seconds)

            //refresh and update
            lastUpdateTime = now
            lastBytesSend = receivedSize
        }


        //progress (for progress bar)
        const progress = Math.floor((receivedSize / (fileMetadata?.size || 1)) * 100)
        const clampedProgress = Math.min(100, progress)

        //refreshing after one full number (optimization)
        if (clampedProgress !== lastProgress) {
            lastProgress = clampedProgress
            if (onProgress) {
                onProgress(clampedProgress)
            }
        } 

        //when file metadata exists and received size >= file full size get file download URL
        if (fileMetadata && receivedSize >= fileMetadata.size) {
            console.log('LOG: Downloaded!')

            //closing stream
            if (chunksController) {
                chunksController.close()
            }

            //creating url
            let blob = new Blob([])
            if ((window as any).__currentStreamReader) {
                blob = await new Response((window as any).__currentStreamReader).blob()
            }
            const dowlandURL = URL.createObjectURL(blob)

            //if file ready state (returning to sendsecondstep.tsx) return file data
            if (onFileReady) {
                onFileReady({
                    name: fileMetadata.name,// name of file
                    size: fileMetadata.size,// size of file
                    url: dowlandURL// URL to download file
                })
            }
            //when on file ready doesnt exists try to download immediately
            else {
                const a = document.createElement('a')
                a.href = dowlandURL
                a.download = fileMetadata.name
                a.click()
                URL.revokeObjectURL(dowlandURL)
            }

            //SUM CONTROL CHECK
            //only hashing small chunks (avoid chrome crash)
            const hashSliceSize = 5 * 1024 * 1024
            const firstChunk = blob.slice(0, Math.min(blob.size, hashSliceSize))
            const lastChunk = blob.slice(Math.max(0, blob.size - hashSliceSize), blob.size)

            const combinedBlob = new Blob([firstChunk, lastChunk])
            const completeReceivedBuffers = await combinedBlob.arrayBuffer()
            const receivedHash = await crypto.subtle.digest('SHA-256', completeReceivedBuffers)
            //converting
            const hash = Array.from(new Uint8Array(receivedHash))
            const receivedFileHash = hash.map(a => a.toString(16).padStart(2, '0')).join('')

            if (receivedFileHash === hostSumControl) {
                console.log('DEBUG: Sum control ok!')
                if (sumControl) sumControl(true)
            }
            else {
                console.error('DEBUG: Sum control error: ', receivedFileHash, '|||||', hostSumControl)
                if (sumControl) sumControl(false)
            }

            //reseting variables after download
            fileMetadata = null
            receivedSize = 0
        }
    }
}
