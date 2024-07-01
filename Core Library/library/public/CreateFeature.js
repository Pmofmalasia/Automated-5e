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

async function createFeaturePrereqsRow(){
	let startRow = document.getElementById("rowIsFeaturePrereqs");
	let tableID = startRow.closest("table").id;
	let isFeaturePrereqs = document.getElementById("isFeaturePrereqs").checked;
	let nextRowIndex = startRow.rowIndex + 1;
	let mainFeatureType = document.getElementById("FeatureType").value;

	if(isFeaturePrereqs){
		addTableRow(tableID,nextRowIndex,"rowIsAttributeFeaturePrereq","<th><label for='isAttributeFeaturePrereq'>Required Attributes:</label></th><td><select id='isAttributeFeaturePrereq' name='isAttributeFeaturePrereq' onchange='createAttributePrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Attributes</option><option value='Exclude'>Exclude Attributes</option></select></td>");
		nextRowIndex++;

		if(mainFeatureType != "Class" && mainFeatureType != "Race"){
			addTableRow(tableID,nextRowIndex,"rowIsRaceFeaturePrereq","<th><label for='isRaceFeaturePrereq'>Required Races:</label></th><td><select id='isRaceFeaturePrereq' name='isRaceFeaturePrereq' onchange='createRacePrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Races</option><option value='Exclude'>Exclude Races</option></select></td>");
			nextRowIndex++;
		}

		if(mainFeatureType != "Class"){
			addTableRow(tableID,nextRowIndex,"rowIsSubraceFeaturePrereq","<th><label for='isSubraceFeaturePrereq'>Required Subraces:</label></th><td><select id='isSubraceFeaturePrereq' name='isSubraceFeaturePrereq' onchange='createSubracePrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Subraces</option><option value='Exclude'>Exclude Subraces</option></select></td>");
			nextRowIndex++;
		}

		if(mainFeatureType != "Class" && mainFeatureType != "Race"){
			addTableRow(tableID,nextRowIndex,"rowIsClassFeaturePrereq","<th><label for='isClassFeaturePrereq'>Required Classes:</label></th><td><select id='isClassFeaturePrereq' name='isClassFeaturePrereq' onchange='createClassPrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Classes</option><option value='Exclude'>Exclude Classes</option></select></td>");
			nextRowIndex++;
		}

		if(mainFeatureType != "Race"){
			addTableRow(tableID,nextRowIndex,"rowIsSubclassFeaturePrereq","<th><label for='isSubclassFeaturePrereq'>Required Subclasses:</label></th><td><select id='isSubclassFeaturePrereq' name='isSubclassFeaturePrereq' onchange='createSubclassPrerequisiteRows()'><option value=''>None</option><option value='Include'>Include Subclasses</option><option value='Exclude'>Exclude Subclasses</option></select></td>");
			nextRowIndex++;
		}
		
		if(mainFeatureType == "Class"){
			addTableRow(tableID,nextRowIndex,"rowClassLevelFeaturePrereq","<th><label for='ClassLevelFeaturePrereq'>Required <span id='ClassLevelFeaturePrereqName'>Class</span> Level:</label></th><td><select id='ClassLevelFeaturePrereq' name='ClassLevelFeaturePrereq'><option value=''>None</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option><option value=13>13</option><option value=14>14</option><option value=15>15</option><option value=16>16</option><option value=17>17</option><option value=18>18</option><option value=19>19</option><option value=20>20</option></select></td>");
			nextRowIndex++;

			document.getElementById("FeatureClass").addEventListener("change", async function(e){
				let className = this.value;
				let classDisplayName = await fetch("macro:pm.GetDisplayName@lib:pm.a5e.Core", {method: "POST", body: '["'+className+'","sb.Classes"]'});
				classDisplayName = await classDisplayName.text();

				document.getElementById("ClassLevelFeaturePrereqName").innerHTML = classDisplayName;
			});

			document.getElementById("FeatureClass").dispatchEvent(new Event("change"));
		}

		addTableRow(tableID,nextRowIndex,"rowTotalLevelFeaturePrereq","<th><label for='TotalLevelFeaturePrereq'>Required Total Level:</label></th><td><input type='checkbox' id='TotalLevelFeaturePrereq' name='TotalLevelFeaturePrereq'><option value=''>None</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option><option value=13>13</option><option value=14>14</option><option value=15>15</option><option value=16>16</option><option value=17>17</option><option value=18>18</option><option value=19>19</option><option value=20>20</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsFeatureFeaturePrereq","<th><label for='isFeatureFeaturePrereq'>Has Required Feature:</label></th><td><input type='checkbox' id='isFeatureFeaturePrereq' name='isFeatureFeaturePrereq' onchange='createFeaturePrerequisiteRows()'></td>");
		nextRowIndex++;

		//Note: May require any weapon of a class vs. all weapons of a class
		addTableRow(tableID,nextRowIndex,"rowIsWeaponProficiencyFeaturePrereq","<th><label for='isWeaponProficiencyFeaturePrereq'>Required Weapon Proficiencies:</label></th><td><select id='isWeaponProficiencyFeaturePrereq' name='isWeaponProficiencyFeaturePrereq' onchange='createWeaponProficiencyPrerequisiteRows()'><option value=''>None</option><option value='Class'>By Weapon Class</option><option value='Specific'>Specific Weapons</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsArmorProficiencyFeaturePrereq","<th><label for='isArmorProficiencyFeaturePrereq'>Required Armor Proficiencies:</label></th><td><select id='isArmorProficiencyFeaturePrereq' name='isArmorProficiencyFeaturePrereq' onchange='createArmorProficiencyPrerequisiteRows()'><option value=''>None</option><option value='Class'>By Armor Class</option><option value='Specific'>Specific Armor</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsSkillProficiencyFeaturePrereq","<th><label for='isSkillProficiencyFeaturePrereq'>Required Skill Proficiencies:</label></th><td><input type='checkbox' id='isSkillProficiencyFeaturePrereq' name='isSkillProficiencyFeaturePrereq' onchange='createSkillProficiencyPrerequisiteRows()'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsSaveProficiencyFeaturePrereq","<th><label for='isSaveProficiencyFeaturePrereq'>Required Save Proficiencies:</label></th><td><input type='checkbox' id='isSaveProficiencyFeaturePrereq' name='isSaveProficiencyFeaturePrereq' onchange='createSaveProficiencyPrerequisiteRows()'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsSpellFeaturePrereq","<th><label for='isSpellFeaturePrereq'>Required Spellcasting:</label></th><td><select id='isSpellFeaturePrereq' name='isSpellFeaturePrereq' onchange='createSpellPrerequisiteRows()'><option value=''>None</option><option value='Any'>Any Spell</option><option value='Specific'>Specific Spell</option></select></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsFeaturePrereqs","rowFeaturePrereqsEnd");
	}
}

async function createSkillProficiencyPrerequisiteRows(){

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
	document.getElementById('CreateFeatureTable').innerHTML = userdata.Input;

	ParentToken = userdata.ParentToken;

	document.getElementById("FeatureType").dispatchEvent(new Event("change"));

	if(document.getElementById("ConditionAssociatedFeature") != null){
		initializeConditionAssociatedFeature();
	}
}

setTimeout(loadUserData, 1);