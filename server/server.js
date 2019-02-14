const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('connected')

    socket.emit('newMsg', generateMessage('admin', 'welcome to chat app'))

    socket.broadcast.emit('newMsg', generateMessage('admin','a new user joined'))

    socket.on('createMsg', (msg) => {
        console.log(msg)
        io.emit('newMsg', generateMessage(msg.from,msg.text))
    })

    socket.on('disconnect', () => {
        console.log("disconnected")
    })
})

server.listen(port, () => console.log(`server is up on port ${port}!`))