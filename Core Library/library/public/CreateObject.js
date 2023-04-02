async function createObjectSubtypeRows(){
	clearUnusedTable("CreateObjectTable","rowObjectType","rowSize");
	let nextRowIndex = document.getElementById("rowObjectType").rowIndex+1;

	if(document.getElementById("Type").value == "Weapon"){
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

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponMeleeRanged","<th><label for='WeaponMeleeRanged'>Melee or Ranged Weapon:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='createWeaponRangeReachRows("+'rowWeaponMeleeRanged'+")'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponReach","<th><label for='Reach'>Reach:</label></th><td><input type='number' id='Reach' name='Reach' min='0' value='5' style='width:25px'></td>");
		nextRowIndex++;

		let requestPropsData = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.WeaponProperties']"});
		let allWeaponPropsData = JSON.stringify(await requestPropsData.json());
		let requestPropsHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allWeaponPropsData+",1,'weaponProperty','createWeaponPropertyRows']"});
		let WeaponPropertyOptions = await requestPropsHTML.text();

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponProperties","<th>Weapon Properties:</th><td><div class='check-multiple' style='width:100%'>"+WeaponPropertyOptions+"</div></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponDamageHeader","<th text-align='center' colspan='2'>Weapon Damage:<input type='hidden' id='weaponDamageInstanceNumber' name='weaponDamageInstanceNumber' value=0></th>");
		nextRowIndex++;

		await addWeaponDamageTypeRows();
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addWeaponDamageTypeRows()'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeWeaponDamageTypeRows()'></th>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponMagicBonus","<th><label for='WeaponMagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='WeaponMagicBonus' name='WeaponMagicBonus' min='0' value='0' style='width:25px' onchange='weaponMagicBonusChanges()'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponCritThresh","<th><label for='WeaponCritThresh'>Critical Threshhold:</label></th><td><input type='number' id='WeaponCritThresh' name='WeaponCritThresh' max='20' min='0' value='20'><select id='WeaponCritThreshMethod' name='WeaponCritThreshMethod'><option value='Set'>Set to Value</option><option value='Reduce'>Reduce by Value</option></select></td>");
		nextRowIndex++;
	}
	else if(document.getElementById("Type").value == "Armor" || document.getElementById("Type").value == "Shield"){
		let allArmorTypes = "";
		if(document.getElementById("Type").value == "Armor"){
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

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorType","<th><label for='ArmorType'>Armor Type:</label></th><td><select id='ArmorType' name='ArmorType' onchange='createArmorTypeRows()'>"+ArmorTypeOptions+"<option value='@@NewType'>New Type</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorBaseAC","<th><label for='ArmorBaseAC'>Base AC:</label></th><td><input type='number' id='ArmorBaseAC' name='ArmorBaseAC' min='0' value='11' style='width:25px'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorDexCap","<th><label for='ArmorDexCap'>Maximum Dexterity Bonus:</label></th><td><input type='number' id='ArmorDexCap' name='ArmorDexCap' min='0' value='2' style='width:25px' disabled><input type='checkbox' id='ArmorNoDexCap' name='ArmorNoDexCap' onchange='toggleFieldEnabled("+'"ArmorDexCap","ArmorNoDexCap"'+")' checked><label for='ArmorNoDexCap'> Unlimited?</label></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorStrengthReq","<th><label for='ArmorStrengthReq'>Strength Requirement:</label></th><td><input type='number' id='ArmorStrengthReq' name='ArmorStrengthReq' min='0' value='13' style='width:25px' disabled><input type='checkbox' id='ArmorNoStrengthReq' name='ArmorNoStrengthReq' onchange='toggleFieldEnabled("+'"ArmorStrengthReq","ArmorNoStrengthReq"'+")' checked><label for='ArmorNoStrengthReq'> No Requirement?</label></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorStealthDisadvantage","<th><label for='ArmorStealthDisadvantage'>Causes Stealth Disadvantage:</label></th><td><input type='checkbox' id='ArmorStealthDisadvantage' name='ArmorStealthDisadvantage'></td>");
		nextRowIndex++;
	}
	else if(document.getElementById("Type").value == "Ammunition"){
		
	}
	else if(document.getElementById("Type").value == "CastingFocus"){
		
	}
	else if(document.getElementById("Type").value == "Container"){
		
	}
	else if(document.getElementById("Type").value == "Ammunition"){
		
	}
	else if(document.getElementById("Type").value == "Hazard" || document.getElementById("Type").value == "Trap"){
		
	}
	else if(document.getElementById("Type").value == "Potion"){
		
	}
	else if(document.getElementById("Type").value == "Scroll"){
		
	}
	else if(document.getElementById("Type").value == "Tool"){
		
	}
	else if(document.getElementById("Type").value == "Vehicle"){
		
	}
}

async function createWeaponTypeRows(){
	let nextRowIndex = document.getElementById("rowWeaponType").rowIndex + 1;

	if(document.getElementById("WeaponType").value == "@@NewType"){
		addTableRow("CreateObjectTable",nextRowIndex,"rowNewWeaponTypeName","<th><label for='NewWeaponTypeName'>New Weapon Type Name:</label></th><td><input type='text' id='NewWeaponTypeName' name='NewWeaponTypeName'></td>");
		nextRowIndex++;
		
		addTableRow("CreateObjectTable",nextRowIndex,"rowIsNewWeaponTemplate","<th><label for='isNewWeaponTemplate'>Add New Weapon as Template:</label></th><td><input type='checkbox' id='isNewWeaponTemplate' name='isNewWeaponTemplate' value=1></td>");
		nextRowIndex++;
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
			document.getElementById("weaponDamageInstanceNumber").value = 0;
			let i = 0;

			for(let tempInstance of WeaponTypeData.WeaponDamage){
				await addWeaponDamageTypeRows();
				document.getElementById("WeaponDamageType"+i).value = tempInstance.DamageType;
				document.getElementById("WeaponDamageDieNumber"+i).value = tempInstance.DamageDieNumber;
				document.getElementById("WeaponDamageDieSize"+i).value = tempInstance.DamageDieSize;
				document.getElementById("WeaponDamageBonus"+i).value = tempInstance.DamageFlatBonus;
				document.getElementById("WeaponAddDmgMod"+i).value = tempInstance.IsModBonus;
				i++;
			}
		}

		if(WeaponTypeData.WeaponMagicBonus != null){
			document.getElementById("WeaponMagicBonus").value = WeaponTypeData.WeaponMagicBonus;
		}

		if(WeaponTypeData.CritThresh != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThresh;
			document.getElementById("WeaponCritThreshMethod").value = "Set";
		}

		if(WeaponTypeData.CritThreshReduction != null){
			document.getElementById("WeaponCritThresh").value = WeaponTypeData.CritThreshReduction;
			document.getElementById("WeaponCritThreshMethod").value = "Reduce";
		}

		//TODO: Put this all in its own function since it will be called by other item templates

		if(WeaponTypeData.Size != null){document.getElementById("Size").value = WeaponTypeData.Size;}

		if(WeaponTypeData.Rarity != null){document.getElementById("Rarity").value = WeaponTypeData.Rarity;}

		if(WeaponTypeData.Cost != null){document.getElementById("Cost").value = WeaponTypeData.Cost;}

		if(WeaponTypeData.CostUnits != null){document.getElementById("CostUnits").value = WeaponTypeData.CostUnits;}

		if(WeaponTypeData.Weight != null){document.getElementById("Weight").value = WeaponTypeData.Weight;}

		let WeaponTemplateIsMagical = WeaponTypeData.isMagical;
		if(WeaponTemplateIsMagical != null){
			if(WeaponTemplateIsMagical == 1){
				document.getElementById("isMagical").setAttribute("checked","");
				document.getElementById("isMagical").dispatchEvent(new Event('change'));

				if(WeaponTypeData.isAttunement == 1){
					document.getElementById("isAttunement").setAttribute("checked","");
				}
				else{
					document.getElementById("isAttunement").removeAttribute("checked","");
				}
				
				if(WeaponTypeData.isSentient == 1){
					document.getElementById("isSentient").setAttribute("checked","");
					document.getElementById("isSentient").dispatchEvent(new Event('change'));
					//TODO: Add sentient item data population once it has been added to the processing function
				}
				else{
					document.getElementById("isSentient").removeAttribute("checked","");
					document.getElementById("isSentient").dispatchEvent(new Event('change'));
				}
				
				if(WeaponTypeData.isCursed == 1){
					document.getElementById("isCursed").setAttribute("checked","");
				}
				else{
					document.getElementById("isCursed").removeAttribute("checked","");
				}
			}
		}

		if(WeaponTypeData.MaxResource != null){
			document.getElementById("isCharges").setAttribute("checked","");
			document.getElementById("isCharges").dispatchEvent(new Event('change'));

			document.getElementById("MaxResource").value = WeaponTypeData.MaxResource;

			let RestoreInstances = new Array("ShortRest","LongRest","Dawn","StartTurn","Initiative");
			for(let tempInstance of RestoreInstances){
				if(WeaponTypeData["Restore"+tempInstance] != null){
					document.getElementById("Restore"+tempInstance).setAttribute("checked","");
				}
				else{
					document.getElementById("Restore"+tempInstance).removeAttribute("checked","");
				}
			}
			
			let templateRestoreMethod = WeaponTypeData.RestoreMethod;
			document.getElementById("RestoreMethod").value = templateRestoreMethod;
			document.getElementById("RestoreMethod").dispatchEvent(new Event('change'));

			if(templateRestoreMethod == "Fixed"){
				document.getElementById("RestoreAmount").value = WeaponTypeData.RestoreAmount;
			}
			else if(templateRestoreMethod == "Rolled"){
				document.getElementById("RestoreAmountDieNumber").value = WeaponTypeData.RestoreAmountDieNumber;
				document.getElementById("RestoreAmountDieSize").value = WeaponTypeData.RestoreAmountDieSize;
				document.getElementById("RestoreAmountBonus").value = WeaponTypeData.RestoreAmountBonus;
			}
			else if(templateRestoreMethod == "Chance"){
				document.getElementById("RestoreChanceDieNumber").value = WeaponTypeData.RestoreChanceDieNumber;
				document.getElementById("RestoreChanceDieSize").value = WeaponTypeData.RestoreChanceDieSize;
				document.getElementById("RestoreChanceBonus").value = WeaponTypeData.RestoreChanceBonus;
			}
			else if(templateRestoreMethod == "Attribute"){
				document.getElementById("RestoreAmountMultiplier").value = WeaponTypeData.RestoreAmountMultiplier;
				document.getElementById("RestoreAmountAttribute").value = WeaponTypeData.RestoreAmountAttribute;
				document.getElementById("RestoreAmountBonus").value = WeaponTypeData.RestoreAmountBonus;
			}
			else if(templateRestoreMethod == "Proficiency"){
				document.getElementById("RestoreAmountMultiplier").value = WeaponTypeData.RestoreAmountMultiplier;
				document.getElementById("RestoreAmountBonus").value = WeaponTypeData.RestoreAmountBonus;
			}
		}

		let TemplateMaterials = WeaponTypeData.Materials;
		let TemplateHasMaterial = 0;
		for(let tempMaterial of TemplateMaterials){
			document.getElementById("objectMaterial"+tempMaterial).setAttribute("checked","");
			TemplateHasMaterial = 1;
		}
		createChooseMainMaterialRows();

		if(TemplateHasMaterial == 1){
			if(WeaponTypeData.MainMaterial != "@@Variable"){
				document.getElementById("MainMaterial").value = WeaponTypeData.MainMaterial;
			}
		}

		document.getElementById("Coating").value = WeaponTypeData.Coating;
		document.getElementById("Integrity").value = WeaponTypeData.Integrity;
		document.getElementById("StateOfMatter").value = WeaponTypeData.StateOfMatter;
		document.getElementById("isFlammable").value = WeaponTypeData.isFlammable;
		document.getElementById("isMagnetic").value = WeaponTypeData.isMagnetic;
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
}

async function addWeaponDamageTypeRows(){
	let nextRowIndex = document.getElementById("rowWeaponDamageHeader").rowIndex + 1;
	let currentInstanceNumber = document.getElementById("weaponDamageInstanceNumber").value;

	let requestWeaponDamageData = await fetch("macro:pm.GetDamageTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allWeaponDamageData = JSON.stringify(await requestWeaponDamageData.json());
	let requestWeaponDamageHTML = await fetch("macro:ut.a5e.GenerateSelectionHTML@lib:pm.a5e.Core", {method: "POST", body: "["+allWeaponDamageData+"]"});
	let DamageTypeOptions = await requestWeaponDamageHTML.text();
	
	addTableRow("CreateObjectTable",nextRowIndex,"rowWeaponDamage"+currentInstanceNumber,"<th text-align='center' colspan='2'><input type='number' id='WeaponDamageDieNumber"+currentInstanceNumber+"' name='WeaponDamageDieNumber"+currentInstanceNumber+"' min=0 value=1 style='width:25px'> d <input type='number' id='WeaponDamageDieSize"+currentInstanceNumber+"' name='WeaponDamageDieSize"+currentInstanceNumber+"' min=1 value=6 style='width:25px'> + <input type='number' id='WeaponDamageBonus"+currentInstanceNumber+"' name='WeaponDamageBonus"+currentInstanceNumber+"' min=0 value=0 style='width:25px'> + <select id='WeaponAddDmgMod"+currentInstanceNumber+"' name='WeaponAddDmgMod"+currentInstanceNumber+"'><option value=1>Modifier</option><option value=0>No Modifier</option></select><select id='WeaponDamageType"+currentInstanceNumber+"' name='WeaponDamageType"+currentInstanceNumber+"'>"+DamageTypeOptions+"</select></th>");

	currentInstanceNumber++;
	document.getElementById("weaponDamageInstanceNumber").value = currentInstanceNumber;
}

function removeWeaponDamageTypeRows(){
	let currentInstanceNumber = document.getElementById("weaponDamageInstanceNumber").value;
	currentInstanceNumber--;
	document.getElementById("weaponDamageInstanceNumber").value = currentInstanceNumber;

	let table = document.getElementById("CreateObjectTable");
	let currentInstanceRowIndex = document.getElementById("rowWeaponDamage"+currentInstanceNumber).rowIndex;
	
	table.deleteRow(currentInstanceRowIndex);
}

function weaponMagicBonusChanges(){
	if(document.getElementById("WeaponMagicBonus").value > 0){
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
		clearUnusedTable("CreateObjectTable","rowIsMagical","rowIsConsumable");
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
//TODO: Add population of ObjectTags here, based on tags on the materials
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