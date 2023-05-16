async function createWeaponTableRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).nextRowIndex + 1;

	if(document.getElementById("isWearable")!=null){
		document.getElementById("isWearable").setAttribute("checked","");
	}

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTypes']"});
	let allWeaponTypes = await request.json();

	let WeaponTypeOptions = "";
	for(let tempWeaponType of allWeaponTypes){
		WeaponTypeOptions = WeaponTypeOptions + "<option value='"+tempWeaponType.Name+"'>"+tempWeaponType.DisplayName+"</option>";
	}

	addTableRow(tableID,nextRowIndex,"rowWeaponType","<th><label for='WeaponType'>Weapon Type:</label></th><td><select id='WeaponType' name='WeaponType' onchange='createWeaponTypeRows("+'"'+tableID+'"'+")'><option value='@@NewType'>New Type</option>"+WeaponTypeOptions+"</select></td>");
	nextRowIndex++;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		createWeaponTypeRows(tableID);
		nextRowIndex++;
		nextRowIndex++;
	}

	addTableRow(tableID,nextRowIndex,"rowWeaponClass","<th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option><option value='Natural'>Natural</option></select></td>");
	nextRowIndex++;

	let requestWeaponTagsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTags']"});
	let allWeaponTagsData = JSON.stringify(await requestWeaponTagsData.json());
	let requestTagsHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allWeaponTagsData+",1,'weaponTag']"});
	let WeaponTagOptions = await requestTagsHTML.text();

	addTableRow(tableID,nextRowIndex,"rowWeaponTags","<th>Weapon Tags:</label></th><td><div class='check-multiple' style='width:100%'>"+WeaponTagOptions+"</div></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponMeleeRanged","<th><label for='WeaponMeleeRanged'>Melee or Ranged Weapon:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='createWeaponRangeReachRows("+'"rowWeaponMeleeRanged"'+")'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponReach","<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>");
	nextRowIndex++;

	let requestPropsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
	let allWeaponPropsData = JSON.stringify(await requestPropsData.json());

	let WeaponPropertyOptions = createHTMLMultiselectOptions(allWeaponPropsData,"weaponProperty","createWeaponPropertyRows");

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

	addTableRow(tableID,nextRowIndex,"rowWeaponCritDice","<th><label for='WeaponCritDice'>Bonus Crit Dice:</label></th><td><select id='WeaponCritDiceMethod' name='WeaponCritDiceMethod'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='WeaponCritDice' name='WeaponCritDice' min='0' value=0></td>");
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

		if(WeaponTypeData.WeaponProperties != null){
			for(let tempProperty of WeaponTypeData.WeaponProperties){
				document.getElementById("weaponProperty"+tempProperty).setAttribute("checked","");
				document.getElementById("weaponProperty"+tempProperty).dispatchEvent(new Event('change'));
			}
		}

		if(WeaponTypeData.Reach != null){document.getElementById("Reach").value = WeaponTypeData.Reach;}

		if(WeaponTypeData.Range != null){document.getElementById("Range").value = WeaponTypeData.Range;}

		if(WeaponTypeData.LongRange != null){document.getElementById("LongRange").value = WeaponTypeData.LongRange;}

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

	addTableRow(tableID,nextRowIndex,"row"+rowPrefix+"Damage"+currentInstanceNumber,"<th text-align='center' colspan='2'><input type='number' id='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' min=1 value=6 style='width:25px'> + <input type='number' id='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' name='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' min=0 value=0 style='width:25px'> + <select id='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"' name='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='"+rowPrefix+"DamageType"+currentInstanceNumber+"' name='"+rowPrefix+"DamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");
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