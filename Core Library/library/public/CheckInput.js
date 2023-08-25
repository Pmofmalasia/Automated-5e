async function createRegularCheckRows(tableID){
	if(document.getElementById("EffectIDChoice").value == ""){
		let nextRowIndex = document.getElementById("rowEffectIDChoice").rowIndex + 1;

		let requestSkills = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allSkills = await requestSkills.json();

		let SkillChoiceOptions = "<option value=''>No Skill</option>";
		for(let tempSkill of allSkills){
			tempAtrAbbr = tempSkill.Attribute.substring(0,3);
			SkillChoiceOptions = SkillChoiceOptions + "<option value='"+tempSkill.Name+"'>"+tempSkill.DisplayName+" ("+tempAtrAbbr+")</option>";
		}
		SkillChoiceOptions = SkillChoiceOptions + "<option value=''> --------------------- </option>";

		let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allAttributes = await requestAttributes.json();

		let AttributeOptions = createHTMLSelectOptions(allAttributes);
		SkillChoiceOptions = SkillChoiceOptions + AttributeOptions;

		addTableRow(tableID,nextRowIndex,"rowSkillChoice","<th><label for='SkillChoice'>Skill:</label></th><td><select id='SkillChoice' name='SkillChoice'>"+SkillChoiceOptions+"</select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAlternateAttribute","<th><label for='AlternateAttribute'>Use Alternate Attribute:</label></th><td><select id='AlternateAttribute' name='AlternateAttribute'><option value=''>No Alternate</option>"+AttributeOptions+"</select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowSituationalBonus","<th><label for='SituationalBonus'>Situational Bonus:</label></th><td><input type='number' id='SituationalBonus' name='SituationalBonus' value=0></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAdvantageChoice","<th><label for='AdvantageChoice'>Advantage Type:</label></th><td><select id='AdvantageChoice' name='AdvantageChoice'><option value=0>Forced Disadvantage</option><option value=1>Situational Disadvantage</option><option value=2 selected>Normal Roll</option><option value=3>Situational Advantage</option><option value=4>Forced Advantage</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowOutputOptions","<th><label for='OutputOptions'>Who Sees the Result?</label></th><td><select id='OutputOptions' name='OutputOptions'><option value=0>Everyone</option><option value=1>You and GM</option><option value=2>GM Only</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowCheckDescription","<th><label for='CheckDescription'>Optional Description:</label></th><td><input type='text' id='CheckDescription' name='CheckDescription'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowEffectIDChoice","rowSubmit");
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CheckInputTable').innerHTML = userdata;

	createRegularCheckRows('CheckInputTable');
}

setTimeout(loadUserData, 1);