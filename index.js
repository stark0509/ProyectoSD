const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port',3000||process.env.PORT);

app.use(express.static(path.join(__dirname,'public')));

http.listen(app.get('port'),()=>{
  console.log('Web server listen on port',app.get('port'));
});
//creando el servidor mqtt
const aedes = require('aedes')
const server = require('net').createServer(aedes.handle)
const port = 1883
server.listen(port,function(){
  console.log('MQTT server listen on port',port);
})
//creando el cliente que servira de publicador y subscriptor
client.on('connect',()=>{
  client.subscribe('temperature')//suscribiendo nuestro cliente a los datos de temperatura de Arduino
})

//websocket
io.on('connection',(socket)=>{
  console.log('A new user connected',socket.id);
  client.on('message',(topic,message)=>{//configurando el cliente para que reciba la Temp y la envia al navegador
    message = message.toString();
    data = parseFloat(message);
    if(topic==="temperature"){
      socket.emit('temperature',data)
      console.log("data was sent! ",data)
    }
  })
  let a;
  setInterval(()=>{
    a=(Math.random()*20)+20;
    socket.emit('distance',a)
  },2000);
  socket.on('enableAutomaticFan',(data)=>{
    console.log(data)
  })
  socket.on('disableAutomaticFan',(data)=>{
    console.log(data)
  })
  socket.on('activateFan',(data)=>{
    console.log(data)
  })
  socket.on('deactivateFan',(data)=>{
    console.log(data)
  })
  socket.on('enableAutomaticDoor',(data)=>{
    console.log(data)
  })
  socket.on('disableAutomaticDoor',(data)=>{
    console.log(data)
  })
  socket.on('activateDoor',(data)=>{
    console.log(data)
  })
  socket.on('deactivateDoor',(data)=>{
    console.log(data)
  })
  socket.on('activateLed1',(data)=>{
    console.log(data)
  })
  socket.on('deactivateLed1',(data)=>{
    console.log(data)
  })
  socket.on('activateLed2',(data)=>{
    console.log(data)
  })
  socket.on('deactivateLed2',(data)=>{
    console.log(data)
  })
})