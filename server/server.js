const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage,generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('connected')

    socket.on('join', (params, cb) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return cb('Name and room name are required')
        }

        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMsg', generateMessage('Admin', 'Welcome to chat app'))
        socket.broadcast.to(params.room).emit('newMsg', generateMessage('Admin', `${params.name} has joined`))
        cb()
    })

    socket.on('createMsg', (msg, cb) => {
        io.emit('newMsg', generateMessage(msg.from, msg.text))
        cb()
    })

    socket.on('createLocationMsg', (coords) => {
        io.emit('newLocationMsg', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id)
        if (user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMsg', generateMessage('Admin', `${user.name} has left`))
        }
        console.log("disconnected")
    })
})

server.listen(port, () => console.log(`server is up on port ${port}!`))