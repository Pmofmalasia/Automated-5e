async function creatureTypeSelectionChanges(){
    let table = document.getElementById("rowCreatureType").closest("table");
    let nextRowIndex = document.getElementById("rowCreatureType").rowIndex + 1;
	let currentCreatureType = document.getElementById("CreatureType").value;

    let requestRaces = await fetch("macro:pm.GetRaces@lib:pm.a5e.Core", {method: "POST", body: ""});
    let PCRaces = await requestRaces.json();

	let finalPCRaces = [];
	for(let race of PCRaces){
		if(race.CreatureType == currentCreatureType){
			finalPCRaces.push(race);
		}
	}

    let request = await fetch("macro:pm.a5e.GetCreatureSubtypes@lib:pm.a5e.Core", {method: "POST", body: "['"+currentCreatureType+"']"});
    let NPCRaces = await request.json();

	for(let race of NPCRaces){
		finalPCRaces.push(race);
	}

	finalPCRaces.sort();
	let NPCRaceSelect = "<option value=''>None</option>"+createHTMLSelectOptions(finalPCRaces);

	document.getElementById("CreatureSubtype").innerHTML = NPCRaceSelect;
}

async function createArmorChoiceRows(){
	clearUnusedTable("MonsterCreationTable","rowIsNaturalArmor","rowMaxHP");
	let isNaturalArmor = document.getElementById("isNaturalArmor").checked;
	let nextRowIndex = document.getElementById("rowIsNaturalArmor").rowIndex + 1;

	if(isNaturalArmor){
		addTableRow("MonsterCreationTable",nextRowIndex,"rowAC","<th><label for='AC'>AC:</label></th><td><input type='number' id='AC' name='AC' min='1' style='width:25px'></td>");
		nextRowIndex++;
	}
	else{
		let ObjectRequest = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Objects']"});
		let allObjects = await ObjectRequest.json();

		let validObjects = [];
		for(let tempObject of allObjects){
			if(tempObject.Type == "Armor" && tempObject.ObjectTags.includes("StandardArmor")){
				validObjects.push(tempObject);
			}
		}
		let ArmorOptions = createHTMLSelectOptions(validObjects,"ObjectID");

		addTableRow("MonsterCreationTable",nextRowIndex,"rowArmorChoice","<th><label for='ArmorChoice'>Armor Worn:</label></th><td><select id='ArmorChoice' name='ArmorChoice'><option value=''>None</option>"+ArmorOptions+"</select></td>");
		nextRowIndex++;

		addTableRow("MonsterCreationTable",nextRowIndex,"rowIsShield","<th><label for='isShield'>Has Shield:</label></th><td><input type='checkbox' id='isShield' name='isShield'></td>");
		nextRowIndex++;
	}
}

async function createDamageTypeRows(damagePrefix){
    let table = document.getElementById("MonsterCreationTable");
    let nextRowIndex = document.getElementById("rowIs"+damagePrefix).rowIndex + 1;

    let request = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
    let damageTypes = await request.json();

    if(document.getElementById("Is"+damagePrefix).checked){
        for(let tempType of damageTypes){
            let tempID = damagePrefix+tempType.Name;
            let damageModRow = table.insertRow(nextRowIndex);
            damageModRow.id = "row"+tempID;
            damageModRow.innerHTML = "<th><label for='"+tempID+"'>"+tempType.DisplayName+" "+damagePrefix+":</label></th><td><select id='"+tempID+"' name='"+tempID+"'><option value=0>None</option><option value=1>Physical</option><option value=2>Magical</option><option value=3>All Damage</option></selected>";
            nextRowIndex++;
        }
    }
    else{
        for(let i=0; i < damageTypes.length; i++){
            table.deleteRow(nextRowIndex);
        }
    }
}

async function createConditionRows(){
    let table = document.getElementById("MonsterCreationTable");
    let nextRowIndex = document.getElementById("rowIsConditionImmun").rowIndex + 1;
    
    let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
    let conditionArray = await request.json();

    if(document.getElementById("IsConditionImmun").checked){
        for(let tempCondition of conditionArray){
            let tempID = tempCondition.Name+"Immunity";
            let conditionImmunRow = table.insertRow(nextRowIndex);
            conditionImmunRow.id = "row"+tempID;
            conditionImmunRow.innerHTML = "<th><label for='"+tempID+"'>"+tempCondition.DisplayName+" Immunity:</label></th><td><input type='checkbox' id='"+tempID+"' name='"+tempID+"'>";
            nextRowIndex++;
        }
    }
    else{
        for(let i=0; i < conditionArray.length; i++){
            table.deleteRow(nextRowIndex);
        }
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(MonsterCreation));
    let request = fetch("macro:MonsterCreationProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);