const electron = require('electron');
const path = require('path');
const { BrowserWindow } = electron.remote;

const createBtn = document.querySelector('#createBtn');

const createWindow = () => { 
let win = new BrowserWindow({
    width: 250,
    height: 200
});

    win.loadFile(path.join(__dirname,'rows.html'))

    win.on('close',() => {
        win = null;
    })
}

createBtn.addEventListener('click',() => {
    createWindow();
})

