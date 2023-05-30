async function createObjectSubtypeRows(){
	clearUnusedTable("CreateObjectTable","rowObjectType","rowSize");
	let nextRowIndex = document.getElementById("rowObjectType").rowIndex+1;
	let ObjectType = document.getElementById("Type").value;
	let tableID = "CreateObjectTable";

	if(ObjectType == "Weapon"){
		createWeaponTableRows(tableID,"rowObjectType");
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

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorIsDexterityBonus","<th><label for='ArmorIsDexterityBonus'>Allows Dexterity Bonus:</label></th><td><input type='checkbox' id='ArmorIsDexterityBonus' name='ArmorIsDexterityBonus' onchange='createArmorDexterityRows()'></td>");
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

		addTableRow("CreateObjectTable",nextRowIndex,"rowAmmunitionAddDamageInstanceButtons","<th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"CreateObjectTable","Ammunition"'+")'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"CreateObjectTable","Ammunition"'+")'></th>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "CastingFocus"){
		document.getElementById("isWearable").setAttribute("checked","");
	}
	else if(ObjectType == "Container"){
		document.getElementById("isWearable").removeAttribute("checked","");

		let StateOptions = [{"Name":"Solid","DisplayName":"Solids"},{"Name":"Liquid","DisplayName":"Liquids"},{"Name":"Gas","DisplayName":"Gases"}];
		createHTMLMultiselectOptions(StateOptions,"")

		addTableRow("CreateObjectTable",nextRowIndex,"rowContentsType","<th>Type of Objects Held:</th><td><input type='number' id='ContentsType' name='ContentsType'><option value='Solid'>Solids</option><option value='Liquid'>Liquids</option></select></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowContainerWeightCapacity","<th><label for='ContainterWeightCapacity'>Weight Capacity</label></th><td><input type='number' id='ContainterWeightCapacity' name='ContainterWeightCapacity' min=0>lbs.</td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowContainerVolumeCapacity","<th><label for='ContainterVolumeCapacity'>Volume Capacity</label></th><td><input type='number' id='ContainterVolumeCapacity' name='ContainterVolumeCapacity' min=0></td>");
		nextRowIndex++;
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
	else if(ObjectType == "Wondrous"){
		document.getElementById("isWearable").removeAttribute("checked","");

		//TODO: Add subtype choice to select other things (e.g. clothing, vehicle, potion) as the actual type of object a wondrous object is
	}
}

async function createAmmunitionTypeRows(){
	let nextRowIndex = document.getElementById("rowAmmunitionType").rowIndex + 1;

	if(document.getElementById("AmmunitionType").value == "@@NewType"){
		createNewTemplateRows("CreateObjectTable",nextRowIndex,"Ammunition");
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
				await addDamageTypeRows("CreateObjectTable","Ammunition");
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

		updateWithTemplateData("CreateObjectTable",AmmunitionTypeData);
	}
}

async function createArmorTypeRows(ArmorOrShield){
	let nextRowIndex = document.getElementById("rowArmorType").rowIndex + 1;

	if(document.getElementById("ArmorType").value == "@@NewType"){
		createNewTemplateRows("CreateObjectTable",nextRowIndex,ArmorOrShield);
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

		updateWithTemplateData("CreateObjectTable",ArmorTypeData);
	}
}

function createArmorDexterityRows(tableID){
	if(document.getElementById("ArmorIsDexterityBonus").checked){
		let nextRowIndex = document.getElementById("rowArmorIsDexterityBonus").rowIndex + 1;

		addTableRow("CreateObjectTable",nextRowIndex,"rowArmorDexCap","<th><label for='ArmorDexCap'>Maximum Dexterity Bonus:</label></th><td><input type='number' id='ArmorDexCap' name='ArmorDexCap' min='0' value='2' style='width:25px' disabled><input type='checkbox' id='ArmorNoDexCap' name='ArmorNoDexCap' onchange='toggleFieldEnabled("+'"ArmorDexCap","ArmorNoDexCap"'+")' checked><label for='ArmorNoDexCap'> Unlimited?</label></td>");
		nextRowIndex++;
	}
	else{
		document.getElementById("CreateObjectTable").deleteRow(document.getElementById("rowArmorDexCap").rowIndex);	
	}
}

function createActivatableRows(tableID){
	let nextRowIndex = document.getElementById("rowIsActivatable").rowIndex + 1;

	if(document.getElementById("isActivatable").checked){
		let UseTimeOptionsArray = ["Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowActivationUseTime","<th><label for='ActivationUseTime'>Activation Time:</label></th><td><select id='ActivationUseTime' name='ActivationUseTime'>"+UseTimeOptions+"</select>");
		nextRowIndex++;
	}
	else{

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

function createActiveEffectsRow(){
	let nextRowIndex = document.getElementById("rowHasActiveEffects").rowIndex + 1;
	let ActiveEffectsSelection = document.getElementById("HasActiveEffects").checked;

	if(ActiveEffectsSelection){
		addTableRow("CreateObjectTable",nextRowIndex,"rowActiveEffectsNumber","<th><label for='ActiveEffectsNumber'>Number of Effects:</label></th><td><input type='number' id='ActiveEffectsNumber' name='ActiveEffectsNumber' value='1' min='1' style='width:25px'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowActiveEffectsRandom","<th><label for='isEffectRandom'>Effect is Random:</label></th><td><input type='checkbox' id='isEffectRandom' name='isEffectRandom'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowHasActiveEffects","rowSourcebook");
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateObjectTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);