//comunicacion tiempo real Serv y Navegador
const socket = io();

let counter = 0;
let sumTotal = 0;
let promedio = 0;
let minimo = [];
let maximo = [];
let hora;
socket.on('temperature', (data) => {
    counter += 1;
    sumTotal += data;
    console.log(sumTotal)
    now = new Date()
    hora = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    promedio = prom(sumTotal, counter);
    minimo = min(data, counter, hora);
    maximo = max(data, counter, hora);
    console.log(hora);
    console.log(data);
    console.log(promedio);
    update_temp_menu(data, promedio, minimo, maximo)
    update_temp_char(data, hora)
})

//Programacion de Botones de Ventilacion
checkbox1 = document.getElementById('customSwitches1')
Estado1 = document.getElementById('Estado1')
checkbox2 = document.getElementById('customSwitches2')
Estado2 = document.getElementById('Estado2')
checkbox1.addEventListener("change", estado1)
checkbox2.addEventListener("change", estado2)

function estado1() {
    if (checkbox1.checked) {
        socket.emit('enableAutomaticFan', 'enableAutoFan');
        Estado1.innerHTML = "Enable"
        if (checkbox2.checked) {
            checkbox2.click()
        }
        checkbox2.setAttribute("disabled", "")
    } else {
        socket.emit('disableAutomaticFan', 'disableAutoFan');
        Estado1.innerHTML = "Disabled"
        checkbox2.removeAttribute("disabled")
    }
}

function estado2() {
    if (checkbox2.checked) {
        socket.emit('activateFan', 'onFan');
        Estado2.innerHTML = "ON"
    } else {
        socket.emit('deactivateFan', 'offFan');
        Estado2.innerHTML = "OFF"
    }
}

//Programacion de Botones de Puerta
checkbox3 = document.getElementById('customSwitches3')
Estado3 = document.getElementById('Estado3')
checkbox4 = document.getElementById('customSwitches4')
Estado4 = document.getElementById('Estado4')
checkbox3.addEventListener("change", estado3)
checkbox4.addEventListener("change", estado4)

function estado3() {
    if (checkbox3.checked) {
        socket.emit('enableAutomaticDoor', 'enableAutoDoor');
        Estado3.innerHTML = "Enable"
        if (checkbox4.checked) {
            checkbox4.click()
        }
        checkbox4.setAttribute("disabled", "")
    } else {
        socket.emit('disableAutomaticDoor', 'disableAutoDoor');
        Estado3.innerHTML = "Disabled"
        checkbox4.removeAttribute("disabled")
    }
}

function estado4() {
    if (checkbox4.checked) {
        socket.emit('activateDoor', 'openDoor');
        Estado4.innerHTML = "Open"
    } else {
        socket.emit('deactivateDoor', 'closeDoor');
        Estado4.innerHTML = "Closed"
    }
}

//Programacion de Botones las luces
checkbox5 = document.getElementById('customSwitches5')
Estado5 = document.getElementById('Estado5')
checkbox6 = document.getElementById('customSwitches6')
Estado6 = document.getElementById('Estado6')
checkbox5.addEventListener("change", estado5)
checkbox6.addEventListener("change", estado6)

function estado5() {
    if (checkbox5.checked) {
        socket.emit('activateLed1', 'onLed1');
        Estado5.innerHTML = "ON"
    } else {
        socket.emit('deactivateLed1', 'offLed1');
        Estado5.innerHTML = "OFF"
    }
}

function estado6() {
    if (checkbox6.checked) {
        socket.emit('activateLed2', 'onLed2');
        Estado6.innerHTML = "ON"
    } else {
        socket.emit('deactivateLed2', 'offLed2');
        Estado6.innerHTML = "OFF"
    }
}

//Muestra la distancia a la puerta
distance = document.getElementById('distance')
socket.on('distance', (data) => {
    console.log('distance', data);
    distance.innerHTML = data.toFixed(2) + " cm"
})
