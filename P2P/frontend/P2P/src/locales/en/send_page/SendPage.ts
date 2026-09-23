export default {
    header1: "Please select network architecture.",
    LANdesc: " - Local Area Network. Use only when the receiver is connected to your network (connected to the same router as you).",
    WANdesc: " - Wide Area Network (internet). Use only when the receiver is connected to different network (connected to the another router).",
    
    status: {
        connecting: "Connecting...",
        roomCreated: "Room created",
        peerJoined: "Peer joined",
        peerLeft: "Peer left",
        joined: "Connected",
        hostLeft: "Host left",
        sending: "Sending files...",
        noRoom: "Room doesn't exists."
    },

    hostStatusesContent: {
        connecting: {
            header: 'Connecting to server'
        },
        roomCreated: {
            header: "Created room",
            subHeader: "A room has been created, you received a link and a QR code for that room. Scan it or send the link to the other device.",
        },
        peerLeft: {
            header: "Peer left",
            subHeader: "The peer has left the room, but don't worry! You can send the link or scan QR code again!"
        },
        peerJoined: {
            header: "Peer joined to the room",
            subHeader: "The peer connected to room, now you can send them a file."
        },
        sending: {
            header: "Sending a file",
            subHeader: "Sending file to peer... You can safely switch tabs. To cancel, close this tab.",
            warning: "Stuck on 0%? If you are on different networks, LAN won't work, try switching to WAN. Alternatively, check if you are transferring files to or from a mobile device. The mobile devices are very slow."
        },
        limit: {
            header: "You have reached the rate limit",
            subHeader: "Please wait 15 minutes, after that you will can connect to websocket."
        },
        flood: {
            header: "You was sending too much messages",
            subHeader: "The websocket connect was closed. System detected flood."
        }
    },

    peerStatusesContent: {
        hostLeft: {
            header: 'The host disconnected',
            subHeader: 'The host left the room. The room has been closed.',
        },
        noRoom: {
            header: "Room not found",
            subHeader: "Sorry! The room has not been found with this URL!",
        },
        roomFull: {
            header: "Room is full",
            subHeader: "Room already has a connected peer!"
        },
        joinedRoom: {
            header: "Joined room",
            subHeader: "Succesfully connected to room. Waiting for host action."
        },
        receiving: {
            header: 'Receiving file',
            subHeader: 'The host sent a file. Downloading.',
            warning: "Warning! Downloading may be slower on mobile devices due to enhanced browser security settings. Unfortunately, this is beyond our control.",
        }
    },

    finished: "Finished!",
    back: "Back",

    selectFile: "Select file",
    noFile: "No file selected",

    remaining: "Remaining time: ",
    speed: "WI-FI speed: ",

    hostSendHeader: "Received file",
    hostSend1: "Host send a file: ",
    hostSend2: "The file size is: ",
    hostSend3: 'You can downland it now, if you do not want to downland it click "Cancel".',
    sumControlOK: "Checksum: Indentical.",
    sumControlBAD: "Checksum: Inconsistent!",
    sumControlWAIT: "Checksum: Calculating...",

    cancel: "Cancel",
    downland: "Downland"
}