//creando el servidor mqtt local
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

const start_mqtt_server = () => {
  server.listen(port, function () {
    console.log('MQTT server listen on port', port);
  })
}

module.exports = {
  start_mqtt_server
}