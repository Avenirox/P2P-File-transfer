import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../locales/LoginContext";
import { Copy, GlobeCheck, icons, Lock, Network, Radio, Send, Trash, UserRoundX, X } from "lucide-react";
import { addIceCandidateSafe, createAndSendOffer, handleAnswerOffer, handleSetRemoteAnswer, selectConfig, sendFile } from "../../services/webrtc";
import { handleDowloadFile, handleCancelFile, handleFileChange, handleDeleteFile, handlesendFile } from "../../utils/SendSecondStep/handlers";
import { calculateFileSize, formatBytesPerSecond, formatETAseconds, WakeLock, ClearWakeLock } from "../../utils/SendSecondStep/functions";
import QRCode from "react-qr-code";

interface NetworkProps {
    selectedNetwork: 'LAN' | 'WAN' | null
}

interface IncomingFile {
    name: string
    size: number
    url: string
}

function SendSecondStep({ selectedNetwork }: NetworkProps) {
    const {t} = useLanguage()//translator
    const [roomID, setRoomID] = useState<string>('')//full new room ID (_lan...)
    const [roomURL, setRoomURL] = useState<string>('')//full new room URL (https://....?room=....)

    const [role, setRole] = useState<'HOST' | 'PEER'>()

    const [fileName, setFileName] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)//file state for host
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [incomingFile, setIncomingFile] = useState<IncomingFile | null>(null)//received file state for peer

    const [status, setStatus] = useState<'CONNECTING' | 'ROOM_CREATED' | 'PEER_JOINED' | 'HOST_LEFT' | 'PEER_LEFT' | 'JOINED_ROOM' | 'SENDING' | 'NO_ROOM' | 'RECEIVING' | 'ROOM_FULL' | 'LIMIT' | 'FLOOD'>('CONNECTING')
    const socketRef = useRef<WebSocket | null>(null)//websocket ref
    const [progress, setProgress] = useState<Number>(0)//progress for peer and host
    const [bytesPerSec, setBytesPerSec] = useState<number>(0)//bytes peer second for peer and host
    const [ETA, setETA] = useState<number>(0)//remaining time to download file for peer and host
    const [sumControl, setSumControl] = useState<boolean | null>(null)//sum control for peer

    const [displayStuckWarn, setStuckWarn] = useState<Boolean>(false)

    //time out + useeffect for stuck warning
    useEffect(() => {
        const isValidStatus = status === 'SENDING' || status === 'RECEIVING'
        if (!isValidStatus) {
            setStuckWarn(false)// do not display stuck warn
            return
        }

        //displaying warn after 8 seconds
        const timer = setTimeout(() => {
            setStuckWarn(true)
        }, 8000)

        return () => clearTimeout(timer)//clearing timer after status change
    }, [status])

    //always on display on this component
    useEffect(() => {
        WakeLock()

        return () => {
            ClearWakeLock()
        }
    }, [])

    //if peer receive file set it to state
    useEffect(() => {
        window.onFileReceivedCallback = (filedata) => {
            console.log('DEBUG: taked file!')
            setIncomingFile(filedata)
        }
        return () => {
            window.onFileReceivedCallback = undefined
        }
    }, [])

    //creating room url and connecting to ws
    useEffect(() => {
        selectConfig(selectedNetwork)//configuring LAN or WAN stun (look webrtc.ts)
        //get ?room= param if exists
        const searchParams = new URLSearchParams(window.location.search)
        const existingRoom = searchParams.get('room')

        let fullRoomID;
        //when param in URL set role to peer
        if (existingRoom) {
            fullRoomID = existingRoom
            setRole('PEER')
        }
        //else generate new room ID and set role to host
        else {
            //generating roomID by crypto
            const generatedID = crypto.randomUUID()
            fullRoomID = (selectedNetwork === 'LAN' ? '_lan' : '_wan') + generatedID
            setRoomID(fullRoomID)
            setRole('HOST')
        }

        //creating URL 
        const protocol = window.location.protocol //e.g. http, https
        const port = window.location.port ? `:${window.location.port}` : '' //e.g. 5173 443
        const host = window.location.hostname || 'localhost' //app IP

        //connecting all to create full room url with param
        const roomURL = selectedNetwork === 'LAN' ? `${protocol}//${host}${port}/send?room=${fullRoomID}` : `${window.location.origin}/send?room=${fullRoomID}`
        setRoomURL(roomURL)

        //connecting to socket (server.js)
        const socket = new WebSocket(`https://p2p-pvqi.onrender.com/`)//server url (change it to node server url)
        socketRef.current = socket //ref for socket

        let isConnected: boolean = false

        //connecting to socket
        socket.onopen = () => {
            isConnected = true
            //if param in url try to find room (peer)
            if (existingRoom) {
                socket.send(JSON.stringify({
                    type: 'join-room',
                    RoomID: fullRoomID
                }))
                return
            }
            //when no param in url create room (host)
            else {
                socket.send(JSON.stringify({
                    type: 'create-room',
                    RoomID: fullRoomID
                }))
                return
            }
        }

        //receiving messages function
        socket.onmessage = async (e) => {
            try {
                const data = JSON.parse(e.data)

                //answering from host sdp request
                if (data.type === 'SIGNAL_OFFER') {
                    await handleAnswerOffer(data.sdp, socket, (returnProgress) => {//webrtc service (look /assets/webrtc.ts)
                        setStatus('RECEIVING')
                        setProgress(returnProgress)
                        if (returnProgress === 100) {
                            setStatus('JOINED_ROOM')
                        }
                    }, (bytesInSec) => {
                        setBytesPerSec(bytesInSec)
                    }, (seconds) => {
                        setETA(seconds)
                    }, (sumControl) => {
                        setSumControl(sumControl)
                    })
                }
                //answering sdp from peer (exchange)
                else if (data.type === 'SIGNAL_ANSWER') {
                    await handleSetRemoteAnswer(data.sdp)//webrtc service (look /assets/webrtc.ts)
                }
                //ice candidates
                else if (data.type === 'ICE_CANDIDATES') {
                    if (data.candidate) {
                        await addIceCandidateSafe(data.candidate)//webrtc service (look /assets/webrtc.ts)
                    }
                }

                //status set from websocket message
                switch (data.message) {
                    case 'room_created':
                        setStatus('ROOM_CREATED')
                        break
                    case 'peer_joined': 
                        setStatus('PEER_JOINED')
                        if (isConnected) createAndSendOffer(socket)//webrtc service (look /assets/webrtc.ts)
                        break
                    case 'peer_left': 
                        setStatus('PEER_LEFT')
                        break
                    case 'joined_room': 
                        setStatus('JOINED_ROOM')
                        break
                    case 'host_left': 
                        setStatus('HOST_LEFT')
                        break
                    case 'room_do_not_exists':
                        setStatus('NO_ROOM')
                        break
                    case 'room_full':
                        setStatus('ROOM_FULL')
                        break
                    case 'rate_limit':
                        setStatus('LIMIT')
                        break
                    case 'flood_detected':
                        setStatus('FLOOD')
                }
            } catch (err) {
                console.error('DEBUG: ERROR: ', err)
            }
        }

        //closing websocket room after close tab
        return () => {
            if (socket.readyState === WebSocket.CONNECTING) {
                socket.onopen = () => socket.close()
            }
            else if (socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
         }
    }, [selectedNetwork])

    const HOSTSTATUSCONTENT = [
        {pendingStatus: 'CONNECTING', icon: <Radio size={50}/>, header: t('send.hostStatusesContent.connecting.header')},
        {pendingStatus: 'ROOM_CREATED', icon: <GlobeCheck size={50}/>, header: t('send.hostStatusesContent.roomCreated.header'), subHeader: t('send.hostStatusesContent.roomCreated.subHeader')},
        {pendingStatus: 'PEER_LEFT', icon: <UserRoundX size={50}/>, header: t('send.hostStatusesContent.peerLeft.header'), subHeader: t('send.hostStatusesContent.peerLeft.subHeader')},
        {pendingStatus: 'PEER_JOINED', icon: <Network size={50}/>, header: t('send.hostStatusesContent.peerJoined.header'), subHeader: t('send.hostStatusesContent.peerJoined.subHeader')},
        {pendingStatus: 'SENDING', icon: <Send size={50}/>, header: t('send.hostStatusesContent.sending.header'), subHeader: t('send.hostStatusesContent.sending.subHeader'), warning: t('send.peerStatusesContent.receiving.warning'), warning2: t('send.hostStatusesContent.sending.warning')},
        {pendingStatus: 'LIMIT', icon: <Lock size={50}/>, header: t('send.hostStatusesContent.limit.header'), subHeader: t('send.hostStatusesContent.limit.subHeader')},
        {pendingStatus: 'FLOOD', icon: <Lock size={50}/>, header: t('send.hostStatusesContent.flood.header'), subHeader: t('send.hostStatusesContent.flood.subHeader')}
    ]

    const PEERSTATUSSCONTENT = [
        {PendingStatus: 'HOST_LEFT', icon: <UserRoundX size={50}/>, header: t('send.peerStatusesContent.hostLeft.header'), subHeader: t('send.peerStatusesContent.hostLeft.subHeader')},
        {PendingStatus: 'NO_ROOM', icon: <X size={50}/>, header: t('send.peerStatusesContent.noRoom.header'), subHeader: t('send.peerStatusesContent.noRoom.subHeader')},
        {PendingStatus: 'ROOM_FULL', icon: <X size={50}/>, header: t('send.peerStatusesContent.roomFull.header'), subHeader: t('send.peerStatusesContent.roomFull.subHeader')},
        {PendingStatus: 'JOINED_ROOM', icon: <Network size={50}/>, header: t('send.peerStatusesContent.joinedRoom.header'), subHeader: t('send.peerStatusesContent.joinedRoom.subHeader')},
        {PendingStatus: 'RECEIVING', icon: <Send size={50}/>, header: t('send.peerStatusesContent.receiving.header'), subHeader: t('send.peerStatusesContent.receiving.subHeader'), warning: t('send.peerStatusesContent.receiving.warning')},
        {pendingStatus: 'LIMIT', icon: <Lock size={50}/>, header: t('send.hostStatusesContent.limit.header'), subHeader: t('send.hostStatusesContent.limit.subHeader')},
        {pendingStatus: 'FLOOD', icon: <Lock size={50}/>, header: t('send.hostStatusesContent.flood.header'), subHeader: t('send.hostStatusesContent.flood.subHeader')}
    ]

    const stuckWarnProgress = progress === 0

    return (
        <>
            <div className="w-[100dvw] h-[100dvh]">
                <div className="w-full h-full flex justify-center items-center bg-white dark:bg-zinc-800 transition-bg duration-500">
                    <div className="md:min-w-[90%] md:min-h-[70%] bg-p2p-bg p-5 mt-20 md:mt-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-6 dark:bg-zinc-900 dark:text-white transition-bg duration-500">
                        {role === 'HOST' && (
                            <>
                                {HOSTSTATUSCONTENT.map((element, index) => (
                                    <React.Fragment key={index}>

                                        {['LIMIT', 'FLOOD'].includes(status) && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center text-3xl text-red-500">{element.header}</h1>
                                                <h3 className="text-xl">{element.subHeader}</h3>
                                            </div>
                                        )}

                                        {status === 'CONNECTING' && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center text-3xl">{element.header}</h1>
                                                <h3 className="text-xl">STATUS: {status}</h3>
                                            </div>
                                        )} 

                                        {['ROOM_CREATED', 'PEER_LEFT'].includes(status) && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center md:gap-6 gap-3">
                                                {element.icon}
                                                <h1 className="text-center md:text-3xl text-2xl">{element.header}</h1>
                                                <h2 className="text-center md:text-xl text-lg">{element.subHeader}</h2>
                                                <div className="flex flex-col md:flex-row items-center gap-4 mt-5">
                                                    <h3 className="text-center">Link: <span className="font-bold bg-gray-300 p-2 leading-loose dark:bg-gray-700">{roomURL}</span></h3>
                                                    <button
                                                        className="cursor-pointer"
                                                        onClick={() => { navigator.clipboard.writeText(roomURL) }}>
                                                        <Copy />
                                                    </button>
                                                </div>
                                                <QRCode value={roomURL} className="p-2 bg-white w-50 md:w-70 h-auto" />
                                                <h3 className="text-xl">STATUS: {status}</h3>
                                            </div>
                                        )}

                                        {status === 'PEER_JOINED' && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center md:text-3xl text-2xl">{element.header}</h1>
                                                <h2 className="text-center md:text-xl text-lg">{element.subHeader}</h2>
                                                <div className="flex md:flex-row flex-col items-center md:gap-4 gap-7">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        id="file-input"
                                                        onChange={(e) => handleFileChange(e, setFile, setFileName)}
                                                        ref={fileInputRef}
                                                    />
                                                    <label
                                                        htmlFor="file-input"
                                                        className="py-2 px-4 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300">
                                                        {t('send.selectFile')}
                                                    </label>
                                                    <p className={`py-2 px-4 ${fileName ? 'bg-p2p-secondary/30' : 'bg-p2p-secondary/20'} rounded-2xl`}>{fileName ? fileName : t('send.noFile')}</p>
                                                    <div className="flex items-center gap-6 md:gap-4">
                                                        <button
                                                            className="md:py-2 md:px-4 py-4 px-5 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300"
                                                            onClick={() => handleDeleteFile(setFile, setFileName, fileInputRef)}>
                                                            <Trash />
                                                        </button>
                                                        <button
                                                            className="md:py-2 md:px-4 py-4 px-5 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300"
                                                            onClick={() => handlesendFile(file, setStatus, sendFile, setProgress, fileName, setBytesPerSec, setETA)}>
                                                            <Send />
                                                        </button>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl">STATUS: {status}</h3>
                                            </div>
                                        )}

                                        {status === 'SENDING' && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center md:text-3xl text-2xl">{element.header}</h1>
                                                <h2 className="text-center md:text-xl text-lg">{element.subHeader}</h2>
                                                <h3 className={`text-center text-lg font-bold md:w-[60ch] bg-gray-300 ${selectedNetwork === 'LAN' && stuckWarnProgress && displayStuckWarn ? 'bg-red-300 dark:bg-red-800' : ''} dark:bg-gray-700 rounded-3xl p-5`}>{selectedNetwork === 'LAN' && stuckWarnProgress && displayStuckWarn ? element.warning2 : element.warning}</h3>
                                                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-p2p-primary transition-all duration-200 ease-in-out"
                                                        style={{ width: `${progress}%` }}>
                                                    </div>
                                                </div>
                                                <h4>{progress === 100 ? t('send.finished') : `${String(progress)}%`}</h4>
                                                {progress === 100 && (
                                                    <>
                                                        <button
                                                            className="py-2 px-4 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300"
                                                            onClick={() => {setStatus('PEER_JOINED'); setProgress(0)}}>
                                                            {t('send.back')}
                                                        </button>
                                                    </>
                                                )}
                                                <h3 className="text-xl">STATUS: {status}</h3>
                                                <h4>{t('send.remaining')}{formatETAseconds(ETA)}, {t('send.speed')}{formatBytesPerSecond(bytesPerSec)}</h4>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                        {role === 'PEER' && (
                            <>
                                {PEERSTATUSSCONTENT.map((element, index) => (
                                    <React.Fragment key={index}>
                                        {status === element.PendingStatus && status !== 'RECEIVING' && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center md:text-3xl text-2xl">{element.header}</h1>
                                                <h2 className="text-center md:text-xl text-lg">{element.subHeader}</h2>
                                                <h3 className="text-xl">STATUS: {element.PendingStatus}</h3>
                                            </div>
                                        )}
                                        {status === 'RECEIVING' && element.PendingStatus === 'RECEIVING' && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center text-3xl">{element.header}</h1>
                                                <h2 className="text-center text-xl">{element.subHeader}</h2>
                                                <h3 className="text-center text-lg font-bold md:w-[60ch] bg-gray-300 dark:bg-gray-700 rounded-3xl p-5">{element.warning}</h3>
                                                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-p2p-primary transtition-all duration-200 ease-in-out"
                                                        style={{ width: `${progress}%` }}>

                                                    </div>
                                                </div>
                                                <h4>{progress === 100 ? t('send.finished') : `${String(progress)}%`}</h4>
                                                <h3 className="text-xl">STATUS: {element.PendingStatus}</h3>
                                                <h4 className="text-center">{t('send.remaining')}{formatETAseconds(ETA)}, {t('send.speed')}{formatBytesPerSecond(bytesPerSec)}</h4>
                                            </div>
                                        )}
                                        {['LIMIT', 'FLOOD'].includes(status) && element.pendingStatus === status && (
                                            <div className="flex flex-col items-center gap-6">
                                                {element.icon}
                                                <h1 className="text-center text-3xl text-red-500">{element.header}</h1>
                                                <h3 className="text-xl">{element.subHeader}</h3>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </div>
                    {role === 'PEER' && incomingFile && (
                        <div className="w-[100dvw] h-[100dvh] bg-[rgba(0,0,0,0.5)] fixed z-99999 top-0 left-0 flex justify-center items-center">
                            <div className="bg-p2p-surface dark:bg-zinc-800 dark:text-white min-w-[400px] min-h-[400px] flex flex-col items-center justify-center gap-6 rounded-2xl p-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                <h1 className="text-2xl">{t('send.hostSendHeader')}</h1>
                                <h2 className="text-xl text-center">{t('send.hostSend1')}{incomingFile.name}<br/>{t('send.hostSend2')}{calculateFileSize(incomingFile.size)}<br/>{t('send.hostSend3')}</h2>
                                <div className="flex items-center gap-4">
                                    <button 
                                        className="py-2 px-4 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300"
                                        onClick={() => handleDowloadFile(incomingFile, setIncomingFile, setStatus)}
                                        >
                                        {t('send.downland')}
                                    </button>
                                    <button 
                                        className="py-2 px-4 bg-red-700/40 dark:bg-red-400 rounded-2xl cursor-pointer hover:bg-red-700/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black transition-bg-shadow duration-300"
                                        onClick={() => handleCancelFile(incomingFile, setIncomingFile, setStatus)}
                                        >
                                        {t('send.cancel')}
                                    </button>
                                </div>
                                <h3 className={`text-lg text-center ${sumControl === true ? 'text-green-500' : sumControl === false ? 'text-red-500' : 'text-black dark:text-white'}`}>{sumControl === true && t('send.sumControlOK')}{sumControl === false && t('send.sumControlBAD')}{sumControl === null && t('send.sumControlWAIT')}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SendSecondStep