const { app, BrowserWindow } = require('electron')
const ipc=require('electron').ipcMain
let win

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 550, frame: false })

  win.loadFile('src/index.html')

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipc.on('btnClose',function(event){
    app.quit();
})

ipc.on('btnMin',function(event){
    
})