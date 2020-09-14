const electron = require('electron');
const path = require('path');
const { BrowserWindow, ipcMain } = electron.remote;

const createBtn = document.querySelector('#createBtn');

const createWindow = () => { 
let win = new BrowserWindow({
    width: 250,
    height: 200,
    webPreferences:{
        nodeIntegration: true,
        enableRemoteModule: true
    }
});

    win.loadFile(path.join(__dirname,'rows.html'))

    win.on('close',() => {
        win = null;
    })

    ipcMain.on('rowsAdded',(e,rows) => {
        console.log(rows);
        win.close();
        
    })
}

createBtn.addEventListener('click',() => {
    createWindow();
});






