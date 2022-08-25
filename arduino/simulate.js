//Permite simular la parte de eventos mqtt que emplea main.ino
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

const random_number = (min,max) => {
    return Math.floor(Math.random()*(max-min) + min)
}

const simulate_temperature = () => {
    const topic = 'temperature'
    setInterval(() => {
        let message = '' + random_number(18,31)
        client.publish(topic, message)
        console.log('temperature sent: ', message)
    }, 5000)
}

const simulate_distance = () => {
    const topic = 'distance'
    setInterval(() => {
        let message = '' + random_number(5,10)
        client.publish(topic, message)
        console.log('distance sent: ', message)
    }, 5000)
}

const subscribe_mqtt_server_events = (client) => {
    mqtt_server_events = ['fanControl','fanState','doorControl','doorState','led1','led2']

    mqtt_server_events.forEach(event => client.subscribe(event));
}

client.on('connect', () => {
    simulate_temperature()
    simulate_distance()
    subscribe_mqtt_server_events(client)
})

client.on('message', (topic,message) => {
    console.log(`${topic}: ${message}`)
})
