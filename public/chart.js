var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature(°C)',
            data: [],
            backgroundColor: [

                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            labels: {
                fontColor: "lightblue"
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "lightblue"
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "lightblue"
                }
            }]
        }
    }
});


const update_temp_menu = (current, average, min_stats, max_stats) => {

    actualTemp = document.getElementById('actualTemp')
    averageTemp = document.getElementById('averageTemp')
    minTemp = document.getElementById('minTemp')
    maxTemp = document.getElementById('maxTemp')
    actualTemp.innerHTML = current.toFixed(4) + " °C"
    averageTemp.innerHTML = average.toFixed(4) + " °C"
    minTemp.innerHTML = min_stats[0].toFixed(4) + " °C at " + min_stats[1]
    maxTemp.innerHTML = max_stats[0].toFixed(4) + " °C at " + max_stats[1]
}

const update_temp_char = (data, hora) => {
    if (counter > 8) {
        myChart.data.labels.shift();
        myChart.data.datasets[0].data.shift();
    }
    myChart.data.labels.push(hora);
    myChart.data.datasets[0].data.push(data);
    myChart.update();
}