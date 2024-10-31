async function createWeaponTableRows(startRowID){
	let referenceElement = document.getElementById(startRowID);
	let endRow = createTableRow(referenceElement,"rowWeaponEnd","<th></th>");
	endRow.setAttribute("hidden","");

	if(document.getElementById("wornHeld")!=null){
		document.getElementById("wornHeld").value = "Held";
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

	referenceElement = createTableRow(referenceElement,"rowWeaponType","<th><label for='WeaponType'>Weapon Type:</label></th><td><select id='WeaponType' name='WeaponType' onchange='createWeaponTypeRows()'><option value='@@NewType'>New Type</option>"+WeaponTypeOptions+"</select></td>");

	if(document.getElementById("WeaponType").value == "@@NewType"){
		createWeaponTypeRows();
		referenceElement = endRow.previousElementSibling;
	}

	referenceElement = createTableRow(referenceElement,"rowWeaponClass","<th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='Natural'>Natural</option><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option><option value='Improvised'>Improvised</option></select></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponMeleeRanged","<th><label for='WeaponMeleeRanged'>Melee or Ranged:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='createWeaponRangeReachRows("+''+'"rowWeaponMeleeRanged"'+")'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponReach","<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>");

	let requestAttributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allAttributes = await requestAttributes.json();

	let AttributeOptions = "";
	for(let tempAttribute of allAttributes){
		AttributeOptions = AttributeOptions + "<option value='"+tempAttribute.Name+"'>"+tempAttribute.DisplayName+"</option>";
	}

	referenceElement = createTableRow(referenceElement,"rowWeaponPrimeStat","<th><label for='PrimeStat'>Main Stat:</label></th><td><select id='PrimeStat' name='PrimeStat'>"+AttributeOptions+"</select></td>");

	let requestPropsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
	let allWeaponPropsData = await requestPropsData.json();

	let WeaponPropertyOptions = createHTMLMultiselectOptions(allWeaponPropsData,"weaponProperty","createWeaponPropertyRows",[]);

	referenceElement = createTableRow(referenceElement,"rowWeaponProperties","<th>Weapon Properties:</th><td><div class='check-multiple' style='width:100%'>"+WeaponPropertyOptions+"</div></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponDamageHeader","<th style='text-align:center' colspan='2'>Weapon Damage:<input type='hidden' id='WeaponDamageInstanceNumber' name='WeaponDamageInstanceNumber' value=0></th>");

	referenceElement = createTableRow(referenceElement,"rowWeaponDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Weapon"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Weapon"'+")'></th>");

	await addDamageTypeRows("Weapon");
	referenceElement = document.getElementById("rowWeaponDamageInstanceButtons");

	referenceElement = createTableRow(referenceElement,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponCritThresh","<th><label for='WeaponCritThresh'>Critical Threshhold:</label></th><td><input type='number' id='WeaponCritThresh' name='WeaponCritThresh' max='20' min='0' value='20'><select id='WeaponCritThreshMethod' name='WeaponCritThreshMethod'><option value='Set'>Set to Value</option><option value='Reduce'>Reduce by Value</option></select></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponCritDice","<th><label for='WeaponCritDice'>Bonus Crit Dice:</label></th><td><select id='WeaponCritDiceMethod' name='WeaponCritDiceMethod'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='WeaponCritDice' name='WeaponCritDice' min='0' value=0 style='width:25px'></td>");
	
	let requestWeaponTagsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTags']"});
	let allWeaponTagsData = await requestWeaponTagsData.json();
	let WeaponTagOptions = createHTMLMultiselectOptions(allWeaponTagsData,"weaponTag");

	referenceElement = createTableRow(referenceElement,"rowWeaponTags","<th>Weapon Tags:</label></th><td><div class='check-multiple' style='width:100%'>"+WeaponTagOptions+"</div></td>");

	referenceElement = createTableRow(referenceElement,"rowWeaponEffect","<th><label for='isWeaponEffect'>Additional Effect on Hit:</label></th><td><input type='checkbox' id='isWeaponEffect' name='isWeaponEffect'></td>");
}

async function createWeaponTypeRows(){
	let referenceRow = document.getElementById("rowWeaponType");

	if(document.getElementById("WeaponType").value == "@@NewType"){
		//In GeneralCreateObjectFunctions
		createNewTemplateRows(referenceRow,"Weapon");
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowWeaponClass"));

		if(document.getElementById("WeaponType").value == "NaturalWeapon"){
			let insertRow = document.getElementById("rowWeaponPrimeStat");

			createTableRow(insertRow,"rowWeaponNotProficient","<th><label for='isWeaponNotProficient'>Weapon PREVENTS Proficiency:</label></th><td><input type='checkbox' id='isWeaponNotProficient' name='isWeaponNotProficient'></td>");

			document.getElementById("WeaponClass").value = "Natural";
		}
		else if(document.getElementById("rowWeaponNotProficient") != null){
			document.getElementById("rowWeaponNotProficient").remove();
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

		deleteInterveningElements(document.getElementById("rowWeaponDamageHeader"),document.getElementById("rowWeaponDamageInstanceButtons"));
		if(WeaponTypeData.WeaponDamage != null){
			document.getElementById("WeaponDamageInstanceNumber").value = 0;
			let i = 0;

			for(let tempInstance of WeaponTypeData.WeaponDamage){
				await addDamageTypeRows("Weapon");
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
					await createWeaponPropertyRows(tempProperty);

					if(tempProperty == "Versatile"){
						//Remove automatically created rows
						deleteInterveningElements(document.getElementById("rowVersatileDamageHeader"),document.getElementById("rowVersatileDamageInstanceButtons"));
						document.getElementById("VersatileDamageInstanceNumber").value = 0;
						let i = 0;
						for(let tempInstance of WeaponTypeData.VersatileDamage){
							await addDamageTypeRows("Versatile");
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

async function addDamageTypeRows(rowPrefix){
	let currentInstanceNumber = Number(document.getElementById(rowPrefix+"DamageInstanceNumber").value);
	let referenceElement = document.getElementById("row"+rowPrefix+"DamageInstanceButtons").previousElementSibling;

	let requestDamageData = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allDamageData = await requestDamageData.json();
	let DamageTypeOptions = createHTMLSelectOptions(allDamageData);

	referenceElement = createTableRow(referenceElement,"row"+rowPrefix+"Damage"+currentInstanceNumber,"<th style='text-align:center' colspan='2'><input type='number' id='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' min=0 value=6 style='width:25px'> + <input type='number' id='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' name='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' value=0 style='width:25px'> + <select id='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"' name='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='"+rowPrefix+"DamageType"+currentInstanceNumber+"' name='"+rowPrefix+"DamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");

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

function createWeaponRangeReachRows(originID){
	let referenceElement = document.getElementById(originID);

	let ReachInnerHTML = "<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>";
	let RangeInnerHTML = "<th><label for='Range'>Range:</label></th><td><input type='number' id='Range' name='Range' min='0' value='5' style='width:35px'> / <input type='number' id='LongRange' name='LongRange' min='0' value='5' style='width:35px'></td>";
	if(originID == "rowWeaponMeleeRanged"){
		deleteInterveningElements(referenceElement,document.getElementById("rowWeaponPrimeStat"));

		if(document.getElementById("WeaponMeleeRanged").value == "Melee"){
			referenceElement = createTableRow(referenceElement,"rowWeaponReach",ReachInnerHTML);

			if(document.getElementById("PrimeStat").value == "Dexterity"){
				document.getElementById("PrimeStat").value = "Strength";
			}
		}
		else{
			referenceElement = createTableRow(referenceElement,"rowWeaponRange",RangeInnerHTML);

			if(document.getElementById("PrimeStat").value == "Strength"){
				document.getElementById("PrimeStat").value = "Dexterity";
			}
		}
	}
	else if(originID == "rowWeaponProperties"){
		referenceElement = createTableRow(referenceElement,"rowWeaponThrownRange",RangeInnerHTML);
	}
}

async function createWeaponPropertyRows(toggledProperty){
	let referenceElement = document.getElementById("rowWeaponProperties");

	if(toggledProperty == "Ammunition"){
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			document.getElementById("rowWeaponUsableAmmunition").remove();
		}
		else if(document.getElementById("rowWeaponUsableAmmunition") == null){
			let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
			let allAmmunitionTypes = await request.json();
	
			let WeaponAmmunitionTypeOptions = createHTMLMultiselectOptions(allAmmunitionTypes,"validWeaponAmmunition");
	
			referenceElement = createTableRow(referenceElement,"rowWeaponUsableAmmunition","<th>Usable Ammunition:</th><td><div class='check-multiple' style='width:100%'>"+WeaponAmmunitionTypeOptions+"</div></td>");
		}
	}
	else if(toggledProperty == "Thrown"){
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			document.getElementById("rowWeaponThrownRange").remove();
		}
		else if(document.getElementById("rowWeaponThrownRange") == null){
			createWeaponRangeReachRows("rowWeaponProperties");
		}
	}
	else if(toggledProperty == "Versatile"){
		endRow = document.getElementById("rowWeaponDamageInstanceButtons").nextElementSibling;
		if(!document.getElementById("weaponProperty"+toggledProperty).checked){
			deleteInterveningElements(document.getElementById("rowWeaponDamageInstanceButtons"),document.getElementById("rowVersatileDamageInstanceButtons").nextElementSibling);
		}
		else if(document.getElementById("rowVersatileDamageHeader") == null){
			let weaponDamageInstanceNumber = Number(document.getElementById("WeaponDamageInstanceNumber").value);
			createTableRow(endRow.previousElementSibling,"rowVersatileDamageHeader","<th style='text-align:center' colspan='2'>Versatile Damage:<input type='hidden' id='VersatileDamageInstanceNumber' name='VersatileDamageInstanceNumber' value=0></th>");

			createTableRow(endRow.previousElementSibling,"rowVersatileDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Versatile"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Versatile"'+")'></th>");

			//Sets default values and number of instances equal to main damage dice, for convenience
			for(let i = 0; i < weaponDamageInstanceNumber; i++){
				await addDamageTypeRows("Versatile");

				document.getElementById("VersatileDamageDieNumber"+i).value = document.getElementById("WeaponDamageDieNumber"+i).value;
				document.getElementById("VersatileDamageDieSize"+i).value = document.getElementById("WeaponDamageDieSize"+i).value;
				document.getElementById("VersatileDamageBonus"+i).value = document.getElementById("WeaponDamageBonus"+i).value;
				document.getElementById("VersatileAddDmgMod"+i).value = document.getElementById("WeaponAddDmgMod"+i).value;
				document.getElementById("VersatileDamageType"+i).value = document.getElementById("WeaponDamageType"+i).value;
			}
		}
	}
}