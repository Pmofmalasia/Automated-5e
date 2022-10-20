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
                let rowPrefix = "";
                if(document.getElementById("isAHL"+i).value == "0"){
                    rowPrefix = "rowIsAHL";
                }
                else{
                    rowPrefix = "rowAHLFlatBonus";
                }
                let rowToReplaceIndex = document.getElementById(rowPrefix+i).rowIndex;
                let newSaveMitigationRow = table.insertRow(rowToReplaceIndex+1);
                newSaveMitigationRow.id = "rowSaveMitigation"+i;
                newSaveMitigationRow.innerHTML = "<th>Damage on Successful Save:</th><td><select id='saveMitigation"+i+"' name='saveMitigation"+i+"'><option value=2>None</option><option value=1>Half</option><option value=0>Full</option></select></td>";
            }
        }
        
        if(document.getElementById("isMoveTarget").checked){
            let moveStartRow = document.getElementById("rowMoveTargetAHLInfo").rowIndex;
            let rowSavePreventMove = table.insertRow(moveStartRow+1);
            rowSavePreventMove.id = "rowSavePreventMove";
            rowSavePreventMove.innerHTML = "<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td></tr>";
        }
        
        if(document.getElementById("isCondition").value != "None"){
            let nextRowIndex = document.getElementById("rowSummons").rowIndex;
            let rowConditionSave = table.insertRow(nextRowIndex);
            rowConditionSave.id = "rowConditionSave";
            rowConditionSave.innerHTML = "<th><label for='conditionSaveEffect'>Conditions Applied on Save:</label></th><select id='conditionSaveEffect' name='conditionSaveEffect' onchange='createConditionSaveTable()'><option value='0'>All Applied</option><option value='1'>Some Applied</option><option value='2' select>None Applied</option><option value='Different'>Different Condition Applied</option></select></td>";
        }
    }
    else{
        clearUnusedTable("Mitigation","Damage");
    }

    if(document.getElementById("howMitigate").value != "Save"){
        if(document.getElementById("isDamage").checked){
            for(let i=1; i <= document.getElementById("differentTypes").value; i++){
                table.deleteRow(document.getElementById("rowSaveMitigation"+i).rowIndex);
            }
        }
        
        if(document.getElementById("isCondition").value != "None"){
            if(document.getElementById("rowConditionSave").value == 1){
                table.deleteRow(document.getElementById("rowConditionsNullified").rowIndex);
            }
            table.deleteRow(document.getElementById("rowConditionSave").rowIndex);
        }
        
        if(document.getElementById("isMoveTarget").checked){
            table.deleteRow(document.getElementById("rowSavePreventMove").rowIndex);
        }
    }
}

async function clearUnusedTable(startRowID,endRowID){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

async function createAHLSelect(ahlSelectID){
    let ahlSelectHTML = "";
    if(document.getElementById("SpellLevel").value == "0"){
        ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Interval</option><option value='2'>Every Other Interval</option><option value='3'>Every Three Intervals</option></select>";
    }
    else{
        ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select>";
    }

    return ahlSelectHTML;
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
        clearUnusedTable("Damage","rowCondition");
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

        let request = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let damageTypes = await request.json();
    
        let damageTypeOptions = "";
        for(let tempType of damageTypes){
            damageTypeOptions = damageTypeOptions + "<label><input type='checkbox' id='DamageTypeOptions"+tempType.Name+damageTypeNumber+"' name='DamageTypeOptions"+tempType.Name+damageTypeNumber+"' value=1><span>"+tempType.DisplayName+"</span></label>";
        }
    
        damageTypeSelectRow.innerHTML = "<th>Damage Type Options:</th><td><div class='check-multiple' style='width:100%'>"+damageTypeOptions+"</div></td>";
        
        let damageTypeRandomRow = table.insertRow(damageRowIndex+2);
        damageTypeRandomRow.id = "rowDamageTypeRandom"+damageTypeNumber;
        damageTypeRandomRow.innerHTML = "<th><label for='DamageTypeRandom"+damageTypeNumber+"'>Type Chosen Randomly?</label></th><td><input type='checkbox' id='DamageTypeRandom"+damageTypeNumber+"' name='DamageTypeRandom"+damageTypeNumber+"' value='1'></td>";
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
            AHLDiceRow.innerHTML = "<th><label for='AHLDieNum"+damageTypeNumber+"'>Increased Damage per Increment:</label></th><td><input type='number' id='AHLDieNum"+damageTypeNumber+"' name='AHLDieNum"+damageTypeNumber+"' min=0 style='width:25px' value=1> d <input type='number' id='AHLDieSize"+damageTypeNumber+"' name='AHLDieSize"+damageTypeNumber+"' min=0 style='width:25px' value="+document.getElementById("DamageDieSize"+damageTypeNumber).value+"> + <input type='number' id='AHLFlatBonus"+damageTypeNumber+"' name='AHLFlatBonus"+damageTypeNumber+"' min=0 style='width:25px' value=0></td>";
        }
    }
}

async function createConditionTable(){
    let table = document.getElementById("SubeffectTable");
    let nextRowIndex = document.getElementById("rowCondition").rowIndex + 1;
    let conditionChoice = document.getElementById("isCondition").value;

    if(conditionChoice == "None"){
        clearUnusedTable("rowCondition","rowSummons");
    }
    else{
        let alreadyAlwaysSetTest = (table.rows.namedItem("rowConditionsAlwaysSet") != null);
        let alreadyOptionsTest = (table.rows.namedItem("rowConditionOptions") != null);
        let alreadySaveTest = (table.rows.namedItem("rowConditionSave") != null);

        if(alreadySaveTest){
            var endRowId = "rowConditionSave";
        }
        else{
            var endRowId = "rowSummons";
        }

        if(conditionChoice == "All" || conditionChoice == "Mixture"){
            if(alreadyAlwaysSetTest){
                nextRowIndex = nextRowIndex + (document.getElementById(endRowId).rowIndex - document.getElementById("rowCondition").rowIndex - 1);
            }
            else{
                let conditionOptions = await createConditionMultipleBoxes("AlwaysSet","createConditionSaveTable()");
                conditionOptions = conditionOptions + "<label><input type='checkbox' id='AlwaysSetSpellSpecific' name='AlwaysSetSpellSpecific' value=1 onchange='createSpellConditionRow(1)'><span>Spell-Specific Condition</span></label>";

                let rowConditionsAlwaysSet = table.insertRow(nextRowIndex);
                rowConditionsAlwaysSet.id = "rowConditionsAlwaysSet";
                rowConditionsAlwaysSet.innerHTML = "<th><label for='conditionsAlwaysSet'>Set Conditions:</label></th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
                nextRowIndex++;
            }
            if(alreadyOptionsTest && conditionChoice == "All"){
                clearUnusedTable("rowConditionOptions",endRowId);
                table.deleteRow(document.getElementById("rowConditionOptions").rowIndex);
            }
        }
        else{
            nextRowIndex = nextRowIndex + (document.getElementById(endRowId).rowIndex - document.getElementById("rowCondition").rowIndex - 1);
        }
        
        if(conditionChoice == "Choose" || conditionChoice == "Mixture"){
            if(!alreadyOptionsTest){
                let conditionOptions = await createConditionMultipleBoxes("ConditionOption","createConditionSaveTable()");
                conditionOptions = conditionOptions + "<label><input type='checkbox' id='ConditionOptionSpellSpecific' name='ConditionOptionSpellSpecific' value=1 onchange='createSpellConditionRow(2)'><span>Spell-Specific Condition</span></label>";

                let rowConditionOptions = table.insertRow(nextRowIndex);
                rowConditionOptions.id = "rowConditionOptions";
                rowConditionOptions.innerHTML = "<th>Condition Options:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
                nextRowIndex++;

                let conditionAHLScalingSelect = await createAHLSelect("conditionOptionsNumberAHLScaling");

                let rowConditionOptionsNumber = table.insertRow(nextRowIndex);
                rowConditionOptionsNumber.id = "rowConditionOptionsNumber";
                rowConditionOptionsNumber.innerHTML = "<th><label  for='conditionOptionsNumber'>Number of Options to Choose:</label></th><td><input type='number' id='conditionOptionsNumber' name='conditionOptionsNumber' min=1 value=1 style='width:25px'> + <input type='number' id='conditionOptionsNumberAHL' name='conditionOptionsNumberAHL' min=0 value=0 style='width:25px'>"+conditionAHLScalingSelect+"</td>";
                nextRowIndex++;
            }
            else{
                nextRowIndex = nextRowIndex + (document.getElementById(endRowId).rowIndex - document.getElementById("rowConditionOptions").rowIndex);
            }
            if(alreadyAlwaysSetTest && conditionChoice == "Choose"){
                clearUnusedTable("rowCondition","rowConditionOptions");
            }
        }

        if(document.getElementById("howMitigate").value == "Save" && !alreadySaveTest){
            let nextRowIndex = document.getElementById("rowSummons").rowIndex;
            let rowConditionSave = table.insertRow(nextRowIndex);
            rowConditionSave.id = "rowConditionSave";
            rowConditionSave.innerHTML = "<th><label for='conditionSaveEffect'>Conditions Applied on Save:</label></th><select id='conditionSaveEffect' name='conditionSaveEffect' onchange='createConditionSaveTable()'><option value='0'>All Applied</option><option value='1'>Some Applied</option><option value='2' select>None Applied</option><option value='Different'>Different Condition Applied</option></select></td>";
        }
    }
}

async function createConditionMultipleBoxes(boxNamePrefix,onChangeFunction){
    let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
    let baseConditions = await request.json();

    let onChangeText = "";
    if(onChangeFunction != ""){
        onChangeText = " onchange='"+onChangeFunction+"'";
    }

    let conditionOptions = "";
    for(let tempCondition of baseConditions){
        conditionOptions = conditionOptions + "<label><input type='checkbox' id='"+boxNamePrefix+tempCondition.Name+"' name='"+boxNamePrefix+tempCondition.Name+"' value=1"+onChangeText+"><span>"+tempCondition.DisplayName+"</span></label>";
    }

    return conditionOptions;
}

async function createSpellConditionRow(whichStartingPosition){
    let table = document.getElementById("SubeffectTable");
    let nextRowIndex = 0;
    let conditionPrefix = "";

    if(whichStartingPosition==1){
        nextRowIndex = document.getElementById("rowConditionsAlwaysSet").rowIndex + 1;
        conditionPrefix = "AlwaysSet";
    }
    else if(whichStartingPosition==2){
        nextRowIndex = document.getElementById("rowConditionOptions").rowIndex + 1;
        conditionPrefix = "ConditionOption";
    }

    if(document.getElementById(conditionPrefix+"SpellSpecific").checked){
        let rowIsSpellSpecificMulti = table.insertRow(nextRowIndex);
        rowIsSpellSpecificMulti.id = "rowIsSpellSpecificMulti"+conditionPrefix;
        rowIsSpellSpecificMulti.innerHTML = "<th><label for='isSpellSpecific"+conditionPrefix+"Multiple'>Multiple Spell Conditions?</label></th><input type='checkbox' id='isSpellSpecific"+conditionPrefix+"Multiple' name='isSpellSpecific"+conditionPrefix+"Multiple' onchange='createMultiSpellConditionRow("+'"'+conditionPrefix+'"'+")'></td>";
    }
    else{
        table.deleteRow(document.getElementById("rowIsSpellSpecificMulti"+conditionPrefix).rowIndex);
        if(document.getElementById("rowSpellSpecificMultiNames"+conditionPrefix) != null){
            table.deleteRow(document.getElementById("rowSpellSpecificMultiNames"+conditionPrefix).rowIndex);
        }
    }
    
    createConditionSaveTable();
}

async function createMultiSpellConditionRow(conditionPrefix){
    let table = document.getElementById("SubeffectTable");
    let nextRowIndex = document.getElementById("rowIsSpellSpecificMulti"+conditionPrefix).rowIndex + 1;

    if(document.getElementById("isSpellSpecific"+conditionPrefix+"Multiple").checked){
        let rowSpellSpecificMultiNames = table.insertRow(nextRowIndex);
        rowSpellSpecificMultiNames.id = "rowSpellSpecificMultiNames"+conditionPrefix;
        rowSpellSpecificMultiNames.innerHTML = "<th><label for='"+conditionPrefix+"SpellSpecificNames'>Enter One Name Per Line:</label></th><textarea id='"+conditionPrefix+"SpellSpecificNames' name='"+conditionPrefix+"SpellSpecificNames' rows='5'></textarea></td>";
    }
    else{
        table.deleteRow(document.getElementById("rowSpellSpecificMultiNames"+conditionPrefix).rowIndex);
    }
}

async function createConditionSaveTable(){
    if(document.getElementById("howMitigate").value != "Save"){
        return;
    }

    let table = document.getElementById("SubeffectTable");
    let nextRowIndex = document.getElementById("rowConditionSave").rowIndex + 1;
    let conditionSaveEffect = document.getElementById("conditionSaveEffect").value;

    if(conditionSaveEffect == 1){
        let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
        let baseConditions = await request.json();
        let conditionOptions = "";
        for(let tempCondition of baseConditions){
            let isSelectedTest = 0;
            if(document.getElementById("rowConditionsAlwaysSet") != null){
                if(document.getElementById("AlwaysSet"+tempCondition.Name).checked){
                    isSelectedTest++;
                }
            }
            if(document.getElementById("rowConditionOptions") != null){
                if(document.getElementById("ConditionOption"+tempCondition.Name).checked){
                    isSelectedTest++;
                }
            }
            if(isSelectedTest>0){
                let alreadyNullifiedText = "";
                if(document.getElementById("SaveNullify"+tempCondition.Name)!=null){
                    if(document.getElementById("SaveNullify"+tempCondition.Name).checked){
                        alreadyNullifiedText = " checked";
                    }
                }
                conditionOptions = conditionOptions + "<label><input type='checkbox' id='SaveNullify"+tempCondition.Name+"' name='SaveNullify"+tempCondition.Name+"' value=1"+alreadyNullifiedText+"><span>"+tempCondition.DisplayName+"</span></label>";
            }
        }

        let spellSpecificSelected = 0;
        if(document.getElementById("rowConditionsAlwaysSet") != null){
            if(document.getElementById("AlwaysSetSpellSpecific").checked){
                spellSpecificSelected++;
            }
        }
        if(document.getElementById("rowConditionOptions") != null){
            if(document.getElementById("ConditionOptionSpellSpecific").checked){
                spellSpecificSelected++;
            }
        }
        if(spellSpecificSelected>0){
            let alreadyNullifiedText = "";
            if(document.getElementById("SaveNullifySpellSpecific")!=null){
                if(document.getElementById("SaveNullifySpellSpecific").checked){
                    alreadyNullifiedText = " checked";
                }
            }
            conditionOptions = conditionOptions + "<label><input type='checkbox' id='SaveNullifySpellSpecific' name='SaveNullifySpellSpecific' value=1"+alreadyNullifiedText+"><span>Spell-Specific Condition</span></label>";
        }

        clearUnusedTable("rowConditionSave","rowSummons");

        let rowConditionsNullified = table.insertRow(nextRowIndex);
        rowConditionsNullified.id = "rowConditionsNullified";
        rowConditionsNullified.innerHTML = "<th>Conditions Nullified:</th><td><div id='SaveConditionNullify' class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
    }
    else if(conditionSaveEffect == "Different"){
        clearUnusedTable("rowConditionSave","rowSummons");

        let rowConditionSave = table.insertRow(nextRowIndex);
        rowConditionSave.id = "rowConditionSave";
        rowConditionSave.innerHTML = "<th><label for='alternateConditions'>Alternate Conditions:</label></th><td>I don't wanna right now thanks. TODO later.</td>";
    }
    else{
        clearUnusedTable("rowConditionSave","rowSummons");
    }
}

async function createSummonTable(){
    let table = document.getElementById("SubeffectTable");
    let nextRowIndex = document.getElementById("rowSummons").rowIndex + 1;
    let summonsSelection = document.getElementById("isSummons").value;
    let hadPriorSummonType = table.rows.namedItem("rowSummonNumber") != null;

    if(summonsSelection == "No"){
        clearUnusedTable("rowSummons","rowIsMoveTarget");
    }
    else{
        if(hadPriorSummonType){
            clearUnusedTable("rowSummons","rowSummonNumber");
        }
        if(summonsSelection == "Single"){
            let rowSingleSummon = table.insertRow(nextRowIndex);
            rowSingleSummon.id = "rowSingleSummon";
            rowSingleSummon.innerHTML = "<th><label for='singleSummon'>Name of Summoned Creature:</th><td><input type='text' id='singleSummon' name='singleSummon'></td>";
            nextRowIndex++;
        }
        else if(summonsSelection == "Options"){
            let rowSummonOptions = table.insertRow(nextRowIndex);
            rowSummonOptions.id = "rowSummonOptions";
            rowSummonOptions.innerHTML = "<th><label for='summonOptions'>Summon Options:<br>(One per Row)</th><td><textarea id='summonOptions' name='summonOptions' rows='5'></textarea></td>";
            nextRowIndex++;
        }
        else if(summonsSelection == "Criteria"){
            let rowSummonCrMax = table.insertRow(nextRowIndex);
            rowSummonCrMax.id = "rowSummonCrMax";
            rowSummonCrMax.innerHTML = "<th><label for='summonCrMax'>Maximum CR of Creature:</th><td><input type='number' id='summonCrMax' name='summonCrMax' min=0 value=2 style='width:25px'></td>";
            nextRowIndex++;

            let summonCrMaxAHLScalingSelect = await createAHLSelect("summonCrMaxAHLScaling");

            let rowSummonCrAHL = table.insertRow(nextRowIndex);
            rowSummonCrAHL.id = "rowSummonCrAHL";
            rowSummonCrAHL.innerHTML = "<th><label for='summonCrMaxAHL'>CR Increase AHL:</th><td><select id='summonCrMaxAHLScaleHow' name='summonCrMaxAHLScaleHow'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='summonCrMaxAHLNum' name='summonCrMaxAHLNum' min=0 value=1 style='width:25px'>"+summonCrMaxAHLScalingSelect+"</td>";
            nextRowIndex++;

            let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
            let allCreatureTypes = await request.json();

            let creatureTypeOptions = "";
            for(let tempType of allCreatureTypes){
                creatureTypeOptions = creatureTypeOptions + "<option value='"+tempType.Name+"'>"+tempType.DisplayName+"</option>";
            }
            
            let rowSummonCreatureType = table.insertRow(nextRowIndex);
            rowSummonCreatureType.id = "rowSummonCreatureType";
            rowSummonCreatureType.innerHTML = "<th><label for='summonCreatureType'>Creature Type Required:</th><td><select id='summonCreatureType' name='summonCreatureType' onchange='createSummonCreatureSubtypeTable()'><option value='None'>None</option>"+creatureTypeOptions+"</select><input type='checkbox' id='isSummonCreatureSubtype' name='isSummonCreatureSubtype' onchange='createSummonCreatureSubtypeTable()'> Use subtype of creature selected?</td>";
            nextRowIndex++;
            //TODO: Add selection of creature subtypes (e.g. devils)
        }

        if(summonsSelection == "SpellEffect"){
            var summonNumberOptions = "<input type='number' id='summonNumber' name='summonNumber' min='1' style='width:25px' value=1>";
        }
        else{
            var summonNumberOptions = "<input type='number' id='summonNumber' name='summonNumber' min='1' style='width:25px' value=1> OR <input type='checkbox' id='summonNumberCRBased' name='summonNumberCRBased' onchange='toggleSummonNumber()'> Based on Summon CR";
        }

        if(!hadPriorSummonType){
            let rowSummonNumber = table.insertRow(nextRowIndex);
            rowSummonNumber.id = "rowSummonNumber";
            rowSummonNumber.innerHTML = "<th><label for='summonNumber'>Number of Summons:</th><td>"+summonNumberOptions+"</td>";
            nextRowIndex++;
            
            let summonNumberAHLScalingSelect = await createAHLSelect("summonNumberAHLScaling");

            let rowSummonNumberAHL = table.insertRow(nextRowIndex);
            rowSummonNumberAHL.id = "rowSummonNumberAHL";
            rowSummonNumberAHL.innerHTML = "<th><label for='summonNumberAHLScaleHow'>Increased Number AHL:</th><td><select id='summonNumberAHLScaleHow' name='summonNumberAHLScaleHow'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='summonNumberAHL' name='summonNumberAHL' min='0' style='width:25px' value=0>"+summonNumberAHLScalingSelect+"</td>";
            nextRowIndex++;            
        }
    }
}

async function toggleSummonNumber(){
    if(document.getElementById("summonNumberCRBased").checked){
        document.getElementById("summonNumber").setAttribute('disabled','');
    }
    else{
        document.getElementById("summonNumber").removeAttribute('disabled','');
    }
}

async function createMoveTargetTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowIsMoveTarget").rowIndex;

    if(document.getElementById("isMoveTarget").checked){
        let rowMoveTargetInfo = table.insertRow(startRowIndex+1);
        rowMoveTargetInfo.id = "rowMoveTargetInfo";
        rowMoveTargetInfo.innerHTML = "<th><label for='moveTargetValue'>Distance Target Moved:</label></th><input type='number' id='moveTargetValue' name='moveTargetValue' min=0 value=10 style='width:25px'><select id='moveTargetUnits' name='moveTargetUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select><select id='moveTargetDirection' name='moveTargetDirection'><option value='Away'>Away From Caster</option><option value='Towards'>Towards Caster</option><option value='Choice'>Caster's Choice</option><option value='Random4'>Random, 4 Directions</option><option value='Random8'>Random, 8 Directions</option></select></td></tr>";

        let moveTargetAHLScalingSelect = await createAHLSelect("moveTargetAHLScaling");

        let rowMoveTargetAHLInfo = table.insertRow(startRowIndex+2);
        rowMoveTargetAHLInfo.id = "rowMoveTargetAHLInfo";
        rowMoveTargetAHLInfo.innerHTML = "<th><label for='moveTargetAHLValue'>Increased Distance AHL:</label></th><input type='number' id='moveTargetAHLValue' name='moveTargetAHLValue' min=0 value=0 style='width:25px'>"+moveTargetAHLScalingSelect+"</td></tr>";

        if(document.getElementById("howMitigate").value == "Save"){
            let rowSavePreventMove = table.insertRow(startRowIndex+3);
            rowSavePreventMove.id = "rowSavePreventMove";
            rowSavePreventMove.innerHTML = "<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td></tr>";
        }
    }
    else{
        clearUnusedTable("rowIsMoveTarget","rowIsCreateObject");
    }
}

async function createCreateObjectTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowIsCreateObject").rowIndex;

    if(document.getElementById("isCreateObject").checked){
        let rowCreateObjectInfo = table.insertRow(startRowIndex+1);
        rowCreateObjectInfo.id = "rowCreateObjectInfo";
        rowCreateObjectInfo.innerHTML = "<th style='colspan:2'>Note: There is currently no data collection for what type of objects are created by spells.</th>";
    }
    else{
        clearUnusedTable("rowIsCreateObject","rowLightType");
    }
}

async function createLightTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowLightType").rowIndex;
    let lightSelection = document.getElementById("lightType").value;

    clearUnusedTable("rowLightType","rowIsWeaponAttack");

    if(lightSelection == "None"){

    }
    else if(lightSelection == "Darkness"){
        let rowLightInfo = table.insertRow(startRowIndex+1);
        rowLightInfo.id = "rowLightInfo";
        rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Darkness:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else if(lightSelection == "BrightDim"){
        let rowLightInfo = table.insertRow(startRowIndex+1);
        rowLightInfo.id = "rowLightInfo";
        rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Light/Dim Light:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> bright <b>/</b> <input type='number' id='secondaryLightDistanceValue' name='secondaryLightDistanceValue' min=0 value=30 style='width:25px'> dim</td>";

        let rowIsSunlight = table.insertRow(startRowIndex+2);
        rowIsSunlight.id = "rowIsSunlight";
        rowIsSunlight.innerHTML = "<th><label for='isSunlight'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight' name='isSunlight' value=1></td>";
    }
    else if(lightSelection == "Obscure"){
        let rowLightInfo = table.insertRow(startRowIndex+1);
        rowLightInfo.id = "rowLightInfo";
        rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Obscured Area:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
    }
    else{
        let rowLightInfo = table.insertRow(startRowIndex+1);
        rowLightInfo.id = "rowLightInfo";
        rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Light:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";

        let rowIsSunlight = table.insertRow(startRowIndex+2);
        rowIsSunlight.id = "rowIsSunlight";
        rowIsSunlight.innerHTML = "<th><label for='isSunlight'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight' name='isSunlight' value=1></td>";
    }
}

async function createRangeTable(){
    let table = document.getElementById("SubeffectTable");
    let RangeRowIndex = document.getElementById("Range").rowIndex;

    if(document.getElementById("RangeType").value == "SelfRanged" || document.getElementById("RangeType").value == "Ranged"){
        if(RangeRowIndex+1 == document.getElementById("AoE").rowIndex){
            let rangeDistanceRow = table.insertRow(RangeRowIndex+1);
            rangeDistanceRow.id = "rowRangeDistance";
            rangeDistanceRow.innerHTML = "<th>Range:</th><td><input type='number' id='RangeValue' name='RangeValue' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            
            let RangeScalingAHLSelect = await createAHLSelect("RangeScalingAHL");

            let rangeDistanceAHLRow = table.insertRow(RangeRowIndex+2);
            rangeDistanceAHLRow.id = "rowRangeDistanceAHL";
            rangeDistanceAHLRow.innerHTML = "<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL' name='RangeValueAHL' min=0 style='width:25px' value=0>"+RangeScalingAHLSelect+"</td>";
        }
    }
    else if(RangeRowIndex+1 != document.getElementById("AoE").rowIndex){
        clearUnusedTable("Range","AoE");
    }
}

async function createAoETable(whichShape){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("AoE").rowIndex + 1;
    let shapesArray = ["Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall"];
    let aoeShapeSelction = document.getElementById("aoeShape").value;
    if(aoeShapeSelction == "None"){
        clearUnusedTable("AoE","rowTargetNumber");
    }
    else{
        if(document.getElementById("rowAoENum") == null){   
            let AoENumAHLScalingSelect = await createAHLSelect("AoENumAHLScaling");

            let rowAoENum = table.insertRow(startRowIndex);
            rowAoENum.id = "rowAoENum";
            rowAoENum.innerHTML = "<th><label for='AoENum'>Number of AoEs:</label></th><td><input type='number' id='AoENum' name='AoENum' min=1 value=1 style='width:25px'> + <input type='number' id='AoENumAHL' name='AoENumAHL' min=0 value=0 style='width:25px'>"+AoENumAHLScalingSelect+"</td>";
        }

        if(aoeShapeSelction == "Choose"){
            if(whichShape==1){
                let rowMultiAOESelection = table.insertRow(startRowIndex);
                rowMultiAOESelection.id = "rowMultiAOESelection";

                let multiAOESelectionText = "";
                for(let tempShape of shapesArray){
                    let tempShapeNoSpace = tempShape.split(" ").join("");
                    multiAOESelectionText = multiAOESelectionText + "<label><input type='checkbox' id='is"+tempShapeNoSpace+"AOEMulti' name='is"+tempShapeNoSpace+"AOEMulti' value=1 onchange='createAoETable("+'"'+tempShape+'"'+")'><span>"+tempShape+"</span></label>";
                }

                rowMultiAOESelection.innerHTML = "<th>AoE Shape Options:</th><td><div class='check-multiple' style='width:100%'>"+multiAOESelectionText+"</div></td>";
                startRowIndex++;

                for(let tempShape of shapesArray){
                    tempShape = tempShape.split(" ").join("");
                    if(document.getElementById("row"+tempShape+"Dimensions") != null){
                        document.getElementById("is"+tempShape+"AOEMulti").setAttribute("checked",'');
                    }
                }
            }
            else{
                if(document.getElementById("is"+whichShape.split(" ").join("")+"AOEMulti").checked){
                    let earlierShapesArray = shapesArray.slice(0,shapesArray.indexOf(whichShape));
                    startRowIndex = document.getElementById("rowMultiAOESelection").rowIndex + 1;
                    for(let tempShape of earlierShapesArray){
                        //Required for Half Sphere or any other shapes with a space
                        tempShape = tempShape.split(" ").join("");
                        if(document.getElementById("row"+tempShape+"Dimensions") != null){
                            startRowIndex = document.getElementById("row"+tempShape+"Dimensions").rowIndex + 2;
                        }
                    }                          
                }
                else{
                    let removalRow = document.getElementById("row"+whichShape.split(" ").join("")+"Dimensions").rowIndex;
                    table.deleteRow(removalRow);
                    table.deleteRow(removalRow);
                    return;
                }
            }
        }
        else{
            whichShape = document.getElementById("aoeShape").value;
            if(document.getElementById("row"+whichShape+"Dimensions") != null){
                clearUnusedTable("AoE","row"+whichShape+"Dimensions");
                clearUnusedTable("row"+whichShape+"DimensionsAHL","rowAoENum");
                return;
            }
            else{
                clearUnusedTable("AoE","rowAoENum");
            }
        }

        if(whichShape == "Cone"){
            let rowConeDimensions = table.insertRow(startRowIndex);
            rowConeDimensions.id = "rowConeDimensions";
            rowConeDimensions.innerHTML = "<th><label for='coneDimensionValue'>Cone Size:</label></th><td><input type='number' id='coneDimensionValue' name='coneDimensionValue' min=0 style='width:25px' value=0><select id='coneDimensionUnits' name='coneDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let coneSizeAHLScalingSelect = await createAHLSelect("coneSizeAHLScaling");

            let rowConeDimensionsAHL = table.insertRow(startRowIndex);
            rowConeDimensionsAHL.id = "rowConeDimensionsAHL";
            rowConeDimensionsAHL.innerHTML = "<th><label for='coneDimensionValueAHL'>Increased Cone Size AHL:</label></th><td><input type='number' id='coneDimensionValueAHL' name='coneDimensionValueAHL' min=0 style='width:25px' value=0>"+coneSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Cube"){
            let rowCubeDimensions = table.insertRow(startRowIndex);
            rowCubeDimensions.id = "rowCubeDimensions";
            rowCubeDimensions.innerHTML = "<th><label for='cubeDimensionValue'>Cube Side Length:</label></th><td><input type='number' id='cubeDimensionValue' name='cubeDimensionValue' min=0 style='width:25px' value=0><select id='cubeDimensionUnits' name='cubeDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let cubeSizeAHLScalingSelect = await createAHLSelect("cubeSizeAHLScaling");

            let rowCubeDimensionsAHL = table.insertRow(startRowIndex);
            rowCubeDimensionsAHL.id = "rowCubeDimensionsAHL";
            rowCubeDimensionsAHL.innerHTML = "<th><label for='cubeDimensionValueAHL'>Increased Side Length AHL:</label></th><td><input type='number' id='cubeDimensionValueAHL' name='cubeDimensionValueAHL' min=0 style='width:25px' value=0>"+cubeSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Cylinder"){
            let rowCylinderDimensions = table.insertRow(startRowIndex);
            rowCylinderDimensions.id = "rowCylinderDimensions";
            rowCylinderDimensions.innerHTML = "<th><label for='cylinderRadiusValue'>Cylinder Radius x Height:</label></th><td><input type='number' id='cylinderRadiusValue' name='cylinderRadiusValue' min=0 style='width:25px' value=0><select id='cylinderRadiusUnits' name='cylinderRadiusUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='cylinderHeightValue' name='cylinderHeightValue' min=0 style='width:25px' value=0><select id='cylinderHeightUnits' name='cylinderHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let cylinderSizeAHLScalingSelect = await createAHLSelect("cylinderSizeAHLScaling");

            let rowCylinderDimensionsAHL = table.insertRow(startRowIndex);
            rowCylinderDimensionsAHL.id = "rowCylinderDimensionsAHL";
            rowCylinderDimensionsAHL.innerHTML = "<th><label for='cylinderRadiusValueAHL'>Cylinder Dimensions AHL:</label></th><td><input type='number' id='cylinderRadiusValueAHL' name='cylinderRadiusValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='cylinderHeightValueAHL' name='cylinderHeightValueAHL' min=0 style='width:25px' value=0>"+cylinderSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Half Sphere"){
            let rowHalfSphereDimensions = table.insertRow(startRowIndex);
            rowHalfSphereDimensions.id = "rowHalfSphereDimensions";
            rowHalfSphereDimensions.innerHTML = "<th><label for='halfSphereDimensionValue'>Half Sphere Radius:</label></th><td><input type='number' id='halfSphereDimensionValue' name='halfSphereDimensionValue' min=0 style='width:25px' value=0><select id='halfSphereDimensionUnits' name='halfSphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let halfSphereSizeAHLScalingSelect = await createAHLSelect("halfSphereSizeAHLScaling");

            let rowHalfSphereDimensionsAHL = table.insertRow(startRowIndex);
            rowHalfSphereDimensionsAHL.id = "rowHalfSphereDimensionsAHL";
            rowHalfSphereDimensionsAHL.innerHTML = "<th><label for='halfSphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='halfSphereDimensionValueAHL' name='halfSphereDimensionValueAHL' min=0 style='width:25px' value=0>"+halfSphereSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Line"){
            let rowLineDimensions = table.insertRow(startRowIndex);
            rowLineDimensions.id = "rowLineDimensions";
            rowLineDimensions.innerHTML = "<th><label for='lineLengthValue'>Line Length x Width:</label></th><td><input type='number' id='lineLengthValue' name='lineLengthValue' min=0 style='width:25px' value=0><select id='lineLengthUnits' name='lineLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='lineWidthValue' name='lineWidthValue' min=0 style='width:25px' value=0><select id='lineWidthUnits' name='lineWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let lineSizeAHLScalingSelect = await createAHLSelect("lineSizeAHLScaling");

            let rowLineDimensionsAHL = table.insertRow(startRowIndex);
            rowLineDimensionsAHL.id = "rowLineDimensionsAHL";
            rowLineDimensionsAHL.innerHTML = "<th><label for='lineLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='lineLengthValueAHL' name='lineLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='lineWidthValueAHL' name='lineWidthValueAHL' min=0 style='width:25px' value=0>"+lineSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Panels"){
            let rowPanelsDimensions = table.insertRow(startRowIndex);
            rowPanelsDimensions.id = "rowPanelsDimensions";
            rowPanelsDimensions.innerHTML = "<th><label for='panelsNumber'>Panel Number and Side Length:</label></th><td><input type='number' id='panelsNumber' name='panelsNumber' min=0 style='width:25px' value=10> panels, <input type='number' id='panelsDimensionValue' name='panelsDimensionValue' min=0 style='width:25px' value=0><select id='panelsDimensionUnits' name='panelsDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let panelsNumberAHLScalingSelect = await createAHLSelect("panelsNumberAHLScaling");

            let rowPanelsDimensionsAHL = table.insertRow(startRowIndex);
            rowPanelsDimensionsAHL.id = "rowPanelsDimensionsAHL";
            rowPanelsDimensionsAHL.innerHTML = "<th><label for='panelsNumberAHL'>Increased Panels AHL:</label></th><td><input type='number' id='panelsNumberAHL' name='panelsNumberAHL' min=0 style='width:25px' value=0>"+panelsNumberAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Sphere"){
            let rowSphereDimensions = table.insertRow(startRowIndex);
            rowSphereDimensions.id = "rowSphereDimensions";
            rowSphereDimensions.innerHTML = "<th><label for='sphereDimensionValue'>Sphere Radius:</label></th><td><input type='number' id='sphereDimensionValue' name='sphereDimensionValue' min=0 style='width:25px' value=0><select id='sphereDimensionUnits' name='sphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let sphereSizeAHLScalingSelect = await createAHLSelect("sphereSizeAHLScaling");

            let rowSphereDimensionsAHL = table.insertRow(startRowIndex);
            rowSphereDimensionsAHL.id = "rowSphereDimensionsAHL";
            rowSphereDimensionsAHL.innerHTML = "<th><label for='sphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='sphereDimensionValueAHL' name='sphereDimensionValueAHL' min=0 style='width:25px' value=0>"+sphereSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
        else if(whichShape == "Wall"){
            let rowWallDimensions = table.insertRow(startRowIndex);
            rowWallDimensions.id = "rowWallDimensions";
            rowWallDimensions.innerHTML = "<th><label for='wallLengthValue'>Wall Length x Width x Height:</label></th><td><input type='number' id='wallLengthValue' name='wallLengthValue' min=0 style='width:25px' value=0><select id='wallLengthUnits' name='wallLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallWidthValue' name='wallWidthValue' min=0 style='width:25px' value=0><select id='wallWidthUnits' name='wallWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallHeightValue' name='wallHeightValue' min=0 style='width:25px' value=0><select id='wallHeightUnits' name='wallHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
            startRowIndex++;

            let wallSizeAHLScalingSelect = await createAHLSelect("wallSizeAHLScaling");

            let rowWallDimensionsAHL = table.insertRow(startRowIndex);
            rowWallDimensionsAHL.id = "rowWallDimensionsAHL";
            rowWallDimensionsAHL.innerHTML = "<th><label for='wallLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='wallLengthValueAHL' name='wallLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallWidthValueAHL' name='wallWidthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallHeightValueAHL' name='wallHeightValueAHL' min=0 style='width:25px' value=0>"+wallSizeAHLScalingSelect+"</td>";
            startRowIndex++;
        }
    }
}

async function createTargetNumberToggle(){
    let table = document.getElementById("SubeffectTable");

    if(document.getElementById("isTargetNumberUnlimited").checked){
        table.deleteRow(document.getElementById("rowTargetNumberAHL").rowIndex);

        document.getElementById("TargetNumber").setAttribute("disabled","");
    }
    else{
        let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling");

        let rowTargetNumberAHL = table.insertRow(document.getElementById("rowTargetNumber").rowIndex + 1);
        rowTargetNumberAHL.id = "rowTargetNumberAHL";
        rowTargetNumberAHL.innerHTML = "<th><label for='TargetNumberAHL'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL' name='TargetNumberAHL' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>";

        document.getElementById("TargetNumber").removeAttribute("disabled","");
    }
}

async function createMultitargetDistanceToggle(){
    let table = document.getElementById("SubeffectTable");
    if(document.getElementById("isMultitargetDistanceUnlimited").checked){
        document.getElementById("MultitargetDistance").setAttribute("disabled","");
    }
    else{
        document.getElementById("MultitargetDistance").removeAttribute("disabled","");
    }
}

async function createTargetTable(primarySecondary){
    let table = document.getElementById("SubeffectTable");
    
    if(primarySecondary == 1){
        var currentTargetTypeSelection = document.getElementById("TargetType").value;
        var startRowIndex = document.getElementById("Target").rowIndex;
    }
    else if(primarySecondary == 2){
        var currentTargetTypeSelection = document.getElementById("secondaryTargetType").value;
        var startRowIndex = document.getElementById("rowSecondaryTarget").rowIndex;
    }    

    if(currentTargetTypeSelection == "Creature"){
        createCreatureTargetTable(primarySecondary);
    }
    else if(currentTargetTypeSelection == "Object"){

    }
    else if(currentTargetTypeSelection == "Effect"){

    }
    else if(currentTargetTypeSelection == "Point"){
        let rowPointOnGround = table.insertRow(startRowIndex+1);
        rowPointOnGround.id = "rowPointOnGround";
        rowPointOnGround.innerHTML = "<th><label for='pointOnGround'>Point Must Be on the Ground:</label></th><td><input type='checkbox' id='pointOnGround' name='pointOnGround'></td>";

        let rowSecondaryTarget = table.insertRow(startRowIndex+2);
        rowSecondaryTarget.id = "rowSecondaryTarget";
        let secondaryTargetOptions = document.getElementById("TargetType").innerHTML;
        secondaryTargetOptions = "<option value='None'>None</option>" + secondaryTargetOptions;
        rowSecondaryTarget.innerHTML = "<th><label for='secondaryTargetType'>Secondary Target Type:</label></th><td><select id='secondaryTargetType' name='secondaryTargetType' onchange='createTargetTable(2)'></select></td>";
        
        document.getElementById("secondaryTargetType").innerHTML = secondaryTargetOptions;
        let secondaryTargetSelection = document.getElementById("secondaryTargetType");
        //removes Point option
        secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(9);
        //removes Free Hand option
        secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(10);
    }
    else{
        clearUnusedTable("Target","submitRow");
    }
}

async function createCreatureTargetTable(primarySecondary){
    let table = document.getElementById("SubeffectTable");
    let currentTargetTypeSelection = document.getElementById("TargetType").value;

    if(primarySecondary==1){
        var startRowID = "Target";
    }
    else if(primarySecondary==2){
        var startRowID = "rowSecondaryTarget";
    }

    let startRowIndex = document.getElementById(startRowID).rowIndex;

    let rowAllegiance = table.insertRow(startRowIndex+1);
    rowAllegiance.id = "rowAllegiance";
    rowAllegiance.innerHTML = "<th><label for='targetAllegiance'>Allegiance of Target:</label></th><td><select id='targetAllegiance' name='targetAllegiance' onchange='disableCreatureFilteringOptions()'><option value='All'>Anyone</option><option value='Self'>Self Only</option><option value='Allies'>Allies</option><option value='AlliesNonself'>Allies Other Than Self</option><option value='NotSelf'>Anyone Other Than Self</option><option value='Enemies'>Enemies</option><option value='Nonhostile'>Nonhostile Creatures</option><option value='NonhostileNotself'>Nonhostile Creatures, Not Self</option></select></td>";

    //Previously considered: function that disables/enables filtering options when 'Self' is the only viable target. Will not do because defaults are not limiting and it would allow for creation of spells only usable by certain creature types maybe? But also because nah.

    let rowCreatureTypes = table.insertRow(startRowIndex+2);
    rowCreatureTypes.id = "rowCreatureTypes";
    rowCreatureTypes.innerHTML = "<th><label for='targetCreatureTypes'>Valid Creature Types:</label></th><td><select id='targetCreatureTypes' name='targetCreatureTypes' onchange='createCreatureTargetTypes()'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>";

    let rowTargetSenses = table.insertRow(startRowIndex+3);
    rowTargetSenses.id = "rowTargetSenses";
    rowTargetSenses.innerHTML = "<th><label for='targetCanSee'>Senses Required by Target:</th><td><input type='checkbox' name='targetCanSee' id='targetCanSee'><label for='targetCanSee'>Target Must See Caster</label><br><input type='checkbox' name='targetCanHear' id='targetCanHear'><label for='targetCanHear'>Target Must Hear Caster</label><br><input type='checkbox' name='targetCanUnderstand' id='targetCanUnderstand'><label for='targetCanUnderstand'>Target Must Understand Caster</label></td>";

    let rowTargetCondition = table.insertRow(startRowIndex+4);
    rowTargetCondition.id = "rowTargetCondition";
    rowTargetCondition.innerHTML = "<th><label for='isTargetCondition'>Condition Requirements on Target:</th><td><select name='isTargetCondition' id='isTargetCondition' onchange='createTargetConditionTable()'><option value='None'>None</option><option value='Inclusive'>Must Have Certain Conditions</option><option value='Exclusive'>Cannot Have Certain Conditions</option><option value='Mixture'>Mixture of Both Above</option></select></td>";
    
    let rowTargetAbilityScore = table.insertRow(startRowIndex+5);
    rowTargetAbilityScore.id = "rowTargetAbilityScore";
    rowTargetAbilityScore.innerHTML = "<th><label for='isAbilityScore'>Limit Targeting By Target Ability Scores:</th><td><input type='checkbox' name='isAbilityScore' id='isAbilityScore' onchange='createTargetAbilityScoreTable()'></td>";
    
    let rowTargetAlignment = table.insertRow(startRowIndex+6);
    rowTargetAlignment.id = "rowTargetAlignment";
    rowTargetAlignment.innerHTML = "<th><label for='isAlignment'>Limit Targeting By Alignment:</th><td><input type='checkbox' name='isAlignment' id='isAlignment' onchange='createTargetAlignmentTable()'></td>";
}

async function createCreatureTargetTypes(){
    let table = document.getElementById("SubeffectTable");
    
    let currentTargetCreatureTypeSelection = document.getElementById("targetCreatureTypes").value;
    let startRowIndex = document.getElementById("rowCreatureTypes").rowIndex;
    let nextRowIndex = startRowIndex+1;

    if(currentTargetCreatureTypeSelection == "All"){
        clearUnusedTable("rowCreatureTypes","rowTargetSenses");
    }
    else{
        let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let allCreatureTypes = await request.json();

        let creatureTypeIncludeOptions = "";
        let creatureTypeExcludeOptions = "";
        for(let tempType of allCreatureTypes){
            creatureTypeIncludeOptions = creatureTypeIncludeOptions + "<label><input type='checkbox' id='CreatureTypeTargetInclusive"+tempType.Name+"' name='CreatureTypeTargetInclusive"+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";

            creatureTypeExcludeOptions = creatureTypeExcludeOptions + "<label><input type='checkbox' id='CreatureTypeTargetExclusive"+tempType.Name+"' name='CreatureTypeTargetExclusive"+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";
        }

        let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveCreatureTypes") != null);
        let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveCreatureTypes") != null);

        if(currentTargetCreatureTypeSelection == "Inclusive" || currentTargetCreatureTypeSelection == "Mixture"){
            if(alreadyInclusiveTest){
                nextRowIndex++;
            }
            else{
                let rowInclusiveCreatureTypes = table.insertRow(nextRowIndex);
                rowInclusiveCreatureTypes.id = "rowInclusiveCreatureTypes";
                rowInclusiveCreatureTypes.innerHTML = "<th>Required Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+creatureTypeIncludeOptions+"</div></td>";
                nextRowIndex++;
            }
            if(alreadyExclusiveTest && currentTargetCreatureTypeSelection == "Inclusive"){
                clearUnusedTable("rowInclusiveCreatureTypes","rowTargetSenses");
            }
        }
        else if(alreadyInclusiveTest){
            nextRowIndex++;
        }
        
        if(currentTargetCreatureTypeSelection == "Exclusive" || currentTargetCreatureTypeSelection == "Mixture"){
            if(!alreadyExclusiveTest){
                let rowExclusiveCreatureTypes = table.insertRow(nextRowIndex);
                rowExclusiveCreatureTypes.id = "rowExclusiveCreatureTypes";
                rowExclusiveCreatureTypes.innerHTML = "<th>Disallowed Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+creatureTypeExcludeOptions+"</div></td>";
                nextRowIndex++;
            }
            else{
                nextRowIndex++;
            }
            if(alreadyInclusiveTest && currentTargetCreatureTypeSelection == "Exclusive"){
                clearUnusedTable("rowCreatureTypes","rowExclusiveCreatureTypes");
            }
        }
    }
}

async function createTargetConditionTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowTargetCondition").rowIndex;
    let conditionChoice = document.getElementById("isTargetCondition").value;
    let nextRowIndex = startRowIndex+1;

    if(conditionChoice == "None"){
        clearUnusedTable("rowTargetCondition","rowTargetAbilityScore");
    }
    else{
        let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveConditions") != null);
        let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveConditions") != null);

        if(conditionChoice == "Inclusive" || conditionChoice == "Mixture"){
            if(alreadyInclusiveTest){
                nextRowIndex++;
                nextRowIndex++;
            }
            else{
                let conditionOptions = await createConditionMultipleBoxes("InclusiveConditions","");
                conditionOptions = conditionOptions + "<label><input type='checkbox' id='INCLUDENONBASECONDITION' name='INCLUDENONBASECONDITION' value=1 onchange='createClassConditionRow(1)'><span>Non-Base Condition</span></label>";

                let rowInclusiveConditions = table.insertRow(nextRowIndex);
                rowInclusiveConditions.id = "rowInclusiveConditions";
                rowInclusiveConditions.innerHTML = "<th>Required Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
                nextRowIndex++;
                
                let rowInclusiveSetByCaster = table.insertRow(nextRowIndex);
                rowInclusiveSetByCaster.id = "rowInclusiveSetByCaster";
                rowInclusiveSetByCaster.innerHTML = "<th><label for='inclusiveSetBy'>Must Be Inflicted by Caster?</label></th><td><input type='checkbox' id='inclusiveSetBy' name='inclusiveSetBy' value=1></td>";
                nextRowIndex++;
            }
            if(alreadyExclusiveTest && conditionChoice == "Inclusive"){
                clearUnusedTable("rowInclusiveSetByCaster","rowTargetAbilityScore");
            }
        }
        else if(alreadyInclusiveTest){
            nextRowIndex++;
            nextRowIndex++;
        }
        
        if(conditionChoice == "Exclusive" || conditionChoice == "Mixture"){
            if(!alreadyExclusiveTest){
                let conditionOptions = await createConditionMultipleBoxes("ExclusiveConditions","");
                conditionOptions = conditionOptions + "<label><input type='checkbox' id='EXCLUDENONBASECONDITION' name='EXCLUDENONBASECONDITION' value=1 onchange='createClassConditionRow(1)'><span>Non-Base Condition</span></label>";

                let rowExclusiveConditions = table.insertRow(nextRowIndex);
                rowExclusiveConditions.id = "rowExclusiveConditions";
                rowExclusiveConditions.innerHTML = "<th>Disallowed Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
                nextRowIndex++;
                
                let rowExclusiveSetByCaster = table.insertRow(nextRowIndex);
                rowExclusiveSetByCaster.id = "rowExclusiveSetByCaster";
                rowExclusiveSetByCaster.innerHTML = "<th><label for='exclusiveSetBy'>Must Be Inflicted by Caster?</label></th><td><input type='checkbox' id='exclusiveSetBy' name='exclusiveSetBy' value=1></td>";
                nextRowIndex++;
            }
            else{
                nextRowIndex++;
                nextRowIndex++;
            }
            if(alreadyInclusiveTest && conditionChoice == "Exclusive"){
                clearUnusedTable("rowTargetCondition","rowExclusiveConditions");
            }
        }
    }
}

async function createClassConditionRow(inclusiveExclusive){
    
}

async function createTargetAbilityScoreTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowTargetAbilityScore").rowIndex;

    if(document.getElementById("isAbilityScore").checked){
        let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let attributeList = await request.json();

        let i = 1;
        for(let tempAttribute of attributeList){
            var abilityScoreName = tempAttribute.Name;
            var abilityScoreDisplayName = tempAttribute.DisplayName;

            var abilityScoreRow = table.insertRow(startRowIndex+i);
            abilityScoreRow.id = "rowAttribute"+abilityScoreName+"Limits";
            abilityScoreRow.innerHTML = "<th><label for='is"+abilityScoreName+"Limit'>"+abilityScoreDisplayName+":</label></th><td><select id='is"+abilityScoreName+"Limit' name='is"+abilityScoreName+"Limit' onchange='enableAbilityScoreLimits("+'"'+abilityScoreName+'"'+")'><option value='No'>No Limits</option><option value='Minimum'>Minimum Score</option><option value='Maximum'>Maximum Score</option><option value='Range'>Min-Max Range</option></select> <input type='number' id='min"+abilityScoreName+"' name='min"+abilityScoreName+"' min=0 value=0 style='width:25px' disabled> - <input type='number' id='max"+abilityScoreName+"' name='max"+abilityScoreName+"' min=0 value=30 style='width:25px' disabled></td>";

            i++;
        }
    }
    else{
        clearUnusedTable("rowTargetAbilityScore","rowTargetAlignment");
    }
    
}

async function enableAbilityScoreLimits(abilityScoreName){
    var currentAbilityScoreSelection = document.getElementById("is"+abilityScoreName+"Limit").value;
    let minScoreID = "min"+abilityScoreName;
    let maxScoreID = "max"+abilityScoreName;

    if(currentAbilityScoreSelection == "No"){
        document.getElementById(minScoreID).setAttribute('disabled','');
        document.getElementById(maxScoreID).setAttribute('disabled','');
    }
    else if(currentAbilityScoreSelection == "Minimum"){
        document.getElementById(minScoreID).removeAttribute('disabled','');
        document.getElementById(maxScoreID).setAttribute('disabled','');
    }
    else if(currentAbilityScoreSelection == "Maximum"){
        document.getElementById(minScoreID).setAttribute('disabled','');
        document.getElementById(maxScoreID).removeAttribute('disabled','');
    }
    else if(currentAbilityScoreSelection == "Range"){
        document.getElementById(minScoreID).removeAttribute('disabled','');
        document.getElementById(maxScoreID).removeAttribute('disabled','');
    }
}

async function createTargetAlignmentTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowTargetAlignment").rowIndex;

    if(document.getElementById("isAlignment").checked){
        let rowAlignmentsGood = table.insertRow(startRowIndex+1);
        rowAlignmentsGood.id = "rowAlignmentsGood";
        rowAlignmentsGood.innerHTML = "<td><input type='checkbox' id='alignmentLawfulGood' name='alignmentLawfulGood'><label for='alignmentLawfulGood'>Lawful Good</label></td><td><input type='checkbox' id='alignmentNeutralGood' name='alignmentNeutralGood'><label for='alignmentNeutralGood'>Neutral Good</label></td><td><input type='checkbox' id='alignmentChaoticGood' name='alignmentChaoticGood'><label for='alignmentChaoticGood'>Chaotic Good</label></td>";

        let rowAlignmentsNeutral = table.insertRow(startRowIndex+2);
        rowAlignmentsNeutral.id = "rowAlignmentsNeutral";
        rowAlignmentsNeutral.innerHTML = "<td><input type='checkbox' id='alignmentLawfulNeutral' name='alignmentLawfulNeutral'><label for='alignmentLawfulNeutral'>Lawful Neutral</label></td><td><input type='checkbox' id='alignmentNeutralNeutral' name='alignmentNeutralNeutral'><label for='alignmentNeutralNeutral'>True Neutral</label></td><td><input type='checkbox' id='alignmentChaoticNeutral' name='alignmentChaoticNeutral'><label for='alignmentChaoticNeutral'>Chaotic Neutral</label></td>";

        let rowAlignmentsEvil = table.insertRow(startRowIndex+3);
        rowAlignmentsEvil.id = "rowAlignmentsEvil";
        rowAlignmentsEvil.innerHTML = "<td><input type='checkbox' id='alignmentLawfulEvil' name='alignmentLawfulEvil'><label for='alignmentLawfulEvil'>Lawful Evil</label></td><td><input type='checkbox' id='alignmentNeutralEvil' name='alignmentNeutralEvil'><label for='alignmentNeutralEvil'>Neutral Evil</label></td><td><input type='checkbox' id='alignmentChaoticEvil' name='alignmentChaoticEvil'><label for='alignmentChaoticEvil'>Chaotic Evil</label></td>";

        let rowAlignmentsOther = table.insertRow(startRowIndex+4);
        rowAlignmentsEvil.id = "rowAlignmentsOther";
        rowAlignmentsOther.innerHTML = "<td text-align='center' colspan='3'><input type='checkbox' id='alignmentUnaligned' name='alignmentUnaligned'><label for='alignmentUnaligned'>Unaligned</label></td>";
    }
    else{
        clearUnusedTable("rowTargetAlignment","submitRow");
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