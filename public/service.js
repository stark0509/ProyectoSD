const socket = io();
socket.on('test',(data)=>{
    console.log(data)
})
socket.on('data',(data)=>{
    console.log(data);
})

"tengo que ver la manera de que de este js le pase los datos al archivo chart"