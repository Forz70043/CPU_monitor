let electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

let Chart = require('chart.js');
let utils = require('./utils');

let dataCPU = [];
let dataMem = [];
let dataTotMem = [];

let cpuChart = {};

window.addEventListener('load', function() {
    console.log('All assets are loaded');

    utils.log("DATA CPU: ",dataCPU);    

    let ctx = document.getElementById('chartCPU');
    console.log("ctx: ",ctx)
    let cty = document.getElementById('chartMem');
    let ctz = document.getElementById('chartTotMem');

    let labels = [1,2,3,4,5];
    cpuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '% CPU Usage',
                data: dataCPU,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                /* borderColor: 'rgb(75, 192, 192)', */
                borderWidth: 1,
                /* tension: 0.1,
                fill: false */
            }]
        },
        options: {
            animation: {
                onComplete: () => {
                  delayed = true;
                },
                delay: (context) => {
                  let delay = 0;
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                  }
                  return delay;
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });



    let memChart = new Chart(cty, {
        type: 'doughnut',
        data: {
            labels: ['Occ Mem','Free Mem'],
            datasets: [{
                label: '% CPU Usage',
                data: dataCPU,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    });


})


function addData(chart, label, data) {
    //chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}



ipcRenderer.on('cpu', (event, data)=>{
    dataCPU.push(data.toFixed(2));
    document.getElementById('cpu').innerHTML = data.toFixed(2);

    addData(cpuChart ,dataCPU.length , data.toFixed(2))
});

ipcRenderer.on('mem', (event, data)=>{
    dataMem.push(data.toFixed(2));
    //console.log('mem %: ' + data);
    document.getElementById('mem').innerHTML = data.toFixed(2);
});

ipcRenderer.on('totmem', (event, data)=>{
    dataTotMem.push(data.toFixed(2));
    //console.log('totmem GB: ' + data);
    document.getElementById('totmem').innerHTML = data.toFixed(2);
});