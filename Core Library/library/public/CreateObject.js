async function createObjectSubtypeRows(){
	clearUnusedTable("CreateObjectTable","rowObjectType","rowSize");
	let nextRowIndex = document.getElementById("rowObjectType").rowIndex+1;
	let ObjectType = document.getElementById("Type").value;

	if(ObjectType == "Weapon"){
		document.getElementById("isWearable").setAttribute("checked","");

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTypes']"});
		let allWeaponTypes = await request.json();

		let WeaponTypeOptions = "";
		for(let tempWeaponType of allWeaponTypes){
			WeaponTypeOptions = WeaponTypeOptions + "<option value='"+tempWeaponType.Name+"'>"+tempWeaponType.DisplayName+"</option>";
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponType","<th><label for='WeaponType'>Weapon Type:</label></th><td><select id='WeaponType' name='WeaponType' onchange='createWeaponTypeRows()'><option value='@@NewType'>New Type</option>"+WeaponTypeOptions+"</select></td>");
		nextRowIndex++;

		if(document.getElementById("WeaponType").value == "@@NewType"){
			createWeaponTypeRows();
			nextRowIndex++;
			nextRowIndex++;
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponClass","<th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option><option value='Natural'>Natural</option></select></td>");
		nextRowIndex++;

		let requestWeaponTagsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponTags']"});
		let allWeaponTagsData = JSON.stringify(await requestWeaponTagsData.json());
		let requestTagsHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allWeaponTagsData+",1,'weaponTag']"});
		let WeaponTagOptions = await requestTagsHTML.text();

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponTags","<th>Weapon Tags:</label></th><td><div class='check-multiple' style='width:100%'>"+WeaponTagOptions+"</div></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponMeleeRanged","<th><label for='WeaponMeleeRanged'>Melee or Ranged Weapon:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='createWeaponRangeReachRows("+'"rowWeaponMeleeRanged"'+")'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponReach","<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>");
		nextRowIndex++;

		let requestPropsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
		let allWeaponPropsData = JSON.stringify(await requestPropsData.json());
		let requestPropsHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allWeaponPropsData+",1,'weaponProperty','createWeaponPropertyRows']"});
		let WeaponPropertyOptions = await requestPropsHTML.text();

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponProperties","<th>Weapon Properties:</th><td><div class='check-multiple' style='width:100%'>"+WeaponPropertyOptions+"</div></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponDamageHeader","<th text-align='center' colspan='2'>Weapon Damage:<input type='hidden' id='WeaponDamageInstanceNumber' name='WeaponDamageInstanceNumber' value=0></th>");
		nextRowIndex++;

		await addDamageTypeRows("Weapon");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Weapon"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Weapon"'+")'></th>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponCritThresh","<th><label for='WeaponCritThresh'>Critical Threshhold:</label></th><td><input type='number' id='WeaponCritThresh' name='WeaponCritThresh' max='20' min='0' value='20'><select id='WeaponCritThreshMethod' name='WeaponCritThreshMethod'><option value='Set'>Set to Value</option><option value='Reduce'>Reduce by Value</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponCritDice","<th><label for='WeaponCritDice'>Bonus Crit Dice:</label></th><td><select id='WeaponCritDiceMethod' name='WeaponCritDiceMethod'><option value='Add'>Add</option><option value='Multiply'>Multiply</option></select><input type='number' id='WeaponCritDice' name='WeaponCritDice' min='0' value=0></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "Armor" || ObjectType == "Shield"){
		document.getElementById("isWearable").setAttribute("checked","");

		let allArmorTypes = "";
		if(ObjectType == "Armor"){
			addTableRow("CreateObjectTable",nextRowIndex,"rowArmorTier","<th><label for='ArmorTier'>Armor Tier:</label></th><td><select id='ArmorTier' name='ArmorTier' onchange='armorTierSelectionChanges()'><option value='Light'>Light</option><option value='Medium'>Medium</option><option value='Heavy'>Heavy</option></select></td>");
			nextRowIndex++;

			let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ArmorTypes']"});
			allArmorTypes = await request.json();
		}
		else{
			let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ShieldTypes']"});
			allArmorTypes = await request.json();
		}

		let ArmorTypeOptions = "";
		for(let tempArmorType of allArmorTypes){
			ArmorTypeOptions = ArmorTypeOptions + "<option value='"+tempArmorType.Name+"'>"+tempArmorType.DisplayName+"</option>";
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorType","<th><label for='ArmorType'>Armor Type:</label></th><td><select id='ArmorType' name='ArmorType' onchange='createArmorTypeRows("+'"'+ObjectType+'"'+")'>"+ArmorTypeOptions+"<option value='@@NewType'>New Type</option></select></td>");
		nextRowIndex++;

		if(document.getElementById("ArmorType").value == "@@NewType"){
			createArmorTypeRows(ObjectType);
			nextRowIndex++;
			nextRowIndex++;
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorBaseAC","<th><label for='ArmorBaseAC'>Base AC:</label></th><td><input type='number' id='ArmorBaseAC' name='ArmorBaseAC' min='0' value='11' style='width:25px'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorDexCap","<th><label for='ArmorDexCap'>Maximum Dexterity Bonus:</label></th><td><input type='number' id='ArmorDexCap' name='ArmorDexCap' min='0' value='2' style='width:25px' disabled><input type='checkbox' id='ArmorNoDexCap' name='ArmorNoDexCap' onchange='toggleFieldEnabled("+'"ArmorDexCap","ArmorNoDexCap"'+")' checked><label for='ArmorNoDexCap'> Unlimited?</label></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorStrengthReq","<th><label for='ArmorStrengthReq'>Strength Requirement:</label></th><td><input type='number' id='ArmorStrengthReq' name='ArmorStrengthReq' min='0' value='13' style='width:25px' disabled><input type='checkbox' id='ArmorNoStrengthReq' name='ArmorNoStrengthReq' onchange='toggleFieldEnabled("+'"ArmorStrengthReq","ArmorNoStrengthReq"'+")' checked><label for='ArmorNoStrengthReq'> No Requirement?</label></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorStealthDisadvantage","<th><label for='ArmorStealthDisadvantage'>Causes Stealth Disadvantage:</label></th><td><input type='checkbox' id='ArmorStealthDisadvantage' name='ArmorStealthDisadvantage'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "Ammunition"){
		document.getElementById("isWearable").setAttribute("checked","");
		
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let AmmunitionTypeOptions = "";
		for(let tempAmmunitionType of allAmmunitionTypes){
			AmmunitionTypeOptions = AmmunitionTypeOptions + "<option value='"+tempAmmunitionType.Name+"'>"+tempAmmunitionType.DisplayName+"</option>";
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowAmmunitionType","<th><label for='AmmunitionType'>Ammunition Type:</label></th><td><select id='AmmunitionType' name='AmmunitionType' onchange='createAmmunitionTypeRows()'><option value='@@NewType'>New Type</option>"+AmmunitionTypeOptions+"</select></td>");
		nextRowIndex++;
		
		if(document.getElementById("AmmunitionType").value == "@@NewType"){
			createAmmunitionTypeRows();
			nextRowIndex++;
			nextRowIndex++;
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowAmmunitionDamageHeader","<th text-align='center' colspan='2'>Additional Damage:<input type='hidden' id='AmmunitionDamageInstanceNumber' name='AmmunitionDamageInstanceNumber' value=0></th>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowAmmunitionAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Ammunition"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Ammunition"'+")'></th>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "CastingFocus"){
		document.getElementById("isWearable").setAttribute("checked","");
	}
	else if(ObjectType == "Container"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
	else if(ObjectType == "Hazard" || ObjectType == "Trap"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
	else if(ObjectType == "Potion"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
	else if(ObjectType == "Scroll"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
	else if(ObjectType == "Tool"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
	else if(ObjectType == "Vehicle"){
		document.getElementById("isWearable").removeAttribute("checked","");
	}
}

function updateWithTemplateData(TemplateData){
	if(TemplateData.Size != null){document.getElementById("Size").value = TemplateData.Size;}

	if(TemplateData.Rarity != null){document.getElementById("Rarity").value = TemplateData.Rarity;}

	if(TemplateData.Cost != null){document.getElementById("Cost").value = TemplateData.Cost;}

	if(TemplateData.CostUnits != null){document.getElementById("CostUnits").value = TemplateData.CostUnits;}

	if(TemplateData.Weight != null){document.getElementById("Weight").value = TemplateData.Weight;}

	let TemplateIsMagical = TemplateData.isMagical;
	if(TemplateIsMagical != null){
		if(TemplateIsMagical == 1){
			document.getElementById("isMagical").setAttribute("checked","");
			document.getElementById("isMagical").dispatchEvent(new Event('change'));

			if(TemplateData.isAttunement == 1){
				document.getElementById("isAttunement").setAttribute("checked","");
			}
			else{
				document.getElementById("isAttunement").removeAttribute("checked","");
			}
			
			if(TemplateData.isSentient == 1){
				document.getElementById("isSentient").setAttribute("checked","");
				document.getElementById("isSentient").dispatchEvent(new Event('change'));
				//TODO: Add sentient item data population once it has been added to the processing function
			}
			else{
				document.getElementById("isSentient").removeAttribute("checked","");
				document.getElementById("isSentient").dispatchEvent(new Event('change'));
			}
			
			if(TemplateData.isCursed == 1){
				document.getElementById("isCursed").setAttribute("checked","");
			}
			else{
				document.getElementById("isCursed").removeAttribute("checked","");
			}
		}
	}

	if(TemplateData.MaxResource != null){
		document.getElementById("isCharges").setAttribute("checked","");
		document.getElementById("isCharges").dispatchEvent(new Event('change'));

		document.getElementById("MaxResource").value = TemplateData.MaxResource;

		let RestoreInstances = new Array("ShortRest","LongRest","Dawn","StartTurn","Initiative");
		for(let tempInstance of RestoreInstances){
			if(TemplateData["Restore"+tempInstance] != null){
				document.getElementById("Restore"+tempInstance).setAttribute("checked","");
			}
			else{
				document.getElementById("Restore"+tempInstance).removeAttribute("checked","");
			}
		}
		
		let templateRestoreMethod = TemplateData.RestoreMethod;
		document.getElementById("RestoreMethod").value = templateRestoreMethod;
		document.getElementById("RestoreMethod").dispatchEvent(new Event('change'));

		if(templateRestoreMethod == "Fixed"){
			document.getElementById("RestoreAmount").value = TemplateData.RestoreAmount;
		}
		else if(templateRestoreMethod == "Rolled"){
			document.getElementById("RestoreAmountDieNumber").value = TemplateData.RestoreAmountDieNumber;
			document.getElementById("RestoreAmountDieSize").value = TemplateData.RestoreAmountDieSize;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
		else if(templateRestoreMethod == "Chance"){
			document.getElementById("RestoreChanceDieNumber").value = TemplateData.RestoreChanceDieNumber;
			document.getElementById("RestoreChanceDieSize").value = TemplateData.RestoreChanceDieSize;
			document.getElementById("RestoreChanceBonus").value = TemplateData.RestoreChanceBonus;
		}
		else if(templateRestoreMethod == "Attribute"){
			document.getElementById("RestoreAmountMultiplier").value = TemplateData.RestoreAmountMultiplier;
			document.getElementById("RestoreAmountAttribute").value = TemplateData.RestoreAmountAttribute;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
		else if(templateRestoreMethod == "Proficiency"){
			document.getElementById("RestoreAmountMultiplier").value = TemplateData.RestoreAmountMultiplier;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
	}

	let TemplateMaterials = TemplateData.Materials;
	let TemplateHasMaterial = 0;
	for(let tempMaterial of TemplateMaterials){
		document.getElementById("objectMaterial"+tempMaterial).setAttribute("checked","");
		TemplateHasMaterial = 1;
	}
	createChooseMainMaterialRows();

	if(TemplateHasMaterial == 1){
		if(TemplateData.MainMaterial != "@@Variable"){
			document.getElementById("MainMaterial").value = TemplateData.MainMaterial;
		}
	}

	document.getElementById("Coating").value = TemplateData.Coating;
	document.getElementById("Integrity").value = TemplateData.Integrity;
	document.getElementById("StateOfMatter").value = TemplateData.StateOfMatter;
	document.getElementById("isFlammable").value = TemplateData.isFlammable;
	document.getElementById("isMagnetic").value = TemplateData.isMagnetic;
}

function createNewTemplateRows(nextRowIndex,ObjectType){
	addTableRow("CreateObjectTable",nextRowIndex,"rowNewTypeName","<th><label for='NewTypeName'>New "+ObjectType+" Type Name:</label></th><td><input type='text' id='NewTypeName' name='NewTypeName'></td>");
	nextRowIndex++;
	
	addTableRow("CreateObjectTable",nextRowIndex,"rowIsNewTemplate","<th><label for='isNewTemplate'>Add New "+ObjectType+" as Template:</label></th><td><input type='checkbox' id='isNewTemplate' name='isNewTemplate' value=1></td>");
	nextRowIndex++;
}

async function createAmmunitionTypeRows(){
	let nextRowIndex = document.getElementById("rowAmmunitionType").rowIndex + 1;

	if(document.getElementById("AmmunitionType").value == "@@NewType"){
		createNewTemplateRows(nextRowIndex,"Ammunition");
	}
	else{
		clearUnusedTable("CreateObjectTable","rowAmmunitionType","rowAmmunitionDamageHeader");
		
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let AmmunitionTypeData;
		let AmmunitionTypeChoice = document.getElementById("AmmunitionType").value;
		for(let tempAmmunitionType of allAmmunitionTypes){
			if(tempAmmunitionType.Name == AmmunitionTypeChoice){
				AmmunitionTypeData = tempAmmunitionType;
			}
		}

		if(AmmunitionTypeData.AmmunitionDamage != null){
			clearUnusedTable("CreateObjectTable","rowAmmunitionDamageHeader","rowAmmunitionAddDamageInstanceButtons");
			document.getElementById("AmmunitionDamageInstanceNumber").value = 0;
			let i = 0;

			for(let tempInstance of AmmunitionTypeData.AmmunitionDamage){
				await addDamageTypeRows("Ammunition");
				document.getElementById("AmmunitionDamageType"+i).value = tempInstance.DamageType;
				document.getElementById("AmmunitionDamageDieNumber"+i).value = tempInstance.DamageDieNumber;
				document.getElementById("AmmunitionDamageDieSize"+i).value = tempInstance.DamageDieSize;
				document.getElementById("AmmunitionDamageBonus"+i).value = tempInstance.DamageFlatBonus;
				document.getElementById("AmmunitionAddDmgMod"+i).value = tempInstance.IsModBonus;
				i++;
			}
		}

		if(AmmunitionTypeData.MagicBonus != null){
			document.getElementById("MagicBonus").value = AmmunitionTypeData.MagicBonus;
		}

		updateWithTemplateData(AmmunitionTypeData);
	}
}

async function createArmorTypeRows(ArmorOrShield){
	let nextRowIndex = document.getElementById("rowArmorType").rowIndex + 1;

	if(document.getElementById("ArmorType").value == "@@NewType"){
		createNewTemplateRows(nextRowIndex,ArmorOrShield);
	}
	else{
		clearUnusedTable("CreateObjectTable","rowArmorType","rowArmorBaseAC");
		
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb."+ArmorOrShield+"Types']"});
		let allArmorTypes = await request.json();

		let ArmorTypeData;
		let ArmorTypeChoice = document.getElementById("ArmorType").value;
		for(let tempArmorType of allArmorTypes){
			if(tempArmorType.Name == ArmorTypeChoice){
				ArmorTypeData = tempArmorType;
			}
		}

		if(ArmorOrShield == "Armor"){
			if(ArmorTypeData.ArmorTier != null){
				document.getElementById("ArmorTier").value = ArmorTypeData.ArmorTier;
			}
		}

		if(ArmorTypeData.BaseAC != null){
			document.getElementById("ArmorBaseAC").value = ArmorTypeData.BaseAC;
		}

		if(ArmorTypeData.isDexterityCap != null){
			if(ArmorTypeData.isDexterityCap == 1){
				document.getElementById("ArmorNoDexCap").removeAttribute("checked","");
				document.getElementById("ArmorNoDexCap").dispatchEvent(new Event('change'));
				document.getElementById("ArmorDexCap").value = ArmorTypeData.DexterityCap;
			}
			else{
				document.getElementById("ArmorNoDexCap").setAttribute("checked","");
				document.getElementById("ArmorNoDexCap").dispatchEvent(new Event('change'));
			}
		}

		if(ArmorTypeData.isStrengthRequirement != null){
			if(ArmorTypeData.isStrengthRequirement == 1){
				document.getElementById("ArmorNoStrengthReq").removeAttribute("checked","");
				document.getElementById("ArmorNoStrengthReq").dispatchEvent(new Event('change'));
				document.getElementById("ArmorStrengthReq").value = ArmorTypeData.StrengthRequirement;
			}
			else{
				document.getElementById("ArmorNoStrengthReq").setAttribute("checked","");
				document.getElementById("ArmorNoStrengthReq").dispatchEvent(new Event('change'));
			}
		}

		if(ArmorTypeData.isStealthDisadvantage != null){
			if(ArmorTypeData.isStealthDisadvantage == 1){
				document.getElementById("ArmorStealthDisadvantage").setAttribute("checked","");
			}
			else{
				document.getElementById("ArmorStealthDisadvantage").removeAttribute("checked","");
			}
		}

		if(ArmorTypeData.MagicBonus != null){
			document.getElementById("MagicBonus").value = ArmorTypeData.MagicBonus;
		}

		updateWithTemplateData(ArmorTypeData);
	}
}

async function createWeaponTypeRows(){
	let nextRowIndex = document.getElementById("rowWeaponType").rowIndex + 1;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		createNewTemplateRows(nextRowIndex,"Weapon");
	}
	else{
		clearUnusedTable("CreateObjectTable","rowWeaponType","rowWeaponClass");

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
			clearUnusedTable("CreateObjectTable","rowWeaponDamageHeader","rowWeaponAddDamageInstanceButtons");
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

		updateWithTemplateData(WeaponTypeData);
	}
}

function createWeaponRangeReachRows(originID){
	let nextRowIndex = document.getElementById(originID).rowIndex + 1;

	let ReachInnerHTML = "<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>";
	let RangeInnerHTML = "<th><label for='Range'>Range:</label></th><td><input type='number' id='Range' name='Range' min='0' value='5' style='width:35px'> / <input type='number' id='LongRange' name='LongRange' min='0' value='5' style='width:35px'></td>";
	if(originID == "rowWeaponMeleeRanged"){
		clearUnusedTable("CreateObjectTable","rowWeaponMeleeRanged","rowWeaponProperties");

		if(document.getElementById("WeaponMeleeRanged").value == "Melee"){
			addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponReach",ReachInnerHTML);
			nextRowIndex++;
		}
		else{
			addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponRange",RangeInnerHTML);
			nextRowIndex++;
		}
	}
	else if(originID == "rowWeaponProperties"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponThrownRange",RangeInnerHTML);
		nextRowIndex++;
	}
}

async function createWeaponPropertyRows(toggledProperty){
	let nextRowIndex = document.getElementById("rowWeaponProperties").rowIndex + 1;
	let table = document.getElementById("CreateObjectTable");

	if(toggledProperty == "Ammunition"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let WeaponAmmunitionTypeOptions = createHTMLMultiselectOptions(allAmmunitionTypes,"validWeaponAmmunition");

		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponUsableAmmunition","<th>Usable Ammunition:</th><td><div class='check-multiple' style='width:100%'>"+WeaponAmmunitionTypeOptions+"</div></td>");
			nextRowIndex++;
		}
		else{
			table.deleteRow(document.getElementById("rowWeaponUsableAmmunition").rowIndex);
		}
	}
	else if(toggledProperty == "Thrown"){
		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			createWeaponRangeReachRows("rowWeaponProperties");
		}
		else{
			table.deleteRow(document.getElementById("rowWeaponThrownRange").rowIndex);
		}
	}
	else if(toggledProperty == "Versatile"){
		nextRowIndex = document.getElementById("rowWeaponAddDamageInstanceButtons").rowIndex + 1;
		if(document.getElementById("weaponProperty"+toggledProperty).checked){
			let weaponDamageInstanceNumber = Number(document.getElementById("WeaponDamageInstanceNumber").value);
			addTableRow("CreateObjectTable",nextRowIndex,"rowVersatileDamageHeader","<th text-align='center' colspan='2'>Versatile Damage:<input type='hidden' id='VersatileDamageInstanceNumber' name='VersatileDamageInstanceNumber' value=0></th>");
			nextRowIndex++;

			for(let i = 0; i < weaponDamageInstanceNumber; i++){
				await addDamageTypeRows("Versatile");
				nextRowIndex++;

				document.getElementById("VersatileDamageDieNumber"+i).value = document.getElementById("WeaponDamageDieNumber"+i).value;
				document.getElementById("VersatileDamageDieSize"+i).value = document.getElementById("WeaponDamageDieSize"+i).value;
				document.getElementById("VersatileDamageBonus"+i).value = document.getElementById("WeaponDamageBonus"+i).value;
				document.getElementById("VersatileAddDmgMod"+i).value = document.getElementById("WeaponAddDmgMod"+i).value;
				document.getElementById("VersatileDamageType"+i).value = document.getElementById("WeaponDamageType"+i).value;
			}

			addTableRow("CreateObjectTable",nextRowIndex,"rowVersatileAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Versatile"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Versatile"'+")'></th>");
			nextRowIndex++;
		}
		else{
			clearUnusedTable("CreateObjectTable","rowWeaponAddDamageInstanceButtons","rowMagicBonus")
		}
	}
}

async function addDamageTypeRows(rowPrefix){
	let currentInstanceNumber = Number(document.getElementById(rowPrefix+"DamageInstanceNumber").value);
	let nextRowIndex = document.getElementById("row"+rowPrefix+"DamageHeader").rowIndex + 1 + currentInstanceNumber;

	let requestDamageData = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allDamageData = JSON.stringify(await requestDamageData.json());
	let requestDamageHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allDamageData+"]"});
	let DamageTypeOptions = await requestDamageHTML.text();

	addTableRow("CreateObjectTable",nextRowIndex,"row"+rowPrefix+"Damage"+currentInstanceNumber,"<th text-align='center' colspan='2'><input type='number' id='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' name='"+rowPrefix+"DamageDieSize"+currentInstanceNumber+"' min=1 value=6 style='width:25px'> + <input type='number' id='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' name='"+rowPrefix+"DamageBonus"+currentInstanceNumber+"' min=0 value=0 style='width:25px'> + <select id='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"' name='"+rowPrefix+"AddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='"+rowPrefix+"DamageType"+currentInstanceNumber+"' name='"+rowPrefix+"DamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");
	nextRowIndex++;

	if(rowPrefix=="Weapon" && document.getElementById("weaponPropertyVersatile") != null){
		if(document.getElementById("weaponPropertyVersatile").checked){
			addDamageTypeRows("Versatile");
		}
	}

	currentInstanceNumber++;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;
}

function removeDamageTypeRows(rowPrefix){
	let currentInstanceNumber = document.getElementById(rowPrefix+"DamageInstanceNumber").value;
	currentInstanceNumber--;
	document.getElementById(rowPrefix+"DamageInstanceNumber").value = currentInstanceNumber;

	let table = document.getElementById("CreateObjectTable");
	let currentInstanceRowIndex = document.getElementById("row"+rowPrefix+"Damage"+currentInstanceNumber).rowIndex;

	table.deleteRow(currentInstanceRowIndex);

	if(rowPrefix=="Weapon" && document.getElementById("weaponPropertyVersatile") != null){
		if(document.getElementById("weaponPropertyVersatile").checked){
			removeDamageTypeRows("Versatile");
		}
	}
}

function MagicBonusChanges(){
	if(document.getElementById("MagicBonus").value > 0){
		if(document.getElementById("isMagical").checked == false){
			document.getElementById("isMagical").setAttribute("checked","");
			createMagicItemRows();
		}
	}
}

function createMagicItemRows(){
	if(document.getElementById("isMagical").checked){
		let nextRowIndex = document.getElementById("rowIsMagical").rowIndex+1;

		addTableRow("CreateObjectTable",nextRowIndex,"rowIsAttunement","<th><label for='isAttunement'>Requires Attunement:</label></th><td><input type='checkbox' id='isAttunement' name='isAttunement'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowIsSentient","<th><label for='isSentient'>Item is Sentient:</label></th><td><input type='checkbox' id='isSentient' name='isSentient' onchange='createSentientItemRows()'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowIsCursed","<th><label for='isCursed'>Item is Cursed:</label></th><td><input type='checkbox' id='isCursed' name='isCursed'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowIsMagical","rowIsWearable");
	}
}

function createSentientItemRows(){
	if(document.getElementById("isSentient").checked){
		let nextRowIndex = document.getElementById("rowIsSentient").rowIndex+1;

		addTableRow("CreateObjectTable",nextRowIndex,"rowSentientAlignment","<th><label for='sentientAlignment'>Item Alignment:</label></th><td><select id='sentientAlignment' name='sentientAlignment'><option value='LawfulGood'>Lawful Good</option><option value='NeutralGood'>Neutral Good</option><option value='ChaoticGood'>Chaotic Good</option><option value='LawfulNeutral'>Lawful Neutral</option><option value='TrueNeutral'>True Neutral</option><option value='ChaoticNeutral'>Chaotic Neutral</option><option value='LawfulEvil'>Lawful Evil</option><option value='NeutralEvil'>Neutral Evil</option><option value='ChaoticEvil'>Chaotic Evil</option><option value='Unaligned'>Unaligned</option><option value='Undetermined'>Undetermined</option></select></td>");
		nextRowIndex++;

		//TODO: Add lines for all mental stats here procedurally; add vision/hearing distances; add communication method/language

		addTableRow("CreateObjectTable",nextRowIndex,"rowHasSight","<th><label for='hasSight'>Item can See:</label></th><td><input type='checkbox' id='hasSight' name='hasSight' onchange='createSentientItemSightRows()'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowHasHearing","<th><label for='hasHearing'>Item can Hear:</label></th><td><input type='checkbox' id='hasHearing' name='hasHearing' onchange='createSentientItemHearingRows()'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowIsSentient","rowIsCursed");
	}
}

function createChargesRows(){
	if(document.getElementById("isCharges").checked){
		let nextRowIndex = document.getElementById("rowIsCharges").rowIndex+1;

		addTableRow("CreateObjectTable",nextRowIndex,"rowMaxCharges","<th><label for='MaxResource'>Maximum Number of Charges:</label></th><td><input type='number' id='MaxResource' name='MaxResource' min='0' value='0' style='width:35px'></td>");
		nextRowIndex++;
		
		addTableRow("CreateObjectTable",nextRowIndex,"rowRechargeWhen","<th>Instances When Resource Recharges:</th><td><div class='check-multiple' style='width:100%'><label><input type='checkbox' id='RestoreShortRest' name='RestoreShortRest'><span>Short Rest</span></label><label><input type='checkbox' id='RestoreLongRest' name='RestoreLongRest'><span>Long Rest</span></label><label><input type='checkbox' id='RestoreDawn' name='RestoreDawn'><span>Dawn</span></label><label><input type='checkbox' id='RestoreStartTurn' name='RestoreStartTurn'><span>Start of Turn</span></label><label><input type='checkbox' id='RestoreInitiative' name='RestoreInitiative'><span>Rolling Initiative</span></label></div></td>");
		nextRowIndex++;
		
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreMethod","<th><label for='RestoreMethod'>Recharge Method:</label></th><td><select id='RestoreMethod' name='RestoreMethod' onchange='createRestoreMethodRows()'><option value='Full'>Fully Recharge</option><option value='Fixed'>Fixed Amount Regained</option><option value='Rolled'>Rolled Amount</option><option value='Chance'>Chance to Recharge</option><option value='Attribute'>Based on Attribute</option><option value='Proficiency'>Based on Proficiency</option></select></td>");
		nextRowIndex++;
		
		addTableRow("CreateObjectTable",nextRowIndex,"rowHasDepletedEffect","<th><label for='HasDepletedEffect'>Effect Occurs when Charges Depleted:</label></th><td><input type='checkbox' id='HasDepletedEffect' name='HasDepletedEffect' onchange='createChargeDepletedRows()'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowIsCharges","rowMaterials");
	}
}

async function createRestoreMethodRows(){
	clearUnusedTable("CreateObjectTable","rowRestoreMethod","rowHasDepletedEffect");
	let nextRowIndex = document.getElementById("rowRestoreMethod").rowIndex+1;
	
	if(document.getElementById("RestoreMethod").value == "Fixed"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmount'>Amount Recharged:</label></th><td><input type='number' id='RestoreAmount' name='RestoreAmount' min='0' value='1' style='width:35px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Rolled"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountDieNumber'>Amount Recharged:</label></th><td><input type='number' id='RestoreAmountDieNumber' name='RestoreAmountDieNumber' min='0' value='1' style='width:25px'> d <input type='number' id='RestoreAmountDieSize' name='RestoreAmountDieSize' min='0' value='6' style='width:25px'> + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Chance"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreChance","<th><label for='RestoreChanceDieNumber'>Dice Rolled:</label></th><td><input type='number' id='RestoreChanceDieNumber' name='RestoreChanceDieNumber' min='0' value='1' style='width:25px'> d <input type='number' id='RestoreChanceDieSize' name='RestoreChanceDieSize' min='0' value='6' style='width:25px'> + <input type='number' id='RestoreChanceBonus' name='RestoreChanceBonus' value=0 style='width:25px'></td>");
		
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreChanceTarget","<th><label for='RestoreChanceTarget'>Minimum Successful Recharge Roll:</label></th><td><input type='number' id='RestoreChanceTarget' name='RestoreChanceTarget' min='0' value='5' style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Attribute"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();
		let AttributeOptions = "";
		for(let tempAttribute of attributeList){
			AttributeOptions = AttributeOptions + "<option value='"+tempAttribute.Name+"'>"+tempAttribute.DisplayName+"</option>";
		}

		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountMultiplier'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier' name='RestoreAmountMultiplier' min='0' value='1' style='width:25px'> * <select id='RestoreAmountAttribute' name='RestoreAmountAttribute'>"+AttributeOptions+"</select>) + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Proficiency"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountMultiplier'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier' name='RestoreAmountMultiplier' min='0' value='1' style='width:25px'> * Proficiency) + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
}

async function createChooseMainMaterialRows(){
	let nextRowIndex = document.getElementById("rowMaterials").rowIndex+1;

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectMaterials']"});
	let allMaterials = await request.json();

	let chosenMaterials = [];
	for(let tempMaterial of allMaterials){
		if(document.getElementById("objectMaterial"+tempMaterial.Name).checked){
			chosenMaterials.push(tempMaterial);
		}
	}
//TODO: Add selection of appropriate ObjectTags here, based on tags on the materials
	if(chosenMaterials.length > 1){
		let mainMaterialOptions = "";
		for(let tempChosenMaterial of chosenMaterials){
			mainMaterialOptions = mainMaterialOptions + "<option value='"+tempChosenMaterial.Name+"'>"+tempChosenMaterial.DisplayName+"</option>";
		}

		if(document.getElementById("rowMainMaterial") == null){
			addTableRow("CreateObjectTable",nextRowIndex,"rowMainMaterial","<th><label for='MainMaterial'>Main Material:</label></th><td><select id='MainMaterial' name='MainMaterial'>"+mainMaterialOptions+"</select></td>");
			nextRowIndex++;
		}
		else{
			let priorSelection = document.getElementById("MainMaterial").value;
			document.getElementById("MainMaterial").innerHTML = mainMaterialOptions;
			document.getElementById("MainMaterial").value = priorSelection;
		}
	}
	else{
		if(document.getElementById("rowMainMaterial") != null){
			document.getElementById("CreateObjectTable").deleteRow(nextRowIndex)
		}
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateObjectTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);