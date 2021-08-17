const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 1024,
        height: 600,
        titleBarStyle: 'hiddenInset',
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    })
    // win.removeMenu()
    win.loadFile('index.html')
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})