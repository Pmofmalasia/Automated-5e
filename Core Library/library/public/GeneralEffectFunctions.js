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