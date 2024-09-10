function addActiveEffectsRow(referenceElement){
	createTableRow(referenceElement,"rowHasActiveEffects","<th><label for='HasActiveEffects'>Has Active Effects:</label></th><td><input type='checkbox' id='HasActiveEffects' name='HasActiveEffects'></td>");
	document.getElementById("HasActiveEffects").addEventListener("change",createActiveEffectsRow);
}

function createActiveEffectsRow(){
	let referenceElement = document.getElementById("rowHasActiveEffects");
	let ActiveEffectsSelection = document.getElementById("HasActiveEffects").checked;
	let endRow = document.getElementById("rowActiveEffectsEnd");

	if(ActiveEffectsSelection){
		referenceElement = createTableRow(referenceElement,"rowActiveEffectsNumber","<th><label for='ActiveEffectsNumber'>Number of Effects:</label></th><td><input type='number' id='ActiveEffectsNumber' name='ActiveEffectsNumber' value='1' min='1' style='width:25px'><span id='ActiveEffectsAHLSpan'></span></td>");
		document.getElementById("ActiveEffectsNumber").addEventListener("change",createEffectChoiceMethodRow);
		document.getElementById("FeatureTierType").addEventListener("change",activeEffectsAHL);
		activeEffectsAHL();

		referenceElement = createTableRow(referenceElement,"rowActiveEffectsRandom","<th><label for='isEffectRandom'>Effect is Random:</label></th><td><input type='checkbox' id='isEffectRandom' name='isEffectRandom'></td>");
	}
	else if(endRow !== null){
		deleteInterveningElements(referenceElement,endRow.nextElementSibling);
	}
}

function activeEffectsAHL(){
	let ahlSelect = createAHLSelect("ActiveEffectsNumberAHLScaling");
	if(ahlSelect === ""){
		document.getElementById("ActiveEffectsAHLSpan").innerHTML = "";
		return;
	}
	
	document.getElementById("ActiveEffectsAHLSpan").innerHTML = " + <input type='number' id='ActiveEffectsAHLNumber' name='ActiveEffectsAHLNumber' class='small-number'>"+ahlSelect;
}

function createEffectChoiceMethodRow(){
	let referenceElement = document.getElementById("rowActiveEffectsNumber");
	let currentEffectsNumber = document.getElementById("ActiveEffectsNumber").value;
	let endRow = document.getElementById("rowEffectChoiceMethod");
	
	if(currentEffectsNumber > 1){
		if(endRow === null){
			let effectChoiceTypes = [
				{Name:"Choice",DisplayName:"User Choice"},
				{Name:"Random",DisplayName:"Random"},
				{Name:"Target",DisplayName:"Target Dependent"},
				{Name:"StoredValue",DisplayName:"Based on Prior Choice"},
				{Name:"OutsideRoll",DisplayName:"Based on Outside Roll"},
				{Name:"ResourceType",DisplayName:"Type of Resource Used"}
			]
			let effectChoiceOptions = createHTMLSelectOptions(effectChoiceTypes);

			//Need to get a way to check feature type generically so ItemActivationState can be added as an option. Or could just have the CreateObject functions add it in afterwards, might be easier.
			referenceElement = createTableRow(referenceElement,"rowEffectChoiceMethod","<th><label for='EffectChoiceMethod'>Method of Choosing Effect:</label></th><td><select id='EffectChoiceMethod' name='EffectChoiceMethod'>"+effectChoiceOptions+"</select></td>");

			document.getElementById("EffectChoiceMethod").addEventListener("change",function(){
				let methodType = this.value;
				let endRow = document.getElementById("rowEffectChoiceMethodEnd");
				if(endRow !== null){
					deleteInterveningElements(referenceElement,endRow.nextElementSibling);
				}

				if(methodType === "Random"){
					referenceElement = createTableRow(referenceElement,"rowEffectChoiceMethodDetails","<th><label for='EffectChoiceRandomDistribution'>Are All Effects Equally Likely:</label></th><td><input type='checkbox' id='EffectChoiceRandomDistribution' name='EffectChoiceRandomDistribution' checked><span id='EffectChoiceRandomDistributionSpan'></span></td>");
					document.getElementById("EffectChoiceRandomDistribution").addEventListener("change",function(){
						let isEven = this.checked;
						let infoSpan = document.getElementById("EffectChoiceRandomDistributionSpan");
						if(isEven){
							infoSpan.innerHTML = "";
						}
						else{
							infoSpan.innerHTML = "Roll Die Size: <input type='number' class='small-number' id='EffectChoiceRandomDistributionMax' name='EffectChoiceRandomDistributionMax'>";
						}
					});
				}
				else if(methodType === "Target"){
					
				}
				else if(methodType === "StoredValue"){
					//Based on choice from this feature vs. choice from other feature
				}
			});
		}
	}
	else if(endRow !== null){
		deleteInterveningElements(referenceElement,endRow.nextElementSibling);
	}
}

function createTimeUnitsSelect(options){
	let selectHTML = "";

	if(options !== undefined){
		if(options.isActions === true){
			selectHTML = "<option value='action'>Action</option><option value='bonus'>Bonus Action</option><option value='reaction'>Reaction</option><option value='interaction'>Item Interaction</option><option value='free'>Free</option>";
		}
	}

	selectHTML += "<option value='round'>Round</option><option value='minute'>Minute</option><option value='hour'>Hour</option><option value='day'>Day</option><option value='year'>Year</option>";

	return selectHTML;
}

function createCustomUseTimeRows(tableID,baseVariableName,clearRowsID){
	let currentUseTime = document.getElementById(baseVariableName).value;
	let nextRowIndex = document.getElementById("row"+baseVariableName).rowIndex + 1;

	clearUnusedTable(tableID,"row"+baseVariableName,clearRowsID);

	if(currentUseTime=="Custom"){
		addTableRow(tableID,nextRowIndex,"rowCustom"+baseVariableName,"<th><label for='custom"+baseVariableName+"'>Custom Time:</label></th><td><input type='number' id='custom"+baseVariableName+"Value' name='custom"+baseVariableName+"Value' min='1' style='width:25px'><select id='custom"+baseVariableName+"Units' name='custom"+baseVariableName+"Units'><option value='Action'>Action</option><option value='Bonus Action'>Bonus Action</option><option value='Reaction'>Reaction</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td>");
		nextRowIndex++;
	}
	else if(currentUseTime=="Reaction"){
		addTableRow(tableID,nextRowIndex,"row"+baseVariableName+"ReactionDescription","<th><label for='"+baseVariableName+"ReactionDescription'>Reaction Trigger:</label></th><td><input type='text' id='"+baseVariableName+"ReactionDescription' name='"+baseVariableName+"ReactionDescription' style='width:100%' value='which you take when'></td>");
		nextRowIndex++;
	}
}

function createCustomDurationRows(tableID,baseVariableName,clearRowsID){
	let currentDuration = document.getElementById(baseVariableName);
	let nextRowIndex = document.getElementById(clearRowsID).rowIndex;
	let priorRowID;
	if(currentDuration == null){
		currentDuration = "Custom";
	}
	else{
		currentDuration = currentDuration.value;
	}

	let thisRow = document.getElementById("rowCustom"+baseVariableName);
	if(thisRow == null){
		priorRowID = document.getElementById(clearRowsID).previousElementSibling.id;
	}
	else{
		priorRowID = thisRow.previousElementSibling.id;
	}

	clearUnusedTable(tableID,priorRowID,clearRowsID);
	if(currentDuration=="Custom"){
		addTableRow(tableID,nextRowIndex,"rowCustom"+baseVariableName,"<th><label for='custom"+baseVariableName+"'>Custom Duration:</label></th><td><input type='number' id='custom"+baseVariableName+"Value' name='custom"+baseVariableName+"Value' min='1' style='width:25px'><select id='custom"+baseVariableName+"Units' name='custom"+baseVariableName+"Units'><option value='Turn'>Turn</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td>");
	}
}

function createAHLDurationRows(tableID,SpellLevel,clearRowsID){
	let nextRowIndex = document.getElementById("rowAHLDuration").rowIndex + 1;
	let maxSpellLevel;
	if(SpellLevel == 0){
		maxSpellLevel = 3;
	}
	else{
		maxSpellLevel = 9;
	}

	if(document.getElementById("AHLDuration").checked){
		let DurationOptions = document.getElementById("Duration").innerHTML;

		//No incrementing of nextRowIndex since rows are created in reverse order
		for(let i=maxSpellLevel; i>SpellLevel; i--){
			addTableRow(tableID,nextRowIndex,"rowAHLDurationLevel"+i,"<th><label for='AHLDurationLevel"+i+"'>Duration at Level "+i+":</label></th><td><select id='AHLDurationLevel"+i+"' name=AHLDurationLevel"+i+"'>"+DurationOptions+"</selected></td>");
		}
	}
	else{
		clearUnusedTable(tableID,"rowAHLDuration",clearRowsID);
	}
}

function createConcentrationLostRows(tableID,SpellLevel,clearRowsID){
	let nextRowIndex = document.getElementById("rowIsConcentrationLost").rowIndex + 1;

	if(document.getElementById("isConcentrationLost").checked){
		let concLostLevelOptions = "";
		for(let i = SpellLevel+1; i<10; i++){
			concLostLevelOptions = concLostLevelOptions+"<option value='"+i+"'>"+i+"</option>";
		}
		addTableRow(tableID,nextRowIndex,"rowConcentrationLostLevel","<th><label for='ConcentrationLostLevel'>Level No Longer Required:</label></th><td><select id='ConcentrationLostLevel' name=ConcentrationLostLevel'>"+concLostLevelOptions+"</selected></td>")
	}
	else{
		clearUnusedTable(tableID,"rowIsConcentrationLost",clearRowsID);
	}
}