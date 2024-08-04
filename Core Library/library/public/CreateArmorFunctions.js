async function createArmorRows(ArmorOrShield,IDSuffix){
	if(arguments.length === 1){IDSuffix = "";}

	let referenceRow = document.getElementById("rowObjectType"+IDSuffix);

	document.getElementById("isWearable").checked = true;

	let allArmorTypes = "";
	if(ArmorOrShield == "Armor"){
		referenceRow = createTableRow(referenceRow,"rowArmorTier","<th><label for='ArmorTier'>Armor Tier:</label></th><td><select id='ArmorTier' name='ArmorTier'><option value='Light'>Light</option><option value='Medium'>Medium</option><option value='Heavy'>Heavy</option><option value='Exotic'>Exotic</option></select></td>");

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ArmorTypes']"});
		allArmorTypes = await request.json();
	}
	else{
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ShieldTypes']"});
		allArmorTypes = await request.json();
	}

	let ArmorTypeOptions = createHTMLSelectOptions(allArmorTypes);

	if(ArmorOrShield == "Armor"){
		ArmorTypeOptions = "<option value='@@NewType'>New Type</option>"+ArmorTypeOptions;
	}
	else{
		ArmorTypeOptions += "<option value='@@NewType'>New Type</option>";
	}

	referenceRow = createTableRow(referenceRow,"rowArmorType","<th><label for='ArmorType'>Armor Type:</label></th><td><select id='ArmorType' name='ArmorType' onchange='armorTemplateUpdate("+'"'+ArmorOrShield+'"'+")'><option value='@@NewType'>New Type</option>"+ArmorTypeOptions+"</select></td>");

	let StartingAC;
	if(ArmorOrShield == "Armor"){
		StartingAC = 11;
	}
	else{
		StartingAC = 2;
	}
	referenceRow = createTableRow(referenceRow,"rowArmorBaseAC","<th><label for='ArmorBaseAC'>Base AC:</label></th><td><input type='number' id='ArmorBaseAC' name='ArmorBaseAC' min='0' value='"+StartingAC+"' style='width:25px'></td>");

	referenceRow = createTableRow(referenceRow,"rowArmorIsDexterityBonus","<th><label for='ArmorIsDexterityBonus'>Allows Dexterity Bonus:</label></th><td><input type='checkbox' id='ArmorIsDexterityBonus' name='ArmorIsDexterityBonus' onchange='createArmorDexterityRows()'></td>");

	referenceRow = createTableRow(referenceRow,"rowArmorStrengthReq","<th><label for='ArmorStrengthReq'>Strength Requirement:</label></th><td><input type='number' id='ArmorStrengthReq' name='ArmorStrengthReq' min='0' value='13' style='width:25px' disabled><input type='checkbox' id='ArmorNoStrengthReq' name='ArmorNoStrengthReq' onchange='toggleFieldEnabled("+'"ArmorStrengthReq","ArmorNoStrengthReq"'+")' checked><label for='ArmorNoStrengthReq'> No Requirement?</label></td>");

	referenceRow = createTableRow(referenceRow,"rowArmorStealthDisadvantage","<th><label for='ArmorStealthDisadvantage'>Causes Stealth Disadvantage:</label></th><td><input type='checkbox' id='ArmorStealthDisadvantage' name='ArmorStealthDisadvantage'></td>");

	referenceRow = createTableRow(referenceRow,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");

	armorTemplateUpdate(ArmorOrShield);
}

async function armorTemplateUpdate(ArmorOrShield){
	let referenceRow = document.getElementById("rowArmorType");

	if(document.getElementById("ArmorType").value == "@@NewType"){
		createNewTemplateRows(referenceRow,ArmorOrShield);
		
		if(ArmorOrShield == "Armor"){
			StartingAC = 11;
		}
		else{
			StartingAC = 2;
		}
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
			if(ArmorTypeData.ArmorTier != undefined){
				document.getElementById("ArmorTier").value = ArmorTypeData.ArmorTier;
			}
		}

		if(ArmorTypeData.BaseAC != undefined){
			document.getElementById("ArmorBaseAC").value = ArmorTypeData.BaseAC;
		}

		if(ArmorTypeData.isDexterityBonus === 1){
			document.getElementById("ArmorIsDexterityBonus").setAttribute("checked","");
			document.getElementById("ArmorIsDexterityBonus").dispatchEvent(new Event('change'));

			if(ArmorTypeData.isDexterityCap != undefined){
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
		}
		else{
			document.getElementById("ArmorIsDexterityBonus").removeAttribute("checked","");
			document.getElementById("ArmorIsDexterityBonus").dispatchEvent(new Event('change'));
		}

		if(ArmorTypeData.isStrengthRequirement != undefined){
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

		if(ArmorTypeData.isStealthDisadvantage != undefined){
			if(ArmorTypeData.isStealthDisadvantage == 1){
				document.getElementById("ArmorStealthDisadvantage").setAttribute("checked","");
			}
			else{
				document.getElementById("ArmorStealthDisadvantage").removeAttribute("checked","");
			}
		}

		if(ArmorTypeData.MagicBonus != undefined){
			document.getElementById("MagicBonus").value = ArmorTypeData.MagicBonus;
		}

		updateGenericObjectTemplate(ArmorTypeData);
	}
}

function createArmorDexterityRows(){
	if(document.getElementById("ArmorIsDexterityBonus").checked && document.getElementById("rowArmorDexCap") === null){
		let referenceRow = document.getElementById("rowArmorIsDexterityBonus");

		createTableRow(referenceRow,"rowArmorDexCap","<th><label for='ArmorDexCap'>Maximum Dexterity Bonus:</label></th><td><input type='number' id='ArmorDexCap' name='ArmorDexCap' min='0' value='2' style='width:25px' disabled><input type='checkbox' id='ArmorNoDexCap' name='ArmorNoDexCap' onchange='toggleFieldEnabled("+'"ArmorDexCap","ArmorNoDexCap"'+")' checked><label for='ArmorNoDexCap'> Unlimited?</label></td>");
	}
	else if(!document.getElementById("ArmorIsDexterityBonus").checked){
		document.getElementById("rowArmorDexCap").remove();	
	}
}