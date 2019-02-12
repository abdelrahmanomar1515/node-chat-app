const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')


const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('connected')

    socket.emit('newMsg', {
        from: "admin",
        text: "welcome to the chat app",
        createdAt: new Date().getTime()
    })

    socket.broadcast.emit('newMsg', {
        from: "admin",
        text: "a new user joined",
        createdAt: new Date().getTime()
    })

    socket.on('createMsg', (msg) => {
        console.log(msg)
        io.emit('newMsg', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('disconnect', () => {
        console.log("disconnected")
    })
})

server.listen(port, () => console.log(`server is up on port ${port}!`))