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

async function clearUnusedTable(startRowID,endRowID){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
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

async function createTargetTable(primarySecondary){
    let table = document.getElementById("SubeffectTable");
    console.log("HI");
    if(primarySecondary == 1){
        console.log("primary");
        var currentTargetTypeSelection = document.getElementById("targetType").value;
        var startRowIndex = document.getElementById("Target").rowIndex;
    }
    else if(primarySecondary == 2){
        console.log("secondary");
        var currentTargetTypeSelection = document.getElementById("secondaryTargetType").value;
        var startRowIndex = document.getElementById("rowSecondaryTarget").rowIndex;
    }    

    if(currentTargetTypeSelection == "Creature"){
        console.log("creature");
        createCreatureTargetTable(primarySecondary);
    }
    else if(currentTargetTypeSelection == "Object"){
        console.log("object");

    }
    else if(currentTargetTypeSelection == "Effect"){
        console.log("effect");

    }
    else if(currentTargetTypeSelection == "Point"){
        console.log("point");
        let rowPointOnGround = table.insertRow(startRowIndex+1);
        rowPointOnGround.id = "rowPointOnGround";
        rowPointOnGround.innerHTML = "<th><label for='pointOnGround'>Point Must Be on the Ground:</label></th><td><input type='checkbox' id='pointOnGround' name='pointOnGround'></td>";
        
        let rowLeavesBehindEffect = table.insertRow(startRowIndex+2);
        rowLeavesBehindEffect.id = "rowLeavesBehindEffect";
        rowLeavesBehindEffect.innerHTML = "<th><label for='leavesBehindEffect'>Leaves Behind Effect in Space:</label></th><td><input type='checkbox' id='leavesBehindEffect' name='leavesBehindEffect'></td>";
        
        let rowSecondaryTarget = table.insertRow(startRowIndex+3);
        rowSecondaryTarget.id = "rowSecondaryTarget";
        let secondaryTargetOptions = document.getElementById("targetType").innerHTML;
        secondaryTargetOptions = "<option value='None'>None</option>" + secondaryTargetOptions;
        rowSecondaryTarget.innerHTML = "<th><label for='secondaryTargetType'>Secondary Target Type:</label></th><td><select id='secondaryTargetType' name='secondaryTargetType' onchange='createTargetTable(2)'></select></td>";
        
        document.getElementById("secondaryTargetType").innerHTML = secondaryTargetOptions;
        let secondaryTargetSelection = document.getElementById("secondaryTargetType");
        //removes Point option
        secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(8);
        //removes Free Hand option
        secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(9);
    }
}

async function createCreatureTargetTable(primarySecondary){
    let table = document.getElementById("SubeffectTable");
    let currentTargetTypeSelection = document.getElementById("targetType").value;

    if(primarySecondary==1){
        var startRowID = "Target";
    }
    else if(primarySecondary==2){
        var startRowID = "rowSecondaryTarget";
    }

    let startRowIndex = document.getElementById(startRowID).rowIndex;
    
    let rowAllegiance = table.insertRow(startRowIndex+1);
    rowAllegiance.id = "rowAllegiance";
    rowAllegiance.innerHTML = "<th><label for='targetAllegiance'>Who Can Be Targeted</label></th><td><select id='targetAllegiance' name='targetAllegiance' onchange='disableCreatureFilteringOptions()'><option value='All'>Anyone</option><option value='Self'>Self Only</option><option value='Allies'>Allies</option><option value='AlliesNonself'>Allies Other Than Self</option><option value='Enemies'>Enemies</option><option value='Nonhostile'>Nonhostile Creatures</option></select></td>";

    //TODO: add function that disables/enables filtering options when 'Self' is the only viable target

    let rowCreatureTypes = table.insertRow(startRowIndex+2);
    rowCreatureTypes.id = "rowCreatureTypes";
    rowCreatureTypes.innerHTML = "<th><label for='targetCreatureTypes'>Valid Creature Types:</label></th><td><select id='targetCreatureTypes' name='targetCreatureTypes' onchange='createCreatureTargetTypes()'><option value='All'>All Types</option><option value='Inclusive'>Include Selected Types</option><option value='Exclusive'>Exclude Selected Types</option></select></td>";
    
    let rowTargetSenses = table.insertRow(startRowIndex+3);
    rowTargetSenses.id = "rowTargetSenses";
    rowTargetSenses.innerHTML = "<th><label for='targetCanSee'>Senses Required by Target:</th><td><input type='checkbox' name='targetCanSee' id='targetCanSee'><label for='targetCanSee'>Target Must See Caster</label><br><input type='checkbox' name='targetCanHear' id='targetCanHear'><label for='targetCanHear'>Target Must Hear Caster</label><br><input type='checkbox' name='targetCanUnderstand' id='targetCanUnderstand'><label for='targetCanUnderstand'>Target Must Understand Caster</label></td>";
    
    let rowTargetCover = table.insertRow(startRowIndex+4);
    rowTargetCover.id = "rowTargetCover";
    rowTargetCover.innerHTML = "<th><label for='maxCover'>Most Cover Target Can Be Behind:</th><td><select name='maxCover' id='maxCover'><option value='None'>None</option><option value='Half'>Half</option><option value='ThreeQuarters' selected>Three-Quarters</option><option value='Full'>Full</option></select></td>";
    
    let rowTargetCondition = table.insertRow(startRowIndex+5);
    rowTargetCondition.id = "rowTargetCondition";
    rowTargetCondition.innerHTML = "<th><label for='isCondition'>Condition Requirements on Target:</th><td><select name='isCondition' id='isCondition' onchange='createTargetConditionTable()'><option value='None'>None</option><option value='Inclusive'>Some Conditions Required</option><option value='Exclusive'>Must Not Have Certain Conditions</option><option value='Mixture'>Mixture of Both</option></select></td>";
    
    let rowTargetAbilityScore = table.insertRow(startRowIndex+6);
    rowTargetAbilityScore.id = "rowTargetAbilityScore";
    rowTargetAbilityScore.innerHTML = "<th><label for='isAbilityScore'>Limit Targeting By Target Ability Scores:</th><td><input type='checkbox' name='isAbilityScore' id='isAbilityScore' onchange='createTargetAbilityScoreTable()'></td>";
    
    let rowTargetAlignment = table.insertRow(startRowIndex+7);
    rowTargetAlignment.id = "rowTargetAlignment";
    rowTargetAlignment.innerHTML = "<th><label for='isAlignment'>Limit Targeting By Alignment:</th><td><input type='checkbox' name='isAlignment' id='isAlignment' onchange='createTargetAlignmentTable()'></td>";
}

async function createCreatureTargetTypes(){
    let table = document.getElementById("SubeffectTable");
    let currentTargetCreatureTypeSelection = document.getElementById("targetCreatureTypes").value;
    let currentTargetTypeSelection = document.getElementById("targetType").value;

    //add check here for going from included -> excluded and vice versa, so that extra selections aren't made (or maybe allow for selections of both like in conditions, would future-proof support for multityped creatures)
    if(currentTargetCreatureTypeSelection == "All"){
        if(currentTargetTypeSelection == "Creature"){
            var endRowID = "submitRow";
            var startRowIndex = document.getElementById("rowCreatureTypes").rowIndex;
        }
        else if(currentTargetTypeSelection == "Creature or Object"){

        }
        else if(currentTargetTypeSelection == "Point"){

        }
        else if(currentTargetTypeSelection == "Effect"){

        }
        else if(currentTargetTypeSelection == "Free Hand"){

        }
        clearUnusedTable("rowCreatureTypes",endRowID);
    }
    else{
        var startRowIndex = document.getElementById("rowCreatureTypes").rowIndex

        let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: "['DisplayName','json']"});
        let creatureTypes = await request.json();

        let creatureTypeOptions = "";
        for(let tempType of creatureTypes){
            creatureTypeOptions = creatureTypeOptions + "<option value='"+tempType+"'>"+tempType+"</option>";
        }

        if(currentTargetCreatureTypeSelection == "Inclusive"){
            var typeHeader = "Included Creature Types:";
        }
        else{
            var typeHeader = "Excluded Creature Types:";
        }

        let rowSpecificTypes = table.insertRow(startRowIndex+1);
        rowSpecificTypes.id = "rowSpecificTypes";
        rowSpecificTypes.innerHTML = "<th><label for='creatureTypeOptions'>"+typeHeader+"</label></th><td><select id='creatureTypeOptions' name='creatureTypeOptions' multiple>"+creatureTypeOptions+"</select></td>";
    }
}

async function createTargetConditionTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowTargetCondition").rowIndex;
    let conditionChoice = document.getElementById("isCondition").value;
    let nextRowIndex = startRowIndex+1;

    if(conditionChoice == "None"){
        clearUnusedTable("rowTargetCondition","rowTargetAbilityScore");
    }
    else{
        let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
        let baseConditions = await request.json();

        let conditionOptions = "";
        for(let tempCondition of baseConditions){
            conditionOptions = conditionOptions + "<option value='"+tempCondition.Name+"'>"+tempCondition.DisplayName+"</option>";
        }
        conditionOptions = conditionOptions + "<option value='NONBASECONDITION'>Non-Base Condition</option>";

        let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveConditions") != null);
        let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveConditions") != null);

        if(conditionChoice == "Inclusive" || conditionChoice == "Mixture"){
            if(alreadyInclusiveTest){
                nextRowIndex++;
                nextRowIndex++;
            }
            else{
                let rowInclusiveConditions = table.insertRow(nextRowIndex);
                rowInclusiveConditions.id = "rowInclusiveConditions";
                rowInclusiveConditions.innerHTML = "<th><label for='inclusiveConditions'>Required Conditions:</label></th><td><select id='inclusiveConditions' name='inclusiveConditions' multiple onchange='createClassConditionRow(1)'>"+conditionOptions+"</select></td>";
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
                let rowExclusiveConditions = table.insertRow(nextRowIndex);
                rowExclusiveConditions.id = "rowExclusiveConditions";
                rowExclusiveConditions.innerHTML = "<th><label for='exclusiveConditions'>Disallowed Conditions:</label></th><td><select id='exclusiveConditions' name='exclusiveConditions' multiple onchange='createClassConditionRow(2)'>"+conditionOptions+"</select></td>";
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
    console.log(document.getElementById("exclusiveConditions").value);
}

async function createTargetAbilityScoreTable(){
    let table = document.getElementById("SubeffectTable");
    let startRowIndex = document.getElementById("rowTargetAbilityScore").rowIndex;

    if(document.getElementById("isAbilityScore").checked){
        let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let attributeList = await request.json();

        let i = 1;
        for(let tempAttribute of attributeList){
            console.log(tempAttribute);
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