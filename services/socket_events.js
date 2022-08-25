const {
    mqtt_client
} = require('./../mqtt/client')

//suscribe al socket de backend a los eventos de frontend
//reenvia los eventos mediaante el server mqtt al cliente(arduino)
const subscribe_to_frontend_socket_events = (socket) => {

    socket.on('enableAutomaticFan', (data) => {
        mqtt_client.publish('fanControl', '1')
        console.log(data)
    })
    socket.on('disableAutomaticFan', (data) => {
        mqtt_client.publish('fanControl', '0')
        console.log(data)
    })
    socket.on('activateFan', (data) => {
        mqtt_client.publish('fanState', '1')
        console.log(data)
    })
    socket.on('deactivateFan', (data) => {
        mqtt_client.publish('fanState', '0')
        console.log(data)
    })
    socket.on('enableAutomaticDoor', (data) => {
        mqtt_client.publish('doorControl', '1') //habilitar control automatico
        console.log(data)
    })
    socket.on('disableAutomaticDoor', (data) => {
        mqtt_client.publish('doorControl', '0') //deshabilitar control automatico
        console.log(data)
    })
    socket.on('activateDoor', (data) => {
        mqtt_client.publish('doorState', '1') //abrir la puerta
        console.log(data)
    })
    socket.on('deactivateDoor', (data) => {
        mqtt_client.publish('doorState', '0') //cerrar la puerta
        console.log(data)
    })
    socket.on('activateLed1', (data) => {
        mqtt_client.publish('led1', '1')
        console.log(data)
    })
    socket.on('deactivateLed1', (data) => {
        mqtt_client.publish('led1', '0')
        console.log(data)
    })
    socket.on('activateLed2', (data) => {
        mqtt_client.publish('led2', '1')
        console.log(data)
    })
    socket.on('deactivateLed2', (data) => {
        mqtt_client.publish('led2', '0')
        console.log(data)
    })
}

const subscribe_to_mqtt_events = (socket) => {
    mqtt_client.on('message', (topic, message) => { //configurando el cliente para que reciba la Temp y la envia al navegador
        console.log(`${topic}: ${message}`)
        message = message.toString();
        data = parseFloat(message);
        if (topic === "temperature") {
            socket.emit('temperature', data)
            console.log("temperature fue enviada al cliente web! ", data)
        } else if (topic === 'distance') {
            socket.emit('distance', data)
            console.log("distancia fue enviada al cliente web! ", data)
        }
    })
}

//websocket
const start_backend_socket = (io) => {
    io.on('connection', (socket) => {
        console.log('Nuevo usuario conectado con el id: ', socket.id);
        subscribe_to_mqtt_events(socket)
        subscribe_to_frontend_socket_events(socket)
    })
}

module.exports = {
    start_backend_socket
}