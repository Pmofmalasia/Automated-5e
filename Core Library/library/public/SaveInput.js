async function createRegularSaveRows(tableID){
	if(document.getElementById("EffectIDChoice").value == ""){
		let nextRowIndex = document.getElementById("rowEffectIDChoice").rowIndex + 1;

		let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allAttributes = await requestAttributes.json();

		let SaveChoiceOptions = createHTMLSelectOptions(allAttributes);

		addTableRow(tableID,nextRowIndex,"rowSaveChoice","<th><label for='SaveChoice'>Saving Throw:</label></th><td><select id='SaveChoice' name='SaveChoice'>"+SaveChoiceOptions+"</select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowSituationalBonus","<th><label for='SituationalBonus'>Situational Bonus:</label></th><td><input type='number' id='SituationalBonus' name='SituationalBonus' value=0></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAdvantageChoice","<th><label for='AdvantageChoice'>Advantage Type:</label></th><td><select id='AdvantageChoice' name='AdvantageChoice'><option value=0>Forced Disadvantage</option><option value=1>Situational Disadvantage</option><option value=2 selected>Normal Roll</option><option value=3>Situational Advantage</option><option value=4>Forced Advantage</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowOutputOptions","<th><label for='OutputOptions'>Who Sees the Result?</label></th><td><select id='OutputOptions' name='OutputOptions'><option value=0>Everyone</option><option value=1>You and GM</option><option value=2 selected>GM Only</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowSaveDescription","<th><label for='SaveDescription'>Optional Description:</label></th><td><input type='text' id='SaveDescription' name='SaveDescription'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowEffectIDChoice","rowSubmit");
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('SaveInputTable').innerHTML = userdata;

	createRegularSaveRows('SaveInputTable');
}

setTimeout(loadUserData, 1);