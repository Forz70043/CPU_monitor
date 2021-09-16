let {ipcRenderer , contextBridge} = require('electron');
//const ipcRenderer = electron.ipcRenderer;

let Chart = require('chart.js');
let utils = require('./utils');

let dataCPU = [];
let dataMem = [];
let dataTotMem = [];

let cpuChart = cpuMem = {};

/* 
contextBridge.exposeInMainWorld('darkMode', {  
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),  
    system: () => ipcRenderer.invoke('dark-mode:system')
}); */


window.addEventListener('load', function() {
    console.log('All assets are loaded');

    utils.log("DATA CPU: ",dataCPU);    

    let ctx = document.getElementById('chartCPU');
    console.log("ctx: ",ctx)
    let cty = document.getElementById('chartMem');
    /* let ctz = document.getElementById('chartTotMem'); */
    let date = new Date();
    let myDate = /*''+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+*/' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    let labels = [myDate];

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


    memChart = new Chart(cty, {
        type: 'doughnut',
        data: {
            labels: ['Busy Mem','Free Mem'],
            datasets: [{
                label: '% CPU Usage',
                data: dataMem,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    });



/* 
    document.getElementById('toggle-dark-mode').addEventListener('click', async () => {  
        const isDarkMode = await window.darkMode.toggle()  
        document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
    })
    
    document.getElementById('reset-to-system').addEventListener('click', async () => {  
        await window.darkMode.system()  
        document.getElementById('theme-source').innerHTML = 'System'
    })

 */

})


function addData(chart, label, data) {
    if(label) chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        if(dataset.data.length>10) dataset.data.shift()
    });
    
    chart.update();
}



ipcRenderer.on('cpu', (event, data)=>{
    dataCPU.push(data.toFixed(2));
    document.getElementById('cpu').innerHTML = data.toFixed(2);
    let date = new Date();
    let myDate = /*''+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+*/' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    addData(cpuChart ,myDate, data.toFixed(2));
});

ipcRenderer.on('mem', (event, data)=>{
    dataMem.push(data.toFixed(2));
    
    //console.log('mem %: ' + data);
    document.getElementById('mem').innerHTML = data.toFixed(2);
    memChart.data.datasets[0].data = [data.toFixed(2),100-data.toFixed(2)];
    //addData(memChart ,false, [data.toFixed(2),100-data.toFixed(2)]);
    memChart.update();
});
/* 
ipcRenderer.on('totmem', (event, data)=>{
    dataTotMem.push(data.toFixed(2));
    //console.log('totmem GB: ' + data);
    document.getElementById('totmem').innerHTML = data.toFixed(2);
}); */