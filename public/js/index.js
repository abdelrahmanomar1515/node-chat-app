var socket = io();
socket.on('connect', function () {
    console.log('connecetd')
})

socket.on('disconnect', function () {
    console.log('disconnected')
})

socket.on('newMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const template = jQuery('#message-template').html()
    const html = Mustache.render(template,{
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    })
    jQuery('#message-list').append(html)
})

socket.on('newLocationMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const template = jQuery('#location-message-template').html()
    const html = Mustache.render(template,{
        text: msg.url,
        from: msg.from,
        createdAt: formattedTime
    })
    jQuery('#message-list').append(html)
})

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()
    const messageTextbox = jQuery('#message-form-message')
    socket.emit('createMsg', {
        from: 'User',
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