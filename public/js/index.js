var socket = io();
socket.on('connect', function () {
    console.log('connecetd')
})

socket.on('disconnect', function () {
    console.log('disconnected')
})

socket.on('newMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const li = jQuery('<li></li>')
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`)
    jQuery('#message-list').append(li)
})

socket.on('newLocationMsg', function (msg) {
    const formattedTime = moment(msg.createdAt).format('H:mm')
    const li = jQuery('<li></li>')
    const a = jQuery('<a target="_blank">My current location</a>')

    li.text(`${msg.from} ${formattedTime}: `)
    a.attr('href', msg.url)
    li.append(a)
    jQuery('#message-list').append(li)
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