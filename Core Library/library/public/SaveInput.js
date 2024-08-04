async function createRegularSaveRows(){
	let referenceRow = document.getElementById("rowEffectChoice");
	let EffectChoice = document.getElementById("EffectChoice").value;
	deleteInterveningElements(referenceRow,document.getElementById("rowSubmit"));

	if(EffectChoice == ""){
		let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allAttributes = await requestAttributes.json();

		let SaveChoiceOptions = createHTMLSelectOptions(allAttributes);

		referenceRow = createTableRow(referenceRow,"rowSaveChoice","<th><label for='SaveChoice'>Saving Throw:</label></th><td><select id='SaveChoice' name='SaveChoice'>"+SaveChoiceOptions+"</select></td>");

		referenceRow = createTableRow(referenceRow,"rowSituationalBonus","<th><label for='SituationalBonus'>Situational Bonus:</label></th><td><input type='number' id='SituationalBonus' name='SituationalBonus' value=0></td>");

		referenceRow = createTableRow(referenceRow,"rowAdvantageChoice","<th><label for='AdvantageChoice'>Advantage Type:</label></th><td><select id='AdvantageChoice' name='AdvantageChoice'><option value=0>Forced Disadvantage</option><option value=1>Situational Disadvantage</option><option value=2 selected>Normal Roll</option><option value=3>Situational Advantage</option><option value=4>Forced Advantage</option></select></td>");

		referenceRow = createTableRow(referenceRow,"rowOutputOptions","<th><label for='OutputOptions'>Who Sees the Result?</label></th><td><select id='OutputOptions' name='OutputOptions'><option value=0>Everyone</option><option value=1>You and GM</option><option value=2>GM Only</option></select></td>");

		referenceRow = createTableRow(referenceRow,"rowSaveDescription","<th><label for='SaveDescription'>Optional Description:</label></th><td><input type='text' id='SaveDescription' name='SaveDescription'></td>");
	}
	else{
		let effectData = JSON.parse(atob(EffectChoice));
		let saveData = effectData.ToResolve.SaveDC;

		if(saveData.isChooseFailure == 1){
			referenceRow = createTableRow(referenceRow,"rowSaveChooseFailure","<th><label for='isChooseFailure'>Choose to Fail:</label></th><td><input type='checkbox' id='isChooseFailure' name='isChooseFailure'></td>");
		}
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('SaveInputTable').innerHTML = userdata;

	createRegularSaveRows();
}

setTimeout(loadUserData, 1);