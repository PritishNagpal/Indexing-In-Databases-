const electron = require('electron');
const {ipcRenderer} = electron;
const createData = require('./Datamanager');


const form = document.querySelector('form');


form.addEventListener('submit',async (e) => {
    e.preventDefault(); 
    const rows = document.querySelector('#input').value; 
    console.log(rows);
    await createData(rows);
    await ipcRenderer.send('rowsAdded',rows);
})