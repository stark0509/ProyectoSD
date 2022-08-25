//funcion promedio 
function prom(sum, count) {
    return (sum / count)
}
//funcion que da el minimo
function min(data, counter, hour) {
    if (counter === 1) {
        minimo[0] = data
        minimo[1] = hour
    } else {
        if (data < minimo[0]) {
            minimo[0] = data
            minimo[1] = hour
        }
    }
    return minimo
}
//funcion que da el maximo
function max(data, counter, hour) {
    if (counter === 1) {
        maximo[0] = data
        maximo[1] = hour
    } else {
        if (data > maximo[0]) {
            maximo[0] = data
            maximo[1] = hour
        }
    }
    return maximo
}