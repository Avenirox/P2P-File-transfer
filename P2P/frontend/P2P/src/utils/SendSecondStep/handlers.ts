// SENDSECONDSTEP.TSX HANDLERS
import { Dispatch, RefObject, SetStateAction } from "react"

// INTERFACES
export interface IncomingFile {
    name: string
    size: number
    url: string
}

// TYPES
type IncomingFileType = IncomingFile | null
type FileType = File | null
type FileNameType = string | null

type SetIncomingFileType = Dispatch<SetStateAction<IncomingFileType>>
type StatusType = Dispatch<SetStateAction<'CONNECTING' | 'ROOM_CREATED' | 'PEER_JOINED' | 'HOST_LEFT' | 'PEER_LEFT' | 'JOINED_ROOM' | 'SENDING' | 'NO_ROOM' | 'RECEIVING' | 'ROOM_FULL' | 'LIMIT' | 'FLOOD'>>
type SetFileType = Dispatch<SetStateAction<File | null>>
type SetFileNameType = Dispatch<SetStateAction<string | null>>
type SetProgressType = Dispatch<SetStateAction<Number>>
type SetBytesPerSec = Dispatch<SetStateAction<number>>
type SetETA = Dispatch<SetStateAction<number>>

type FileRefType = RefObject<HTMLInputElement | null>

// 1. HANDLEDOWLOADFILE HANDLER(for peer)
// Handle download file (on peer)
export const handleDowloadFile = (
    incomingFile: IncomingFileType, 
    setIncomingFile: SetIncomingFileType, 
    setStatus: StatusType
) => {
        
    if (!incomingFile) return

    //creating a URL for file
    const a = document.createElement('a')
    a.href = incomingFile.url
    a.download = incomingFile.name
    a.click()

    //after click revoke URL
    URL.revokeObjectURL(incomingFile.url)
    setIncomingFile(null)
    setStatus('JOINED_ROOM')
}

// 2. HANDLECANCELFILE HANDLER (for peer)
export const handleCancelFile = (
    incomingFile: IncomingFileType, 
    setIncomingFile: SetIncomingFileType, 
    setStatus: StatusType
) => {

    //reseting Incoming file and status
    if (incomingFile) {
        URL.revokeObjectURL(incomingFile.url)//when url for file exists, revoke it
    }
    setIncomingFile(null)
    setStatus('JOINED_ROOM')
}

// 3. HANDLEFILECHANGE HANDLER (for host)
// change and add file to state
export const handleFileChange = (
    e: any, 
    setFile: SetFileType, 
    setFileName: SetFileNameType
) => {
    const Selectedfile = e.target.files[0]

    //when file exists put it into a state
    if (Selectedfile) {
        setFileName(Selectedfile.name)
        setFile(Selectedfile)
    }
    //if no exists clear states
    else {
        setFileName(null)
        setFile(null)
    }
}

// 4. HANDLEDELETEFILE HANDLER (for host)
// the delete file button handler
export const handleDeleteFile = (
    setFile: SetFileType,
    setFileName: SetFileNameType,
    fileInputRef: FileRefType
) => {
    setFileName(null)//set file name null
    setFile(null)//set file null
    //file input reseting
    if (fileInputRef.current) {
        fileInputRef.current.value = ''
    }
}

// 5. HANDLESENDFILE HANDLER (for host)
// this handler sends the file to peer
export const handlesendFile = async (
    file: FileType,
    setStatus: StatusType,
    sendFile: Function,
    setProgress: SetProgressType,
    fileName: FileNameType,
    setBytesPerSec: SetBytesPerSec,
    setETA: SetETA
) => {
    if (!file) {
        return
    }

    try {
        setStatus('SENDING')//state for sending, hide file input
        console.log('DEBUG: Starting sending files.', fileName)

        //look into services/webrtc for function code
        await sendFile(file, (progress: number) => {
            setProgress(progress)
        },
        (bytesInSec: number) => {
            setBytesPerSec(bytesInSec)
        },
        (seconds: number) => {
            setETA(seconds)
        })
    }
    catch (err) {
        console.error(err)
    }
    finally {
        setETA(0),
        setBytesPerSec(0)
    }
}