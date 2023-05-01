function checkEffectType(){
	return document.getElementById("EffectType").value;
}

async function createMitigationTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let nextMitigationRowIndex = document.getElementById("Mitigation").rowIndex + 1;

	if(document.getElementById("howMitigate").value == "Attack"){
		clearUnusedTable("CreateSubeffectTable","Mitigation","Damage");
		let attackTableRow1 = table.insertRow(nextMitigationRowIndex);nextMitigationRowIndex++;
		attackTableRow1.innerHTML = "<th>Melee or Ranged Attack:</th><select id='MeleeRanged' name='MeleeRanged'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>";

		let attackTableRow2 = table.insertRow(nextMitigationRowIndex);nextMitigationRowIndex++;
		attackTableRow2.innerHTML = "<th>Crit Threshhold:</th><td><input type='number' id='CritThresh' name='CritThresh' max='20' min='1' value='20'></td>";

		addTableRow("CreateSubeffectTable",nextMitigationRowIndex,"rowIsConditionalAdvantage","<th>Conditional (Dis)advantage:</th><input type='checkbox' id='isConditionalAttackAdvantage' name='isConditionalAttackAdvantage' onchange='createConditionalAttackAdvantageRows()'></td>");
		nextMitigationRowIndex++;
	}
	else if(document.getElementById("howMitigate").value == "Save"){
		clearUnusedTable("CreateSubeffectTable","Mitigation","Damage");
		let saveTableRows = table.insertRow(nextMitigationRowIndex);

		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: "['DisplayName','json']"});
		let saveTypes = await request.json();

		let saveOptions = "";
		for(let tempSave of saveTypes){
			saveOptions += "<option value='"+tempSave+"'>"+tempSave+"</option>";
		}
		saveTableRows.innerHTML = "<th>Save Type:</th><select id='SaveType' name='SaveType'>"+saveOptions+"</select></td>";
		nextMitigationRowIndex++;

		addTableRow("CreateSubeffectTable",nextMitigationRowIndex,"rowIsConditionalAdvantage","<th>Conditional (Dis)advantage:</th><input type='checkbox' id='isConditionalSaveAdvantage' name='isConditionalSaveAdvantage' onchange='createConditionalSaveAdvantageRows()'></td>");
		nextMitigationRowIndex++;

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
		
		if(document.getElementById("isCondition").value != "None"){
			let nextRowIndex = document.getElementById("rowSummons").rowIndex;
			let rowConditionSave = table.insertRow(nextRowIndex);
			rowConditionSave.id = "rowConditionSave";
			rowConditionSave.innerHTML = "<th><label for='conditionSaveEffect'>Conditions Applied on Save:</label></th><select id='conditionSaveEffect' name='conditionSaveEffect' onchange='createConditionSaveTable()'><option value='0'>All Applied</option><option value='1'>Some Applied</option><option value='2' select>None Applied</option><option value='Different'>Different Condition Applied</option></select></td>";
		}
		
		if(document.getElementById("isMoveTarget").checked){
			let moveStartRow = document.getElementById("rowMoveTargetAHLInfo").rowIndex;
			let rowSavePreventMove = table.insertRow(moveStartRow+1);
			rowSavePreventMove.id = "rowSavePreventMove";
			rowSavePreventMove.innerHTML = "<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td></tr>";
		}
		
		if(document.getElementById("isSetHP").checked){
			let savePreventSetHPIndex = document.getElementById("rowSetHPAmount").rowIndex + 1;
		
			addTableRow("CreateSubeffectTable",savePreventSetHPIndex,"rowSavePreventSetHP","<th><label for='savePreventSetHP'>Save Prevents HP Change:</label></th><td><input type='checkbox' id='savePreventSetHP' name='savePreventSetHP'></td>");
		}
		
		if(document.getElementById("InstantKill").checked){
			let savePreventInstantKillIndex = document.getElementById("rowInstantKill").rowIndex + 1;

			addTableRow("CreateSubeffectTable",savePreventInstantKillIndex,"rowSavePreventInstantKill","<th><label for='savePreventInstantKill'>Save Prevents Instant Kill:</label></th><td><input type='checkbox' id='savePreventInstantKill' name='savePreventInstantKill'></td>");
		}
	}
	else{
		clearUnusedTable("CreateSubeffectTable","Mitigation","Damage");
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
		
		if(document.getElementById("isSetHP").checked){
			table.deleteRow(document.getElementById("rowSavePreventSetHP").rowIndex);
		}
		
		if(document.getElementById("InstantKill").checked){
			table.deleteRow(document.getElementById("rowSavePreventInstantKill").rowIndex);
		}
	}
}

async function createAHLSelect(ahlSelectID){
	let ahlSelectHTML = "";
	if(document.getElementById("SpellLevel")!=null){
		if(document.getElementById("SpellLevel").value == "0"){
			ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Interval</option><option value='2'>Every Other Interval</option><option value='3'>Every Three Intervals</option></select>";
		}
		else{
			ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select>";
		}
	}
	return ahlSelectHTML;
}

async function createDamageTable(){
	if(document.getElementById("isDamage").checked){
		let table = document.getElementById("CreateSubeffectTable");
		let damageRowIndex = document.getElementById("Damage").rowIndex;
		let addRemoveButtonsRow = table.insertRow(damageRowIndex+1);
		addRemoveButtonsRow.id = "AdditionButtons";
		addRemoveButtonsRow.innerHTML = "<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows()'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows()'></th>";

		addDamageTypeRows();
	}
	else{
		clearUnusedTable("CreateSubeffectTable","Damage","rowCondition");
		document.getElementById("differentTypes").value = 0;
	}
}

async function addDamageTypeRows(){
	let table = document.getElementById("CreateSubeffectTable");
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
	modBonusRow.innerHTML = "<th>Add Ability Score Modifier:</th><td><input type='checkbox' id='ModBonus"+damageTypeNumber+"' name='ModBonus"+damageTypeNumber+"' value=1></td>";
	
	let isAHLRow = table.insertRow(buttonRowIndex+2);
	isAHLRow.id = "rowIsAHL"+damageTypeNumber;
   
	if(checkEffectType()=="Spell"){
		if(document.getElementById("SpellLevel").value == "0"){
			isAHLRow.innerHTML = "<th>Damage Increases AHL:</th><td><select id='isAHL"+damageTypeNumber+"' name='isAHL"+damageTypeNumber+"' onchange='createAHLDamage("+damageTypeNumber+")'><option value='0'>No Increase</option><option value='1'>Every Interval</option><option value='2'>Every Other Interval</option><option value='3'>Every Three Intervals</option></select></td>";
		}
		else{
			isAHLRow.innerHTML = "<th>Damage Increases AHL:</th><td><select id='isAHL"+damageTypeNumber+"' name='isAHL"+damageTypeNumber+"' onchange='createAHLDamage("+damageTypeNumber+")'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select></td>";
		}
	}

	if(document.getElementById("howMitigate").value == "Save"){
		let saveMitigationRow = table.insertRow(buttonRowIndex+3);
		saveMitigationRow.id = "rowSaveMitigation"+damageTypeNumber;
		saveMitigationRow.innerHTML = "<th>Damage on Successful Save:</th><td><select id='saveMitigation"+damageTypeNumber+"' name='saveMitigation"+damageTypeNumber+"'><option value=2>None</option><option value=1>Half</option><option value=0>Full</option></select></td>";
	}
}

async function removeDamageTypeRows(){
	let table = document.getElementById("CreateSubeffectTable");
	let damageTypeNumber = document.getElementById("differentTypes").value;
	clearUnusedTable("CreateSubeffectTable","DamageSet"+damageTypeNumber,"AdditionButtons");
	document.getElementById("differentTypes").value = damageTypeNumber-1;
	table.deleteRow(document.getElementById("AdditionButtons").rowIndex - 1);
}

async function createTypeOptions(damageTypeNumber){
	let table = document.getElementById("CreateSubeffectTable");
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
			clearUnusedTable("CreateSubeffectTable","DamageSet"+damageTypeNumber,"rowModBonus"+damageTypeNumber);
		}
	}
}

async function createAHLDamage(damageTypeNumber){
	//This function is not currently using any checkEffectType functions since it should only be run if the EffectType is Spell in the first place. If something is going wrong, check here.

	let table = document.getElementById("CreateSubeffectTable");
	let AHLRowIndex = document.getElementById("rowIsAHL"+damageTypeNumber).rowIndex;
	
	if(document.getElementById("isAHL"+damageTypeNumber).value == "0"){
		if(document.getElementById("howMitigate").value == "Save"){
			clearUnusedTable("CreateSubeffectTable","rowIsAHL"+damageTypeNumber,"rowSaveMitigation"+damageTypeNumber)
		}
		else{
			if(damageTypeNumber == document.getElementById("differentTypes").value){
				clearUnusedTable("CreateSubeffectTable","rowIsAHL"+damageTypeNumber,"AdditionButtons");
			}
			else{
				clearUnusedTable("CreateSubeffectTable","rowIsAHL"+damageTypeNumber,"DamageSet"+(damageTypeNumber+1));
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
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowCondition").rowIndex + 1;
	let conditionChoice = document.getElementById("isCondition").value;

	if(conditionChoice == "None"){
		clearUnusedTable("CreateSubeffectTable","rowCondition","rowSummons");
	}
	else{
		let alreadyAlwaysAddedTest = (table.rows.namedItem("rowConditionsAlwaysAdded") != null);
		let alreadyOptionsTest = (table.rows.namedItem("rowConditionOptions") != null);
		let alreadyEndInfoTest = (table.rows.namedItem("rowSameDuration") != null || table.rows.namedItem("rowAlternateConditionDuration") != null);
		let alreadySaveTest = (table.rows.namedItem("rowConditionSave") != null);

		let endRowId = "";

		if(alreadySaveTest){
			endRowId = "rowConditionSave";
		}
		else{
			endRowId = "rowSummons";
		}

		if(conditionChoice == "All" || conditionChoice == "Mixture"){
			if(alreadyAlwaysAddedTest){
				nextRowIndex = (document.getElementById("rowConditionsAlwaysAdded").rowIndex + 1);
			}
			else{
				let conditionOptions = await createConditionMultipleBoxes("AlwaysAdded","createConditionSaveTable()");
				conditionOptions = conditionOptions + "<label><input type='checkbox' id='AlwaysAddedEffectSpecific' name='AlwaysAddedEffectSpecific' value=1 onchange='createUniqueConditionRow(1)'><span>Unique Condition</span></label>";

				let rowConditionsAlwaysAdded = table.insertRow(nextRowIndex);
				rowConditionsAlwaysAdded.id = "rowConditionsAlwaysAdded";
				rowConditionsAlwaysAdded.innerHTML = "<th><label for='conditionsAlwaysAdded'>Set Conditions:</label></th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
				nextRowIndex++;
			}

			if(alreadyOptionsTest && conditionChoice == "All"){
				let tempRemovalId = 0;

				if(checkEffectType()=="Spell"){
					tempRemovalId = "rowUseSameDuration";
				}
				else{
					tempRemovalId = "rowAlternateConditionDuration";
				}

				clearUnusedTable("CreateSubeffectTable","rowConditionOptions",tempRemovalId);
				table.deleteRow(document.getElementById("rowConditionOptions").rowIndex);
			}
		}
		else{
			if(alreadyAlwaysAddedTest){
				nextRowIndex = (document.getElementById("rowConditionsAlwaysAdded").rowIndex + 1);
			}
		}

		if(conditionChoice == "Choose" || conditionChoice == "Mixture"){
			if(!alreadyOptionsTest){
				let conditionOptions = await createConditionMultipleBoxes("ConditionOption","createConditionSaveTable()");
				conditionOptions = conditionOptions + "<label><input type='checkbox' id='ConditionOptionEffectSpecific' name='ConditionOptionEffectSpecific' value=1 onchange='createUniqueConditionRow(2)'><span>Unique Condition</span></label>";

				let rowConditionOptions = table.insertRow(nextRowIndex);
				rowConditionOptions.id = "rowConditionOptions";
				rowConditionOptions.innerHTML = "<th>Condition Options:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
				nextRowIndex++;

				let rowConditionOptionsNumber = table.insertRow(nextRowIndex);
				rowConditionOptionsNumber.id = "rowConditionOptionsNumber";
				let ConditionOptionsHTML = "<th><label  for='ConditionOptionsNumber'>Number of Options to Choose:</label></th><td><input type='number' id='ConditionOptionsNumber' name='ConditionOptionsNumber' min=1 value=1 style='width:25px'>";

				if(checkEffectType()=="Spell"){
					let conditionAHLScalingSelect = await createAHLSelect("ConditionOptionsNumberAHLScaling");                   
					ConditionOptionsHTML = ConditionOptionsHTML + " + <input type='number' id='ConditionOptionsNumberAHL' name='ConditionOptionsNumberAHL' min=0 value=0 style='width:25px'>"+conditionAHLScalingSelect;
				}

				rowConditionOptionsNumber.innerHTML = ConditionOptionsHTML+"</td>";
				nextRowIndex++;
			}
			else{
				nextRowIndex = nextRowIndex + (document.getElementById(endRowId).rowIndex - document.getElementById("rowConditionOptions").rowIndex);
			}
			if(alreadyAlwaysAddedTest && conditionChoice == "Choose"){
				//ConditionOptions is likely being inserted one row too much when going from all --> choose, so endinfo stuff gets removed here
				clearUnusedTable("CreateSubeffectTable","rowCondition","rowConditionOptions");
			}
		}

		if(!alreadyEndInfoTest){
			if(checkEffectType()=="Spell"){
				let rowSameDuration = table.insertRow(nextRowIndex);
				rowSameDuration.id = "rowSameDuration";
				rowSameDuration.innerHTML = "<th><label for='isConditionSameDuration'>Duration is Same as Spell's?</label></th><input type='checkbox' id='isConditionSameDuration' name='isConditionSameDuration' onchange='conditionAlternateDuration()' checked></td>";
				nextRowIndex++;                
			}
			else{
				conditionAlternateDuration();
				nextRowIndex++;
			}

			let rowIsConditionNonDurationEnd = table.insertRow(nextRowIndex);
			rowIsConditionNonDurationEnd.id = "rowIsConditionNonDurationEnd";
			rowIsConditionNonDurationEnd.innerHTML = "<th><label for='isConditionNonDurationEnd'>May End Separate from Duration?</label></th><input type='checkbox' id='isConditionNonDurationEnd' name='isConditionNonDurationEnd' onchange='createConditionNonDurationEnd()'></td>";
			nextRowIndex++;
		}

		if(document.getElementById("howMitigate").value == "Save" && !alreadySaveTest){
			let saveRowIndex = document.getElementById("rowSummons").rowIndex;
			let rowConditionSave = table.insertRow(saveRowIndex);
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

async function createUniqueConditionRow(whichStartingPosition){
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = 0;
	let conditionPrefix = "";

	if(whichStartingPosition==1){
		nextRowIndex = document.getElementById("rowConditionsAlwaysAdded").rowIndex + 1;
		conditionPrefix = "AlwaysAdded";
	}
	else if(whichStartingPosition==2){
		nextRowIndex = document.getElementById("rowConditionOptions").rowIndex + 1;
		conditionPrefix = "ConditionOption";
	}

	if(document.getElementById(conditionPrefix+"EffectSpecific").checked){
		let rowIsEffectSpecificMulti = table.insertRow(nextRowIndex);
		rowIsEffectSpecificMulti.id = "rowIsEffectSpecificMulti"+conditionPrefix;
		rowIsEffectSpecificMulti.innerHTML = "<th><label for='isEffectSpecific"+conditionPrefix+"Multiple'>Multiple Unique Conditions?</label></th><input type='checkbox' id='isEffectSpecific"+conditionPrefix+"Multiple' name='isEffectSpecific"+conditionPrefix+"Multiple' onchange='createMultiUniqueConditionRow("+'"'+conditionPrefix+'"'+")'></td>";
	}
	else{
		table.deleteRow(document.getElementById("rowIsEffectSpecificMulti"+conditionPrefix).rowIndex);
		if(document.getElementById("rowEffectSpecificMultiNames"+conditionPrefix) != null){
			table.deleteRow(document.getElementById("rowEffectSpecificMultiNames"+conditionPrefix).rowIndex);
		}
	}
	
	createConditionSaveTable();
}

async function createMultiUniqueConditionRow(conditionPrefix){
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowIsEffectSpecificMulti"+conditionPrefix).rowIndex + 1;

	if(document.getElementById("isEffectSpecific"+conditionPrefix+"Multiple").checked){
		let rowEffectSpecificMultiNames = table.insertRow(nextRowIndex);
		rowEffectSpecificMultiNames.id = "rowEffectSpecificMultiNames"+conditionPrefix;
		rowEffectSpecificMultiNames.innerHTML = "<th><label for='"+conditionPrefix+"EffectSpecificNames'>Enter One Name Per Line:</label></th><textarea id='"+conditionPrefix+"EffectSpecificNames' name='"+conditionPrefix+"EffectSpecificNames' rows='5'></textarea></td>";
	}
	else{
		table.deleteRow(document.getElementById("rowEffectSpecificMultiNames"+conditionPrefix).rowIndex);
	}
}

async function conditionAlternateDuration(){
	let table = document.getElementById("CreateSubeffectTable");
	let isSameDuration = 0;
	let nextRowIndex = 0;

	if(checkEffectType()=="Spell"){
		isSameDuration = document.getElementById("isConditionSameDuration").checked;
		nextRowIndex = document.getElementById("rowSameDuration").rowIndex + 1;
	}
	else{
		if(document.getElementById("rowConditionOptions")==null){
			nextRowIndex = document.getElementById("rowConditionsAlwaysAdded").rowIndex+1;
		}
		else{
			nextRowIndex = document.getElementById("rowConditionOptionsNumber").rowIndex+1;
		}
	}

	if(isSameDuration){
		//This doesn't work because this function just completely doesn't get called and I don't know why.
		table.deleteRow(document.getElementById("rowAlternateConditionDuration").rowIndex);
	}
	else{
		let rowAlternateConditionDuration = table.insertRow(nextRowIndex);
		rowAlternateConditionDuration.id = "rowAlternateConditionDuration";
		rowAlternateConditionDuration.innerHTML = "<th><label for='conditionAlternateDuration'>Condition Duration:</label></th><input type='number' id='conditionAlternateDuration' name='conditionAlternateDuration' min='1' value='1' style='width:25px'><select id='conditionAlternateDurationUnits' name='conditionAlternateDurationUnits'><option value=''>No Duration</option><option value='Round'>Rounds</option><option value='Minute'>Minutes</option><option value='Hour' select>Hours</option><option value='Day'>Days</option><option value='Year'>Years</option></select></td>";
	}
}

async function createConditionNonDurationEnd(){
	let table = document.getElementById("CreateSubeffectTable");
	let hasOtherEndOptions = document.getElementById("isConditionNonDurationEnd").checked;
	let nextRowIndex = document.getElementById("rowIsConditionNonDurationEnd").rowIndex + 1;

	if(hasOtherEndOptions){
		let endConditionOptions = "<option value='No'>No</option><option value='Conditional'>Conditional</option><option value='Always'>Always</option>";

		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();

		let i = 1;
		let saveOptions = "<option value='None'>Without Save</option>";
		for(let tempAttribute of attributeList){
			let abilityScoreName = tempAttribute.Name;
			let abilityScoreDisplayName = tempAttribute.DisplayName;
			saveOptions = saveOptions + "<option value='"+abilityScoreName+"'>"+abilityScoreDisplayName+" Save</option>";
		}

		let rowEndConditionInstancesLabel = table.insertRow(nextRowIndex);
		rowEndConditionInstancesLabel.id = "rowEndConditionInstancesLabel";
		rowEndConditionInstancesLabel.innerHTML = "<th colspan=2 text-align='center'>Instances When Condition Can End</th>";
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowEndConditionAsAction","<th><label for='isEndConditionAction'>With Use of an Action:</label></th><select id='isEndConditionAction' name='isEndConditionAction' onchange='endConditionConditions("+'"'+"Action"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionActionSave' name='isEndConditionActionSave'>"+saveOptions+"</select></td>");
		nextRowIndex++;

		let rowEndConditionStartTurn = table.insertRow(nextRowIndex);
		rowEndConditionStartTurn.id = "rowEndConditionStartTurn";
		rowEndConditionStartTurn.innerHTML = "<th><label for='isEndConditionStartTurn'>Start of Turn:</label></th><select id='isEndConditionStartTurn' name='isEndConditionStartTurn' onchange='endConditionConditions("+'"'+"StartTurn"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionStartTurnSave' name='isEndConditionStartTurnSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionEndTurn = table.insertRow(nextRowIndex);
		rowEndConditionEndTurn.id = "rowEndConditionEndTurn";
		rowEndConditionEndTurn.innerHTML = "<th><label for='isEndConditionEndTurn'>End of Turn:</label></th><select id='isEndConditionEndTurn' name='isEndConditionEndTurn' onchange='endConditionConditions("+'"'+"EndTurn"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionEndTurnSave' name='isEndConditionEndTurnSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionTempHPLost = table.insertRow(nextRowIndex);
		rowEndConditionTempHPLost.id = "rowEndConditionTempHPLost";
		rowEndConditionTempHPLost.innerHTML = "<th><label for='isEndConditionTempHPLost'>When Temp HP is Lost:</label></th><input type='checkbox' id='isEndConditionTempHPLost' name='isEndConditionTempHPLost'></td>";
		nextRowIndex++;

		let rowEndConditionAfterAttack = table.insertRow(nextRowIndex);
		rowEndConditionAfterAttack.id = "rowEndConditionAfterAttack";
		rowEndConditionAfterAttack.innerHTML = "<th><label for='isEndConditionAfterAttack'>After Attacking:</label></th><select id='isEndConditionAfterAttack' name='isEndConditionAfterAttack' onchange='endConditionConditions("+'"'+"AfterAttack"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterAttackSave' name='isEndConditionAfterAttackSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterSpell = table.insertRow(nextRowIndex);
		rowEndConditionAfterSpell.id = "rowEndConditionAfterSpell";
		rowEndConditionAfterSpell.innerHTML = "<th><label for='isEndConditionAfterSpell'>Casting a Spell:</label></th><select id='isEndConditionAfterSpell' name='isEndConditionAfterSpell' onchange='endConditionConditions("+'"'+"AfterSpell"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterSpellSave' name='isEndConditionAfterSpellSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterForceSave = table.insertRow(nextRowIndex);
		rowEndConditionAfterForceSave.id = "rowEndConditionAfterForceSave";
		rowEndConditionAfterForceSave.innerHTML = "<th><label for='isEndConditionAfterForceSave'>After Forcing a Save:</label></th><select id='isEndConditionAfterForceSave' name='isEndConditionAfterForceSave' onchange='endConditionConditions("+'"'+"AfterForceSave"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterForceSaveSave' name='isEndConditionAfterForceSaveSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterDamage = table.insertRow(nextRowIndex);
		rowEndConditionAfterDamage.id = "rowEndConditionAfterDamage";
		rowEndConditionAfterDamage.innerHTML = "<th><label for='isEndConditionAfterDamage'>After Dealing Damage:</label></th><select id='isEndConditionAfterDamage' name='isEndConditionAfterDamage' onchange='endConditionConditions("+'"'+"AfterDamage"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterDamageSave' name='isEndConditionAfterDamageSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterMoving = table.insertRow(nextRowIndex);
		rowEndConditionAfterMoving.id = "rowEndConditionAfterMoving";
		rowEndConditionAfterMoving.innerHTML = "<th><label for='isEndConditionAfterMoving'>After Moving:</label></th><select id='isEndConditionAfterMoving' name='isEndConditionAfterMoving' onchange='endConditionConditions("+'"'+"AfterMoving"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterMovingSave' name='isEndConditionAfterMovingSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterAttacked = table.insertRow(nextRowIndex);
		rowEndConditionAfterAttacked.id = "rowEndConditionAfterAttacked";
		rowEndConditionAfterAttacked.innerHTML = "<th><label for='isEndConditionAfterAttacked'>After Being Attacked:</label></th><select id='isEndConditionAfterAttacked' name='isEndConditionAfterAttacked' onchange='endConditionConditions("+'"'+"AfterAttacked"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterAttackedSave' name='isEndConditionAfterAttackedSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterDamaged = table.insertRow(nextRowIndex);
		rowEndConditionAfterDamaged.id = "rowEndConditionAfterDamaged";
		rowEndConditionAfterDamaged.innerHTML = "<th><label for='isEndConditionAfterDamaged'>After Being Damaged:</label></th><select id='isEndConditionAfterDamaged' name='isEndConditionAfterDamaged' onchange='endConditionConditions("+'"'+"AfterDamaged"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterDamagedSave' name='isEndConditionAfterDamagedSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterShortRest = table.insertRow(nextRowIndex);
		rowEndConditionAfterShortRest.id = "rowEndConditionAfterShortRest";
		rowEndConditionAfterShortRest.innerHTML = "<th><label for='isEndConditionAfterShortRest'>After Short Resting:</label></th><select id='isEndConditionAfterShortRest' name='isEndConditionAfterShortRest' onchange='endConditionConditions("+'"'+"AfterShortRest"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterShortRestSave' name='isEndConditionAfterShortRestSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterLongRest = table.insertRow(nextRowIndex);
		rowEndConditionAfterLongRest.id = "rowEndConditionAfterLongRest";
		rowEndConditionAfterLongRest.innerHTML = "<th><label for='isEndConditionAfterLongRest'>After Long Resting:</label></th><select id='isEndConditionAfterLongRest' name='isEndConditionAfterLongRest' onchange='endConditionConditions("+'"'+"AfterLongRest"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterLongRestSave' name='isEndConditionAfterLongRestSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterGainCondition = table.insertRow(nextRowIndex);
		rowEndConditionAfterGainCondition.id = "rowEndConditionAfterGainCondition";
		rowEndConditionAfterGainCondition.innerHTML = "<th><label for='isEndConditionAfterGainCondition'>After Gaining Another Condition:</label></th><select id='isEndConditionAfterGainCondition' name='isEndConditionAfterGainCondition' onchange='endConditionConditions("+'"'+"AfterGainCondition"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterGainConditionSave' name='isEndConditionAfterGainConditionSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterEndCondition = table.insertRow(nextRowIndex);
		rowEndConditionAfterEndCondition.id = "rowEndConditionAfterEndCondition";
		rowEndConditionAfterEndCondition.innerHTML = "<th><label for='isEndConditionAfterEndCondition'>After Ending Another Condition:</label></th><select id='isEndConditionAfterEndCondition' name='isEndConditionAfterEndCondition' onchange='endConditionConditions("+'"'+"AfterEndCondition"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterEndConditionSave' name='isEndConditionAfterEndConditionSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;

		let rowEndConditionAfterChangeEquipment = table.insertRow(nextRowIndex);
		rowEndConditionAfterChangeEquipment.id = "rowEndConditionAfterChangeEquipment";
		rowEndConditionAfterChangeEquipment.innerHTML = "<th><label for='isEndConditionAfterChangeEquipment'>After Changing Equipment:</label></th><select id='isEndConditionAfterChangeEquipment' name='isEndConditionAfterChangeEquipment' onchange='endConditionConditions("+'"'+"AfterChangeEquipment"+'"'+")'>"+endConditionOptions+"</select><select id='isEndConditionAfterChangeEquipmentSave' name='isEndConditionAfterChangeEquipmentSave'>"+saveOptions+"</select></td>";
		nextRowIndex++;
	}
	else{
		let endRowID = "";

		if(document.getElementById("howMitigate").value == "Save"){
			endRowID = "rowConditionSave";
		}
		else{
			endRowID = "rowSummons";
		}

		clearUnusedTable("CreateSubeffectTable","rowIsConditionNonDurationEnd",endRowID)
	}
}

async function createConditionSaveTable(){
	if(document.getElementById("howMitigate").value != "Save"){
		return;
	}

	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowConditionSave").rowIndex + 1;
	let conditionSaveEffect = document.getElementById("conditionSaveEffect").value;

	if(conditionSaveEffect == 1){
		let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let baseConditions = await request.json();
		let conditionOptions = "";
		for(let tempCondition of baseConditions){
			let isSelectedTest = 0;
			if(document.getElementById("rowConditionsAlwaysAdded") != null){
				if(document.getElementById("AlwaysAdded"+tempCondition.Name).checked){
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

		let EffectSpecificSelected = 0;
		if(document.getElementById("rowConditionsAlwaysAdded") != null){
			if(document.getElementById("AlwaysAddedEffectSpecific").checked){
				EffectSpecificSelected++;
			}
		}
		if(document.getElementById("rowConditionOptions") != null){
			if(document.getElementById("ConditionOptionEffectSpecific").checked){
				EffectSpecificSelected++;
			}
		}
		if(EffectSpecificSelected>0){
			let alreadyNullifiedText = "";
			if(document.getElementById("SaveNullifyEffectSpecific")!=null){
				if(document.getElementById("SaveNullifyEffectSpecific").checked){
					alreadyNullifiedText = " checked";
				}
			}
			conditionOptions = conditionOptions + "<label><input type='checkbox' id='SaveNullifyEffectSpecific' name='SaveNullifyEffectSpecific' value=1"+alreadyNullifiedText+"><span>Unique Condition</span></label>";
		}

		clearUnusedTable("CreateSubeffectTable","rowConditionSave","rowSummons");

		let rowConditionsNullified = table.insertRow(nextRowIndex);
		rowConditionsNullified.id = "rowConditionsNullified";
		rowConditionsNullified.innerHTML = "<th>Conditions Nullified:</th><td><div id='SaveConditionNullify' class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
	}
	else if(conditionSaveEffect == "Different"){
		clearUnusedTable("CreateSubeffectTable","rowConditionSave","rowSummons");

		let rowConditionSave = table.insertRow(nextRowIndex);
		rowConditionSave.id = "rowConditionSave";
		rowConditionSave.innerHTML = "<th><label for='alternateConditions'>Alternate Conditions:</label></th><td>I don't wanna right now thanks. TODO later.</td>";
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowConditionSave","rowSummons");
	}
}

async function createSummonTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowSummons").rowIndex + 1;
	let summonsSelection = document.getElementById("isSummons").value;
	let hadPriorSummonType = table.rows.namedItem("rowSummonNumber") != null;

	if(summonsSelection == "No"){
		clearUnusedTable("CreateSubeffectTable","rowSummons","rowUncommonEffects");
	}
	else{
		if(hadPriorSummonType){
			clearUnusedTable("CreateSubeffectTable","rowSummons","rowSummonNumber");
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

			if(checkEffectType()=="Spell"){
				let summonCrMaxAHLScalingSelect = await createAHLSelect("summonCrMaxAHLScaling");

				let rowSummonCrAHL = table.insertRow(nextRowIndex);
				rowSummonCrAHL.id = "rowSummonCrAHL";
				rowSummonCrAHL.innerHTML = "<th><label for='summonCrMaxAHLNum'>CR Increase AHL:</th><td><select id='summonCrMaxAHLScaleHow' name='summonCrMaxAHLScaleHow'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='summonCrMaxAHLNum' name='summonCrMaxAHLNum' min=0 value=0 style='width:25px'>"+summonCrMaxAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}

			let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
			let allCreatureTypes = await request.json();

			let creatureTypeOptions = "";
			for(let tempType of allCreatureTypes){
				creatureTypeOptions = creatureTypeOptions + "<label><input type='checkbox' id='summonCreatureType"+tempType.Name+"' name='summonCreatureType"+tempType.Name+"' value=1 onchange='createSummonCreatureSubtypeTable("+'"'+tempType.Name+'"'+")'><span>"+tempType.DisplayName+"</span></label>";
			}
			
			let rowSummonCreatureType = table.insertRow(nextRowIndex);
			rowSummonCreatureType.id = "rowSummonCreatureType";
			rowSummonCreatureType.innerHTML = "<th><label for='summonCreatureType'>Creature Type Required:</th><td><div class='check-multiple' style='width:100%'>"+creatureTypeOptions+"</div></td>";
			nextRowIndex++;
			
			let rowIsSummonCreatureSubtype = table.insertRow(nextRowIndex);
			rowIsSummonCreatureSubtype.id = "rowIsSummonCreatureSubtype";
			rowIsSummonCreatureSubtype.innerHTML = "<th><label for='isSummonCreatureSubtype'>Must be subtype of creature selected?</label></th><td><input type='checkbox' id='isSummonCreatureSubtype' name='isSummonCreatureSubtype' onchange='createSummonCreatureSubtypeTable(1)'></td>";
			nextRowIndex++;
			//TODO: Add selection of creature subtypes (e.g. devils)
		}

		let summonNumberOptions = "";

		if(summonsSelection == "SpellEffect"){
			summonNumberOptions = "<input type='number' id='summonNumber' name='summonNumber' min='1' style='width:25px' value=1>";
		}
		else{
			summonNumberOptions = "<input type='number' id='summonNumber' name='summonNumber' min='1' style='width:25px' value=1> OR <input type='checkbox' id='summonNumberCRBased' name='summonNumberCRBased' onchange='toggleSummonNumber()'> Based on Summon CR";
		}

		if(!hadPriorSummonType){
			let rowSummonNumber = table.insertRow(nextRowIndex);
			rowSummonNumber.id = "rowSummonNumber";
			rowSummonNumber.innerHTML = "<th><label for='summonNumber'>Number of Summons:</th><td>"+summonNumberOptions+"</td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let summonNumberAHLScalingSelect = await createAHLSelect("summonNumberAHLScaling");

				let rowSummonNumberAHL = table.insertRow(nextRowIndex);
				rowSummonNumberAHL.id = "rowSummonNumberAHL";
				rowSummonNumberAHL.innerHTML = "<th><label for='summonNumberAHLScaleHow'>Increased Number AHL:</th><td><select id='summonNumberAHLScaleHow' name='summonNumberAHLScaleHow'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='summonNumberAHL' name='summonNumberAHL' min='0' style='width:25px' value=0>"+summonNumberAHLScalingSelect+"</td>";
				nextRowIndex++;
			}
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

async function createSummonCreatureSubtypeTable(thisCreatureType){

}

async function createUncommonEffectsRows(){
	let nextRowIndex = document.getElementById("rowUncommonEffects").rowIndex+1;

	if(document.getElementById("isUncommonEffects").checked){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20","<th><label for='isModifyD20'>Modifies d20 Tests?</label></th><td><input type='checkbox' id='isModifyD20' name='isModifyD20' onchange='createModifyD20Rows()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20","<th><label for='isModifyDamageRoll'>Modifies Damage Rolls?</label></th><td><input type='checkbox' id='isModifyDamageRoll' name='isModifyDamageRoll' onchange='createModifyDamageRollRows()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectCondition","<th><label for='isAffectCondition'>Affects Active Conditions?</label></th><td><select id='isAffectCondition' name='isAffectCondition' onchange='createAffectConditionRows()'><option value='No'>No Effect</option><option value='End'>End Conditions</option><option value='Suppress'>Suppress Conditions</option><option value='Shorten'>Shorten Conditions</option><option value='Prolong'>Prolong Conditions</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpell","<th><label for='isAffectSpell'>Affects Spell Effects?</label></th><td><select id='isAffectSpell' name='isAffectSpell' onchange='createAffectSpellRows()'><option value='No'>No Effect</option><option value='End'>End Spells</option><option value='Suppress'>Suppress Spells</option><option value='Shorten'>Shorten Spells</option><option value='Prolong'>Prolong Spells</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowLightType","<th><label for='lightType'>Creates a Light or Darkness?</label></th><td><select id='lightType' name='lightType' onchange='createLightTable()'><option value='None'>No Light</option><option value='Dim'>Dim Light</option><option value='Bright'>Bright Light</option><option value='BrightDim'>Bright + Dim Light</option><option value='Darkness'>Darkness</option><option value='Obscure'>Heavily Obscure</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsMoveTarget","<th><label for='isMoveTarget'>Moves the Target?</label></th><td><input type='checkbox' id='isMoveTarget' name='isMoveTarget' value=1 onchange='createMoveTargetTable()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsTransform","<th><label for='isTransform'>Transform Target?</label></th><td><input type='checkbox' id='isTransform' name='isTransform' onchange='createTransformRows()'></td>");
		nextRowIndex++;
		
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowSetHP","<th><label for='isSetHP'>Set Target's Current HP?</label></th><td><input type='checkbox' id='isSetHP' name='isSetHP' onchange='createSetHPRows()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowInstantKill","<th><label for='InstantKill'>Instantly Kills Target?</label></th><td><input type='checkbox' id='InstantKill' name='InstantKill' onchange='createInstantKillRows()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsCreateObject","<th><label for='isCreateObject'>Creates an Object?</label></th><td><input type='checkbox' id='isCreateObject' name='isCreateObject' value=1 onchange='createCreateObjectTable()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsWeaponAttack","<th><label for='isWeaponAttack'>Makes a Weapon Attack?</label></th><td><input type='checkbox' id='isWeaponAttack' name='isWeaponAttack' value=1 onchange='createWeaponAttackTable()'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIgnoreCoverBenefits","<th><label for='IgnoreCoverBenefit'>Ignore Cover Benefits?</label></th><td><input type='checkbox' id='IgnoreCoverBenefit' name='IgnoreCoverBenefit'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowUncommonEffects","Range");
	}
}

async function createModifyD20Rows(){
	let nextRowIndex = document.getElementById("rowModifyD20").rowIndex + 1;

	if(document.getElementById("isModifyD20").checked){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsModifyAttack","<th><label for='affectEffectAffectsAll'>Must Affect All Possible Effects:</label></th><td><input type='checkbox' id='affectEffectAffectsAll' name='affectEffectAffectsAll'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20Number","<th><label for='affectEffectNumber'>Number to Remove:</label></th><td><input type='number' id='affectEffectNumber' name='affectEffectNumber' min=0 style='width:25px' value=1><input type='checkbox' name='affectEffectNumberUnlimited' id='affectEffectNumberUnlimited' onchange='toggleFieldEnabled("+'"affectEffectNumber","affectEffectNumberUnlimited"'+")'>Unlimited?</td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let affectEffectNumberAHLScalingSelect = await createAHLSelect("affectEffectNumberAHLScaling");

			addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20NumberAHL","<th><label for='affectEffectNumberAHL'>Number Affected Increase AHL:</th><td><input type='number' id='affectEffectNumberAHL' name='affectEffectNumberAHL' min=0 value=0 style='width:25px'>"+affectEffectNumberAHLScalingSelect+"</td>");
			nextRowIndex++;
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20Number","<th><label for='affectEffectAffectsAll'>Must Affect All Possible Effects:</label></th><td><input type='checkbox' id='affectEffectAffectsAll' name='affectEffectAffectsAll'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20NameFilterType","<th><label for='affectEffectNameFilterType'>Valid Spells By Name:</label></th><td><select id='affectEffectNameFilterType' name='affectEffectNameFilterType' onchange='createModifyD20NameFilterRows()'><option value='All'>All Spells</option><option value='Inclusive'>Must Be Specific Spell(s)</option><option value='Exclusive'>Cannot Be Specific Spell(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20TagFilterType","<th><label for='affectEffectTagFilterType'>Valid Spells By Type:</label></th><td><select id='affectEffectTagFilterType' name='affectEffectTagFilterType' onchange='createModifyD20TagFilterRows()'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20LevelMax","<th><label for='affectEffectLevelMax'>Maximum Level Affected:</label></th><td><input type='number' id='affectEffectLevelMax' name='affectEffectLevelMax' min=0 value=1 style='width:25px'> OR <select id='affectEffectLevelMaxAlternate' name='affectEffectLevelMaxAlternate'><option value='None'>No Alternative</option><option value='CastLevel'>Spell Slot Level</option><option value='NoMax'>No Maximum</option></select></td>");
			nextRowIndex++;
		}
		else{
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20LevelMax","<th><label for='affectEffectLevelMax'>Maximum Level Affected:</label></th><td><input type='number' id='affectEffectLevelMax' name='affectEffectLevelMax' min=0 value=1 style='width:25px'><input type='checkbox' name='affectEffectNumberUnlimited' id='affectEffectNumberUnlimited' onchange='toggleFieldEnabled("+'"affectEffectNumber","affectEffectNumberUnlimited"'+")'>Unlimited?</td>");
			nextRowIndex++;
		}
		
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsModifyD20LevelMaxOverride","<th><label for='isModifyD20LevelMaxOverride'>May Affect Spells Over Maximum Level?</label></th><td><input type='checkbox' id='isModifyD20LevelMaxOverride' name='isModifyD20LevelMaxOverride' onchange='createModifyD20LevelMaxOverrideRows()'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowModifyD20","rowAffectCondition");
	}
}

async function createModifyD20TypeRows(){
	
}

async function createAffectConditionRows(){
	let nextRowIndex = document.getElementById("rowAffectCondition").rowIndex + 1;

	if(document.getElementById("isAffectCondition").value != "No"){
		document.getElementById("isAffectSpell").setAttribute("disabled","");

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionNumber","<th><label for='affectConditionNumber'>Number to Remove:</label></th><td><input type='number' id='affectConditionNumber' name='affectConditionNumber' min=0 style='width:25px' value=1><input type='checkbox' name='affectConditionNumberUnlimited' id='affectConditionNumberUnlimited' onchange='toggleFieldEnabled("+'"affectConditionNumber","affectConditionNumberUnlimited"'+")'>Unlimited?</td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let affectConditionNumberAHLScalingSelect = await createAHLSelect("affectConditionNumberAHLScaling");

			addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionNumberAHL","<th><label for='affectConditionNumberAHL'>Number Affected Increase AHL:</th><td><input type='number' id='affectConditionNumberAHL' name='affectConditionNumberAHL' min=0 value=0 style='width:25px'>"+affectConditionNumberAHLScalingSelect+"</td>");
			nextRowIndex++;
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionAffectsAll","<th><label for='affectConditionAffectsAll'>Must Affect All Possible Conditions:</label></th><td><input type='checkbox' id='affectConditionAffectsAll' name='affectConditionAffectsAll'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionNameFilterType","<th><label for='affectConditionNameFilterType'>Valid Conditions By Name:</label></th><td><select id='affectConditionNameFilterType' name='affectConditionNameFilterType' onchange='createAffectConditionNameFilterRows()'><option value='All'>All Conditions</option><option value='Inclusive'>Must Be Specific Condition(s)</option><option value='Exclusive'>Cannot Be Specific Condition(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionTagFilterType","<th><label for='affectConditionTagFilterType'>Valid Conditions By Type:</label></th><td><select id='affectConditionTagFilterType' name='affectConditionTagFilterType' onchange='createAffectConditionTagFilterRows()'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionTier","<th><label for='affectConditionTier'>Removal Tier:</label></th><td><select id='affectConditionTier' name='affectConditionTier'><option value=1>Basic</option><option value=2 select>Lesser Restoration</option><option value=3>Greater Restoration</option><option value=4>Heal</option><option value=5>Power Word: Heal</option><option value=6>Wish</option></select></td>");
		nextRowIndex++;

		//TODO: Add a "prolong/shorten conditions" thing here - Removal Tier should be included in this, which will require change to clearunusedtable for createtagfilterrows
	}
	else{
		document.getElementById("isAffectSpell").removeAttribute("disabled","");
		clearUnusedTable("CreateSubeffectTable","rowAffectCondition","rowAffectSpell");
	}
}

async function createAffectConditionNameFilterRows(){
	let table = document.getElementById("CreateSubeffectTable");
	let currentNameFilterTypeSelection = document.getElementById("affectConditionNameFilterType").value;
	let nextRowIndex = document.getElementById("rowAffectConditionNameFilterType").rowIndex + 1;

	if(currentNameFilterTypeSelection == "All"){
		clearUnusedTable("CreateSubeffectTable","rowAffectConditionNameFilterType","rowAffectConditionTagFilterType");
	}
	else{
		let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allConditions = await request.json();

		let conditionIncludeOptions = "";
		let conditionExcludeOptions = "";
		for(let tempCondition of allConditions){
			conditionIncludeOptions = conditionIncludeOptions + "<label><input type='checkbox' id='affectConditionNameFilterInclusive"+tempCondition.Name+"' name='affectConditionNameFilterInclusive"+tempCondition.Name+"' value=1><span>"+tempCondition.DisplayName+"</span></label>";

			conditionExcludeOptions = conditionExcludeOptions + "<label><input type='checkbox' id='affectConditionNameFilterExclusive"+tempCondition.Name+"' name='affectConditionNameFilterExclusive"+tempCondition.Name+"' value=1><span>"+tempCondition.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveAffectConditionNames") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveAffectConditionNames") != null);

		if(currentNameFilterTypeSelection == "Inclusive" || currentNameFilterTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowInclusiveAffectConditionNames","<th>Affected Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionIncludeOptions+"</div></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentNameFilterTypeSelection == "Inclusive"){
				clearUnusedTable("CreateSubeffectTable","rowInclusiveAffectConditionNames","rowAffectConditionTagFilterType");
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentNameFilterTypeSelection == "Exclusive" || currentNameFilterTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowExclusiveAffectConditionNames","<th>Unaffected Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentNameFilterTypeSelection == "Exclusive"){
				clearUnusedTable("CreateSubeffectTable","rowAffectConditionNameFilterType","rowExclusiveAffectConditionNames");
			}
		}
	}

	createAffectConditionCombineNameTagFiltersHowRows();
}

async function createAffectConditionTagFilterRows(){
	let table = document.getElementById("CreateSubeffectTable");
	let currentTagFilterTypeSelection = document.getElementById("affectConditionTagFilterType").value;
	let nextRowIndex = document.getElementById("rowAffectConditionTagFilterType").rowIndex + 1;

	if(currentTagFilterTypeSelection == "All"){
		clearUnusedTable("CreateSubeffectTable","rowAffectConditionTagFilterType","rowAffectConditionTier");
	}
	else{
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ConditionTags']"});
		let allConditionTags = await request.json();

		let conditionTagIncludeOptions = "";
		let conditionTagExcludeOptions = "";
		for(let tempTag of allConditionTags){
			conditionTagIncludeOptions = conditionTagIncludeOptions + "<label><input type='checkbox' id='affectConditionTagFilterInclusive"+tempTag.Name+"' name='affectConditionTagFilterInclusive"+tempTag.Name+"' value=1><span>"+tempTag.DisplayName+"</span></label>";
	
			conditionTagExcludeOptions = conditionTagExcludeOptions + "<label><input type='checkbox' id='affectConditionTagFilterExclusive"+tempTag.Name+"' name='affectConditionTagFilterExclusive"+tempTag.Name+"' value=1><span>"+tempTag.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveAffectConditionTags") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveAffectConditionTags") != null);

		if(currentTagFilterTypeSelection == "Inclusive" || currentTagFilterTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowInclusiveAffectConditionTags","<th>Affect Conditions with Tag:</th><td><div class='check-multiple' style='width:100%'>"+conditionTagIncludeOptions+"</div></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTagFilterTypeSelection == "Inclusive"){
				clearUnusedTable("CreateSubeffectTable","rowInclusiveAffectConditionTags","rowAffectConditionTier");
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTagFilterTypeSelection == "Exclusive" || currentTagFilterTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowExclusiveAffectConditionTags","<th>Cannot Affect Conditions with Tag:</th><td><div class='check-multiple' style='width:100%'>"+conditionTagExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTagFilterTypeSelection == "Exclusive"){
				clearUnusedTable("CreateSubeffectTable","rowAffectConditionTagFilterType","rowExclusiveAffectConditionTags");
			}
		}
	}

	createAffectConditionCombineNameTagFiltersHowRows();
}

async function createAffectConditionCombineNameTagFiltersHowRows(){
	let table = document.getElementById("CreateSubeffectTable");

	if(document.getElementById("affectConditionNameFilterType").value != "All" && document.getElementById("affectConditionTagFilterType").value != "All"){
		if(document.getElementById("rowAffectConditionCombineFiltersHow") == null){
			let nextRowIndex = "";
			if(document.getElementById("rowExclusiveAffectConditionTags") == null){
				nextRowIndex = document.getElementById("rowInclusiveAffectConditionTags").rowIndex + 1;
			}
			else{
				nextRowIndex = document.getElementById("rowExclusiveAffectConditionTags").rowIndex + 1;
			}
			
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectConditionCombineFiltersHow","<th><label for='affectConditionCombineFiltersHow'>How Do Name and Tag Filters Interact?</label></th><td><select id='affectConditionCombineFiltersHow' name='affectConditionCombineFiltersHow'><option value='or'>Fit Name OR Tag Filters</option><option value='and'>Fit Name AND Tag Filters</option></select></td>");
		}
	}
	else if(document.getElementById("rowAffectConditionCombineFiltersHow") != null){
		table.deleteRow(document.getElementById("rowAffectConditionCombineFiltersHow").rowIndex);
	}
}

async function createAffectSpellRows(){
	let nextRowIndex = document.getElementById("rowAffectSpell").rowIndex + 1;

	if(document.getElementById("isAffectSpell").value != "No"){
		document.getElementById("isAffectCondition").setAttribute("disabled","");

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellNumber","<th><label for='affectSpellNumber'>Number to Remove:</label></th><td><input type='number' id='affectSpellNumber' name='affectSpellNumber' min=0 style='width:25px' value=1><input type='checkbox' name='affectSpellNumberUnlimited' id='affectSpellNumberUnlimited' onchange='toggleFieldEnabled("+'"affectSpellNumber","affectSpellNumberUnlimited"'+")'>Unlimited?</td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let affectSpellNumberAHLScalingSelect = await createAHLSelect("affectSpellNumberAHLScaling");

			addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellNumberAHL","<th><label for='affectSpellNumberAHL'>Number Affected Increase AHL:</th><td><input type='number' id='affectSpellNumberAHL' name='affectSpellNumberAHL' min=0 value=0 style='width:25px'>"+affectSpellNumberAHLScalingSelect+"</td>");
			nextRowIndex++;
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellAffectsAll","<th><label for='affectSpellAffectsAll'>Must Affect All Possible Spells:</label></th><td><input type='checkbox' id='affectSpellAffectsAll' name='affectSpellAffectsAll'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellWhileCast","<th><label for='affectSpellWhileCast'>Affects Spells Being Cast:</label></th><td><input type='checkbox' id='affectSpellWhileCast' name='affectSpellWhileCast'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellNameFilterType","<th><label for='affectSpellNameFilterType'>Valid Spells By Name:</label></th><td><select id='affectSpellNameFilterType' name='affectSpellNameFilterType' onchange='createAffectSpellNameFilterRows()'><option value='All'>All Spells</option><option value='Inclusive'>Must Be Specific Spell(s)</option><option value='Exclusive'>Cannot Be Specific Spell(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellTagFilterType","<th><label for='affectSpellTagFilterType'>Valid Spells By Type:</label></th><td><select id='affectSpellTagFilterType' name='affectSpellTagFilterType' onchange='createAffectSpellTagFilterRows()'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellLevelMax","<th><label for='affectSpellLevelMax'>Maximum Level Affected:</label></th><td><input type='number' id='affectSpellLevelMax' name='affectSpellLevelMax' min=0 value=1 style='width:25px'> OR <select id='affectSpellLevelMaxAlternate' name='affectSpellLevelMaxAlternate'><option value='None'>No Alternative</option><option value='CastLevel'>Spell Slot Level</option><option value='NoMax'>No Maximum</option></select></td>");
			nextRowIndex++;
		}
		else{
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowAffectSpellLevelMax","<th><label for='affectSpellLevelMax'>Maximum Level Affected:</label></th><td><input type='number' id='affectSpellLevelMax' name='affectSpellLevelMax' min=0 value=1 style='width:25px'><input type='checkbox' name='affectSpellNumberUnlimited' id='affectSpellNumberUnlimited' onchange='toggleFieldEnabled("+'"affectSpellNumber","affectSpellNumberUnlimited"'+")'>Unlimited?</td>");
			nextRowIndex++;
		}
		
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsAffectSpellLevelMaxOverride","<th><label for='isAffectSpellLevelMaxOverride'>May Affect Spells Over Maximum Level?</label></th><td><input type='checkbox' id='isAffectSpellLevelMaxOverride' name='isAffectSpellLevelMaxOverride' onchange='createAffectSpellLevelMaxOverrideRows()'></td>");
		nextRowIndex++;
	}
	else{
		document.getElementById("isAffectCondition").removeAttribute("disabled","");
		clearUnusedTable("CreateSubeffectTable","rowAffectSpell","rowLightType");
	}
}

async function createAffectSpellNameFilterRows(){
	let table = document.getElementById("CreateSubeffectTable");
	let currentNameFilterTypeSelection = document.getElementById("affectSpellNameFilterType").value;
	let nextRowIndex = document.getElementById("rowAffectSpellNameFilterType").rowIndex + 1;

	if(currentNameFilterTypeSelection == "All"){
		clearUnusedTable("CreateSubeffectTable","rowAffectSpellNameFilterType","rowAffectSpellTagFilterType");
	}
	else{
		//TODO: This is an unmanagably large list for a check-multiple interface. Will need another solution.
		let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allSpells = await request.json();

		let spellIncludeOptions = "";
		let spellExcludeOptions = "";
		for(let tempSpell of allSpells){
			spellIncludeOptions = spellIncludeOptions + "<label><input type='checkbox' id='affectSpellNameFilterInclusive"+tempSpell.Name+"' name='affectSpellNameFilterInclusive"+tempSpell.Name+"' value=1><span>"+tempSpell.DisplayName+"</span></label>";

			spellExcludeOptions = spellExcludeOptions + "<label><input type='checkbox' id='affectSpellNameFilterExclusive"+tempSpell.Name+"' name='affectSpellNameFilterExclusive"+tempSpell.Name+"' value=1><span>"+tempSpell.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveAffectSpellNames") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveAffectSpellNames") != null);

		if(currentNameFilterTypeSelection == "Inclusive" || currentNameFilterTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowInclusiveAffectSpellNames","<th>Affected Spells:</th><td></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentNameFilterTypeSelection == "Inclusive"){
				clearUnusedTable("CreateSubeffectTable","rowInclusiveAffectSpellNames","rowAffectSpellTagFilterType");
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}

		if(currentNameFilterTypeSelection == "Exclusive" || currentNameFilterTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowExclusiveAffectSpellNames","<th>Unaffected Spells:</th><td><div class='check-multiple' style='width:100%'>"+spellExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentNameFilterTypeSelection == "Exclusive"){
				clearUnusedTable("CreateSubeffectTable","rowAffectSpellNameFilterType","rowExclusiveAffectSpellNames");
			}
		}
	}
}

async function createAffectSpellTagFilterRows(){
	let table = document.getElementById("CreateSubeffectTable");
	let currentTagFilterTypeSelection = document.getElementById("affectSpellTagFilterType").value;
	let nextRowIndex = document.getElementById("rowAffectSpellTagFilterType").rowIndex + 1;

	if(currentTagFilterTypeSelection == "All"){
		clearUnusedTable("CreateSubeffectTable","rowAffectSpellTagFilterType","rowAffectSpellTier");
	}
	else{
		console.log("Spells do not have tags yet, so this will not work.");
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.SpellTags']"});
		let allSpellTags = await request.json();

		let spellTagIncludeOptions = "";
		let spellTagExcludeOptions = "";
		for(let tempTag of allSpellTags){
			spellTagIncludeOptions = spellTagIncludeOptions + "<label><input type='checkbox' id='affectSpellTagFilterInclusive"+tempTag.Name+"' name='affectSpellTagFilterInclusive"+tempTag.Name+"' value=1><span>"+tempTag.DisplayName+"</span></label>";
	
			spellTagExcludeOptions = spellTagExcludeOptions + "<label><input type='checkbox' id='affectSpellTagFilterExclusive"+tempTag.Name+"' name='affectSpellTagFilterExclusive"+tempTag.Name+"' value=1><span>"+tempTag.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveAffectSpellTags") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveAffectSpellTags") != null);

		if(currentTagFilterTypeSelection == "Inclusive" || currentTagFilterTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowInclusiveAffectSpellTags","<th>Affect Spells with Tag:</th><td><div class='check-multiple' style='width:100%'>"+spellTagIncludeOptions+"</div></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTagFilterTypeSelection == "Inclusive"){
				clearUnusedTable("CreateSubeffectTable","rowInclusiveAffectSpellTags","rowAffectSpellTier");
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTagFilterTypeSelection == "Exclusive" || currentTagFilterTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow("CreateSubeffectTable",nextRowIndex,"rowExclusiveAffectSpellTags","<th>Cannot Affect Spells with Tag:</th><td><div class='check-multiple' style='width:100%'>"+spellTagExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTagFilterTypeSelection == "Exclusive"){
				clearUnusedTable("CreateSubeffectTable","rowAffectSpellTagFilterType","rowExclusiveAffectSpellTags");
			}
		}
	}
}

async function createLightTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowLightType").rowIndex+1;
	let lightSelection = document.getElementById("lightType").value;

	clearUnusedTable("CreateSubeffectTable","rowLightType","rowIsMoveTarget");

	if(lightSelection == "None"){

	}
	else{
		if(lightSelection == "Darkness"){
			let rowLightInfo = table.insertRow(nextRowIndex);
			rowLightInfo.id = "rowLightInfo";
			rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Darkness:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;
		}
		else if(lightSelection == "BrightDim"){
			let rowLightInfo = table.insertRow(nextRowIndex);
			rowLightInfo.id = "rowLightInfo";
			rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Light/Dim Light:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> bright <b>/</b> <input type='number' id='secondaryLightDistanceValue' name='secondaryLightDistanceValue' min=0 value=30 style='width:25px'> dim</td>";
			nextRowIndex++;

			let rowIsSunlight = table.insertRow(nextRowIndex);
			rowIsSunlight.id = "rowIsSunlight";
			rowIsSunlight.innerHTML = "<th><label for='isSunlight'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight' name='isSunlight' value=1></td>";
			nextRowIndex++;
		}
		else if(lightSelection == "Obscure"){
			let rowLightInfo = table.insertRow(nextRowIndex);
			rowLightInfo.id = "rowLightInfo";
			rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Obscured Area:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;
		}
		else{
			let rowLightInfo = table.insertRow(nextRowIndex);
			rowLightInfo.id = "rowLightInfo";
			rowLightInfo.innerHTML = "<th><label for='lightDistanceValue'>Size of Light:</label></th><td><input type='number' id='lightDistanceValue' name='lightDistanceValue' min=0 value=30 style='width:25px'><select id='lightDistanceUnits' name='lightDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			let rowIsSunlight = table.insertRow(nextRowIndex);
			rowIsSunlight.id = "rowIsSunlight";
			rowIsSunlight.innerHTML = "<th><label for='isSunlight'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight' name='isSunlight' value=1></td>";
			nextRowIndex++;
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowLightCanBlock","<th><label for='lightCanBlock'>Light Can Be Blocked if Covered:</label></th><td><input type='checkbox' id='lightCanBlock' name='lightCanBlock'></td>");
		nextRowIndex++;

		if(document.getElementById("aoeShape").value != "None"){
			let UseAoESizeIndex = document.getElementById("rowLightInfo").rowIndex+1;
			addTableRow("CreateSubeffectTable",UseAoESizeIndex,"rowLightUseAoESize","<th><label for='isLightUseAoESize'>Use AoE For Size:</label></th><td><input type='checkbox' id='isLightUseAoESize' name='isLightUseAoESize' onchange='toggleFieldEnabled("+'"lightDistanceValue","isLightUseAoESize"'+")'></td>");
		}
	}

}

async function createMoveTargetTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let nextRowIndex = document.getElementById("rowIsMoveTarget").rowIndex+1;

	if(document.getElementById("isMoveTarget").checked){
		let rowMoveTargetInfo = table.insertRow(nextRowIndex);
		rowMoveTargetInfo.id = "rowMoveTargetInfo";
		rowMoveTargetInfo.innerHTML = "<th><label for='moveTargetValue'>Distance Target Moved:</label></th><input type='number' id='moveTargetValue' name='moveTargetValue' min=0 value=10 style='width:25px'><select id='moveTargetUnits' name='moveTargetUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option><option value='Unlimited'>Unlimited</option></select><select id='moveTargetDirection' name='moveTargetDirection'><option value='Choice'>User's Choice</option><option value='Away'>Away From User</option><option value='Towards'>Towards User</option><option value='Random4'>Random, 4 Directions</option><option value='Random8'>Random, 8 Directions</option></select></td></tr>";
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let moveTargetAHLScalingSelect = await createAHLSelect("moveTargetAHLScaling");

			let rowMoveTargetAHLInfo = table.insertRow(nextRowIndex);
			rowMoveTargetAHLInfo.id = "rowMoveTargetAHLInfo";
			rowMoveTargetAHLInfo.innerHTML = "<th><label for='moveTargetAHLValue'>Increased Distance AHL:</label></th><input type='number' id='moveTargetAHLValue' name='moveTargetAHLValue' min=0 value=0 style='width:25px'>"+moveTargetAHLScalingSelect+"</td></tr>";
			nextRowIndex++;
		}

		let rowMoveTargetType = table.insertRow(nextRowIndex);
		rowMoveTargetType.id = "rowMoveTargetType";
		rowMoveTargetType.innerHTML = "<th><label for='moveTargetType'>Type of Movement:</label></th><select id='moveTargetType' name='moveTargetType'><option value='Physical'>Physical Movement</option><option value='Teleportation'>Teleportation</option><option value='Extraplanar'>Extraplanar Teleportation</option></select></td></tr>";
		nextRowIndex++;

		if(document.getElementById("howMitigate").value == "Save"){
			let rowSavePreventMove = table.insertRow(nextRowIndex);
			rowSavePreventMove.id = "rowSavePreventMove";
			rowSavePreventMove.innerHTML = "<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td></tr>";
			nextRowIndex++;
		}
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsMoveTarget","rowIsTransform");
	}
}

async function createSetHPRows(){
	let nextRowIndex = document.getElementById("rowSetHP").rowIndex + 1;

	if(document.getElementById("isSetHP").checked){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowSetHPAmount","<th><label for='SetHPAmount'>Set Target HP to:</label></th><td><input type='number' id='SetHPAmount' name='SetHPAmount' min=0 style='width:25px' value=0></td>");
		nextRowIndex++;

		if(document.getElementById("howMitigate").value=="Save"){
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowSavePreventSetHP","<th><label for='savePreventSetHP'>Save Prevents HP Change:</label></th><td><input type='checkbox' id='savePreventSetHP' name='savePreventSetHP'></td>");
			nextRowIndex++;
		}
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowSetHP","rowInstantKill");
	}
}

async function createInstantKillRows(){
	let nextRowIndex = document.getElementById("rowInstantKill").rowIndex + 1;
	if(document.getElementById("howMitigate").value=="Save" && document.getElementById("InstantKill").checked){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowSavePreventInstantKill","<th><label for='savePreventInstantKill'>Save Prevents Instant Kill:</label></th><td><input type='checkbox' id='savePreventInstantKill' name='savePreventInstantKill'></td>");
		nextRowIndex++;  
	}
	else if(document.getElementById("rowSavePreventInstantKill") != null){
		document.getElementById("CreateSubeffectTable").deleteRow(nextRowIndex);
	}
}

async function createCreateObjectTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let startRowIndex = document.getElementById("rowIsCreateObject").rowIndex;
//TODO: Object creation once equipment/item stuff is done
	if(document.getElementById("isCreateObject").checked){
		let rowCreateObjectInfo = table.insertRow(startRowIndex+1);
		rowCreateObjectInfo.id = "rowCreateObjectInfo";
		rowCreateObjectInfo.innerHTML = "<th style='colspan:2'>Note: There is currently no data collection for what type of objects are created by spells.</th>";
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsCreateObject","rowIsWeaponAttack");
	}
}

async function createRangeTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let RangeRowIndex = document.getElementById("Range").rowIndex;

	if(document.getElementById("RangeType").value == "SelfRanged" || document.getElementById("RangeType").value == "Ranged"){
		if(RangeRowIndex+1 == document.getElementById("AoE").rowIndex){
			let rangeDistanceRow = table.insertRow(RangeRowIndex+1);
			rangeDistanceRow.id = "rowRangeDistance";
			rangeDistanceRow.innerHTML = "<th><label for='RangeValue'>Range:</label></th><td><input type='number' id='RangeValue' name='RangeValue' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";

			if(checkEffectType()=="Spell"){
				let RangeScalingAHLSelect = await createAHLSelect("RangeScalingAHL");

				let rangeDistanceAHLRow = table.insertRow(RangeRowIndex+2);
				rangeDistanceAHLRow.id = "rowRangeDistanceAHL";
				rangeDistanceAHLRow.innerHTML = "<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL' name='RangeValueAHL' min=0 style='width:25px' value=0>"+RangeScalingAHLSelect+"</td>";                
			}
		}
	}
	else if(document.getElementById("RangeType").value == "PriorTarget"){

	}
	else if(RangeRowIndex+1 != document.getElementById("AoE").rowIndex){
		//Will need to change when rows are deleted here
		clearUnusedTable("CreateSubeffectTable","Range","AoE");
	}
}

async function createAoETable(whichShape){
	let table = document.getElementById("CreateSubeffectTable");
	let startRowIndex = document.getElementById("AoE").rowIndex + 1;
	let shapesArray = ["Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall"];
	let aoeShapeSelction = document.getElementById("aoeShape").value;
	if(aoeShapeSelction == "None"){
		clearUnusedTable("CreateSubeffectTable","AoE","rowTargetNumber");

		if(document.getElementById("rowLightUseAoESize") != null){
			document.getElementById("lightDistanceValue").removeAttribute("disabled","");
			table.deleteRow(document.getElementById("rowLightUseAoESize").rowIndex);
		}
	}
	else{
		if(document.getElementById("rowAoENum") == null){
			let rowAoENum = table.insertRow(startRowIndex);
			rowAoENum.id = "rowAoENum";
			let rowAoEHTML = "<th><label for='AoENum'>Number of AoEs:</label></th><td><input type='number' id='AoENum' name='AoENum' min=1 value=1 style='width:25px'>";
			if(checkEffectType()=="Spell"){
				let AoENumAHLScalingSelect = await createAHLSelect("AoENumAHLScaling");

				rowAoEHTML = rowAoEHTML + " + <input type='number' id='AoENumAHL' name='AoENumAHL' min=0 value=0 style='width:25px'>"+AoENumAHLScalingSelect;
			}
			rowAoENum.innerHTML = rowAoEHTML+"</td>";
		}

		if(document.getElementById("rowLightType") != null){
			if(document.getElementById("rowLightUseAoESize") == null && document.getElementById("lightType").value != "None"){
				let UseAoESizeIndex = document.getElementById("rowLightInfo").rowIndex+1;
				addTableRow("CreateSubeffectTable",UseAoESizeIndex,"rowLightUseAoESize","<th><label for='isLightUseAoESize'>Use AoE For Size:</label></th><td><input type='checkbox' id='isLightUseAoESize' name='isLightUseAoESize' onchange='toggleFieldEnabled("+'"lightDistanceValue","isLightUseAoESize"'+")'></td>");
				nextRowIndex++;
			}
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
				clearUnusedTable("CreateSubeffectTable","AoE","row"+whichShape+"Dimensions");
				
				if(checkEffectType()=="Spell"){
					clearUnusedTable("CreateSubeffectTable","row"+whichShape+"DimensionsAHL","rowAoENum");                    
				}
				else{
					clearUnusedTable("CreateSubeffectTable","row"+whichShape+"Dimensions","rowAoENum");
				}

				return;
			}
			else{
				clearUnusedTable("CreateSubeffectTable","AoE","rowAoENum");
			}
		}

		if(whichShape == "Cone"){
			let rowConeDimensions = table.insertRow(startRowIndex);
			rowConeDimensions.id = "rowConeDimensions";
			rowConeDimensions.innerHTML = "<th><label for='coneDimensionValue'>Cone Size:</label></th><td><input type='number' id='coneDimensionValue' name='coneDimensionValue' min=0 style='width:25px' value=0><select id='coneDimensionUnits' name='coneDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let coneSizeAHLScalingSelect = await createAHLSelect("coneSizeAHLScaling");

				let rowConeDimensionsAHL = table.insertRow(startRowIndex);
				rowConeDimensionsAHL.id = "rowConeDimensionsAHL";
				rowConeDimensionsAHL.innerHTML = "<th><label for='coneDimensionValueAHL'>Increased Cone Size AHL:</label></th><td><input type='number' id='coneDimensionValueAHL' name='coneDimensionValueAHL' min=0 style='width:25px' value=0>"+coneSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Cube"){
			let rowCubeDimensions = table.insertRow(startRowIndex);
			rowCubeDimensions.id = "rowCubeDimensions";
			rowCubeDimensions.innerHTML = "<th><label for='cubeDimensionValue'>Cube Side Length:</label></th><td><input type='number' id='cubeDimensionValue' name='cubeDimensionValue' min=0 style='width:25px' value=0><select id='cubeDimensionUnits' name='cubeDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let cubeSizeAHLScalingSelect = await createAHLSelect("cubeSizeAHLScaling");

				let rowCubeDimensionsAHL = table.insertRow(startRowIndex);
				rowCubeDimensionsAHL.id = "rowCubeDimensionsAHL";
				rowCubeDimensionsAHL.innerHTML = "<th><label for='cubeDimensionValueAHL'>Increased Side Length AHL:</label></th><td><input type='number' id='cubeDimensionValueAHL' name='cubeDimensionValueAHL' min=0 style='width:25px' value=0>"+cubeSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Cylinder"){
			let rowCylinderDimensions = table.insertRow(startRowIndex);
			rowCylinderDimensions.id = "rowCylinderDimensions";
			rowCylinderDimensions.innerHTML = "<th><label for='cylinderRadiusValue'>Cylinder Radius x Height:</label></th><td><input type='number' id='cylinderRadiusValue' name='cylinderRadiusValue' min=0 style='width:25px' value=0><select id='cylinderRadiusUnits' name='cylinderRadiusUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='cylinderHeightValue' name='cylinderHeightValue' min=0 style='width:25px' value=0><select id='cylinderHeightUnits' name='cylinderHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let cylinderSizeAHLScalingSelect = await createAHLSelect("cylinderSizeAHLScaling");

				let rowCylinderDimensionsAHL = table.insertRow(startRowIndex);
				rowCylinderDimensionsAHL.id = "rowCylinderDimensionsAHL";
				rowCylinderDimensionsAHL.innerHTML = "<th><label for='cylinderRadiusValueAHL'>Cylinder Dimensions AHL:</label></th><td><input type='number' id='cylinderRadiusValueAHL' name='cylinderRadiusValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='cylinderHeightValueAHL' name='cylinderHeightValueAHL' min=0 style='width:25px' value=0>"+cylinderSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Half Sphere"){
			let rowHalfSphereDimensions = table.insertRow(startRowIndex);
			rowHalfSphereDimensions.id = "rowHalfSphereDimensions";
			rowHalfSphereDimensions.innerHTML = "<th><label for='halfSphereDimensionValue'>Half Sphere Radius:</label></th><td><input type='number' id='halfSphereDimensionValue' name='halfSphereDimensionValue' min=0 style='width:25px' value=0><select id='halfSphereDimensionUnits' name='halfSphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let halfSphereSizeAHLScalingSelect = await createAHLSelect("halfSphereSizeAHLScaling");

				let rowHalfSphereDimensionsAHL = table.insertRow(startRowIndex);
				rowHalfSphereDimensionsAHL.id = "rowHalfSphereDimensionsAHL";
				rowHalfSphereDimensionsAHL.innerHTML = "<th><label for='halfSphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='halfSphereDimensionValueAHL' name='halfSphereDimensionValueAHL' min=0 style='width:25px' value=0>"+halfSphereSizeAHLScalingSelect+"</td>";
				startRowIndex++;
			}

		}
		else if(whichShape == "Line"){
			let rowLineDimensions = table.insertRow(startRowIndex);
			rowLineDimensions.id = "rowLineDimensions";
			rowLineDimensions.innerHTML = "<th><label for='lineLengthValue'>Line Length x Width:</label></th><td><input type='number' id='lineLengthValue' name='lineLengthValue' min=0 style='width:25px' value=0><select id='lineLengthUnits' name='lineLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='lineWidthValue' name='lineWidthValue' min=0 style='width:25px' value=0><select id='lineWidthUnits' name='lineWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let lineSizeAHLScalingSelect = await createAHLSelect("lineSizeAHLScaling");

				let rowLineDimensionsAHL = table.insertRow(startRowIndex);
				rowLineDimensionsAHL.id = "rowLineDimensionsAHL";
				rowLineDimensionsAHL.innerHTML = "<th><label for='lineLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='lineLengthValueAHL' name='lineLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='lineWidthValueAHL' name='lineWidthValueAHL' min=0 style='width:25px' value=0>"+lineSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Panels"){
			let rowPanelsDimensions = table.insertRow(startRowIndex);
			rowPanelsDimensions.id = "rowPanelsDimensions";
			rowPanelsDimensions.innerHTML = "<th><label for='panelsNumber'>Panel Number and Side Length:</label></th><td><input type='number' id='panelsNumber' name='panelsNumber' min=0 style='width:25px' value=10> panels, <input type='number' id='panelsDimensionValue' name='panelsDimensionValue' min=0 style='width:25px' value=0><select id='panelsDimensionUnits' name='panelsDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let panelsNumberAHLScalingSelect = await createAHLSelect("panelsNumberAHLScaling");

				let rowPanelsDimensionsAHL = table.insertRow(startRowIndex);
				rowPanelsDimensionsAHL.id = "rowPanelsDimensionsAHL";
				rowPanelsDimensionsAHL.innerHTML = "<th><label for='panelsNumberAHL'>Increased Panels AHL:</label></th><td><input type='number' id='panelsNumberAHL' name='panelsNumberAHL' min=0 style='width:25px' value=0>"+panelsNumberAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Sphere"){
			let rowSphereDimensions = table.insertRow(startRowIndex);
			rowSphereDimensions.id = "rowSphereDimensions";
			rowSphereDimensions.innerHTML = "<th><label for='sphereDimensionValue'>Sphere Radius:</label></th><td><input type='number' id='sphereDimensionValue' name='sphereDimensionValue' min=0 style='width:25px' value=0><select id='sphereDimensionUnits' name='sphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let sphereSizeAHLScalingSelect = await createAHLSelect("sphereSizeAHLScaling");

				let rowSphereDimensionsAHL = table.insertRow(startRowIndex);
				rowSphereDimensionsAHL.id = "rowSphereDimensionsAHL";
				rowSphereDimensionsAHL.innerHTML = "<th><label for='sphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='sphereDimensionValueAHL' name='sphereDimensionValueAHL' min=0 style='width:25px' value=0>"+sphereSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
		else if(whichShape == "Wall"){
			let rowWallDimensions = table.insertRow(startRowIndex);
			rowWallDimensions.id = "rowWallDimensions";
			rowWallDimensions.innerHTML = "<th><label for='wallLengthValue'>Wall Length x Width x Height:</label></th><td><input type='number' id='wallLengthValue' name='wallLengthValue' min=0 style='width:25px' value=0><select id='wallLengthUnits' name='wallLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallWidthValue' name='wallWidthValue' min=0 style='width:25px' value=0><select id='wallWidthUnits' name='wallWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallHeightValue' name='wallHeightValue' min=0 style='width:25px' value=0><select id='wallHeightUnits' name='wallHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			startRowIndex++;

			if(checkEffectType()=="Spell"){
				let wallSizeAHLScalingSelect = await createAHLSelect("wallSizeAHLScaling");

				let rowWallDimensionsAHL = table.insertRow(startRowIndex);
				rowWallDimensionsAHL.id = "rowWallDimensionsAHL";
				rowWallDimensionsAHL.innerHTML = "<th><label for='wallLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='wallLengthValueAHL' name='wallLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallWidthValueAHL' name='wallWidthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallHeightValueAHL' name='wallHeightValueAHL' min=0 style='width:25px' value=0>"+wallSizeAHLScalingSelect+"</td>";
				startRowIndex++;                
			}
		}
	}
}

async function createTargetNumberToggle(){
	let table = document.getElementById("CreateSubeffectTable");

	if(document.getElementById("isTargetNumberUnlimited").checked){
		if(checkEffectType()=="Spell"){
			table.deleteRow(document.getElementById("rowTargetNumberAHL").rowIndex);            
		}

		document.getElementById("TargetNumber").setAttribute("disabled","");
	}
	else{
		if(checkEffectType()=="Spell"){
			let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling");

			let rowTargetNumberAHL = table.insertRow(document.getElementById("rowTargetNumber").rowIndex + 1);
			rowTargetNumberAHL.id = "rowTargetNumberAHL";
			rowTargetNumberAHL.innerHTML = "<th><label for='TargetNumberAHL'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL' name='TargetNumberAHL' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>";                
		}

		document.getElementById("TargetNumber").removeAttribute("disabled","");
	}
}

async function createMultitargetDistanceToggle(){
	let table = document.getElementById("CreateSubeffectTable");
	if(document.getElementById("isMultitargetDistanceUnlimited").checked){
		document.getElementById("MultitargetDistance").setAttribute("disabled","");
	}
	else{
		document.getElementById("MultitargetDistance").removeAttribute("disabled","");
	}
}

async function createTargetTable(primarySecondary){
	let table = document.getElementById("CreateSubeffectTable");
	
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
		clearUnusedTable("CreateSubeffectTable","Target","submitRow");
	}
}

async function createCreatureTargetTable(primarySecondary){
	let table = document.getElementById("CreateSubeffectTable");
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
	let table = document.getElementById("CreateSubeffectTable");
	
	let currentTargetCreatureTypeSelection = document.getElementById("targetCreatureTypes").value;
	let startRowIndex = document.getElementById("rowCreatureTypes").rowIndex;
	let nextRowIndex = startRowIndex+1;

	if(currentTargetCreatureTypeSelection == "All"){
		clearUnusedTable("CreateSubeffectTable","rowCreatureTypes","rowTargetSenses");
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
				clearUnusedTable("CreateSubeffectTable","rowInclusiveCreatureTypes","rowTargetSenses");
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
				clearUnusedTable("CreateSubeffectTable","rowCreatureTypes","rowExclusiveCreatureTypes");
			}
		}
	}
}

async function createTargetConditionTable(){
	let table = document.getElementById("CreateSubeffectTable");
	let startRowIndex = document.getElementById("rowTargetCondition").rowIndex;
	let conditionChoice = document.getElementById("isTargetCondition").value;
	let nextRowIndex = startRowIndex+1;

	if(conditionChoice == "None"){
		clearUnusedTable("CreateSubeffectTable","rowTargetCondition","rowTargetAbilityScore");
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
				clearUnusedTable("CreateSubeffectTable","rowInclusiveSetByCaster","rowTargetAbilityScore");
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
				clearUnusedTable("CreateSubeffectTable","rowTargetCondition","rowExclusiveConditions");
			}
		}
	}
}

async function createClassConditionRow(inclusiveExclusive){
	
}

async function createTargetAbilityScoreTable(){
	let table = document.getElementById("CreateSubeffectTable");
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
		clearUnusedTable("CreateSubeffectTable","rowTargetAbilityScore","rowTargetAlignment");
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
	let table = document.getElementById("CreateSubeffectTable");
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
		clearUnusedTable("CreateSubeffectTable","rowTargetAlignment","submitRow");
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateSubeffectTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);