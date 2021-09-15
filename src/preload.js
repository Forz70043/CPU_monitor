let electron = require('electron');

const ipcRenderer = electron.ipcRenderer;
ipcRenderer.on('cpu', (event, data)=>{
    document.getElementById('cpu').innerHTML = data.toFixed(2);
    console.log('cpu %: ' + data);
});
ipcRenderer.on('mem', (event, data)=>{
    console.log('mem %: ' + data);
    document.getElementById('mem').innerHTML = data.toFixed(2);
})
ipcRenderer.on('totmem', (event, data)=>{
    console.log('totmem GB: ' + data);
    document.getElementById('totmem').innerHTML = data.toFixed(2);
})