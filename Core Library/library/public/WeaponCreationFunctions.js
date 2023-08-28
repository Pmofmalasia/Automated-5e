async function createWeaponTableRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;

	if(document.getElementById("isWearable")!=null){
		document.getElementById("isWearable").setAttribute("checked","");
	}

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTypes']"});
	let allWeaponTypes = await request.json();

	let WeaponTypeOptions = "";
	for(let tempWeaponType of allWeaponTypes){
		WeaponTypeOptions = WeaponTypeOptions + "<option value='"+tempWeaponType.Name+"'>"+tempWeaponType.DisplayName;
	}
	WeaponTypeOptions = WeaponTypeOptions+"</option><option value='NaturalWeapon'>Natural Weapon</option><option value='Unarmed'>Unarmed</option>";

	addTableRow(tableID,nextRowIndex,"rowWeaponType","<th><label for='WeaponType'>Weapon Type:</label></th><td><select id='WeaponType' name='WeaponType' onchange='createWeaponTypeRows("+'"'+tableID+'"'+")'><option value='@@NewType'>New Type</option>"+WeaponTypeOptions+"</select></td>");
	nextRowIndex++;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		createWeaponTypeRows(tableID);
		nextRowIndex++;
		nextRowIndex++;
	}

	addTableRow(tableID,nextRowIndex,"rowWeaponClass","<th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option><option value='Natural'>Natural</option><option value='Improvised'>Improvised</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponMeleeRanged","<th><label for='WeaponMeleeRanged'>Melee or Ranged:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='createWeaponRangeReachRows("+'"'+tableID+'",'+'"rowWeaponMeleeRanged"'+")'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponReach","<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>");
	nextRowIndex++;

	let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allAttributes = await requestAttributes.json();

	let AttributeOptions = "";
	for(let tempAttribute of allAttributes){
		AttributeOptions = AttributeOptions + "<option value='"+tempAttribute.Name+"'>"+tempAttribute.DisplayName+"</option>";
	}

	addTableRow(tableID,nextRowIndex,"rowWeaponPrimeStat","<th><label for='PrimeStat'>Main Stat:</label></th><td><select id='PrimeStat' name='PrimeStat'>"+AttributeOptions+"</select></td>");
	nextRowIndex++;

	let requestPropsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
	let allWeaponPropsData = await requestPropsData.json();

	let WeaponPropertyOptions = createHTMLMultiselectOptions(allWeaponPropsData,"weaponProperty","createWeaponPropertyRows",[tableID]);

	addTableRow(tableID,nextRowIndex,"rowWeaponProperties","<th>Weapon Properties:</th><td><div class='check-multiple' style='width:100%'>"+WeaponPropertyOptions+"</div></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponDamageHeader","<th text-align='center' colspan='2'>Weapon Damage:<input type='hidden' id='WeaponDamageInstanceNumber' name='WeaponDamageInstanceNumber' value=0></th>");
	nextRowIndex++;

	await addDamageTypeRows(tableID,"Weapon");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"'+tableID+'","Weapon"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"'+tableID+'","Weapon"'+")'></th>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponCritThresh","<th><label for='WeaponCritThresh'>Critical Threshhold:</label></th><td><input type='number' id='WeaponCritThresh' name='WeaponCritThresh' max='20' min='0' value='20'><select id='WeaponCritThreshMethod' name='WeaponCritThreshMethod'><option value='Set'>Set to Value</option><option value='Reduce'>Reduce by Value</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponCritDice","<th><label for='WeaponCritDice'>Bonus Crit Dice:</label></th><td><select id='WeaponCritDiceMethod' name='WeaponCritDiceMethod'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='WeaponCritDice' name='WeaponCritDice' min='0' value=0 style='width:25px'></td>");
	nextRowIndex++;
	
	let requestWeaponTagsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTags']"});
	let allWeaponTagsData = await requestWeaponTagsData.json();
	let WeaponTagOptions = createHTMLMultiselectOptions(allWeaponTagsData,"weaponTag");

	addTableRow(tableID,nextRowIndex,"rowWeaponTags","<th>Weapon Tags:</label></th><td><div class='check-multiple' style='width:100%'>"+WeaponTagOptions+"</div></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponEffect","<th><label for='isWeaponEffect'>Additional Effect on Hit:</label></th><td><input type='checkbox' id='isWeaponEffect' name='isWeaponEffect'></td>");
	nextRowIndex++;
}

async function createWeaponTypeRows(tableID){
	let nextRowIndex = document.getElementById("rowWeaponType").rowIndex + 1;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		//In GeneralCreateObjectFunctions
		createNewTemplateRows(tableID,nextRowIndex,"Weapon");
	}
	else{
		clearUnusedTable(tableID,"rowWeaponType","rowWeaponClass");

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTypes']"});
		let allWeaponTypes = await request.json();

		let WeaponTypeData;
		let WeaponTypeChoice = document.getElementById("WeaponType").value;
		for(let tempWeaponType of allWeaponTypes){
			if(tempWeaponType.Name == WeaponTypeChoice){
				WeaponTypeData = tempWeaponType;
			}
		}

		if(WeaponTypeData.WeaponClass != null){document.getElementById("WeaponClass").value = WeaponTypeData.WeaponClass;}

		if(WeaponTypeData.WeaponTags != null){
			for(let tempTag of WeaponTypeData.WeaponTags){
				document.getElementById("weaponTag"+tempTag).setAttribute("checked","");
			}
		}

		if(WeaponTypeData.WeaponMeleeRanged != null){
			document.getElementById("WeaponMeleeRanged").value = WeaponTypeData.WeaponMeleeRanged;
			document.getElementById("WeaponMeleeRanged").dispatchEvent(new Event('change'));
		}

		if(WeaponTypeData.WeaponDamage != null){
			clearUnusedTable(tableID,"rowWeaponDamageHeader","rowWeaponAddDamageInstanceButtons");
			document.getElementById("WeaponDamageInstanceNumber").value = 0;
			let i = 0;

			for(let tempInstance of WeaponTypeData.WeaponDamage){
				await addDamageTypeRows(tableID,"Weapon");
				document.getElementById("WeaponDamageType"+i).value = tempInstance.DamageType;
				document.getElementById("WeaponDamageDieNumber"+i).value = tempInstance.DamageDieNumber;
				document.getElementById("WeaponDamageDieSize"+i).value = tempInstance.DamageDieSize;
				document.getElementById("WeaponDamageBonus"+i).value = tempInstance.DamageFlatBonus;
				document.getElementById("WeaponAddDmgMod"+i).value = tempInstance.IsModBonus;
				i++;
			}
		}
//TODO: Currently only selects weapon properties and does not set the values for any selections, will need to add
		if(WeaponTypeData.WeaponProperties != null){
			for(let tempProperty of WeaponTypeData.WeaponProperties){
				document.getElementById("weaponProperty"+tempProperty).setAttribute("checked","");
				document.getElementById("weaponProperty"+tempProperty).dispatchEvent(new Event('change'));
			}
		}

		if(WeaponTypeData.Reach != null){document.getElementById("Reach").value = WeaponTypeData.Reach;}

		if(WeaponTypeData.Range != null){document.getElementById("Range").value = WeaponTypeData.Range;}

		if(WeaponTypeData.LongRange != null){document.getElementById("LongRange").value = WeaponTypeData.LongRange;}

		if(WeaponTypeData.MagicBonus != null){
			document.getElementById("MagicBonus").value = WeaponTypeData.MagicBonus;
		}

		if(WeaponTypeData.CritThresh != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThresh;
			document.getElementById("WeaponCritThreshMethod").value = "Set";
		}

		if(WeaponTypeData.CritThreshReduction != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThreshReduction;
			document.getElementById("WeaponCritThreshMethod").value = "Reduce";
		}

		updateWithTemplateData(tableID,WeaponTypeData);
	}
}

async function addDamageTypeRows(tableID,rowPrefix){
	let currentInstanceNumber = Number(document.getElementById(rowPrefix+"DamageInstanceNumber").value);
	let nextRowIndex = document.getElementById("row"+rowPrefix+"DamageHeader").rowIndex + 1 + currentInstanceNumber;

	let requestDamageData = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allDamageData = JSON.stringify(await requestDamageData.json());
	let requestDamageHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allDamageData+"]"});
	let DamageTypeOptions = await requestDamageHTML.text();

	addTableRow(tableID,nextRowIndex,"row"+rowPrefix+"Damage"+currentInstanceNumber,"<th text-align='center' colspan='2'><input type='number' id='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' min=0 value=6 style='width:25px'> + <input type='number' id='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' name='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' min=0 value=0 style='width:25px'> + <select id='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"' name='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='"+rowPrefix+"DamageType"+currentInstanceNumber+"' name='"+rowPrefix+"DamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");
	nextRowIndex++;

	if(rowPrefix=="Weapon" && document.getElementById("weaponPropertyVersatile") != null){
		if(document.getElementById("weaponPropertyVersatile").checked){
			addDamageTypeRows(tableID,"Versatile");
		}
	}

	currentInstanceNumber++;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;
}

function removeDamageTypeRows(tableID,rowPrefix){
	let currentInstanceNumber = document.getElementById(rowPrefix+"DamageInstanceNumber").value;
	currentInstanceNumber--;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;

	let table = document.getElementById(tableID);
	let currentInstanceRowIndex = document.getElementById("row"+rowPrefix+"Damage"+currentInstanceNumber).rowIndex;

	table.deleteRow(currentInstanceRowIndex);

	if(rowPrefix=="Weapon" && document.getElementById("weaponPropertyVersatile") != null){
		if(document.getElementById("weaponPropertyVersatile").checked){
			removeDamageTypeRows(tableID,"Versatile");
		}
	}
}

function createWeaponRangeReachRows(tableID,originID){
	let nextRowIndex = document.getElementById(originID).rowIndex + 1;

	let ReachInnerHTML = "<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>";
	let RangeInnerHTML = "<th><label for='Range'>Range:</label></th><td><input type='number' id='Range' name='Range' min='0' value='5' style='width:35px'> / <input type='number' id='LongRange' name='LongRange' min='0' value='5' style='width:35px'></td>";
	if(originID == "rowWeaponMeleeRanged"){
		clearUnusedTable(tableID,"rowWeaponMeleeRanged","rowWeaponPrimeStat");

		if(document.getElementById("WeaponMeleeRanged").value == "Melee"){
			addTableRow(tableID,nextRowIndex,"rowWeaponReach",ReachInnerHTML);
			nextRowIndex++;

			if(document.getElementById("PrimeStat").value == "Dexterity"){
				document.getElementById("PrimeStat").value = "Strength";
			}
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowWeaponRange",RangeInnerHTML);
			nextRowIndex++;

			if(document.getElementById("PrimeStat").value == "Strength"){
				document.getElementById("PrimeStat").value = "Dexterity";
			}
		}
	}
	else if(originID == "rowWeaponProperties"){
		addTableRow(tableID,nextRowIndex,"rowWeaponThrownRange",RangeInnerHTML);
		nextRowIndex++;
	}
}

async function createWeaponPropertyRows(toggledProperty,tableID){
	let nextRowIndex = document.getElementById("rowWeaponProperties").rowIndex + 1;
	let table = document.getElementById(tableID);

	if(toggledProperty == "Ammunition"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let WeaponAmmunitionTypeOptions = createHTMLMultiselectOptions(allAmmunitionTypes,"validWeaponAmmunition");

		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			addTableRow(tableID,nextRowIndex,"rowWeaponUsableAmmunition","<th>Usable Ammunition:</th><td><div class='check-multiple' style='width:100%'>"+WeaponAmmunitionTypeOptions+"</div></td>");
			nextRowIndex++;
		}
		else{
			table.deleteRow(document.getElementById("rowWeaponUsableAmmunition").rowIndex);
		}
	}
	else if(toggledProperty == "Thrown"){
		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			createWeaponRangeReachRows(tableID,"rowWeaponProperties");
		}
		else{
			table.deleteRow(document.getElementById("rowWeaponThrownRange").rowIndex);
		}
	}
	else if(toggledProperty == "Versatile"){
		nextRowIndex = document.getElementById("rowWeaponAddDamageInstanceButtons").rowIndex + 1;
		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			let weaponDamageInstanceNumber = Number(document.getElementById("WeaponDamageInstanceNumber").value);
			addTableRow(tableID,nextRowIndex,"rowVersatileDamageHeader","<th text-align='center' colspan='2'>Versatile Damage:<input type='hidden' id='VersatileDamageInstanceNumber' name='VersatileDamageInstanceNumber' value=0></th>");
			nextRowIndex++;

			for(let i = 0; i < weaponDamageInstanceNumber; i++){
				await addDamageTypeRows(tableID,"Versatile");
				nextRowIndex++;

				document.getElementById("VersatileDamageDieNumber"+i).value = document.getElementById("WeaponDamageDieNumber"+i).value;
				document.getElementById("VersatileDamageDieSize"+i).value = document.getElementById("WeaponDamageDieSize"+i).value;
				document.getElementById("VersatileDamageBonus"+i).value = document.getElementById("WeaponDamageBonus"+i).value;
				document.getElementById("VersatileAddDmgMod"+i).value = document.getElementById("WeaponAddDmgMod"+i).value;
				document.getElementById("VersatileDamageType"+i).value = document.getElementById("WeaponDamageType"+i).value;
			}

			addTableRow(tableID,nextRowIndex,"rowVersatileAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"'+tableID+'","Versatile"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"'+tableID+'","Versatile"'+")'></th>");
			nextRowIndex++;
		}
		else{
			clearUnusedTable(tableID,"rowWeaponAddDamageInstanceButtons","rowMagicBonus")
		}
	}
}