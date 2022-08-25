//creando el cliente que servira de publicador y subscriptor
const mqtt = require('mqtt')

//Parametros de conexion con el servidor MQTT de MyMQTTHub
const options = {
  port: 1883,
  clientId: 'webServer',
  username: 'test',
  password: 'test',
};

//const client = mqtt.connect('mqtt://node02.myqtthub.com:1883',options)
//Parametros de conexion al servidor MQTT Local
const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  console.log('connected to mqtt server')
  client.subscribe('temperature') //suscribiendo nuestro cliente a los datos de temperatura de Arduino
  console.log('cliente MQTT fue suscrito a los datos de temperatura!')
  client.subscribe('distance') //suscribiendo nuestro cliente a los datos de temperatura de Arduino
  console.log('cliente MQTT fue suscrito a los datos de distancia!')
})

module.exports = {
  mqtt_client: client
}