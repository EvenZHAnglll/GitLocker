// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

class FileRecord {
    constructor(fileName, filePath, lock) {
        this.fileName = fileName;
        this.filePath = filePath;

        this.lock = lock;
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
            (line.lock ?
            `<tr><td>${line.fileName}</td><td>${line.filePath}</td><td><button class="btn-unlock" id="${line.fileName}">unlock</button></td></tr>`
            :
            `<tr><td>${line.fileName}</td><td>${line.filePath}</td><td><button class="btn-lock" id="${line.fileName}">lock</button></td></tr>`
        )
    )
}

var lines = [] 
for (let i = 0; i < 400; i++) {
    var tf = (i % 2 == 0)
    lines.push(new FileRecord(
        `BP_abc_${i}.uasset`,
        `./Content/BP_abc_${i}.uasset`,
        (i % 4 == 0)
    ));
}

lines.forEach(element => {
    addNewLine(element)
});

document.querySelectorAll('.btn-lock').forEach(element =>{
    element.addEventListener('click', event =>{
        console.log("click On Lock", event.target.id, event)
    })
})

document.querySelectorAll('.btn-unlock').forEach(element =>{
    element.addEventListener('click', event =>{
        console.log("click On Unlock", event.target.id, event)
    })
})