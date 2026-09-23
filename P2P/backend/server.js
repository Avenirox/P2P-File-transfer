const { WebSocketServer } = require('ws')
require('dotenv').config()
const http = require('http')
const fs = require('fs')

//creating test http server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('WebSocket Signaling Server OK')
})

const PORT = process.env.BACKPORT // must be the same in the registerSecondStep.tsx!
const wss = new WebSocketServer({ server })
const DEBUGLOGS = true//true - debug in node console errors, logs, ice candidates e.g.

const rooms = new Map()//app rooms
const connectionsIP = new Map()//users IP's (only for limites)

const LIMIT = 15//fiften requests from one ip connection
const WINDOW_MS = 15 * 60 * 1000//resets after 15 minutes
const WEBSITE_URL = process.env.FRONTENDURL//frontend url for origin

wss.on('connection', (ws, req) => {
    //only connect from p2p front url
    const originURL = req.headers.origin
    if (originURL !== WEBSITE_URL) {
        if (DEBUGLOGS) console.log('someone try to connect from: ',originURL )//log connect req url
        ws.close(4403, 'Forbidden')//close immeditely
        return
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress//gets ip
    const now = Date.now()//date for timelimit
    //adding to table if does not exists
    if (!connectionsIP.has(ip)) {
        connectionsIP.set(ip, { count: 1, resetTime: now + WINDOW_MS})
    }
    else {
        const tracker = connectionsIP.get(ip)//getiing device by ip

        //resets time when tracker time expires
        if (now > tracker.resetTime) {
            tracker.count = 1
            tracker.resetTime = now + WINDOW_MS
        }
        //else adding count
        else {
            tracker.count++
        }

        //checking limit
        if (tracker.count > LIMIT) {
            if (DEBUGLOGS) console.log('Rate limit finded a limit!')//logs
            ws.send(JSON.stringify({ message: 'rate_limit', type: 'error'}))//sends message to send second step
            ws.close(4429, 'To many requests!')//closing connection
            return
        }
    }
    if (DEBUGLOGS) console.log('DEBUG: Connected succesfully')
    //anti-message DDOS
    ws.msgCount = 0
    ws.lastReset = Date.now()
    
    ws.on('message', (message) => {
        const now = Date.now()
        if (now - ws.lastReset > 5000) {
            ws.msgCount = 0
            ws.lastReset = now
        }
        ws.msgCount++
        if (ws.msgCount >= 20) {
            ws.send(JSON.stringify({ message: 'flood_detected' }))
            ws.close(4429, 'To many messages')
            return
        }
        try {
            const data = JSON.parse(message)

            switch (data.type) {
                //joining room for peer
                case 'join-room': {
                    const { RoomID } = data
                    
                    //when room doesnt exists throw error
                    if (!rooms.has(RoomID)) {
                        ws.send(JSON.stringify({ message: 'room_do_not_exists', type: "error"}))
                        return
                    }
                    const room = rooms.get(RoomID)//if exists get the room ID from param

                    //when room already have peer throw error
                    if (room.peer) {
                        ws.send(JSON.stringify({ type: 'error', message: 'room_full' }))
                        return
                    }

                    //adding to room
                    room.peer = ws
                    ws.RoomID = RoomID
                    ws.isHost = false

                    //inform host and peer
                    room.host.send(JSON.stringify({ message: 'peer_joined' }))
                    room.peer.send(JSON.stringify({ message: 'joined_room' }))
                    if (DEBUGLOGS) console.log('DEBUG: Peer joined')
                    break
                }
                //create room for host
                case 'create-room': {
                    const { RoomID } = data

                    //protection against the same room URL
                    if (!rooms.has(RoomID)) {
                        rooms.set(RoomID, { host: ws, peer: null})//waiting for peer (room is open)
                        ws.RoomID = RoomID,
                        ws.isHost = true

                        //sending to host (ws) message
                        ws.send(JSON.stringify({ message: 'room_created', roomid: RoomID}))
                        if (DEBUGLOGS) console.log('DEBUG: Created room: ', RoomID)
                    }
                    break
                }
                //offers sdp for peer
                case 'SIGNAL_OFFER': {
                    //Get room
                    const room = rooms.get(ws.RoomID)
                    //When peer and room exists send to peer SDP
                    if (room && room.peer) {
                        room.peer.send(JSON.stringify(data))
                        if (DEBUGLOGS) console.log("HOST send a offer!")
                    }
                    break
                }
                //answers sdp from host
                case 'SIGNAL_ANSWER': {
                    //Get room
                    const room = rooms.get(ws.RoomID)
                    //When room and host exists send to host SDP
                    if (room && room.host) {
                        room.host.send(JSON.stringify(data))
                        if (DEBUGLOGS) console.log('PEER send a anwer!')
                    }
                    break
                }
                //Ice candidates
                case 'ICE_CANDIDATES': {
                    //get room
                    const room = rooms.get(ws.RoomID)
                    if (!room) break
                    //sending a ICE to target
                    const target = ws.isHost ? room.peer : room.host
                    if (target && target.readyState === 1) {
                        target.send(JSON.stringify(data))
                        if (DEBUGLOGS) console.log('DEBUG: ICE CANIDATE was sent to: ', target +  ' Content: ', data)
                    }
                    break
                }
            }
        } catch (err) {
            console.error('DEBUG: ERROR: ', err)
        }
    })
    //when peer or host close connection
    ws.on('close', () => {
        //when ws had the room send message to other device in room
        if (ws.RoomID && rooms.has(ws.RoomID)) {
            //get room
            const room = rooms.get(ws.RoomID)

            //when ws was host close the room and send message to peer
            if (ws.isHost) {
                if (DEBUGLOGS) console.log('DEBUG: Host left closing room')
                rooms.delete(ws.RoomID)//deleting room
                if (room.peer && room.peer.readyState === 1) {
                    room.peer.send(JSON.stringify({ message: "host_left"}))
                }
                return
            }
            //when it was peer, remove peer from room and send message to host
            else {
                if (DEBUGLOGS) console.log('DEBUG: Peer left room')
                if (room.host && room.host.readyState === 1) {
                    room.host.send(JSON.stringify({ message: "peer_left"}))
                }
                room.peer = null//Didnt deleted room, only removed peer
                return
            }

        }  
    })
})

//listening on lan and localhost
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server WS Working on wss://192.168.100.100:${PORT}`)
})

