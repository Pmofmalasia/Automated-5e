async function creatureTypeSelectionChanges(){
    let table = document.getElementById("MonsterCreationTable");
    let nextRowIndex = document.getElementById("rowCreatureType").rowIndex + 1;
}

async function createDamageTypeRows(damagePrefix){
    let table = document.getElementById("MonsterCreationTable");
    let nextRowIndex = document.getElementById("rowIs"+damagePrefix).rowIndex + 1;

    let request = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
    let damageTypes = await request.json();

    if(document.getElementById("Is"+damagePrefix).checked){
        for(let tempType of damageTypes){
            let tempID = damagePrefix+tempType.Name;
            let damageModRow = table.insertRow(nextRowIndex);
            damageModRow.id = "row"+tempID;
            damageModRow.innerHTML = "<th><label for='"+tempID+"'>"+tempType.DisplayName+" "+damagePrefix+":</label></th><td><select id='"+tempID+"' name='"+tempID+"'><option value=0>None</option><option value=1>Physical</option><option value=2>Magical</option><option value=3>All Damage</option></selected>";
            nextRowIndex++;
        }
    }
    else{
        for(let i=0; i < damageTypes.length; i++){
            table.deleteRow(nextRowIndex);
        }
    }
}

async function createConditionRows(){
    let table = document.getElementById("MonsterCreationTable");
    let nextRowIndex = document.getElementById("rowIsConditionImmun").rowIndex + 1;
    
    let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
    let conditionArray = await request.json();

    if(document.getElementById("IsConditionImmun").checked){
        for(let tempCondition of conditionArray){
            let tempID = tempCondition.Name+"Immunity";
            let conditionImmunRow = table.insertRow(nextRowIndex);
            conditionImmunRow.id = "row"+tempID;
            conditionImmunRow.innerHTML = "<th><label for='"+tempID+"'>"+tempCondition.DisplayName+" Immunity:</label></th><td><input type='checkbox' id='"+tempID+"' name='"+tempID+"'>";
            nextRowIndex++;
        }
    }
    else{
        for(let i=0; i < conditionArray.length; i++){
            table.deleteRow(nextRowIndex);
        }
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(MonsterCreation));
    let request = fetch("macro:MonsterCreationProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);