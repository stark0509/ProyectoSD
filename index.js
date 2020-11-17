const express = require('express');
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port',3000||process.env.PORT);

app.use(express.static(path.join(__dirname,'public')));

app.get('/:id',(req,res)=>{
  console.log(req.params['id']);
  res.send();
});

http.listen(app.get('port'),()=>{
  console.log('Listen on port',app.get('port'));
});

//websocket
io.on('connection',(socket)=>{
  console.log('A new user connected',socket.id);
  let a;
  setInterval(()=>{
    a=(Math.random()*20)+20;
    socket.emit('temperature',a)
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