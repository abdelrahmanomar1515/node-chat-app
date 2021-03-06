var socket = io();

function scrollToBottom() {
    const messageList = jQuery('#message-list')
    const newMessage = messageList.children('li:last-child')

    const clientHeight = messageList.prop('clientHeight')
    const scrollTop = messageList.prop('scrollTop')
    const scrollHeight = messageList.prop('scrollHeight')
    const newMessageHeight = newMessage.innerHeight()
    const lastMessageHeight = newMessage.prev().innerHeight()

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messageList.scrollTop(scrollHeight)
    }
}

socket.on('connect', function () {
    const params = jQuery.deparam(window.location.search)
    socket.emit('join',params,function(err){
        if(err){
            alert(err)
            window.location.href= '/'
        }else{
            console.log('no error')
        }
    })
})

socket.on('disconnect', function () {
    console.log('disconnected')
})

socket.on('updateUserList', function(users){
    let ol = jQuery('<ol></ol>')
    for(let user of users){
        ol.append(jQuery('<li></li>').text(user))
    }
    jQuery('#users').html(ol)
    console.log(users)
})

socket.on('newMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const template = jQuery('#message-template').html()
    const html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    })
    jQuery('#message-list').append(html)
    scrollToBottom()
})

socket.on('newLocationMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const template = jQuery('#location-message-template').html()
    const html = Mustache.render(template, {
        text: msg.url,
        from: msg.from,
        createdAt: formattedTime
    })
    jQuery('#message-list').append(html)
    scrollToBottom()
})

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()
    const messageTextbox = jQuery('#message-form-message')
    socket.emit('createMsg', {
        text: messageTextbox.val()
    }, (data) => {
        messageTextbox.val('')
    })
})

const locationButton = jQuery('#location-button')
locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...')
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('createLocationMsg', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location')
    })
})