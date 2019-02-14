var socket = io();
socket.on('connect', function () {
    console.log('connecetd')
})

socket.on('disconnect', function () {
    console.log('disconnected')
})

socket.on('newMsg', function(msg) {
    console.log("new msg", msg)
    const li = jQuery('<li></li>')
    li.text(`${msg.from}: ${msg.text}`)
    jQuery('#message-list').append(li)
})


jQuery('#message-form').on('submit', (e) =>{
    e.preventDefault()
    console.log(e)
    socket.emit('createMsg',{
        from: jQuery('#message-form-from').val(),
        text: jQuery('#message-form-message').val()
    }, (data)=>{
        console.log(data)
    })
})