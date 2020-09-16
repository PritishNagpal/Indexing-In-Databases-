const electron = require('electron');
const { ipcMain } = electron;
const fs = require('fs');
const randomWords = require('random-words');
const path = require('path');




const createData = async (totalRows) => {
   const dir = path.join(__dirname,'GeneratedData');
   const dataDir = path.join(dir,'data');
   createDirectory(dir);
   createDirectory(dataDir);

   let extentNumber = 1;
   let pageNumber = 1;
   let pageLength = 0;
   for(let i=1;i<=totalRows;i++){
        const extentPath = path.join(dataDir,`extent_${extentNumber.toString()}`);
        const pagePath = path.join(extentPath,`page_${pageNumber.toString()}.txt`);
        createDirectory(extentPath);

        const rollNo = i;
        const name = await getRandomWord();
        const username = await getRandomWord();
        const password = await  getRandomWord();
        const rowData = `${rollNo}|${name}|${username}|${password}\n`;
        pageLength += rowData.length;

        if(pageLength < 8*1024){
            writeRow(pagePath,rowData);
        }else{
            i--;
            pageNumber++;
            pageLength = 0;
            if(pageNumber == 9){
                extentNumber++;
                pageNumber = 1;
            }
        }
   }
}

const createDirectory = (dir) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const getRandomWord = () => {
    const len = (Math.random()*10) + 5;
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    
    let str = '';
    for(let i=0;i<len;i++){
        let letter = Math.floor((Math.random()*10) + 16);
        str += alpha[letter];
    }
    return str;
}

const writeRow = (file,rowData) => {
    try{
        fs.appendFileSync(file,rowData);
    }catch(e){
        console.log(e);
    }
}

module.exports = createData;