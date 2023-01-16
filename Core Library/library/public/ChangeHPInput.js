async function addDamageTypeRow(){
    let table = document.getElementById("ChangeHPInputTable");
    let nextRowIndex = document.getElementById("rowDamage0").rowIndex;
    let nextDamageTypeNumber = 0;
    while(nextRowIndex != document.getElementById("rowDamageButtons").rowIndex){
        nextRowIndex++;
        nextDamageTypeNumber++;
    }

    let response = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
    let DamageTypeList = await response.json();

    let DamageTypeOptions = "<option value='None'>Ignore Type</option>";
    for(let tempDamageType of DamageTypeList){
        DamageTypeOptions = DamageTypeOptions + "<option value='"+tempDamageType.Name+"'>"+tempDamageType.DisplayName+"</option>";
    }

    let rowDamageType = table.insertRow(nextRowIndex);
    rowDamageType.id = "rowDamage"+nextInnateNumber;
    rowDamageType.innerHTML = "<th><label for='DamageValue"+nextDamageTypeNumber+"'>Damage:</label></th><td><input type='number' id='DamageValue"+nextDamageTypeNumber+"' name='DamageValue"+nextDamageTypeNumber+"' value='0' min=0 style='width:30px'><select id='DamageType"+nextDamageTypeNumber+"' name='DamageType"+nextDamageTypeNumber+"'>"+DamageTypeOptions+"</select></td>";
    nextRowIndex++;

    document.getElementById("DamageTypeNumber").value = nextDamageTypeNumber;
}

async function removeDamageTypeRow(){
    let table = document.getElementById("ChangeHPInputTable");
    let currentDamageNumber = document.getElementById("DamageTypeNumber").value;
    table.deleteRow(document.getElementById("rowDamage"+currentDamageNumber).rowIndex);
    document.getElementById("DamageTypeNumber").value = currentDamageNumber - 1;
}

async function addConcSaveOptions(){
    let table = document.getElementById("ChangeHPInputTable");
    let nextRowIndex = document.getElementById("rowBypassConc").rowIndex + 1;

    if(document.getElementById("BypassConc").checked){
        clearUnusedTable("rowBypassConc","rowAddSourceInfo");
    }
    else{
        let rowConcSaveBonus = table.insertRow(nextRowIndex);
        rowConcSaveBonus.id = "rowConcSaveBonus";
        rowConcSaveBonus.innerHTML = "<th><label for='ConcSaveBonus'>Concentration Save Bonus:</label></th><td><input type='number' id='ConcSaveBonus' name='ConcSaveBonus' value='0' style='width:25px'></td>";
        nextRowIndex++;
        
        let rowConcSaveAdvantage = table.insertRow(nextRowIndex);
        rowConcSaveAdvantage.id = "rowConcSaveAdvantage";
        rowConcSaveAdvantage.innerHTML = "<th><label for='ConcSaveAdvantage'>Concentration Save Bonus:</label></th><td><select id='ConcSaveAdvantage' name='ConcSaveAdvantage'><option value=0>Forced Disadvantage</option><option value=1>Situational Disadvantage</option><option value=2>Normal Roll</option><option value=3>Situational Advantage</option><option value=4>Forced Advantage</option></select></td>";
        nextRowIndex++;
    }
}

async function addSourceInfo(){
    //TODO: Add in-depth options for adding info about the source of an effect later, e.g. is it magical, weapon attack, from a spell, who's the source, etc. Low priority for now since the effects frame should cover all of that anyway.
}

async function clearUnusedTable(startRowID,endRowID){
    let table = document.getElementById("ChangeHPInputTable");
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('ChangeHPInputTable').innerHTML = userdata;
}

async function submitData() {
    let submitData = Object.fromEntries(new FormData(ChangeHPInput));
    let request = fetch("macro:ChangeHPInputProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);