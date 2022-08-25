const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {
  start_mqtt_server
} = require('./mqtt/server')
const {
  start_backend_socket
} = require('./services/socket_events')

//iniciando el servidor mqtt
start_mqtt_server()

//Iniciando el servidor web
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

http.listen(app.get('port'), () => {
  console.log('Web server listen on port', app.get('port'));
});


//inicializando el socket backend
start_backend_socket(io)