async function createWeaponTableRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;

	if(document.getElementById("isWearable")!=null){
		document.getElementById("isWearable").setAttribute("checked","");
	}
	if(document.getElementById("isStackable")!=null){
		document.getElementById("isStackable").checked = false;
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

	addTableRow(tableID,nextRowIndex,"rowWeaponClass","<th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='Natural'>Natural</option><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option><option value='Improvised'>Improvised</option></select></td>");
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

	addTableRow(tableID,nextRowIndex,"rowWeaponDamageHeader","<th style='text-align:center' colspan='2'>Weapon Damage:<input type='hidden' id='WeaponDamageInstanceNumber' name='WeaponDamageInstanceNumber' value=0></th>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWeaponDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"'+tableID+'","Weapon"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Weapon"'+")'></th>");

	await addDamageTypeRows(tableID,"Weapon");
	nextRowIndex = document.getElementById("rowWeaponDamageInstanceButtons").rowIndex + 1;

	addTableRow(tableID,nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
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
	let referenceRow = document.getElementById("rowWeaponType");
	let nextRowIndex = referenceRow.rowIndex + 1;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		//In GeneralCreateObjectFunctions
		createNewTemplateRows(referenceRow,"Weapon");
	}
	else{
		clearUnusedTable(tableID,"rowWeaponType","rowWeaponClass");

		if(document.getElementById("WeaponType").value == "NaturalWeapon"){
			let insertRowIndex = document.getElementById("rowWeaponPrimeStat").rowIndex + 1;

			addTableRow(tableID,insertRowIndex,"rowWeaponNotProficient","<th><label for='isWeaponNotProficient'>Weapon PREVENTS Proficiency:</label></th><td><input type='checkbox' id='isWeaponNotProficient' name='isWeaponNotProficient'></td>");

			document.getElementById("WeaponClass").value = "Natural";
		}
		else if(document.getElementById("rowWeaponNotProficient") != null){
			document.getElementById(tableID).deleteRow(document.getElementById("rowWeaponNotProficient").rowIndex);
		}

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

		let requestWeaponTagsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTags']"});
		let allWeaponTags = await requestWeaponTagsData.json();
		if(WeaponTypeData.WeaponTags != null){
			for(let tempTag of allWeaponTags){
				let thisWeaponTag = tempTag.Name;
				if(WeaponTypeData.WeaponTags.includes(thisWeaponTag)){
					document.getElementById("weaponTag"+thisWeaponTag).setAttribute("checked","");
				}
				else{
					document.getElementById("weaponTag"+thisWeaponTag).removeAttribute("checked","");
				}
			}
		}
		else{
			for(let tempTag of allWeaponTags){
				document.getElementById("weaponTag"+tempTag.Name).removeAttribute("checked","");
			}
		}

		if(WeaponTypeData.WeaponMeleeRanged != null){
			document.getElementById("WeaponMeleeRanged").value = WeaponTypeData.WeaponMeleeRanged;
			document.getElementById("WeaponMeleeRanged").dispatchEvent(new Event('change'));
		}

		clearUnusedTable(tableID,"rowWeaponDamageHeader","rowWeaponDamageInstanceButtons");
		if(WeaponTypeData.WeaponDamage != null){
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

		let requestWeaponPropertiesData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
		let allWeaponProperties = await requestWeaponPropertiesData.json();
		if(WeaponTypeData.WeaponProperties != null){
			for(let tempPropertyData of allWeaponProperties){
				let tempProperty = tempPropertyData.Name;
				if(WeaponTypeData.WeaponProperties.includes(tempProperty)){
					document.getElementById("weaponProperty"+tempProperty).setAttribute("checked","");
					await createWeaponPropertyRows(tempProperty,tableID);

					if(tempProperty == "Versatile"){
						//Remove automatically created rows
						clearUnusedTable(tableID,"rowVersatileDamageHeader","rowVersatileDamageInstanceButtons");
						document.getElementById("VersatileDamageInstanceNumber").value = 0;
						let i = 0;
						for(let tempInstance of WeaponTypeData.VersatileDamage){
							await addDamageTypeRows(tableID,"Versatile");
							document.getElementById("VersatileDamageType"+i).value = tempInstance.DamageType;
							document.getElementById("VersatileDamageDieNumber"+i).value = tempInstance.DamageDieNumber;
							document.getElementById("VersatileDamageDieSize"+i).value = tempInstance.DamageDieSize;
							document.getElementById("VersatileDamageBonus"+i).value = tempInstance.DamageFlatBonus;
							document.getElementById("VersatileAddDmgMod"+i).value = tempInstance.IsModBonus;
							i++;
						}
					}
					else if(tempProperty == "Ammunition"){
						let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes','Name','json']"});
						let allAmmunitionTypes = await request.json();

						for(let ammoType of allAmmunitionTypes){
							if(typeof WeaponTypeData.CompatibleAmmunition != "object"){
								document.getElementById("validWeaponAmmunition"+ammoType).removeAttribute("checked","");
							}
							else{
								if(WeaponTypeData.CompatibleAmmunition.includes(ammoType)){
									document.getElementById("validWeaponAmmunition"+ammoType).setAttribute("checked","");
								}
								else{
									document.getElementById("validWeaponAmmunition"+ammoType).removeAttribute("checked","");
								}								
							}

						}
					}		
				}
				else{
					document.getElementById("weaponProperty"+tempProperty).removeAttribute("checked","");
					document.getElementById("weaponProperty"+tempProperty).dispatchEvent(new Event('change'));
				}
			}
		}
		else{
			for(let tempPropertyData of allWeaponProperties){
				let tempProperty = tempPropertyData.Name;
				document.getElementById("weaponProperty"+tempProperty).removeAttribute("checked","");
				document.getElementById("weaponProperty"+tempProperty).dispatchEvent(new Event('change'));
			}
		}

		if(WeaponTypeData.Reach != null){document.getElementById("Reach").value = WeaponTypeData.Reach;}

		if(WeaponTypeData.Range != null){document.getElementById("Range").value = WeaponTypeData.Range;}

		if(WeaponTypeData.LongRange != null){document.getElementById("LongRange").value = WeaponTypeData.LongRange;}

		if(WeaponTypeData.MagicBonus != null){
			document.getElementById("MagicBonus").value = WeaponTypeData.MagicBonus;
		}
		else{
			document.getElementById("MagicBonus").value = 0;
		}

		if(WeaponTypeData.CritThresh != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThresh;
			document.getElementById("WeaponCritThreshMethod").value = "Set";
		}

		if(WeaponTypeData.CritThreshReduction != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThreshReduction;
			document.getElementById("WeaponCritThreshMethod").value = "Reduce";
		}
		
		if(WeaponTypeData.CritThreshReduction == null && WeaponTypeData.CritThreshReduction == null){
			document.getElementById("WeaponCritThresh").value = 0;
			document.getElementById("WeaponCritThreshMethod").value = "Set";
		}

		updateGenericObjectTemplate(WeaponTypeData);
	}
}

async function addDamageTypeRows(tableID,rowPrefix){
	let currentInstanceNumber = Number(document.getElementById(rowPrefix+"DamageInstanceNumber").value);
	let endRow = document.getElementById("row"+rowPrefix+"DamageInstanceButtons");

	let requestDamageData = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allDamageData = await requestDamageData.json();
	let DamageTypeOptions = createHTMLSelectOptions(allDamageData);

	addTableRow(tableID,endRow.rowIndex,"row"+rowPrefix+"Damage"+currentInstanceNumber,"<th style='text-align:center' colspan='2'><input type='number' id='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' min=0 value=6 style='width:25px'> + <input type='number' id='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' name='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' value=0 style='width:25px'> + <select id='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"' name='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='"+rowPrefix+"DamageType"+currentInstanceNumber+"' name='"+rowPrefix+"DamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");

	currentInstanceNumber++;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;
}

function removeDamageTypeRows(rowPrefix){
	let currentInstanceNumber = document.getElementById(rowPrefix+"DamageInstanceNumber").value;
	currentInstanceNumber--;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;

	let endRow = document.getElementById("row"+rowPrefix+"DamageInstanceButtons");
	if(endRow.previousElementSibling.id != "row"+rowPrefix+"DamageHeader"){
		endRow.previousElementSibling.remove();
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
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			table.deleteRow(document.getElementById("rowWeaponUsableAmmunition").rowIndex);
		}
		else if(document.getElementById("rowWeaponUsableAmmunition") == null){
			let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
			let allAmmunitionTypes = await request.json();
	
			let WeaponAmmunitionTypeOptions = createHTMLMultiselectOptions(allAmmunitionTypes,"validWeaponAmmunition");
	
			addTableRow(tableID,nextRowIndex,"rowWeaponUsableAmmunition","<th>Usable Ammunition:</th><td><div class='check-multiple' style='width:100%'>"+WeaponAmmunitionTypeOptions+"</div></td>");
			nextRowIndex++;
		}
	}
	else if(toggledProperty == "Thrown"){
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			table.deleteRow(document.getElementById("rowWeaponThrownRange").rowIndex);
		}
		else if(document.getElementById("rowWeaponThrownRange") == null){
			createWeaponRangeReachRows(tableID,"rowWeaponProperties");
		}
	}
	else if(toggledProperty == "Versatile"){
		endRow = document.getElementById("rowWeaponDamageInstanceButtons").nextElementSibling;
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			clearUnusedTable(tableID,"rowWeaponDamageInstanceButtons",document.getElementById("rowVersatileDamageInstanceButtons").nextElementSibling.id);
		}
		else if(document.getElementById("rowVersatileDamageHeader") == null){
			let weaponDamageInstanceNumber = Number(document.getElementById("WeaponDamageInstanceNumber").value);
			addTableRow(tableID,endRow.rowIndex,"rowVersatileDamageHeader","<th style='text-align:center' colspan='2'>Versatile Damage:<input type='hidden' id='VersatileDamageInstanceNumber' name='VersatileDamageInstanceNumber' value=0></th>");
			nextRowIndex++;

			addTableRow(tableID,endRow.rowIndex,"rowVersatileDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"'+tableID+'","Versatile"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Versatile"'+")'></th>");
			nextRowIndex++;

			//Sets default values and number of instances equal to main damage dice, for convenience
			for(let i = 0; i < weaponDamageInstanceNumber; i++){
				await addDamageTypeRows(tableID,"Versatile");
				nextRowIndex++;

				document.getElementById("VersatileDamageDieNumber"+i).value = document.getElementById("WeaponDamageDieNumber"+i).value;
				document.getElementById("VersatileDamageDieSize"+i).value = document.getElementById("WeaponDamageDieSize"+i).value;
				document.getElementById("VersatileDamageBonus"+i).value = document.getElementById("WeaponDamageBonus"+i).value;
				document.getElementById("VersatileAddDmgMod"+i).value = document.getElementById("WeaponAddDmgMod"+i).value;
				document.getElementById("VersatileDamageType"+i).value = document.getElementById("WeaponDamageType"+i).value;
			}
		}
	}
}