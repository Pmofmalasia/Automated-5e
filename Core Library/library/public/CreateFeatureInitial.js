function createMainFeatureRow(){
	let startRow = document.getElementById("rowHasMain");
	let hasMainFeature = document.getElementById("hasMain").checked;
	let mainFeatureType = document.getElementById("FeatureType").value;

	if(hasMainFeature){
		createFeatureInputRow(startRow.id,"Main","Main Feature",mainFeatureType);
	}
	else if(startRow.nextElementSibling.id == "rowMainFeature"){
		startRow.nextElementSibling.remove();
	}
}

function createReplaceFeatureRow(){
	let startRow = document.getElementById("rowIsReplaceFeature");
	let isReplaceFeature = document.getElementById("isReplaceFeature").checked;
	let FeatureType = document.getElementById("FeatureType").value;

	if(isReplaceFeature){
		createFeatureInputRow(startRow.id,"Replace","Replaced Feature",FeatureType);
	}
	else if(startRow.nextElementSibling.id == "rowReplaceFeature"){
		startRow.nextElementSibling.remove();
	}
}

async function initializeConditionAssociatedFeature(){
	let baseConditionFeature = {"Name":"BaseCondition","DisplayName":"Base Condition","Class":"Condition","Subclass":""};
	let allFeatureOptions = [];
	allFeatureOptions.push(baseConditionFeature);
	let finalFeatureOptions = [];
	let featureProperties = ["sb.Abilities","sb.Feats","sb.Conditions","sb.Objects","sb.MonsterFeatures"];

	for(let property of featureProperties){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: '["'+property+'"]'});
		allFeatureOptions = allFeatureOptions.concat(await request.json());
	}

	for(let feature of allFeatureOptions){
		finalFeatureOptions.push(feature.DisplayName);
	}

	document.getElementById("ConditionAssociatedFeature").addEventListener("change",function(e){
		validateFeatureAutocomplete("ConditionAssociatedFeature",btoa(JSON.stringify(allFeatureOptions)));
	});

	autocomplete(document.getElementById("ConditionAssociatedFeature"),finalFeatureOptions);
}

function createNewConditionTagRows(){
	let isCreateNewConditionTag = document.getElementById("isCreateNewConditionTag").checked;
	let startRow = document.getElementById("rowConditionTags");
	let nextRowIndex = startRow.rowIndex + 1;
	let tableID = startRow.closest("table").id;
	if(isCreateNewConditionTag){
		addTableRow(tableID,nextRowIndex,"rowNewConditionTag","<th><label for='NewConditionTag'>New Condition Tag Name:</span></label></th><td><input type='text' id='NewConditionTag' name='NewConditionTag'></td>");
	}
	else{
		startRow.nextElementSibling.remove();
	}
}

async function createFeaturePrereqsRow(){
	let startRow = document.getElementById("rowIsFeaturePrereqs");
	let endRow = document.getElementById("rowFeaturePrereqsEnd");
	let tableID = startRow.closest("table").id;
	let isFeaturePrereqs = document.getElementById("isFeaturePrereqs").checked;
	let mainFeatureType = document.getElementById("FeatureType").value;

	if(isFeaturePrereqs){
		//Note: The event being dispatched here messes with the values of the row indices here while the other onchange function of FeatureClass is excuting, so the endRow method is used instead.
		if(mainFeatureType == "Class"){
			addTableRow(tableID,endRow.rowIndex,"rowClassLevelFeaturePrereq","<th><label for='ClassLevelFeaturePrereq'>Required <span id='ClassLevelFeaturePrereqName'>Class</span> Level:</label></th><td><select id='ClassLevelFeaturePrereq' name='ClassLevelFeaturePrereq'><option value=''>None</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option><option value=13>13</option><option value=14>14</option><option value=15>15</option><option value=16>16</option><option value=17>17</option><option value=18>18</option><option value=19>19</option><option value=20>20</option></select></td>");

			document.getElementById("FeatureClass").addEventListener("change", async function(e){
				let className = this.value;
				let classDisplayName = await fetch("macro:pm.GetDisplayName@lib:pm.a5e.Core", {method: "POST", body: '["'+className+'","sb.Classes"]'});
				classDisplayName = await classDisplayName.text();

				document.getElementById("ClassLevelFeaturePrereqName").innerHTML = classDisplayName;
			});

			document.getElementById("FeatureClass").dispatchEvent(new Event("change"));
		}

		addTableRow(tableID,endRow.rowIndex,"rowTotalLevelFeaturePrereq","<th><label for='TotalLevelFeaturePrereq'>Required Total Level:</label></th><td><select id='TotalLevelFeaturePrereq' name='TotalLevelFeaturePrereq'><option value=''>None</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option><option value=13>13</option><option value=14>14</option><option value=15>15</option><option value=16>16</option><option value=17>17</option><option value=18>18</option><option value=19>19</option><option value=20>20</option></select></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsAttributeFeaturePrereq","<th><label for='isAttributeFeaturePrereq'>Has Required Ability Scores:</label></th><td><input type='checkbox' id='isAttributeFeaturePrereq' name='isAttributeFeaturePrereq' onchange='createAttributePrerequisiteRows()'></td>");

		if(mainFeatureType != "Class" && mainFeatureType != "Race"){
			addTableRow(tableID,endRow.rowIndex,"rowIsRaceFeaturePrereq","<th><label for='isRaceFeaturePrereq'>Required Races:</label></th><td><select id='isRaceFeaturePrereq' name='isRaceFeaturePrereq' onchange='createRacePrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Races</option><option value='Exclude'>Exclude Races</option></select></td>");
		}

		if(mainFeatureType != "Class"){
			addTableRow(tableID,endRow.rowIndex,"rowIsSubraceFeaturePrereq","<th><label for='isSubraceFeaturePrereq'>Required Subraces:</label></th><td><select id='isSubraceFeaturePrereq' name='isSubraceFeaturePrereq' onchange='createSubracePrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Subraces</option><option value='Exclude'>Exclude Subraces</option></select></td>");
		}

		if(mainFeatureType != "Class" && mainFeatureType != "Race"){
			addTableRow(tableID,endRow.rowIndex,"rowIsClassFeaturePrereq","<th><label for='isClassFeaturePrereq'>Required Classes:</label></th><td><select id='isClassFeaturePrereq' name='isClassFeaturePrereq' onchange='createClassPrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Classes</option><option value='Exclude'>Exclude Classes</option></select></td>");
		}

		if(mainFeatureType != "Race"){
			addTableRow(tableID,endRow.rowIndex,"rowIsSubclassFeaturePrereq","<th><label for='isSubclassFeaturePrereq'>Required Subclasses:</label></th><td><select id='isSubclassFeaturePrereq' name='isSubclassFeaturePrereq' onchange='createSubclassPrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Subclasses</option><option value='Exclude'>Exclude Subclasses</option></select></td>");
		}

		addTableRow(tableID,endRow.rowIndex,"rowIsFeatureFeaturePrereq","<th><label for='isFeatureFeaturePrereq'>Has Required Feature:</label></th><td><input type='checkbox' id='isFeatureFeaturePrereq' name='isFeatureFeaturePrereq' onchange='createFeaturePrerequisiteRows()'></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsWeaponProficiencyFeaturePrereq","<th><label for='isWeaponProficiencyFeaturePrereq'>Required Weapon Proficiencies:</label></th><td><select id='isWeaponProficiencyFeaturePrereq' name='isWeaponProficiencyFeaturePrereq' onchange='createWeaponProficiencyPrerequisiteRows()'><option value=''>None</option><option value='Class'>By Weapon Class</option><option value='Specific'>Specific Weapons</option></select></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsArmorProficiencyFeaturePrereq","<th><label for='isArmorProficiencyFeaturePrereq'>Required Armor Proficiencies:</label></th><td><select id='isArmorProficiencyFeaturePrereq' name='isArmorProficiencyFeaturePrereq' onchange='createArmorProficiencyPrerequisiteRows()'><option value=''>None</option><option value='Class'>By Armor Class</option><option value='Specific'>Specific Armor</option></select></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsSkillProficiencyFeaturePrereq","<th><label for='isSkillProficiencyFeaturePrereq'>Required Skill Proficiencies:</label></th><td><input type='checkbox' id='isSkillProficiencyFeaturePrereq' name='isSkillProficiencyFeaturePrereq' onchange='createSkillProficiencyPrerequisiteRows()'></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsSaveProficiencyFeaturePrereq","<th><label for='isSaveProficiencyFeaturePrereq'>Required Save Proficiencies:</label></th><td><input type='checkbox' id='isSaveProficiencyFeaturePrereq' name='isSaveProficiencyFeaturePrereq' onchange='createSaveProficiencyPrerequisiteRows()'></td>");

		addTableRow(tableID,endRow.rowIndex,"rowIsSpellFeaturePrereq","<th><label for='isSpellFeaturePrereq'>Required Spellcasting:</label></th><td><select id='isSpellFeaturePrereq' name='isSpellFeaturePrereq' onchange='createSpellPrerequisiteRows()'><option value=''>None</option><option value='Any'>Any Spell</option><option value='Specific'>Specific Spell</option></select></td>");
	}
	else{
		clearUnusedTable(tableID,"rowIsFeaturePrereqs","rowFeaturePrereqsEnd");
	}
}

async function createAttributePrerequisiteRows(){
	let isAttributeFeaturePrereq = document.getElementById("isAttributeFeaturePrereq").checked;
	let startRow = document.getElementById("rowIsAttributeFeaturePrereq");
	let nextRowIndex = startRow.rowIndex + 1;
	let tableID = startRow.closest("table").id;

	if(isAttributeFeaturePrereq){
		let allAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ''});
		allAttributes = await allAttributes.json();
		let attributeOptions = createHTMLMultiselectOptions(allAttributes,"AttributeFeaturePrereq");

		addTableRow(tableID,nextRowIndex,"rowAttributeFeaturePrereq","<th>Required Ability Scores:</th><td><div class='check-multiple' style='width:100%'>"+attributeOptions+"</div></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAttributeFeaturePrereqAmount","<th><label for='AttributeFeaturePrereqAmount'>Minimum Ability Score Required:</label></th><td><input type='number' id='AttributeFeaturePrereqAmount' name='AttributeFeaturePrereqAmount' value=13></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAttributeFeaturePrereqAllOrOne","<th><label for='AttributeFeaturePrereqAllOrOne'>Requires All or One Ability Score Above Minimum:</label></th><td><select id='AttributeFeaturePrereqAllOrOne' name='AttributeFeaturePrereqAllOrOne'><option value=1>One</option><option value='All'>All</option></select></td>");
		nextRowIndex++;
	}
	else{
		startRow.nextElementSibling.remove();
		startRow.nextElementSibling.remove();
		startRow.nextElementSibling.remove();
	}
}

async function createClassPrerequisiteRows(){
	let isClassRequired = document.getElementById("isClassFeaturePrereq").value;
	let startRow = document.getElementById("rowIsClassFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isClassRequired != "" && document.getElementById("rowClassFeaturePrereq") == null){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Classes']"});
		allClasses = await request.json();
		let subclassOptions = createHTMLMultiselectOptions(allClasses,"ClassFeaturePrereq");

		let header;
		if(isClassRequired == "Include"){
			header = "Required";
		}
		else{
			header = "Disallowed";
		}

		addTableRow(tableID,startRow.rowIndex + 1,"rowClassFeaturePrereq","<th><span id='ClassFeaturePrereqSpan'>"+header+"</span> Class(es):</th><td><div class='check-multiple' style='width:100%'>"+subclassOptions+"</div></td>");
	}
	else if(isClassRequired == ""){
		document.getElementById("rowClassFeaturePrereq").remove();
	}
	else{
		let headerSpan = document.getElementById("ClassFeaturePrereqSpan");
		if(isClassRequired == "Include"){
			headerSpan.innerHTML = "Required";
		}
		else{
			headerSpan.innerHTML = "Disallowed";
		}
	}
}

async function createSubclassPrerequisiteRows(){
	let isSubclassRequired = document.getElementById("isSubclassFeaturePrereq").value;
	let startRow = document.getElementById("rowIsSubclassFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isSubclassRequired != "" && document.getElementById("rowSubclassFeaturePrereq") == null){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Subclasses']"});
		allSubclasses = await request.json();
		let subclassOptions = createHTMLMultiselectOptions(allSubclasses,"SubclassFeaturePrereq");

		let header;
		if(isSubclassRequired == "Include"){
			header = "Required";
		}
		else{
			header = "Disallowed";
		}

		addTableRow(tableID,startRow.rowIndex + 1,"rowSubclassFeaturePrereq","<th><span id='SubclassFeaturePrereqSpan'>"+header+"</span> Subclass(es):</th><td><div class='check-multiple' style='width:100%'>"+subclassOptions+"</div></td>");
	}
	else if(isSubclassRequired == ""){
		document.getElementById("rowSubclassFeaturePrereq").remove();
	}
	else{
		let headerSpan = document.getElementById("SubclassFeaturePrereqSpan");
		if(isSubclassRequired == "Include"){
			headerSpan.innerHTML = "Required";
		}
		else{
			headerSpan.innerHTML = "Disallowed";
		}
	}
}

async function createRacePrerequisiteRows(){
	let isRaceRequired = document.getElementById("isRaceFeaturePrereq").value;
	let startRow = document.getElementById("rowIsRaceFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isRaceRequired != "" && document.getElementById("rowRaceFeaturePrereq") == null){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Races']"});
		allRaces = await request.json();
		let subclassOptions = createHTMLMultiselectOptions(allRaces,"RaceFeaturePrereq");

		let header;
		if(isRaceRequired == "Include"){
			header = "Required";
		}
		else{
			header = "Disallowed";
		}

		addTableRow(tableID,startRow.rowIndex + 1,"rowRaceFeaturePrereq","<th><span id='RaceFeaturePrereqSpan'>"+header+"</span> Race(es):</th><td><div class='check-multiple' style='width:100%'>"+subclassOptions+"</div></td>");
	}
	else if(isRaceRequired == ""){
		document.getElementById("rowRaceFeaturePrereq").remove();
	}
	else{
		let headerSpan = document.getElementById("RaceFeaturePrereqSpan");
		if(isRaceRequired == "Include"){
			headerSpan.innerHTML = "Required";
		}
		else{
			headerSpan.innerHTML = "Disallowed";
		}
	}
}

async function createSubracePrerequisiteRows(){
	let isSubraceRequired = document.getElementById("isSubraceFeaturePrereq").value;
	let startRow = document.getElementById("rowIsSubraceFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isSubraceRequired != "" && document.getElementById("rowSubraceFeaturePrereq") == null){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Subraces']"});
		allSubracees = await request.json();
		let subclassOptions = createHTMLMultiselectOptions(allSubracees,"SubraceFeaturePrereq");
		let header;
		if(isSubraceRequired == "Include"){
			header = "Required";
		}
		else{
			header = "Disallowed";
		}

		addTableRow(tableID,startRow.rowIndex + 1,"rowSubraceFeaturePrereq","<th><span id='SubraceFeaturePrereqSpan'>"+header+"</span> Subrace(s):</th><td><div class='check-multiple' style='width:100%'>"+subclassOptions+"</div></td>");
	}
	else if(isSubraceRequired == ""){
		document.getElementById("rowSubraceFeaturePrereq").remove();
	}
	else{
		let headerSpan = document.getElementById("SubraceFeaturePrereqSpan");
		if(isSubraceRequired == "Include"){
			headerSpan.innerHTML = "Required";
		}
		else{
			headerSpan.innerHTML = "Disallowed";
		}
	}
}

function createFeaturePrerequisiteRows(){
	let isFeatureRequired = document.getElementById("isFeatureFeaturePrereq").checked;
	let startRow = document.getElementById("rowIsFeatureFeaturePrereq");

	if(isFeatureRequired){
		createFeatureInputRow(startRow.id,"FeatureFeaturePrereq","Required Feature");
	}
	else{
		startRow.nextElementSibling.remove();
	}
}

async function createWeaponProficiencyPrerequisiteRows(){
	let isWeaponProfRequired = document.getElementById("isWeaponProficiencyFeaturePrereq").value;
	let startRow = document.getElementById("rowIsWeaponProficiencyFeaturePrereq");
	let tableID = startRow.closest("table").id;

	while(startRow.nextElementSibling.id == "rowWeaponProficiencyFeaturePrereq" || startRow.nextElementSibling.id == "rowWeaponProficiencyFeaturePrereqAllOrOne"){
		startRow.nextElementSibling.remove();
	}

	if(isWeaponProfRequired == "Class"){
		let armorClassOptions = createHTMLMultiselectOptions([{"Name":"Simple","DisplayName":"Simple Weapons"},{"Name":"Martial","DisplayName":"Martial Weapons"},{"Name":"Exotic","DisplayName":"Exotic Weapons"},{"Name":"Improvised","DisplayName":"Improvised Weapons"}],"WeaponProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowWeaponProficiencyFeaturePrereq","<th>Select Required Weapon Class Proficiencies:</th><td><div class='check-multiple' style='width:100%'>"+armorClassOptions+"</div></td>");

		addTableRow(tableID,startRow.rowIndex + 2,"rowWeaponProficiencyFeaturePrereqAllOrOne","<th><label for='WeaponProficiencyFeaturePrereqAllOrOne'>Requires All or One Proficiency Within the Class:</label></th><td><select id='WeaponProficiencyFeaturePrereqAllOrOne' name='WeaponProficiencyFeaturePrereqAllOrOne'><option value='One'>One</option><option value='All'>All</option></select></td>");
	}
	else if(isWeaponProfRequired == "Specific"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTypes']"});
		allWeaponTypes = await request.json();
		let armorOptions = createHTMLMultiselectOptions(allWeaponTypes,"WeaponProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowWeaponProficiencyFeaturePrereq","<th>Select Required Weapon Proficiencies:</th><td><div class='check-multiple' style='width:100%'>"+armorOptions+"</div></td>");

		addTableRow(tableID,startRow.rowIndex + 2,"rowWeaponProficiencyFeaturePrereqAllOrOne","<th><label for='WeaponProficiencyFeaturePrereqAllOrOne'>Requires All or One of the Above:</label></th><td><select id='WeaponProficiencyFeaturePrereqAllOrOne' name='WeaponProficiencyFeaturePrereqAllOrOne'><option value='One'>One</option><option value='All'>All</option></select></td>");
	}
}

async function createArmorProficiencyPrerequisiteRows(){
	let isArmorProfRequired = document.getElementById("isArmorProficiencyFeaturePrereq").value;
	let startRow = document.getElementById("rowIsArmorProficiencyFeaturePrereq");
	let tableID = startRow.closest("table").id;

	while(startRow.nextElementSibling.id == "rowArmorProficiencyFeaturePrereq" || startRow.nextElementSibling.id == "rowArmorProficiencyFeaturePrereqAllOrOne"){
		startRow.nextElementSibling.remove();
	}

	if(isArmorProfRequired == "Class"){
		let armorClassOptions = createHTMLMultiselectOptions([{"Name":"Light","DisplayName":"Light Armor"},{"Name":"Medium","DisplayName":"Medium Armor"},{"Name":"Heavy","DisplayName":"Heavy Armor"},{"Name":"Shield","DisplayName":"Shields"}],"ArmorProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowArmorProficiencyFeaturePrereq","<th>Select Required Armor Class Proficiencies:</th><td><div class='check-multiple' style='width:100%'>"+armorClassOptions+"</div></td>");

		addTableRow(tableID,startRow.rowIndex + 2,"rowArmorProficiencyFeaturePrereqAllOrOne","<th><label for='ArmorProficiencyFeaturePrereqAllOrOne'>Requires All or One Proficiency Within the Class:</label></th><td><select id='ArmorProficiencyFeaturePrereqAllOrOne' name='ArmorProficiencyFeaturePrereqAllOrOne'><option value='One'>One</option><option value='All'>All</option></select></td>");
	}
	else if(isArmorProfRequired == "Specific"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ArmorTypes']"});
		allArmorTypes = await request.json();
		let armorOptions = createHTMLMultiselectOptions(allArmorTypes,"ArmorProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowArmorProficiencyFeaturePrereq","<th>Select Required Armor Proficiencies:</th><td><div class='check-multiple' style='width:100%'>"+armorOptions+"</div></td>");

		addTableRow(tableID,startRow.rowIndex + 2,"rowArmorProficiencyFeaturePrereqAllOrOne","<th><label for='ArmorProficiencyFeaturePrereqAllOrOne'>Requires All or One of the Above:</label></th><td><select id='ArmorProficiencyFeaturePrereqAllOrOne' name='ArmorProficiencyFeaturePrereqAllOrOne'><option value='One'>One</option><option value='All'>All</option></select></td>");
	}
}

async function createSkillProficiencyPrerequisiteRows(){
	let isSkillProfRequired = document.getElementById("isSkillProficiencyFeaturePrereq").checked;
	let startRow = document.getElementById("rowIsSkillProficiencyFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isSkillProfRequired){
		let allSkills = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ''});
		allSkills = await allSkills.json();
		let SkillOptions = createHTMLMultiselectOptions(allSkills,"SkillProficiencyFeaturePrereq");

		SkillOptions += "<label><input type='checkbox'><span>------------------------------------------------</span></label>";
		
		let allToolTypes = await fetch("macro:pm.GetToolTypes@lib:pm.a5e.Core", {method: "POST", body: ''});
		allToolTypes = await allToolTypes.json();
		SkillOptions += createHTMLMultiselectOptions(allToolTypes,"SkillProficiencyFeaturePrereq");

		SkillOptions += "<label><input type='checkbox'><span>------------------------------------------------</span></label>";
		
		let allTools = await fetch("macro:pm.GetTools@lib:pm.a5e.Core", {method: "POST", body: ''});
		allTools = await allTools.json();
		SkillOptions += createHTMLMultiselectOptions(allTools,"SkillProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowSkillProficiencyFeaturePrereq","<th>Select Required Skill Proficiencies:</th><td><div class='check-multiple' style='width:100%; height:100px'>"+SkillOptions+"</div></td>");

		addTableRow(tableID,startRow.rowIndex + 2,"rowSkillProficiencyFeaturePrereqExpertise","<th><label for='SkillProficiencyFeaturePrereqExpertise'>Requires Expertise:</label></th><td><input type='checkbox' id='SkillProficiencyFeaturePrereqExpertise' name='SkillProficiencyFeaturePrereqExpertise'></td>");
	}
	else{
		startRow.nextElementSibling.remove();
		startRow.nextElementSibling.remove();
	}
}

async function createSaveProficiencyPrerequisiteRows(){
	let isSaveProfRequired = document.getElementById("isSaveProficiencyFeaturePrereq").checked;
	let startRow = document.getElementById("rowIsSaveProficiencyFeaturePrereq");
	let tableID = startRow.closest("table").id;

	if(isSaveProfRequired){
		let allAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ''});
		allAttributes = await allAttributes.json();
		let saveOptions = createHTMLMultiselectOptions(allAttributes,"SaveProficiencyFeaturePrereq");

		addTableRow(tableID,startRow.rowIndex + 1,"rowSaveProficiencyFeaturePrereq","<th>Select Required Saving Throw Proficiencies:</th><td><div class='check-multiple' style='width:100%'>"+saveOptions+"</div></td>");
	}
	else{
		document.getElementById("rowSaveProficiencyFeaturePrereq").remove();
	}
}

async function createSpellPrerequisiteRows(){
	let startRow = document.getElementById("rowIsSpellFeaturePrereq");
	let isSpellPrereqs = document.getElementById("isSpellFeaturePrereq").value;

	if(isSpellPrereqs == "Specific"){
		createSpellInputRow(startRow.id,"FeaturePrereqSpecific","Requried Spell");
	}
	else if(startRow.nextElementSibling.id == "rowFeaturePrereqSpecificSpell"){
		startRow.nextElementSibling.remove();
	}
}

async function loadUserData() {
	let userdata = JSON.parse(atob(await MapTool.getUserData()));
	document.getElementById('CreateFeatureInitialTable').innerHTML = userdata.Input;

	ParentToken = userdata.ParentToken;

	let featureTypeInput = document.getElementById("FeatureType");
	featureTypeInput.addEventListener("change",createFeatureClassRows());
	featureTypeInput.dispatchEvent(new Event("change"));

	if(document.getElementById("ConditionAssociatedFeature") != null){
		initializeConditionAssociatedFeature();
	}
}

setTimeout(loadUserData, 1);