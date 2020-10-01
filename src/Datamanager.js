const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader');
let Promise = require("bluebird");

let searchedData = ["NOTFOUND"];


const createData = async (totalRows) => {
   const dir = path.join(__dirname,'GeneratedData');
   const dataDir = path.join(dir,'data');
   createDirectory(dir);
   createDirectory(dataDir);
    
   let metadataFilePath = path.join(dataDir,"metadata");
   let metadata = totalRows;
   writeRow(metadataFilePath, metadata);
   
   let extentNumber = 1;
   let pageNumber = 1;
   let pageLength = 0;
   for(let i=1;i<=totalRows;i++){
        const extentPath = path.join(dataDir,`extent_${extentNumber.toString()}`);
        const pagePath = path.join(extentPath,`page_${pageNumber.toString()}.txt`);
        createDirectory(extentPath);

        const rollNo = i;
        const name = getRandomWord();
        const username = getRandomWord();
        const password =  getRandomWord();
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

async function searchData(dataToBeDisplayed,searchDataInColumn,dataToBeSearched){
    
   const dir = path.join(__dirname,'GeneratedData');
   const dataDir = path.join(dir,'data');
    let extentNumber=1,pageNumber=1;
    let totalRows=0;
    let metadataFilePath = path.join(dataDir,"metadata");
    let curLine = "";
    let resultAfterSearch;

    var eachLine = Promise.promisify(lineReader.eachLine);
    await eachLine(metadataFilePath, function(line) {
        curLine = line.toString();
    }).then(async function() {
        totalRows = parseInt(curLine);
        // console.log(totalRows);
        let i=1;
        let flag = false;
        while (i <= parseInt(totalRows)) {
            if(flag)break;
            let extentPath = path.join(dataDir,"extent_"+extentNumber);
            let pagePath = path.join(extentPath,"page_"+pageNumber+".txt");
            // let pathsearch = path.relative(__filename,pagePath);

            let pathsearch = pagePath;
            pathsearch = pathsearch.split("\\").join("/");
            console.log(pathsearch);
            await eachLine(pathsearch,function(line){
                if(flag == false){
                    // console.log(line);
                curLine = line.toString();
                let result = curLine.split("|");
                i++;
                if(dataToBeSearched==result[parseInt(searchDataInColumn)]){
                    resultAfterSearch = result;
                    flag = true;
                } else return;
            }
            }).then(()=>{
                pageNumber++;
                if (pageNumber == 9) {
                    extentNumber++;
                    pageNumber = 1;
                }
            })
        }
    }).catch(function(err) {
        console.error(err);
    });
    if(resultAfterSearch)searchedData = resultAfterSearch;
    else searchedData = ["NOTFOUND"];
    
}

export {createData,searchData,searchedData};