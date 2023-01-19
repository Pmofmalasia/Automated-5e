async function clearUnusedTable(tableID,startRowID,endRowID){
    let table = document.getElementById(tableID);
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

function addTableRow(tableID,rowIndex,rowID,rowHTML){
    let table = document.getElementById(tableID);
    let newRow = table.insertRow(rowIndex);
    newRow.id = rowID;
    newRow.innerHTML = rowHTML;
}

async function submitData(formName,nextMacroName) {
    let form = document.getElementById(formName);
    let submitData = Object.fromEntries(new FormData(form));
    let request = fetch("macro:"+nextMacroName+"@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}