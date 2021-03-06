// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//const { ipcRenderer } = require("electron");

// const {ipcRenderer} = require('electron')


class FileRecord {
    constructor(fileName, filePath, lockOwner,  bLocked) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.lockOwner = lockOwner;
        this.bLocked = bLocked;
    }
}

function searchClick(){
    console.log("searchClick")
}
function searchInput(){
    console.log("searchInput");
    searchFilter();
}

function searchFilter() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    if(filter == "LOCKS" || filter == "\\" || filter == "LOCK"){
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase()=="-") {
                    tr[i].style.display = "none";
                } else {
                    tr[i].style.display = "";
                }
            }       
        }
    }else{
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }       
        }
    }
  }

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('myInput').addEventListener('click',searchClick);
    document.getElementById('myInput').addEventListener('keyup',searchInput);
});



// table content
var line = new FileRecord("name.umap","fasdasdafasd/sadafsf",true)
var tableBody = document.getElementById('table-body')

function addNewLine(line){
    tableBody.insertAdjacentHTML(
        // document.getElementById('table-body').insertAdjacentHTML(
            "beforeend", 
            (line.bLocked?
            `<tr><td class="column-60">${line.filePath}</td><td class="column-20">${line.lockOwner}</td><td class="column-btn"><button class="btn-unlock" id="${line.filePath}">Unlock</button></td></tr>`
            :
            `<tr><td class="column-60">${line.filePath}</td><td class="column-20">${line.lockOwner}</td><td class="column-btn"><button class="btn-lock" id="${line.filePath}">Lock</button></td></tr>`
        )
    )
}

// var lines = [] 
// for (let i = 0; i < 400; i++) {
//     var tf = (i % 2 == 0)
//     lines.push(new FileRecord(
//         `BP_abc_${i}.uasset`,
//         `./Content/BP_abc_${i}.uasset`,
//         (i % 4 == 0)
//     ));
// }

// lines.forEach(element => {
//     addNewLine(element)
// });



// ipcRenderer.on('got-files-in-out',(event,files)=>{
//     console.log(files)
//     document.getElementById('data-div').innerHTML= files
// })

// ipcRenderer.on('got-app-path',(event,app_path)=>{
//     console.log(app_path)
// })

//ipcRenderer.send('get-files-in-out')

//ipcRenderer.send('get-app-path')


// run_script('cd C:\\Users\\Even\\Desktop\\GitHub\\electron-api-demos-master\n ls', [''] , (output) => {
//     console.log("run_script:",output);
// });

//child_process.exec('git status',{cwd:repoPath},(error,stdout,stderr)=>{console.log(stdout)})
var lockedFileNames = []
var LockedDict = {}
child_process.exec('git lfs locks',{cwd:repoPath},(error,stdout,stderr)=>{
    if (error){console.log("ERROR:",error)}
    console.log(stdout)
    arrayOfLocks = stdout.split("\n")
    
    console.log(arrayOfLocks)
    arrayOfLocks.forEach((element,index ) =>{
        console.log(element)
        element = element.replace("	","//")
        element = element.replace("	","//")
        element = element.replace(/\s/g,"")
        arrayOfLocks[index] = element.split("//")
        lockedFileNames[index] = arrayOfLocks[index][0]
        LockedDict[arrayOfLocks[index][0]] = arrayOfLocks[index][2]
    })
    arrayOfLocks.pop()
    console.log(arrayOfLocks)
    updateFileRecords()
})

//"README.md         EvenZHAnglllID:441708", "css/searchicon.png	EvenZHAnglll	ID:441678", "preload.js        	EvenZHAnglll	ID:436008"



// get file list
const fs = require("fs")
const path = require("path")

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (!ignore.includes(file)) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath, "/", file))
            }
        }
    })
    return arrayOfFiles
}

function updateFileRecords () {
    var fileList = getAllFiles(repoPath) 
    var fileListRelative = []
    fileList.forEach(element => {
        fileListRelative.push(element.replace(repoPath,"."))
    });
    console.log(fileListRelative)

    fileListRelative.forEach(file => {
        file = file.replace(".\\","")
        file = file.replaceAll("\\","/") //.replace("\\","/")
        if(lockedFileNames.includes(file)){
            var owner = arrayOfLocks[lockedFileNames.findIndex((element)=>{return element==file})][1]
            addNewLine(new FileRecord(file.split("\\").pop(),file,owner,true))
        }else{
            addNewLine(new FileRecord(file.split("\\").pop(),file,"-",false))
        }
        
    }) 



    // bind Event to Buttons
    document.querySelectorAll('.btn-lock').forEach(element =>{
        element.addEventListener('click', event =>{
            console.log("click On Lock", event.target.id, event)
            document.getElementById(event.target.id).innerHTML = '<div class="ld ld-ring ld-spin"></div>'
            child_process.exec(`git lfs lock ${event.target.id}`,{cwd:repoPath},(error,stdout,stderr)=>{
                location.reload()
            })
        })
    })

    document.querySelectorAll('.btn-unlock').forEach(element =>{
        element.addEventListener('click', event =>{
            console.log("click On Unlock", event.target.id, event)
            document.getElementById(event.target.id).innerHTML = '<div class="ld ld-ring ld-spin"></div>'
            child_process.exec(`git lfs unlock ${event.target.id}`,{cwd:repoPath},(error,stdout,stderr)=>{
                location.reload()
            })            
        })
    })
}

