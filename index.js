const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port',process.env.PORT || 3000);

app.use(express.static(path.join(__dirname,'public')));

http.listen(app.get('port'),()=>{
  console.log('Web server listen on port',app.get('port'));
});
//creando el servidor mqtt local
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883
server.listen(port,function(){
  console.log('MQTT server listen on port',port);
})
//creando el cliente que servira de publicador y subscriptor
const mqtt = require('mqtt')
//const options = {
  //port: 1883,
  //clientId: 'webServer',
  //username: 'test',
  //password: 'test',
//};
//const client = mqtt.connect('mqtt://node02.myqtthub.com:1883',options)
const client = mqtt.connect('mqtt://localhost:1883')
client.on('connect',()=>{
  console.log('connected to mqtt server')
  client.subscribe('temperature')//suscribiendo nuestro cliente a los datos de temperatura de Arduino
  console.log('cliente MQTT fue suscrito a los datos de temperatura!')
  client.subscribe('distance')//suscribiendo nuestro cliente a los datos de temperatura de Arduino
  console.log('cliente MQTT fue suscrito a los datos de distancia!')
})

//websocket
io.on('connection',(socket)=>{
  console.log('Nuevo usuario conectado con el id: ',socket.id);
  client.on('message',(topic,message)=>{//configurando el cliente para que reciba la Temp y la envia al navegador
    message = message.toString();
    data = parseFloat(message);
    if(topic==="temperature"){
      socket.emit('temperature',data)
      console.log("temperature fue enviada al cliente web! ",data)
    }else if(topic==='distance'){
      socket.emit('distance',data)
      console.log("distancia fue enviada al cliente web! ",data)
    }
  })

  socket.on('enableAutomaticFan',(data)=>{
    client.publish('fanControl','1')
    console.log(data)
  })
  socket.on('disableAutomaticFan',(data)=>{
    client.publish('fanControl','0')
    console.log(data)
  })
  socket.on('activateFan',(data)=>{
    client.publish('fanState','1')
    console.log(data)
  })
  socket.on('deactivateFan',(data)=>{
    client.publish('fanState','0')
    console.log(data)
  })
  socket.on('enableAutomaticDoor',(data)=>{
    client.publish('doorControl','1')//habilitar control automatico
    console.log(data)
  })
  socket.on('disableAutomaticDoor',(data)=>{
    client.publish('doorControl','0')//deshabilitar control automatico
    console.log(data)
  })
  socket.on('activateDoor',(data)=>{
    client.publish('doorState','1')//abrir la puerta
    console.log(data)
  })
  socket.on('deactivateDoor',(data)=>{
    client.publish('doorState','0')//cerrar la puerta
    console.log(data)
  })
  socket.on('activateLed1',(data)=>{
    client.publish('led1','1')
    console.log(data)
  })
  socket.on('deactivateLed1',(data)=>{
    client.publish('led1','0')
    console.log(data)
  })
  socket.on('activateLed2',(data)=>{
    client.publish('led2','1')
    console.log(data)
  })
  socket.on('deactivateLed2',(data)=>{
    client.publish('led2','0')
    console.log(data)
  }) 
})