function checkEffectType(){
	return document.getElementById("EffectType").value;
}

function createParentSubeffectRows(){
	let nextRowIndex = document.getElementById("rowParentSubeffect").rowIndex + 1;
	let ParentSubeffect = getParentSubeffect();

	if(ParentSubeffect == "NONE"){
		clearUnusedTable("CreateSubeffectTable","rowParentSubeffect","rowMitigation");

		let endRowIndex = document.getElementById("rowUsePriorTargets").rowIndex;
		document.getElementById(tableID).deleteRow(endRowIndex);
	}
	else{
		let PrereqSelectOptions = "<option value = ''>None</option>";
		let ParentSubeffectComponents = Object.keys(ParentSubeffect);

		if(ParentSubeffectComponents.includes("Attack")){
			PrereqSelectOptions = PrereqSelectOptions + "<option value='AttackHit'>Attack Hits</option><option value='AttackMiss'>Attack Misses</option>";
		}

		if(ParentSubeffectComponents.includes("SaveData")){
			PrereqSelectOptions = PrereqSelectOptions + "<option value='FailedSave'>Failed Save</option><option value='PassedSave'>Passed Save</option>";
		}

		if(ParentSubeffectComponents.includes("Check")){
			PrereqSelectOptions = PrereqSelectOptions + "<option value='FailedCheck'>Failed Check</option><option value='PassedCheck'>Passed Check</option>";
		}

		if(ParentSubeffectComponents.includes("Damage")){
			PrereqSelectOptions = PrereqSelectOptions + "<option value='Damage'>Deals Damage</option><option value='Healing'>Heals Target</option>";
		}

		if(ParentSubeffectComponents.includes("ConditionInfo")){
			PrereqSelectOptions = PrereqSelectOptions + "<option value='ConditionApplied'>Applies Condition</option>";
		}

		let rowPrereqsInnerHTML = "<th><label for='ParentPrereqs'>Requirement for This Subeffect to Occur:</label></th><td><select id='ParentPrereqs' name='ParentPrereqs' onchange='createParentPrereqRows()'>"+PrereqSelectOptions+"</select></td>";
		if(document.getElementById("rowParentPrereqs") == null){
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqs",rowPrereqsInnerHTML);
			nextRowIndex++;			
		}
		else{
			document.getElementById("rowParentPrereqs").innerHTML = rowPrereqsInnerHTML;
		}

		//Shift from adding prereqs to handling targeting here
		nextRowIndex = document.getElementById("Range").rowIndex;
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUsePriorTargets","<th><label for='UsePriorTargets'>Use Same Targets as Linked Effect:</label></th><td><input type='checkbox' id='UsePriorTargets' name='UsePriorTargets' onchange='createPriorTargetsRows("+'"CreateSubeffectTable","Prior"'+")'></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUsePriorOrigin","<th><label for='UsePriorOrigin'>New Subeffect Originates from Old Target:</label></th><td><input type='checkbox' id='UsePriorOrigin' name='UsePriorOrigin' onchange='createPriorOriginRows()'></td>");
		nextRowIndex++;
	}
}

function getParentSubeffect(){
	let ParentSubeffectNumber = Number(document.getElementById("ParentSubeffect").value);
//TODO: At this point, weapons fail because the subeffect created by the attack itself is not available for this function to see. May need to make an exception for weapons (and ammo?)
	if(ParentSubeffectNumber == 0){
		return "NONE";
	}
	else{
		let PriorSubeffects = JSON.parse(atob(document.getElementById("PriorSubeffects").value));
		let ParentSubeffect = PriorSubeffects[ParentSubeffectNumber-1];
		return ParentSubeffect;
	}
}

async function createParentPrereqRows(){
	let nextRowIndex = document.getElementById("rowParentPrereqs").rowIndex + 1;
	let PrereqChoice = document.getElementById("ParentPrereqs").value;
	
	clearUnusedTable("CreateSubeffectTable","rowParentPrereqs","rowMitigation");

	if(PrereqChoice == "AttackHit"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqAttackHitMargin'>Must Hit by At Least:</label></th><td><input type='number' id='PrereqAttackHitMargin' name='PrereqAttackHitMargin' min=0 value=0></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra2","<th><label for='PrereqAttackCrits'>Attack Must Crit:</label></th><td><input type='checkbox' id='PrereqAttackCrits' name='PrereqAttackCrits'></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "AttackMiss"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqAttackMissMargin'>Must Miss by At Least:</label></th><td><input type='number' id='PrereqAttackMissMargin' name='PrereqAttackMissMargin' min=0 value=0></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "PassedSave"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqSaveSucceedMargin'>Must Succeed by At Least:</label></th><td><input type='number' id='PrereqSaveSucceedMargin' name='PrereqSaveSucceedMargin' min=0 value=0></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "FailedSave"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqSaveFailMargin'>Must Fail by At Least:</label></th><td><input type='number' id='PrereqSaveFailMargin' name='PrereqSaveFailMargin' min=0 value=0></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "PassedCheck"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqCheckSucceedMargin'>Must Succeed by At Least:</label></th><td><input type='number' id='PrereqCheckSucceedMargin' name='PrereqCheckSucceedMargin' min=0 value=0></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "FailedCheck"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqCheckFailMargin'>Must Fail by At Least:</label></th><td><input type='number' id='PrereqCheckFailMargin' name='PrereqCheckFailMargin' min=0 value=0></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "ConditionApplied"){
		let ConditionsRequiredOptions = "<option value='All'>All Conditions</option><option value='Any'>Any Condition</option>";
		let ParentSubeffect = getParentSubeffect();
		let ParentSubeffectConditionInfo = ParentSubeffect.ConditionInfo;

		for(let tempCondition of ParentSubeffectConditionInfo.Conditions){
			ConditionsRequiredOptions = ConditionsRequiredOptions + "<option value='"+tempCondition.Name+"'>"+tempCondition.DisplayName+"</option>";
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqConditionsApplied'>Conditions that Must be Applied:</label></th><td><select id='PrereqConditionsApplied' name='PrereqConditionsApplied'>"+ConditionsRequiredOptions+"</select></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "Damage"){
		let ParentSubeffect = getParentSubeffect();
		let ParentSubeffectDamage = ParentSubeffect.Damage;
		let PriorDamageTypes = [];
		let PriorDamageTypeOptions = "<option value='TotalDamage'>All</option>";

		for(let tempInstance of ParentSubeffectDamage){
			let tempRequest = await fetch("macro:pm.GetDisplayName@lib:pm.a5e.Core",{method:"POST",body:"['"+tempInstance.DamageType+"','sb.DamageTypes']"});
			let tempDisplayType = await tempRequest.text();
			let tempTypeName = tempInstance.Name;
	
			if(PriorDamageTypes.includes(tempTypeName) == false){
				PriorDamageTypes = PriorDamageTypes.push(tempTypeName);
				PriorDamageTypeOptions = PriorDamageTypeOptions + "<option value='"+tempTypeName+"'>"+tempDisplayType+"</option>";
			}
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqDamageDealtMinimum'>Minimum Damage Dealt:</label></th><td><input type='number' id='PrereqDamageDealtMinimum' name='PrereqDamageDealtMinimum' value=1 min=1 style='width:35px'><select id='PrereqDamageDealtType' name='PrereqDamageDealtType'>"+PriorDamageTypeOptions+"</select></td>");
		nextRowIndex++;
	}
	else if(PrereqChoice == "Healing"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowParentPrereqExtra","<th><label for='PrereqHealingMinimum'>Minimum Healing Done:</label></th><td><input type='number' id='PrereqHealingMinimum' name='PrereqHealingMinimum' value=1 min=1 style='width:35px'></td>");
		nextRowIndex++;
	}
}

async function createMitigationTable(){
	let tableID = "CreateSubeffectTable";
	let referenceRow = document.getElementById("rowMitigation");
	let howMitigate = document.getElementById("howMitigate").value;

	if(howMitigate == "None"){
		deleteInterveningElements(referenceRow,document.getElementById("rowMitigationEnd").nextElementSibling);
	}
	else{
		if(document.getElementById("rowMitigationEnd") == null){
			let endRow = createTableRow(referenceRow,"rowMitigationEnd","<th colspan='2'></th>");
			endRow.classList.add("section-end");
		}

		deleteInterveningElements(referenceRow,document.getElementById("rowMitigationEnd"));

		if(howMitigate == "Attack"){
			if(checkEffectType() == "Spell"){
				referenceRow = createTableRow(referenceRow,"rowToHitMethod","<th><label for='ToHitMethod'>Method of Choosing To Hit:</label></th><select id='ToHitMethod' name='ToHitMethod' onchange='createToHitMethodRow("+'"'+tableID+'"'+")'><option value='Stat'>Stat-Based</option><option value='SpellAttack'>Spell Attack Bonus</option><option value='SetValue'>Preset Value</option></select></td>");
	
				document.getElementById("rowToHitMethod").setAttribute("hidden","");
				document.getElementById("ToHitMethod").value = "SpellAttack";
			}
			else{
				referenceRow = createTableRow(referenceRow,"rowToHitMethod","<th><label for='ToHitMethod'>Method of Choosing To Hit:</label></th><select id='ToHitMethod' name='ToHitMethod' onchange='createToHitMethodRow("+'"'+tableID+'"'+")'><option value='Stat'>Stat-Based</option><option value='SpellAttack'>Spell Attack Bonus</option><option value='SetValue'>Preset Value</option></select></td>");
	
				let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
				let AllAttributes = await request.json();
				let AttributeOptions = createHTMLSelectOptions(AllAttributes);
	
				referenceRow = createTableRow(referenceRow,"rowToHitBonus","<th><label for='ToHitStat'>Stat Used:</label></th><select id='ToHitStat' name='ToHitStat'>"+AttributeOptions+"</select></td>");
			}
	
			referenceRow = createTableRow(referenceRow,"rowMeleeRanged","<th><label for='MeleeRanged'>Melee or Ranged Attack:</label></th><select id='MeleeRanged' name='MeleeRanged'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");

			referenceRow = createTableRow(referenceRow,"rowCritThresh","<th>Crit Threshhold:</th><td><input type='number' id='CritThresh' name='CritThresh' max='20' min='1' value='20'></td>");
	
			referenceRow = createTableRow(referenceRow,"rowIsConditionalAdvantage","<th>Conditional (Dis)advantage:</th><input type='checkbox' id='isConditionalAttackAdvantage' name='isConditionalAttackAdvantage' onchange='createConditionalAttackAdvantageRows()'></td>");
		
			referenceRow = createTableRow(referenceRow,"rowIgnoreCoverBenefits","<th><label for='IgnoreCoverBenefit'>Ignore Cover Benefits?</label></th><td><input type='checkbox' id='IgnoreCoverBenefit' name='IgnoreCoverBenefit'></td>");
		}
		else if(howMitigate == "Save"){	
			let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: "[]"});
			let saveTypes = await request.json();
			let saveOptions = createHTMLSelectOptions(saveTypes);
		
			referenceRow = createTableRow(referenceRow,"rowSaveType","<th><label for='SaveType'>Save Type:</label></th><select id='SaveType' name='SaveType'>"+saveOptions+"</select></td>");
	
			if(checkEffectType() == "Spell"){
				referenceRow = createTableRow(referenceRow,"rowSaveDCMethod","<th><label for='SaveDCMethod'>Method of Choosing Save DC:</label></th><select id='SaveDCMethod' name='SaveDCMethod' onchange='createSaveDCMethodRow("+'"'+tableID+'"'+")'><option value='Stat'>Stat-Based</option><option value='SpellSave'>Spell Save DC</option><option value='SetValue'>Preset Value</option></select></td>");
	
				document.getElementById("rowSaveDCMethod").setAttribute("hidden","");
				document.getElementById("SaveDCMethod").value = "SpellSave";
			}
			else{
				referenceRow = createTableRow(referenceRow,"rowSaveDCMethod","<th><label for='SaveDCMethod'>Method of Choosing Save DC:</label></th><select id='SaveDCMethod' name='SaveDCMethod' onchange='createSaveDCMethodRow("+'"'+tableID+'"'+")'><option value='Stat'>Stat-Based</option><option value='SpellAttack'>Spell Attack Bonus</option><option value='SetValue'>Preset Value</option></select></td>");
	
				referenceRow = createTableRow(referenceRow,"rowSaveDC","<th><label for='SaveDCStat'>Stat Used:</label></th><select id='SaveDCStat' name='SaveDCStat'>"+saveOptions+"</select></td>");
			}
	
			referenceRow = createTableRow(referenceRow,"rowIsConditionalAdvantage","<th>Conditional (Dis)advantage:</th><input type='checkbox' id='isConditionalSaveAdvantage' name='isConditionalSaveAdvantage' onchange='createConditionalSaveAdvantageRows()'></td>");
	
			referenceRow = createTableRow(referenceRow,"rowIsConditionalAutomaticSave","<th>Conditional Auto-Success/Failure:</th><input type='checkbox' id='isConditionalAutomaticSave' name='isConditionalAutomaticSave' onchange='createConditionalAutomaticSaveRows()'></td>");
	
			referenceRow = createTableRow(referenceRow,"rowIsChooseFailure","<th><label for='isChooseFailure'>Can Choose to Fail:</label></th><input type='checkbox' id='isChooseFailure' name='isChooseFailure'></td>");
		
			referenceRow = createTableRow(referenceRow,"rowIgnoreCoverBenefits","<th><label for='IgnoreCoverBenefit'>Ignore Cover Benefits?</label></th><td><input type='checkbox' id='IgnoreCoverBenefit' name='IgnoreCoverBenefit'></td>");
	
			if(document.getElementById("isDamage").checked){
				for(let i=1; i <= document.getElementById("differentTypes").value; i++){
					let rowPrefix = "";
					if(document.getElementById("isAHL"+i).value == "0"){
						rowPrefix = "rowIsAHL";
					}
					else{
						rowPrefix = "rowAHLFlatBonus";
					}

					let referenceRow = document.getElementById(rowPrefix+i);
					referenceRow = createTableRow(referenceRow,"rowSaveMitigation"+i,"<th>Damage on Successful Save:</th><td><select id='saveMitigation"+i+"' name='saveMitigation"+i+"'><option value=2>None</option><option value=1>Half</option><option value=0>Full</option></select></td>");
				}
			}
			
			if(document.getElementById("isCondition").value != "None"){
				let referenceRow = document.getElementById("rowSummons").previousElementSibling;
				referenceRow = createTableRow(referenceRow,"rowConditionSave","<th><label for='conditionSaveEffect'>Conditions Applied on Save:</label></th><select id='conditionSaveEffect' name='conditionSaveEffect' onchange='createConditionSaveTable()'><option value='0'>All Applied</option><option value='1'>Some Applied</option><option value='2' selected>None Applied</option><option value='Different'>Different Condition Applied</option></select></td>");
			}
			
			if(document.getElementById("isMoveTarget").checked){
				let referenceRow = document.getElementById("rowMoveTargetAHLInfo");
				referenceRow = createTableRow(referenceRow,"rowSavePreventMove","<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td>");
			}
	
			if(document.getElementById("isSetHP").checked){
				let referenceRow = document.getElementById("rowSetHPAmount");
			
				referenceRow = createTableRow(referenceRow,"rowSavePreventSetHP","<th><label for='savePreventSetHP'>Save Prevents HP Change:</label></th><td><input type='checkbox' id='savePreventSetHP' name='savePreventSetHP'></td>");
			}
	
			if(document.getElementById("InstantKill").checked){
				let referenceRow = document.getElementById("rowInstantKill");
	
				referenceRow = createTableRow(referenceRow,"rowSavePreventInstantKill","<th><label for='savePreventInstantKill'>Save Prevents Instant Kill:</label></th><td><input type='checkbox' id='savePreventInstantKill' name='savePreventInstantKill'></td>");
			}
		}
		else if(howMitigate == "Check" || howMitigate == "ForceCheck"){
			let request = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ""});
			let checkList = await request.json();

			let requestAttr = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
			let attributeList = await requestAttr.json();

			let requestTool = await fetch("macro:pm.GetTools@lib:pm.a5e.Core", {method: "POST", body: ""});
			let toolList = await requestTool.json();

			let checkOptions = createHTMLSelectOptions(checkList) + "<option value='AthleticsAcrobatics'>Athletics or Acrobatics</option>" + createHTMLSelectOptions(attributeList) + "<option value='Multiple'>Multiple Options</option>";
		
			if(checkEffectType() == "Spell"){
				checkOptions = "<option value='SpellAttribute'>Spellcasting Attribute</option>" + checkOptions;
			}

			referenceRow = createTableRow(referenceRow,"rowCheckType","<th><label for='CheckType'>Check Type:</label></th><span id='CheckTypeInputSpan'><select id='CheckType' name='CheckType'>"+checkOptions+"</select></span></td>");
			document.getElementById("CheckType").addEventListener("change",function(){
				let allOptions = attributeList.concat(checkList);
				let allCheckOptions = createHTMLMultiselectOptions(allOptions,"MitigationCheckType");

				document.getElementById("CheckTypeInputSpan").innerHTML = "<div class='check-multiple' style='width:100%'>"+allCheckOptions+"</div>";
			});

			referenceRow = createTableRow(referenceRow,"rowCheckDCMethod","<th colspan='2'>Check DC = <input type='number' id='CheckDCBase' name='CheckDCBase' value='10' min='0' class='small-number'> + <select id='CheckDCStatBonus' name='CheckDCStatBonus'>"+createHTMLSelectOptions(attributeList)+createHTMLSelectOptions(checkList)+"</select> + <select id='CheckDCProfBonus' name='CheckDCProfBonus'><option value='Yes'>Proficiency Bonus</option><option value='No'>No Additional Proficiency</option></select><span id='CheckDCEffectLevelBonus'></span></th>");

			function toggleEffectLevelBonus(){
				let toggleOn = false;

				if(document.getElementById("TargetType") != null){
					if(document.getElementById("TargetType").value === "Effect"){
						toggleOn = true;
					}
				}

				if(document.getElementById("secondaryTargetType") != null){
					if(document.getElementById("secondaryTargetType").value === "Effect"){
						toggleOn = true;
					}

					document.getElementById("secondaryTargetType").addEventListener("change",toggleEffectLevelBonus);
				}

				if(document.getElementById("PriorTargetType") != null){
					//TODO: Needs additional data for prior effects (specifically what their targets were) available to read 
				}

				let levelBonusSpan = document.getElementById("CheckDCEffectLevelBonus");
				if(toggleOn){
					if(document.getElementById("CheckDCLevelBonusModifier") === null){
						levelBonusSpan.innerHTML = "+ Effect Level x<input type='number' id='CheckDCLevelBonusModifier' name='CheckDCLevelBonusModifier' value='1' min='0' class='small-number'>";						
					}
				}
				else{
					levelBonusSpan.innerHTML = "";
				}
			}

			if(document.getElementById("TargetType") != null){
				document.getElementById("TargetType").addEventListener("change",toggleEffectLevelBonus);
			}
			if(document.getElementById("secondaryTargetType") != null){
				document.getElementById("secondaryTargetType").addEventListener("change",toggleEffectLevelBonus);
			}
			if(document.getElementById("PriorTargetType") != null){
				document.getElementById("PriorTargetType").addEventListener("change",toggleEffectLevelBonus);
			}

			toggleEffectLevelBonus();

			if(false){
			referenceRow = createTableRow(referenceRow,"rowCheckDCMethod","<th><label for='CheckDCMethod'>Method of Choosing Check DC:</label></th><select id='CheckDCMethod' name='CheckDCMethod' onchange='createCheckDCMethodRow()'><option value='SetValue'>Preset Value</option><option value='Stat'>Stat-Based</option><option value='Contested'>Contested Check</option></select></td>");

			document.getElementById("CheckDCMethod").addEventListener("change",function(){
				let referenceRow = document.getElementById("rowCheckDCMethod");
				let methodChoice = document.getElementById("CheckDCMethod").value;

				if(referenceRow.nextElementSibling.id === "rowCheckDC"){
					referenceRow.nextElementSibling.remove();
				}

				if(methodChoice === "SetValue"){

				}
				else if(methodChoice === "Stat"){
					referenceRow = createTableRow(referenceRow,"rowCheckDC","<th><label for='CheckDCStat'>Stat Used:</label></th><select id='isCheckDCStatProficiency'</td>");
				}
				else if(methodChoice === "Contested"){

				}
				else if(methodChoice === "EffectLevel"){
					referenceRow = createTableRow(referenceRow,"rowCheckDC","<th><label for='CheckDCStat'>Stat Used:</label></th><select id='CheckDCStat' name='CheckDCStat'>"+createHTMLSelectOptions(attributeList)+"</select></td>");
				}
			});				
			}

		}
	}

	if(document.getElementById("howMitigate").value != "Save"){
		if(document.getElementById("isDamage").checked){
			for(let i=1; i <= document.getElementById("differentTypes").value; i++){
				document.getElementById("rowSaveMitigation"+i).remove();
			}
		}
		
		if(document.getElementById("isCondition").value != "None"){
			if(document.getElementById("rowConditionSave").value == 1){
				document.getElementById("rowConditionsNullified").remove();
			}
			document.getElementById("rowConditionSave").remove();
		}
		
		if(document.getElementById("isMoveTarget").checked){
			document.getElementById("rowSavePreventMove").remove();
		}
		
		if(document.getElementById("isSetHP").checked){
			document.getElementById("rowSavePreventSetHP").remove();
		}
		
		if(document.getElementById("InstantKill").checked){
			document.getElementById("rowSavePreventInstantKill").remove();
		}
	}
}

async function createToHitMethodRow(tableID){
	let nextRowIndex = document.getElementById("rowToHitMethod").rowIndex + 1;
	let MethodChoice = document.getElementById("ToHitMethod").value;
	clearUnusedTable(tableID,"rowToHitMethod","rowMeleeRanged");

	if(MethodChoice == "Stat"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
		let AllAttributes = await request.json();
		let AttributeOptions = createHTMLSelectOptions(AllAttributes);

		addTableRow(tableID,nextRowIndex,"rowToHitBonus","<th><label for='ToHitStat'>Stat Used:</label></th><select id='ToHitStat' name='ToHitStat'>"+AttributeOptions+"</select></td>");
		nextRowIndex++;
	}
	else if(MethodChoice == "SetValue"){
		addTableRow(tableID,nextRowIndex,"rowToHitBonus","<th><label for='ToHitBonus'>To Hit Bonus:</label></th><input type='number' id='ToHitBonus' name='ToHitBonus' value=0></td>");
		nextRowIndex++;
	}
} 

async function createSaveDCMethodRow(tableID){
	let nextRowIndex = document.getElementById("rowSaveDCMethod").rowIndex + 1;
	let MethodChoice = document.getElementById("SaveDCMethod").value;
	clearUnusedTable(tableID,"rowSaveDCMethod","rowIsConditionalAdvantage");

	if(MethodChoice == "Stat"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
		let AllAttributes = await request.json();
		let AttributeOptions = createHTMLSelectOptions(AllAttributes);

		addTableRow(tableID,nextRowIndex,"rowSaveDC","<th><label for='SaveDCStat'>Stat Used:</label></th><select id='SaveDCStat' name='SaveDCStat'>"+AttributeOptions+"</select></td>");
		nextRowIndex++;
	}
	else if(MethodChoice == "SetValue"){
		addTableRow(tableID,nextRowIndex,"rowSaveDC","<th><label for='SaveDC'>Save DC:</label></th><input type='number' id='SaveDC' name='SaveDC' value=0></td>");
		nextRowIndex++;
	}
} 

function createAHLSelect(ahlSelectID){
	let ahlSelectHTML = "";
	if(document.getElementById("ExtraDataSpellLevel")!=null){
		if(document.getElementById("ExtraDataSpellLevel").value == "0"){
			ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Interval</option><option value='2'>Every Other Interval</option><option value='3'>Every Three Intervals</option></select>";
		}
		else{
			ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select>";
		}
	}
	else{
		ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select>";		
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

	let damageTypeOptions = await generateDamageTypeOptions();

	damageTypeOptions = damageTypeOptions + "<option value='Multiple Options'>Multiple Options</option>";

	let UsePriorDamageButton = "";

	if(document.getElementById("ParentSubeffect") != null){
		let ParentSubeffect = getParentSubeffect();
		if(ParentSubeffect != "NONE"){
			let ParentSubeffectHasDamage = Object.keys(ParentSubeffect).includes("Damage");

			if(ParentSubeffectHasDamage){
				UsePriorDamageButton = " <b>OR</b> <input type='button' id='PriorDamageButton' name='PriorDamageButton' value='Base On Prior Damage' onclick='switchToPriorDamage(1)'>";
			}			
		}
	}

	let damageRowHTML = generateDamageRowText(damageTypeNumber,damageTypeOptions,UsePriorDamageButton);
	let damageRow = table.insertRow(buttonRowIndex);
	damageRow.id = "DamageSet"+damageTypeNumber;
	damageRow.innerHTML = damageRowHTML;
	
	let modBonusRow = table.insertRow(buttonRowIndex+1);
	modBonusRow.id = "rowModBonus"+damageTypeNumber;
	modBonusRow.innerHTML = "<th>Add Ability Score Modifier:</th><td><input type='checkbox' id='ModBonus"+damageTypeNumber+"' name='ModBonus"+damageTypeNumber+"' value=1></td>";
	
	let isAHLRow = table.insertRow(buttonRowIndex+2);
	isAHLRow.id = "rowIsAHL"+damageTypeNumber;
   
	if(checkEffectType()=="Spell"){
		if(document.getElementById("ExtraDataSpellLevel").value == "0"){
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

function generateDamageRowText(damageTypeNumber,damageTypeOptions,UsePriorDamageButton){
	return "<th text-align='center' colspan='2'><input type='number' id='DamageDieNum"+damageTypeNumber+"' name='DamageDieNum"+damageTypeNumber+"' value=1 min=0 style='width:25px'> d <input type='number' id='DamageDieSize"+damageTypeNumber+"' name='DamageDieSize"+damageTypeNumber+"' value=6 style='width:25px'> <b>+</b> <input type='number' id='DamageFlatBonus"+damageTypeNumber+"' name='DamageFlatBonus"+damageTypeNumber+"' value=0 style='width:25px'><select id='DamageType"+damageTypeNumber+"' name='DamageType"+damageTypeNumber+"' onchange='createTypeOptions("+damageTypeNumber+")'>"+damageTypeOptions+"</select> Damage"+UsePriorDamageButton+"</th>";
}

async function generateDamageTypeOptions(){
	let request = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: "['DisplayName','json']"});
	let damageTypes = await request.json();

	let damageTypeOptions = "";
	for(let tempType of damageTypes){
		damageTypeOptions = damageTypeOptions + "<option value='"+tempType+"'>"+tempType+"</option>";
	}
	damageTypeOptions = damageTypeOptions + "<option value='Healing'>Healing</option><option value='TempHP'>Temp HP</option>";

	return damageTypeOptions;
}

async function switchToPriorDamage(damageTypeNumber){
	let damageTypeOptions = await generateDamageTypeOptions();
	let ParentSubeffect = getParentSubeffect();
	let ParentSubeffectDamage = ParentSubeffect.Damage;
	let PriorDamageTypes = [];
	let PriorDamageTypeOptions = "<option value='TotalDamage'>All</option>";

	for(let tempInstance of ParentSubeffectDamage){
		let tempRequest = await fetch("macro:pm.GetDisplayName@lib:pm.a5e.Core",{method:"POST",body:"['"+tempInstance.DamageType+"','sb.DamageTypes']"});
		let tempDisplayType = await tempRequest.text();
		let tempTypeName = tempInstance.DamageType;

		if(PriorDamageTypes.includes(tempTypeName) == false){
			PriorDamageTypes = PriorDamageTypes.push(tempTypeName);
			PriorDamageTypeOptions = PriorDamageTypeOptions + "<option value='"+tempTypeName+"'>"+tempDisplayType+"</option>";
		}
	}

	document.getElementById("DamageSet"+damageTypeNumber).innerHTML = "<th text-align='center' colspan='2'> <input type='number' id='PriorDamagePercent"+damageTypeNumber+"' name='PriorDamagePercent"+damageTypeNumber+"' min=0 max=100 style='width:30px' value=100>% of <select id='PriorDamageType"+damageTypeNumber+"' name='PriorDamageType"+damageTypeNumber+"'>"+PriorDamageTypeOptions+"</select> Damage dealt as <select id='DamageType"+damageTypeNumber+"' name='DamageType"+damageTypeNumber+"'>"+damageTypeOptions+"</select> Damage, <b>OR</b> <input type='button' id='IndependentDamageButton' name='IndependentDamageButton' value='Indepenent Damage' onclick='switchToIndependentDamage("+damageTypeNumber+")'>";
}

async function switchToIndependentDamage(damageTypeNumber){
	let damageTypeOptions = await generateDamageTypeOptions();
	let UsePriorDamageButton = " <b>OR</b> <input type='button' id='PriorDamageButton' name='PriorDamageButton' value='Base On Prior Damage' onclick='switchToPriorDamage("+damageTypeNumber+")'>";
	let newInnerHTML = generateDamageRowText(damageTypeNumber,damageTypeOptions,UsePriorDamageButton);

	document.getElementById("DamageSet"+damageTypeNumber).innerHTML = newInnerHTML;
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
	let tableID = document.getElementById("rowCondition").closest("table").id;
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowCondition").rowIndex + 1;
	let conditionChoice = document.getElementById("isCondition").value;

	if(conditionChoice == "None"){
		clearUnusedTable(tableID,"rowCondition","rowSummons");
	}
	else{
		let alreadyAlwaysAddedTest = (table.rows.namedItem("rowConditionsAlwaysAdded") != null);
		let alreadyOptionsTest = (table.rows.namedItem("rowConditionOptions") != null);
		let alreadyEndInfoTest = (table.rows.namedItem("rowConditionSameDuration") != null || table.rows.namedItem("rowConditionDuration") != null);
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
				clearUnusedTable(tableID,"rowConditionOptions","rowIsAura");
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
					let conditionAHLScalingSelect = createAHLSelect("ConditionOptionsNumberAHLScaling");                   
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
				clearUnusedTable(tableID,"rowCondition","rowConditionOptions");
			}
		}

		if(!alreadyEndInfoTest){
			addTableRow(tableID,nextRowIndex,"rowIsAura","<th><label for='isAura'>Condition is an Aura:</label></th><td><input type='checkbox' id='isAura' name='isAura' onchange='createAuraRows()'></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowIsAuraEnd","");
			document.getElementById("rowIsAuraEnd").setAttribute("hidden","");
			nextRowIndex++;

			createTableRow(document.getElementById("rowIsAuraEnd"),"rowIsConditionTiered","<th><label for='isConditionTiered'>Can Set Condition at Tier Over 1:</label></th><input type='checkbox' id='isConditionTiered' name='isConditionTiered' onchange='createConditionTierRows()'></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowConditionSameDuration","<th><label for='isConditionSameDuration'>Duration is Same as Spell's?</label></th><input type='checkbox' id='isConditionSameDuration' name='isConditionSameDuration' onchange='conditionAlternateDuration()' checked></td>");
			nextRowIndex++;

			if(checkEffectType()!="Spell"){
				document.getElementById("rowConditionSameDuration").setAttribute("hidden","");
				document.getElementById("rowConditionSameDuration").removeAttribute("checked");
				conditionAlternateDuration();
				nextRowIndex++;
			}

			addTableRow(tableID,nextRowIndex,"rowConditionAdvancePoint","<th><label for='ConditionAdvancePoint'>When Duration Advances:</label></th><select id='ConditionAdvancePoint' name='ConditionAdvancePoint'><option value='EndofTurn'>End of Target's Turn</option><option value='StartofTurn'>Start of Target's Turn</option><option value='EndofSetByTurn'>End of User's Turn</option><option value='StartofSetByTurn'>Start of User's Turn</option><option value='StartofSetByTurn'>Not Specified</option></select></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowIsConditionNonDurationEnd","<th><label for='isConditionNonDurationEnd'>May End Separate from Duration?</label></th><input type='checkbox' id='isConditionNonDurationEnd' name='isConditionNonDurationEnd' onchange='createConditionNonDurationEnd()'></td>");
			nextRowIndex++;
		}

		if(document.getElementById("howMitigate").value == "Save" && !alreadySaveTest){
			let saveRowIndex = document.getElementById("rowSummons").rowIndex;
			let rowConditionSave = table.insertRow(saveRowIndex);
			rowConditionSave.id = "rowConditionSave";
			rowConditionSave.innerHTML = "<th><label for='conditionSaveEffect'>Conditions Applied on Save:</label></th><select id='conditionSaveEffect' name='conditionSaveEffect' onchange='createConditionSaveTable()'><option value='0'>All Applied</option><option value='1'>Some Applied</option><option value='2' selected>None Applied</option><option value='Different'>Different Condition Applied</option></select></td>";
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
	let isSameDuration = false;
	let nextRowIndex = document.getElementById("rowConditionSameDuration").rowIndex + 1;

	if(checkEffectType()=="Spell"){
		isSameDuration = document.getElementById("isConditionSameDuration").checked;
	}

	if(isSameDuration){
		clearUnusedTable("CreateSubeffectTable","rowConditionSameDuration","rowConditionAdvancePoint");
	}
	else{
		let durationOptionsArray = ["Instantaneous","1 Round","1 Minute","10 Minutes","1 Hour","8 Hours","24 Hours","10 Days","Until Dispelled","Custom"];
		let durationOptions = "";
		for(let option of durationOptionsArray){
			durationOptions = durationOptions + "<option value='"+option+"'>"+option+"</option>";
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowConditionDuration","<th><label for='ConditionDuration'>Condition Duration:</label></th><select id='ConditionDuration' name='ConditionDuration' onchange='createCustomDurationRows("+'"CreateSubeffectTable","ConditionDuration","rowConditionAdvancePoint"'+")'>"+durationOptions+"</select></td>");
	}
}

async function createConditionNonDurationEnd(){
	let table = document.getElementById("rowIsConditionNonDurationEnd").closest("table");
	let tableID = table.id;
	let hasOtherEndOptions = document.getElementById("isConditionNonDurationEnd").checked;
	let nextRowIndex = document.getElementById("rowIsConditionNonDurationEnd").rowIndex + 1;

	if(hasOtherEndOptions){
		addTableRow(tableID,nextRowIndex,"rowEndConditionInstancesLabel","<th colspan=2 text-align='center'>Instances When Condition Can End</th>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowConditionNonDurationEndButtons","<th colspan=2><input type='button' value='Add Instance' onclick='addConditionEndInstanceRow()'><input type='button' value='Remove Instance' onclick='removeConditionEndInstanceRow()'><input type='hidden' id='conditionEndInstanceNumber' name='conditionEndInstanceNumber' value=0></th>");
		nextRowIndex++;

		addConditionEndInstanceRow();
	}
	else{
		let endRowID = document.getElementById("rowConditionNonDurationEndButtons").nextElementSibling.id;

		clearUnusedTable(tableID,"rowIsConditionNonDurationEnd",endRowID)
	}
}

async function createConditionEndInstanceResolutionType(whichInstance){
	let ResolutionType = document.getElementById("conditionEndInstanceSuccessRequired"+whichInstance).value;

	if(ResolutionType == ""){
		document.getElementById("conditionEndInstanceDetails"+whichInstance).innerHTML = "";
	}
	else if(ResolutionType == "Check"){
		let requestAttr = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await requestAttr.json();

		let request = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ""});
		let checkList = await request.json();

		let checkOptions = createHTMLSelectOptions(checkList) + "<option value='AthleticsAcrobatics'>Athletics or Acrobatics</option>" + createHTMLSelectOptions(attributeList);
		
		let checkInput = "<select id='conditionEndInstanceResolution"+whichInstance+"' name='conditionEndInstanceResolution"+whichInstance+"'>"+checkOptions+"</select>";
		document.getElementById("conditionEndInstanceDetails"+whichInstance).innerHTML = checkInput;
	}
	else if(ResolutionType == "Save"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();
		let saveOptions = createHTMLSelectOptions(attributeList);
		
		let saveInput = "<select id='conditionEndInstanceResolution"+whichInstance+"' name='conditionEndInstanceResolution"+whichInstance+"'>"+saveOptions+"</select>";
		document.getElementById("conditionEndInstanceDetails"+whichInstance).innerHTML = saveInput;
	}
}

function addConditionEndInstanceRow(){
	let tableID = document.getElementById("rowConditionNonDurationEndButtons").closest("table").id;
	let nextRowIndex = document.getElementById("rowConditionNonDurationEndButtons").rowIndex;
	let currentInstanceNumber = Number(document.getElementById("conditionEndInstanceNumber").value);

	let instanceOptionsArray = [
		{
			"Name":"EndTurn",
			"DisplayName":"End of Turn"
		},
		{
			"Name":"StartTurn",
			"DisplayName":"Start of Turn"
		},
		{
			"Name":"Action",
			"DisplayName":"Using a Dedicated Action"
		},
		{
			"Name":"ActionOther",
			"DisplayName":"Other Creature Uses Action"
		},
		{
			"Name":"AfterAttack",
			"DisplayName":"Attacking"
		},
		{
			"Name":"AfterSpell",
			"DisplayName":"Casting a Spell"
		},
		{
			"Name":"AfterForceSave",
			"DisplayName":"Forcing a Saving Throw"
		},
		{
			"Name":"AfterDamage",
			"DisplayName":"Dealing Damage"
		},
		{
			"Name":"AfterMoving",
			"DisplayName":"Movement"
		},
		{
			"Name":"AfterAttacked",
			"DisplayName":"Being Attacked"
		},
		{
			"Name":"AfterDamaged",
			"DisplayName":"Being Damaged"
		},
		{
			"Name":"TempHPLost",
			"DisplayName":"Losing all Temp HP"
		},
		{
			"Name":"AfterShortRest",
			"DisplayName":"Short Rest"
		},
		{
			"Name":"AfterLongRest",
			"DisplayName":"Long Rest"
		},
		{
			"Name":"AfterGainCondition",
			"DisplayName":"Gaining Another Condition"
		},
		{
			"Name":"AfterEndCondition",
			"DisplayName":"Ending Another Condition"
		},
		{
			"Name":"AfterChangeEquipment",
			"DisplayName":"Changing Equipment"
		}
	]
	let instanceOptions = createHTMLSelectOptions(instanceOptionsArray);

	let endConditionOptions = "<option value='0'>Always</option><option value='1'>Conditionally</option>";

	addTableRow(tableID,nextRowIndex,"rowConditionNonDurationEndInstance"+currentInstanceNumber,"<th colspan=2>On <select id='conditionNonDurationEndInstance"+currentInstanceNumber+"' name='conditionNonDurationEndInstance"+currentInstanceNumber+"'>"+instanceOptions+"</select><select id='isConditionEndInstanceConditional"+currentInstanceNumber+"' name='isConditionEndInstanceConditional"+currentInstanceNumber+"' onchange='createConditionEndInstanceConditions("+currentInstanceNumber+")'>"+endConditionOptions+"</select> Ends <select id='conditionEndInstanceSuccessRequired"+currentInstanceNumber+"' name='conditionEndInstanceSuccessRequired"+currentInstanceNumber+"' onchange='createConditionEndInstanceResolutionType("+'"'+currentInstanceNumber+'"'+")'><option value=''>Automatically</option><option value='Save'>With Save</option><option value='Check'>With Check</option></select><span id='conditionEndInstanceDetails"+currentInstanceNumber+"'></span></th>");
	nextRowIndex++;

	document.getElementById("conditionEndInstanceNumber").value = currentInstanceNumber + 1;
}

function removeConditionEndInstanceRow(){
	let currentInstanceNumber = Number(document.getElementById("conditionEndInstanceNumber").value);

	if(currentInstanceNumber > 0){
		let buttonsRow = document.getElementById("rowConditionNonDurationEndButtons");
		let currentRowID = buttonsRow.id;
		let newInstanceNumber = currentInstanceNumber - 1;

		let targetRowID = "rowConditionNonDurationEndInstance"+newInstanceNumber;

		while(currentRowID != targetRowID){
			currentRowID = buttonsRow.previousElementSibling.id;
			buttonsRow.previousElementSibling.remove();
		}

		document.getElementById("conditionEndInstanceNumber").value = currentInstanceNumber - 1;
	}
}

function createAuraRows(){
	let tableID = document.getElementById("rowIsAura").closest("table").id;

	if(document.getElementById("isAura").checked){
		createTargetingRows(tableID,"rowIsAuraEnd","Aura");

		document.getElementById("RangeTypeAura").value = "SelfRanged";
		document.getElementById("RangeTypeAura").onchange();
		document.getElementById("RangeAura").setAttribute("hidden","");

		document.getElementById("AoEAura").setAttribute("hidden","");

		document.getElementById("MustTargetAllAura").checked = true;

		document.getElementById("isTargetNumberUnlimitedAura").checked = true;
		document.getElementById("isTargetNumberUnlimitedAura").onchange();

		document.getElementById("rowMissilesAura").setAttribute("hidden","");
	}
	else{
		clearUnusedTable(tableID,"rowIsAura","rowIsAuraEnd");
	}
}

function createConditionTierRows(){
	let isConditionTiered = document.getElementById("isConditionTiered").checked;
	if(isConditionTiered){
		createTableRow(document.getElementById("rowIsConditionTiered"),"rowConditionTier","<th><label for='ConditionTier'>Condition Tier:</label></th><td><input type='number' id='ConditionTier' name='ConditionTier' value=1 min=1 style='width:25px'><span id='ConditionTierAHLSpan'></span></td>");
		if(checkEffectType() == "Spell"){
			let tierAHLSelect = createAHLSelect("ConditionTierAHLScaling");
			document.getElementById("ConditionTierAHLSpan").innerHTML = " + <input type='number' id='ConditionTierAHL' name='ConditionTierAHL' value=0 min=0 style='width:25px'>"+tierAHLSelect;
		}
	}
	else{
		document.getElementById("rowConditionTier").remove();
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

function createUseResourceRows(){
	if(document.getElementById("isUseResource").checked){
		let nextRowIndex = document.getElementById("rowIsUseResource").rowIndex + 1;

		if(checkEffectType()!="Spell"){
			addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsUseUniqueResource","<th><label for='isUseUniqueResource'>Uses this Feature's Resource:</label></th><td><select id='isUseUniqueResource' name='isUseUniqueResource' onchange='createUniqueResourceRows()'><option value='0'>No</option><option value='1'>Yes, Main</option><option value='2'>Yes, Backup</option></select></td>");
			nextRowIndex++;

			addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsUseSpellSlots","<th><label for='isUseSpellSlots'>Uses Spell Slots:</label></th><td><select id='isUseSpellSlots' name='isUseSpellSlots' onchange='createUseSpellSlotRows()'><option value='0'>No</option><option value='1'>Yes, Main</option><option value='2'>Yes, Backup</option></select></td>");
			nextRowIndex++;
		}

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsUseHitDice","<th><label for='isUseHitDice'>Uses Hit Dice:</label></th><td><select id='isUseHitDice' name='isUseHitDice' onchange='createUseHitDiceRows()'><option value='0'>No</option><option value='1'>Yes, Main</option><option value='2'>Yes, Backup</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsUseOtherFeatureResource","<th><label for='isUseOtherFeatureResource'>Uses Other Feature Resources:</label></th><td><select id='isUseOtherFeatureResource' name='isUseOtherFeatureResource' onchange='createOtherFeatureResourceRows()'><option value='0'>No</option><option value='1'>Yes, Main</option><option value='2'>Yes, Backup</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowToggleTimeResource","<th><label for='isToggleTimeResource'>Expends Time Resource:</label></th><td><select id='isToggleTimeResource' name='isToggleTimeResource' onchange=''><option value='0'>No</option><option value='1'>Yes, Turns On</option><option value='2'>Yes, Turns Off</option></select></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsUseResource","rowUncommonEffects");
	}
}

function createUniqueResourceRows(){
	if(document.getElementById("isUseUniqueResource").value != "0" && document.getElementById("rowUseUniqueResourceRange") == null){
		let nextRowIndex = document.getElementById("rowIsUseUniqueResource").rowIndex + 1;

		//TODO: Add a check here to see if the feature has multiple resources, if so pick which one to use

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUseUniqueResourceRange","<th><label for='UseUniqueResourceMin'>Usable Unique Resource at Once:</label></th><td><input type='number' id='UseUniqueResourceMin' name='UseUniqueResourceMin' min=1 value=1 style='width:25px'> - <input type='number' id='UseUniqueResourceMax' name='UseUniqueResourceMax' min=1 value=1 style='width:25px'><input type='checkbox' id='isNoUniqueResourceUseLimit' name='isNoUniqueResourceUseLimit' onchange='toggleFieldEnabled("+'"UseUniqueResourceMax","isNoUniqueResourceUseLimit"'+")'> No Limit</td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUseUniqueResourceIncrements","<th><label for='UseUniqueResourceIncrements'>Spend Resource in Increments of:</label></th><td><input type='number' id='UseUniqueResourceIncrements' name='UseUniqueResourceIncrements' min=1 value=1 style='width:25px'></td>");
		nextRowIndex++;
	}
	else{
		if(document.getElementById("isUseUniqueResource").value == "0"){
			clearUnusedTable("CreateSubeffectTable","rowIsUseUniqueResource","rowIsUseSpellSlots");
		}
	}
}

function createUseSpellSlotRows(){
	if(document.getElementById("isUseSpellSlots").value != "0" && document.getElementById("rowUseSpellSlotRange") == null){
		let nextRowIndex = document.getElementById("rowIsUseSpellSlots").rowIndex + 1;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUseSpellSlotRange","<th><label for='UseSpellSlotMin'>Range of Usable Spell Slots:</label></th><td><input type='number' id='UseSpellSlotMin' name='UseSpellSlotMin' min=1 value=1 style='width:25px'> - <input type='number' id='UseSpellSlotMax' name='UseSpellSlotMax' min=1 value=9 style='width:25px' disabled><input type='checkbox' id='isNoSpellSlotUseLimit' name='isNoSpellSlotUseLimit' onchange='toggleFieldEnabled("+'"UseSpellSlotMax","isNoSpellSlotUseLimit"'+")' checked> No Limit</td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsUseSpellSlots","rowIsUseHitDice");
	}
}

function createUseHitDiceRows(){
	if(document.getElementById("isUseHitDice").value != "0" && document.getElementById("rowUseHitDiceRange") == null){
		let nextRowIndex = document.getElementById("rowIsUseHitDice").rowIndex + 1;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUseHitDiceRange","<th><label for='UseHitDiceMin'>Range of Usable Hit Dice:</label></th><td><input type='number' id='UseHitDiceMin' name='UseHitDiceMin' min=1 value=1 style='width:25px'> - <input type='number' id='UseHitDiceMax' name='UseHitDiceMax' min=1 value=5 style='width:25px'><input type='checkbox' id='isNoHitDiceUseLimit' name='isNoHitDiceUseLimit' onchange='toggleFieldEnabled("+'"UseHitDiceMax","isNoHitDiceUseLimit"'+")'> No Limit</td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowUseHitDiceIncrements","<th><label for='UseHitDiceIncrements'>Spend Hit Dice in Increments of:</label></th><td><input type='number' id='UseHitDiceIncrements' name='UseHitDiceIncrements' min=1 value=1 style='width:25px'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsUseHitDice","rowIsUseOtherFeatureResource");
	}
}

function createOtherFeatureResourceRows(){
	if(document.getElementById("isUseOtherFeatureResource").value != "0"){
		let nextRowIndex = document.getElementById("rowIsUseOtherFeatureResource").rowIndex + 1;

		//In addition to the UseUniqueResource input above, will need option for using the name only and not subclass info (e.g. Channel Divinity)
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsUseOtherFeatureResource","rowToggleTimeResource");
	}
}

async function createUncommonEffectsRows(){
	let referenceRow = document.getElementById("rowUncommonEffects");

	if(document.getElementById("isUncommonEffects").checked){
		referenceRow = createTableRow(referenceRow,"rowModifyD20","<th><label for='isModifyD20'>Modifies d20 Tests?</label></th><td><input type='checkbox' id='isModifyD20' name='isModifyD20' onchange='createModifyD20Rows()'></td>");

		referenceRow = createTableRow(referenceRow,"rowModifyDamage","<th><label for='isModifyDamageRoll'>Modifies Damage Rolls?</label></th><td><input type='checkbox' id='isModifyDamageRoll' name='isModifyDamageRoll' onchange='createModifyDamageRollRows()'></td>");

		referenceRow = createTableRow(referenceRow,"rowAffectCondition","<th><label for='isAffectCondition'>Affects Active Conditions?</label></th><td><select id='isAffectCondition' name='isAffectCondition' onchange='createAffectConditionRows()'><option value='No'>No Effect</option><option value='End'>End Conditions</option><option value='Suppress'>Suppress Conditions</option><option value='Shorten'>Shorten Conditions</option><option value='Prolong'>Prolong Conditions</option></select></td>");

		referenceRow = createTableRow(referenceRow,"rowAffectSpell","<th><label for='isAffectSpell'>Affects Spell Effects?</label></th><td><select id='isAffectSpell' name='isAffectSpell' onchange='createAffectSpellRows()'><option value='No'>No Effect</option><option value='End'>End Spells</option><option value='Suppress'>Suppress Spells</option><option value='Shorten'>Shorten Spells</option><option value='Prolong'>Prolong Spells</option></select></td>");

		referenceRow = createTableRow(referenceRow,"rowIsLight","<th><label for='isLight'>Creates a Light or Darkness?</label></th><td><input type='checkbox' id='isLight' name='isLight' onchange='toggleLightTable("+'"rowIsLight","rowIsMoveTarget"'+")'></td>");

		referenceRow = createTableRow(referenceRow,"rowIsMoveTarget","<th><label for='isMoveTarget'>Moves the Target?</label></th><td><input type='checkbox' id='isMoveTarget' name='isMoveTarget' value=1 onchange='createMoveTargetTable()'></td>");

		referenceRow = createTableRow(referenceRow,"rowIsTransform","<th><label for='isTransform'>Transform Target?</label></th><td><select id='isTransform' name='isTransform' onchange='createTransformRows()'><option value=''>No</option><option value='Single'>Single Specific Creature</option><option value='Options'>Creature from List</option><option value='Unique'>Creature Unique to Feature</option><option value='Criteria'>Creature Based on Criteria</option><option value='Cosmetic'>Change Appearance Only</option></select></td>");
		
		referenceRow = createTableRow(referenceRow,"rowSetHP","<th><label for='isSetHP'>Set Target's Current HP?</label></th><td><input type='checkbox' id='isSetHP' name='isSetHP' onchange='createSetHPRows()'></td>");
		
		referenceRow = createTableRow(referenceRow,"rowIsDropItems","<th><label for='isDropItems'>Target Drops Held Items?</label></th><td><input type='checkbox' id='isDropItems' name='isDropItems'></td>");
		document.getElementById("isDropItems").addEventListener("change",function(ev){
			createDropHeldItemRows();
		});

		referenceRow = createTableRow(referenceRow,"rowInstantKill","<th><label for='InstantKill'>Instantly Kills Target?</label></th><td><input type='checkbox' id='InstantKill' name='InstantKill' onchange='createInstantKillRows()'></td>");

		referenceRow = createTableRow(referenceRow,"rowIsDifficultTerrain","<th><label for='isDifficultTerrain'>Creates Difficult Terrain?</label></th><td><input type='checkbox' id='isDifficultTerrain' name='isDifficultTerrain' onchange='createDifficultTerrainRows("+'"CreateSubeffectTable"'+")'></td>");

		referenceRow = createTableRow(referenceRow,"rowIsCreateObject","<th><label for='isCreateObject'>Creates an Object?</label></th><td><select id='isCreateObject' name='isCreateObject' onchange='createCreateObjectTable()'><option value='No'>No</option><option value='Unique'>Unique Item</option><option value='Specific'>Specific Item</option><option value='Type'>Items by Criteria</select></td>");

		referenceRow = createTableRow(referenceRow,"rowIsWeaponAttack","<th><label for='isWeaponAttack'>Makes a Weapon Attack?</label></th><td><input type='checkbox' id='isWeaponAttack' name='isWeaponAttack' value=1 onchange='createWeaponAttackTable()'></td>");

		let effectType = checkEffectType();
		if(effectType == "Object" || effectType == "Weapon"){
			referenceRow = createTableRow(referenceRow,"rowIsActivateItem","<th><label for='isActivateItem'>Activates this Item:</label></th><td><select id='isActivateItem' name='isActivateItem'><option value=''>No Effect</option><option value='Activate'>Activate Item</option><option value='Deactivate'>Deactivate Item</option><option value='Toggle'>Toggle Activation</option></select></td>");
		}
		
		referenceRow = createTableRow(referenceRow,"rowUncommonEffectsEnd","<th colspan='2'></th>");
		referenceRow.classList.add("section-end");
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowUncommonEffectsEnd").nextElementSibling);
	}
}

async function createModifyD20Rows(){
	let nextRowIndex = document.getElementById("rowModifyD20").rowIndex + 1;

	if(document.getElementById("isModifyD20").checked){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowIsModifyAttack","<th><label for='affectEffectAffectsAll'>Must Affect All Possible Effects:</label></th><td><input type='checkbox' id='affectEffectAffectsAll' name='affectEffectAffectsAll'> (This is incomplete and I forgot to come back to it at some point)</td>");
		nextRowIndex++;

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowModifyD20Number","<th><label for='affectEffectNumber'>Number to Remove:</label></th><td><input type='number' id='affectEffectNumber' name='affectEffectNumber' min=0 style='width:25px' value=1><input type='checkbox' name='affectEffectNumberUnlimited' id='affectEffectNumberUnlimited' onchange='toggleFieldEnabled("+'"affectEffectNumber","affectEffectNumberUnlimited"'+")'>Unlimited?</td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let affectEffectNumberAHLScalingSelect = createAHLSelect("affectEffectNumberAHLScaling");

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
			let affectConditionNumberAHLScalingSelect = createAHLSelect("affectConditionNumberAHLScaling");

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
			let affectSpellNumberAHLScalingSelect = createAHLSelect("affectSpellNumberAHLScaling");

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

async function createMoveTargetTable(){
	let referenceRow = document.getElementById("rowIsMoveTarget");

	if(document.getElementById("isMoveTarget").checked){
		referenceRow = createTableRow(referenceRow,"rowMoveTargetInfo","<th><label for='moveTargetValue'>Distance Target Moved:</label></th><input type='number' id='moveTargetValue' name='moveTargetValue' min=0 value=10 style='width:25px'><select id='moveTargetUnits' name='moveTargetUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option><option value='Unlimited'>Unlimited</option></select><select id='moveTargetDirection' name='moveTargetDirection'><option value='Choice'>User's Choice</option><option value='Away'>Away From User</option><option value='Towards'>Towards User</option><option value='Random4'>Random, 4 Directions</option><option value='Random8'>Random, 8 Directions</option></select></td>");

		if(checkEffectType()=="Spell"){
			let moveTargetAHLScalingSelect = createAHLSelect("moveTargetAHLScaling");

			referenceRow = createTableRow(referenceRow,"rowMoveTargetAHLInfo","<th><label for='moveTargetAHLValue'>Increased Distance AHL:</label></th><input type='number' id='moveTargetAHLValue' name='moveTargetAHLValue' min=0 value=0 style='width:25px'>"+moveTargetAHLScalingSelect+"</td>");
		}

		referenceRow = createTableRow(referenceRow,"rowMoveTargetType","<th><label for='moveTargetType'>Type of Movement:</label></th><select id='moveTargetType' name='moveTargetType'><option value='Physical'>Physical Movement</option><option value='Teleportation'>Teleportation</option><option value='Extraplanar'>Extraplanar Teleportation</option></select></td>");

		if(document.getElementById("howMitigate").value == "Save"){
			referenceRow = createTableRow(referenceRow,"rowSavePreventMove","<th><label for='savePreventMove'>Save Prevents Movement:</label></th><select id='savePreventMove' name='savePreventMove'><option value=2>Prevent Completely</option><option value=1>Halved Movement</option><option value=0>Move Not Affected</option></select></td>");
		}

		referenceRow = createTableRow(referenceRow,"rowMoveTargetEnd","<th colspan=2></th>");
		referenceRow.classList.add("section-end");
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowMoveTargetEnd").nextElementSibling);
	}
}

function createSetHPRows(){
	let referenceRow = document.getElementById("rowSetHP");

	if(document.getElementById("isSetHP").checked){
		referenceRow = createTableRow(referenceRow,"rowSetHPAmount","<th><label for='SetHPAmount'>Set Target HP to:</label></th><td><input type='number' id='SetHPAmount' name='SetHPAmount' min=0 style='width:25px' value=0></td>");

		if(document.getElementById("howMitigate").value=="Save"){
			referenceRow = createTableRow(referenceRow,"rowSavePreventSetHP","<th><label for='savePreventSetHP'>Save Prevents HP Change:</label></th><td><input type='checkbox' id='savePreventSetHP' name='savePreventSetHP'></td>");
		}
	
		referenceRow = createTableRow(referenceRow,"rowSetHPEnd","<th colspan=2></th>");
		referenceRow.classList.add("section-end");
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowSetHPEnd").nextElementSibling);
	}
}

function createDropHeldItemRows(){
	if(document.getElementById("isDropItems").checked){
		let mitigationChoice = document.getElementById("howMitigate");
		mitigationChoice.addEventListener("change",createDropItemsResolution);

		createDropItemsResolution();
	}
	else{
		document.getElementById("howMitigate").removeEventListener("change",createDropItemsResolution);
		if(document.getElementById("rowIsSavePreventDrop") != null){
			document.getElementById("rowIsSavePreventDrop").remove();
		}
	}
}

function createDropItemsResolution(){
	let referenceRow = document.getElementById("rowIsDropItems");
	let mitigationChoice = document.getElementById("howMitigate");

	if(mitigationChoice.value == "Save"){
		referenceRow = createTableRow(referenceRow,"rowIsSavePreventDrop","<th><label for='isSavePreventDrop'>Successful Save Prevents Dropping Items:</label></th><td><input type='checkbox' id='isSavePreventDrop' name='isSavePreventDrop' checked></td>");
	}
	else if(document.getElementById("rowIsSavePreventDrop") != null){
		document.getElementById("rowIsSavePreventDrop").remove();
	}
}

function createInstantKillRows(){
	let referenceRow = document.getElementById("rowInstantKill");
	if(document.getElementById("howMitigate").value=="Save" && document.getElementById("InstantKill").checked){
		referenceRow = createTableRow(referenceRow,"rowSavePreventInstantKill","<th><label for='savePreventInstantKill'>Save Prevents Instant Kill:</label></th><td><input type='checkbox' id='savePreventInstantKill' name='savePreventInstantKill'></td>");
	}
	else if(document.getElementById("rowSavePreventInstantKill") != null){
		document.getElementById("rowSavePreventInstantKill").remove();
	}
}

function createDifficultTerrainRows(tableID){
	let nextRowIndex = document.getElementById("rowIsDifficultTerrain").rowIndex + 1;

	if(document.getElementById("isDifficultTerrain").checked){
		addTableRow(tableID,nextRowIndex,"rowDifficultTerrainMultiplier","<th><label for='DifficultTerrainMultiplier'>Multiplier for Movement in Terrain</label></th><td><input type='number' id='DifficultTerrainMultiplier' name='DifficultTerrainMultiplier' value=2 style='width:25px'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowDifficultTerrainRange","<th><label for='DifficultTerrainDistanceValue'>Size of Difficult Terrain:</label></th><td><input type='number' id='DifficultTerrainDistanceValue' name='DifficultTerrainDistanceValue' min=0 value=30 style='width:25px'><select id='DifficultTerrainDistanceUnits' name='DifficultTerrainDistanceUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
		nextRowIndex++;

		if(document.getElementById("aoeShape").value != "None"){
			addTableRow(tableID,nextRowIndex,"rowDifficultTerrainUseAoESize","<th><label for='isDifficultTerrainUseAoESize'>Use AoE For Size:</label></th><td><input type='checkbox' id='isDifficultTerrainUseAoESize' name='isDifficultTerrainUseAoESize' onchange='toggleFieldEnabled("+'["DifficultTerrainDistanceValue","DifficultTerrainDistanceUnits"],"isDifficultTerrainUseAoESize"'+")'></td>");
			nextRowIndex++;
		}
	}
	else{
		clearUnusedTable("CreateSubeffectTable","rowIsDifficultTerrain","rowIsCreateObject");
	}
}

async function createCreateObjectTable(){
	let nextRowIndex = document.getElementById("rowIsCreateObject").rowIndex + 1;
	clearUnusedTable("CreateSubeffectTable","rowIsCreateObject","rowIsWeaponAttack");
	let CreateObjectSeleciton = document.getElementById("isCreateObject").value;

	if(CreateObjectSeleciton == "Unique"){
		addTableRow("CreateSubeffectTable",nextRowIndex,"rowCreateObject","<th><label for='ValidObjectMethod")
		let rowCreateObjectInfo = table.insertRow(nextRowIndex);
		rowCreateObjectInfo.id = "rowCreateObjectInfo";
		rowCreateObjectInfo.innerHTML = "<th style='colspan:2'>Note: There is currently no data collection for what type of objects are created by spells.</th>";
		nextRowIndex++;
	}
	else if(CreateObjectSeleciton == "Specific"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Objects','Name','json']"});
		let allObjects = await request.json();
		let ObjectSelectionOptions = createHTMLSelectOptions(allObjects,"ObjectID");

		addTableRow("CreateSubeffectTable",nextRowIndex,"rowCreateObject","<th><label for='CreatedObject'>Object Created:</label></th><td><select id='CreatedObject' name='CreatedObject'>"+ObjectSelectionOptions+"</select></td>");
		nextRowIndex++;
	}
	else if(CreateObjectSeleciton == "Type"){

	}
}

function createPersistentEffectRows(tableID){
	let persistentEffectChoice = document.getElementById("needsPersistentEffect").value;
	let nextRowIndex = document.getElementById("rowNeedsPersistentEffect").rowIndex + 1;
	clearUnusedTable(tableID,"rowNeedsPersistentEffect","submitRow");

	if(persistentEffectChoice == "Same"){
		addTableRow(tableID,nextRowIndex,"rowPersistentEffectTargeting","<th><label for='isPersistentEffectRandom'>Persistent Effect is Chosen Randomly:</label></th><td><input type='checkbox' id='isPersistentEffectRandom' name='isPersistentEffectRandom'></td>");
		nextRowIndex++;
	}
	else if(persistentEffectChoice == "Different"){
		addTableRow(tableID,nextRowIndex,"rowPersistentEffectsNumber","<th><label for='PersistentEffectsNumber'>Number of Persistent Effects:</label></th><td><input type='number' id='PersistentEffectsNumber' name='PersistentEffectsNumber' value=1 min=1 style='width:25px'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsPersistentEffectRandom","<th><label for='isPersistentEffectRandom'>Persistent Effect is Chosen Randomly:</label></th><td><input type='checkbox' id='isPersistentEffectRandom' name='isPersistentEffectRandom'></td>");
		nextRowIndex++;
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateSubeffectTable').innerHTML = userdata;

	createTargetingRows("CreateSubeffectTable","rowMitigation","");
}

setTimeout(loadUserData, 1);