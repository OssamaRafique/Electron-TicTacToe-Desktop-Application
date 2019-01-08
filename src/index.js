const electron = require('electron')
const ipc = electron.ipcRenderer

const closeBtn=document.getElementById('close')

closeBtn.addEventListener('click',function(event){
    ipc.send('btnClose')
})

const minBtn=document.getElementById('min')

minBtn.addEventListener('click',function(event){
    //ipc.send('btnMin')
    var remote = require( 'electron' ).remote;
    var win = remote.getCurrentWindow();
    win.minimize()
})
