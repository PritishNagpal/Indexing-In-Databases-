const electron = require('electron');
const {ipcRenderer} = electron;


const form = document.querySelector('form');

let rows;

form.addEventListener('submit',(e) => {
    e.preventDefault();
    rows = document.querySelector('#input').value; 
    console.log(rows);
    ipcRenderer.send('rowsAdded',rows);
})