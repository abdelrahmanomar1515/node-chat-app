const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('connected')

    socket.emit('newMsg', generateMessage('Admin', 'Welcome to chat app'))

    socket.broadcast.emit('newMsg', generateMessage('Admin','a new user joined'))

    socket.on('createMsg', (msg,cb) => {
        io.emit('newMsg', generateMessage(msg.from,msg.text))
        cb()
    })
    
    socket.on('createLocationMsg', (coords)=>{
        io.emit('newLocationMsg', generateLocationMessage('Admin', coords.latitude,coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log("disconnected")
    })
})

server.listen(port, () => console.log(`server is up on port ${port}!`))