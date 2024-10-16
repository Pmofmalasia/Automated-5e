async function createRegularCheckRows(tableID,Inventory){
	if(document.getElementById("EffectIDChoice").value == ""){
		let nextRowIndex = document.getElementById("rowEffectIDChoice").rowIndex + 1;

		let requestSkills = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allSkills = await requestSkills.json();

		let SkillChoiceOptions = "<option value=''>No Skill</option>";
		for(let tempSkill of allSkills){
			let tempAtrAbbr = tempSkill.Attribute.substring(0,3);
			let thisSkillInfo = {Name:tempSkill.Name, Type:"Skill"};
			SkillChoiceOptions = SkillChoiceOptions + "<option value='"+btoa(JSON.stringify(thisSkillInfo))+"'>"+tempSkill.DisplayName+" ("+tempAtrAbbr+")</option>";
		}
		SkillChoiceOptions = SkillChoiceOptions + "<option value=''> ------------------------ </option>";

		let hasToolsTest = false;
		let addedToolTypes = [];
		for(let item of Inventory){
			if(item.ToolSubtype != null && item.ToolSubtype != "" && !addedToolTypes.includes(item.ToolSubtype)){
				hasToolsTest = true;
				let thisToolInfo = {Name:item.ToolSubtype,Type:"Tool"};
				SkillChoiceOptions = SkillChoiceOptions + "<option value='"+btoa(JSON.stringify(thisToolInfo))+"'>"+item.DisplayName+"</option>";

				addedToolTypes.push(item.ToolSubtype);
			}
		}

		if(hasToolsTest){
			//TODO: Add function for choosing 'Tool Not in Inventory' as an option
			SkillChoiceOptions = SkillChoiceOptions + "<option value=''> ------------------------ </option>";
		}

		let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allAttributes = await requestAttributes.json();

		let AttributeOptions = "";
		for(let tempAttribute of allAttributes){
			let thisAttributeInfo = {Name:tempAttribute.Name, Type:"Ability Score"};
			SkillChoiceOptions = SkillChoiceOptions + "<option value='"+btoa(JSON.stringify(thisAttributeInfo))+"'>"+tempAttribute.DisplayName+"</option>";

			AttributeOptions = AttributeOptions + "<option value='"+tempAttribute.Name+"'>"+tempAttribute.DisplayName+"</option>";
		}

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

async function populateForm(tableID,formHTML){
	document.getElementById(tableID).innerHTML = formHTML;
}

async function loadUserData() {
	let userdata = JSON.parse(atob(await MapTool.getUserData()));

	await populateForm('CheckInputTable',userdata.FormData);
	await createRegularCheckRows('CheckInputTable',userdata.Inventory);
}

setTimeout(loadUserData, 1);