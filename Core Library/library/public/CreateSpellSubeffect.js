async function createMitigationTable(){
    let table = document.getElementById("SubeffectTable");
    let mitigationLineIndex = document.getElementById("Mitigation").rowIndex;

    if(document.getElementById("howMitigate").value == "Attack"){
        clearUnusedTable("Mitigation","Damage");
        let attackTableRow2 = table.insertRow(mitigationLineIndex+1);
        let attackTableRow1 = table.insertRow(mitigationLineIndex+1);

        attackTableRow1.innerHTML = "<th>Melee or Ranged Attack:</th><select id='MeleeRanged' name='MeleeRanged'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>";
        attackTableRow2.innerHTML = "<th>Crit Threshhold:</th><td><input type='number' id='CritThresh' name='CritThresh' max='20' min='1' value='20'></td>";
    }
    else if(document.getElementById("howMitigate").value == "Save"){
        clearUnusedTable("Mitigation","Damage");
        let saveTableRows = table.insertRow(mitigationLineIndex+1);

        let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: "['DisplayName','json']"});
        let saveTypes = await request.json();

        let saveOptions = "";
        for(let tempSave of saveTypes){
            saveOptions += "<option value='"+tempSave+"'>"+tempSave+"</option>";
        }
        saveTableRows.innerHTML = "<th>Save Type:</th><select id='SaveType' name='SaveType'>"+saveOptions+"</select></td>";

        if(document.getElementById("isDamage").checked){
            for(let i=1; i <= document.getElementById("differentTypes").value; i++){
                if(document.getElementById("isAHL"+i).value == "0"){
                    var rowPrefix = "rowIsAHL";
                }
                else{
                    var rowPrefix = "rowAHLFlatBonus";
                }
                let rowToReplaceIndex = document.getElementById(rowPrefix+i).rowIndex;
                let newSaveMitigationRow = table.insertRow(rowToReplaceIndex+1);
                newSaveMitigationRow.id = "rowSaveMitigation"+i;
                newSaveMitigationRow.innerHTML = "<th>Damage on Successful Save:</th><td><select id='saveMitigation"+i+"' name='saveMitigation"+i+"'><option value=2>None</option><option value=1>Half</option><option value=0>Full</option></select></td>";
            }
        }
    }
    else{
        clearUnusedTable("Mitigation","Damage");
    }

    if(document.getElementById("howMitigate").value != "Save" && document.getElementById("isDamage").checked){
        for(let i=1; i <= document.getElementById("differentTypes").value; i++){
            table.deleteRow(document.getElementById("rowSaveMitigation"+i).rowIndex);
        }
    }
}

async function clearUnusedTable(anchorRowID,endRowID){
    let table = document.getElementById("SubeffectTable");
    let anchorRowIndex = document.getElementById(anchorRowID).rowIndex;
    var endRowIndex = document.getElementById(endRowID).rowIndex;
    while(anchorRowIndex+1 != endRowIndex){
        table.deleteRow(anchorRowIndex+1);
        var endRowIndex = document.getElementById(endRowID).rowIndex;
    }
}

async function createDamageTable(){
    if(document.getElementById("isDamage").checked){
        let table = document.getElementById("SubeffectTable");
        let damageRowIndex = document.getElementById("Damage").rowIndex;
        let addRemoveButtonsRow = table.insertRow(damageRowIndex+1);
        addRemoveButtonsRow.id = "AdditionButtons";
        addRemoveButtonsRow.innerHTML = "<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows()'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows()'></th>";

        addDamageTypeRows();
    }
    else{
        clearUnusedTable("Damage","Missiles");
        document.getElementById("differentTypes").value = 0;
    }
}

async function addDamageTypeRows(){
    let table = document.getElementById("SubeffectTable");
    let buttonRowIndex = document.getElementById("AdditionButtons").rowIndex;
    let damageTypeNumber = document.getElementById("differentTypes").value;
    damageTypeNumber++;
    document.getElementById("differentTypes").value = damageTypeNumber;

    let request = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: "['DisplayName','json']"});
    let damageTypes = await request.json();

    let damageTypeOptions = "";
    for(let tempType of damageTypes){
        damageTypeOptions = damageTypeOptions + "<option value='"+tempType+"'>"+tempType+"</option>";
    }

    damageTypeOptions = damageTypeOptions + "<option value='Healing'>Healing</option><option value='Temp HP'>Temp HP</option><option value='Multiple Options'>Multiple Options</option>";
    
    let damageRow = table.insertRow(buttonRowIndex);
    damageRow.id = "DamageSet"+damageTypeNumber;
    damageRow.innerHTML = "<th text-align='center' colspan='2'><input type='number' id='DamageDieNum"+damageTypeNumber+"' name='DamageDieNum"+damageTypeNumber+"' value=1 min=0 style='width:25px'> d <input type='number' id='DamageDieSize"+damageTypeNumber+"' name='DamageDieSize"+damageTypeNumber+"' value=6 style='width:25px'> <b>+</b> <input type='number' id='DamageFlatBonus"+damageTypeNumber+"' name='DamageFlatBonus"+damageTypeNumber+"' value=0 style='width:25px'><select id='DamageType"+damageTypeNumber+"' name='DamageType"+damageTypeNumber+"' onchange='createTypeOptions("+damageTypeNumber+")'>"+damageTypeOptions+"</select> Damage</th>";
    
    let modBonusRow = table.insertRow(buttonRowIndex+1);
    modBonusRow.id = "rowModBonus"+damageTypeNumber;
    modBonusRow.innerHTML = "<th>Add Spellcasting Modifier to Damage:</th><td><input type='checkbox' id='ModBonus"+damageTypeNumber+"' name='ModBonus"+damageTypeNumber+"' value=1></td>";
    
    let isAHLRow = table.insertRow(buttonRowIndex+2);
    isAHLRow.id = "rowIsAHL"+damageTypeNumber;
    isAHLRow.innerHTML = "<th>Damage Increases AHL:</th><td><select id='isAHL"+damageTypeNumber+"' name='isAHL"+damageTypeNumber+"' onchange='createAHLDamage("+damageTypeNumber+")'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select></td>";

    if(document.getElementById("howMitigate").value == "Save"){
        let saveMitigationRow = table.insertRow(buttonRowIndex+3);
        saveMitigationRow.id = "rowSaveMitigation"+damageTypeNumber;
        saveMitigationRow.innerHTML = "<th>Damage on Successful Save:</th><td><select id='saveMitigation"+damageTypeNumber+"' name='saveMitigation"+damageTypeNumber+"'><option value=2>None</option><option value=1>Half</option><option value=0>Full</option></select></td>";
    }
}

async function removeDamageTypeRows(){
    let table = document.getElementById("SubeffectTable");
    let damageTypeNumber = document.getElementById("differentTypes").value;
    clearUnusedTable("DamageSet"+damageTypeNumber,"AdditionButtons");
    document.getElementById("differentTypes").value = damageTypeNumber-1;
    table.deleteRow(document.getElementById("AdditionButtons").rowIndex - 1);
}

async function createTypeOptions(damageTypeNumber){
    let table = document.getElementById("SubeffectTable");
    let damageRowIndex = document.getElementById("DamageSet"+damageTypeNumber).rowIndex;

    if(document.getElementById("DamageType"+damageTypeNumber).value == "Multiple Options"){
        let damageTypeSelectRow = table.insertRow(damageRowIndex+1);
        damageTypeSelectRow.id = "rowDamageTypeOptions"+damageTypeNumber;

        damageTypeSelectRow.innerHTML = "<th>Damage Type Options:</th><td><select id='DamageTypeOptions"+damageTypeNumber+"' name='DamageTypeOptions"+damageTypeNumber+"' multiple></select></td>";

        let damageTypeOptions = document.getElementById("DamageType"+damageTypeNumber).innerHTML;

        let damageTypeSelect = document.getElementById("DamageTypeOptions"+damageTypeNumber);
        damageTypeSelect.innerHTML = damageTypeOptions;
        damageTypeSelect = damageTypeSelect.remove(damageTypeSelect.length-1);
        
        let damageTypeRandomRow = table.insertRow(damageRowIndex+2);
        damageTypeRandomRow.id = "rowDamageTypeRandom"+damageTypeNumber;
        damageTypeRandomRow.innerHTML = "<th>Type Chosen Randomly?</th><td><input type='checkbox' id='DamageTypeRandom"+damageTypeNumber+"' name='DamageTypeRandom"+damageTypeNumber+"' value='1'></td>";
    }
    else{
        if(table.rows[damageRowIndex+1].id != "rowModBonus"+damageTypeNumber){
            clearUnusedTable("DamageSet"+damageTypeNumber,"rowModBonus"+damageTypeNumber);
        }
    }
}

async function createAHLDamage(damageTypeNumber){
    let table = document.getElementById("SubeffectTable");
    let AHLRowIndex = document.getElementById("rowIsAHL"+damageTypeNumber).rowIndex;
    
    if(document.getElementById("isAHL"+damageTypeNumber).value == "0"){
        if(document.getElementById("howMitigate").value == "Save"){
            clearUnusedTable("rowIsAHL"+damageTypeNumber,"rowSaveMitigation"+damageTypeNumber)
        }
        else{
            if(damageTypeNumber == document.getElementById("differentTypes").value){
                clearUnusedTable("rowIsAHL"+damageTypeNumber,"AdditionButtons");
            }
            else{
                clearUnusedTable("rowIsAHL"+damageTypeNumber,"DamageSet"+(damageTypeNumber+1));
            }
        }

    }
    else{
        if(table.rows[AHLRowIndex+1].id != "rowAHLDieNum"+damageTypeNumber){
            let AHLDiceRow = table.insertRow(AHLRowIndex+1);
            AHLDiceRow.id = "rowAHLDieNum"+damageTypeNumber;
            AHLDiceRow.innerHTML = "<th>Dice per Increase:</th><td><input type='number' id='AHLDieNum"+damageTypeNumber+"' name='AHLDieNum"+damageTypeNumber+"' min=0 style='width:25px' value=1> d <input type='number' id='AHLDieSize"+damageTypeNumber+"' name='AHLDieSize"+damageTypeNumber+"' min=0 style='width:25px' value="+document.getElementById("DamageDieSize"+damageTypeNumber).value+"></td>";

            let AHLFlatBonusRow = table.insertRow(AHLRowIndex+2);
            AHLFlatBonusRow.id = "rowAHLFlatBonus"+damageTypeNumber;
            AHLFlatBonusRow.innerHTML = "<th>Flat Bonus per Increase:</th><td><input type='number' id='AHLFlatBonus"+damageTypeNumber+"' name='AHLFlatBonus"+damageTypeNumber+"' min=0 style='width:25px' value=0></td>";
        }
    }
}

async function createRangeTable(){
    let table = document.getElementById("SubeffectTable");
    let RangeRowIndex = document.getElementById("Range").rowIndex;

    if(document.getElementById("rangeType").value == "SelfRanged" || document.getElementById("rangeType").value == "Ranged"){
        if(RangeRowIndex+1 == document.getElementById("AoE").rowIndex){
            let rangeDistanceRow = table.insertRow(RangeRowIndex+1);
            rangeDistanceRow.id = "rowRangeDistance";
            rangeDistanceRow.innerHTML = "<th>Range:</th><td><input type='number' id='RangeValue' name='RangeValue' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            
            let rangeDistanceAHLRow = table.insertRow(RangeRowIndex+2);
            rangeDistanceAHLRow.id = "rowRangeDistanceAHL";
            rangeDistanceAHLRow.innerHTML = "<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL' name='RangeValueAHL' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnitsAHL'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select><select id='RangeScaling' name='RangeScaling'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select></td>";
        }
    }
    else if(RangeRowIndex+1 != document.getElementById("AoE").rowIndex){
        clearUnusedTable("Range","AoE");
    }
}

async function createAoETable(){
    let table = document.getElementById("SubeffectTable");
    let currentAOESelection = document.getElementById("aoeShape").value;
    let aoeIndex = document.getElementById("AoE").rowIndex;

    if(currentAOESelection == "None"){
        clearUnusedTable("AoE","Target");
    }
    else if(currentAOESelection == "Cone"){
        let rowConeDimensions = table.insertRow(aoeIndex+1);
        rowConeDimensions.id = "rowConeDimensions";
        rowConeDimensions.innerHTML = "<th><label for='coneDimensionValue'>Cone Size:</label></th><td><input type='number' id='coneDimensionValue' name='coneDimensionValue' min=0 style='width:25px' value=0><select id='coneDimensionUnits' name='coneDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Cube"){
        let rowCubeDimensions = table.insertRow(aoeIndex+1);
        rowCubeDimensions.id = "rowCubeDimensions";
        rowCubeDimensions.innerHTML = "<th><label for='cubeDimensionValue'>Side Length:</label></th><td><input type='number' id='cubeDimensionValue' name='cubeDimensionValue' min=0 style='width:25px' value=0><select id='cubeDimensionUnits' name='cubeDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Cylinder"){
        let rowCylinderDimensions = table.insertRow(aoeIndex+1);
        rowCylinderDimensions.id = "rowCylinderDimensions";
        rowCylinderDimensions.innerHTML = "<th><label for='cylinderRadiusValue'>Cylinder Radius x Height:</label></th><td><input type='number' id='cylinderRadiusValue' name='cylinderRadiusValue' min=0 style='width:25px' value=0><select id='cylinderRadiusUnits' name='cylinderRadiusUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='cylinderHeightValue' name='cylinderHeightValue' min=0 style='width:25px' value=0><select id='cylinderHeightUnits' name='cylinderHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Half Sphere"){
        let rowHalfSphereDimensions = table.insertRow(aoeIndex+1);
        rowHalfSphereDimensions.id = "rowHalfSphereDimensions";
        rowHalfSphereDimensions.innerHTML = "<th><label for='halfSphereDimensionValue'>Half Sphere Radius:</label></th><td><input type='number' id='halfSphereDimensionValue' name='halfSphereDimensionValue' min=0 style='width:25px' value=0><select id='halfSphereDimensionUnits' name='halfSphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Line"){
        let rowLineDimensions = table.insertRow(aoeIndex+1);
        rowLineDimensions.id = "rowLineDimensions";
        rowLineDimensions.innerHTML = "<th><label for='lineLengthValue'>Line Length x Width:</label></th><td><input type='number' id='lineLengthValue' name='lineLengthValue' min=0 style='width:25px' value=0><select id='lineLengthUnits' name='lineLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='lineWidthValue' name='lineWidthValue' min=0 style='width:25px' value=0><select id='lineWidthUnits' name='lineWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Panels"){
        let rowPanelDimensions = table.insertRow(aoeIndex+1);
        rowPanelDimensions.id = "rowPanelDimensions";
        rowPanelDimensions.innerHTML = "<th><label for='panelDimensionValue'>Panel Side Length:</label></th><td><input type='number' id='panelDimensionValue' name='panelDimensionValue' min=0 style='width:25px' value=0><select id='panelDimensionUnits' name='panelDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";

        let rowPanelNumber = table.insertRow(aoeIndex+2);
        rowPanelNumber.id = "rowPanelNumber";
        rowPanelNumber.innerHTML = "<th><label for='panelNumber'>Number of Panels:</label></th><td><input type='number' id='panelNumber' name='panelNumber' min=0 style='width:25px' value=10></td>";
    }
    else if(currentAOESelection == "Sphere"){
        let rowSphereDimensions = table.insertRow(aoeIndex+1);
        rowSphereDimensions.id = "rowSphereDimensions";
        rowSphereDimensions.innerHTML = "<th><label for='sphereDimensionValue'>Sphere Radius:</label></th><td><input type='number' id='sphereDimensionValue' name='sphereDimensionValue' min=0 style='width:25px' value=0><select id='sphereDimensionUnits' name='sphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Wall"){
        let rowWallDimensions = table.insertRow(aoeIndex+1);
        rowWallDimensions.id = "rowWallDimensions";
        rowWallDimensions.innerHTML = "<th><label for='wallLengthValue'>Wall Length x Width x Height:</label></th><td><input type='number' id='wallLengthValue' name='wallLengthValue' min=0 style='width:25px' value=0><select id='wallLengthUnits' name='wallLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallWidthValue' name='wallWidthValue' min=0 style='width:25px' value=0><select id='wallWidthUnits' name='wallWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallHeightValue' name='wallHeightValue' min=0 style='width:25px' value=0><select id='wallHeightUnits' name='wallHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(currentAOESelection == "Choose"){
        
    }
}

async function createTargetTable(){
    let table = document.getElementById("SubeffectTable");
    let currentTargetTypeSelection = document.getElementById("targetType").value;
    let targetTypeIndex = document.getElementById("Target").rowIndex;

    if(currentTargetTypeSelection == "Creature"){
        
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('SubeffectTable').innerHTML = userdata;
}

async function submitSpellData() {
    let submitData = Object.fromEntries(new FormData(spellCreation));
    let request = fetch("macro:CreateSpellSubeffectProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);