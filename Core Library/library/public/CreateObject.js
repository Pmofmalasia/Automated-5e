async function createObjectSubtypeRows(tableID,IDSuffix){
	if(arguments.length === 1){IDSuffix = "";}
	//Reset selections
	clearUnusedTable(tableID,"rowObjectType"+IDSuffix,"rowSize");
	let improvisedWeaponSelection = document.getElementById("isImprovisedWeapon");
	improvisedWeaponSelection.removeAttribute("disabled","");
	document.getElementById("isSpellcastingFocus").checked = false;
	document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));

	let nextRowIndex = document.getElementById("rowObjectType"+IDSuffix).rowIndex+1;
	let ObjectType = document.getElementById("Type"+IDSuffix).value;

	if(ObjectType == "Weapon"){
		createWeaponTableRows(tableID,"rowObjectType"+IDSuffix);
		improvisedWeaponSelection.checked = false;
		improvisedWeaponSelection.dispatchEvent(new Event("change"));
		improvisedWeaponSelection.setAttribute("disabled","");
	}
	else if(ObjectType == "Armor" || ObjectType == "Shield"){
		let ArmorOrShield;
		if(ObjectType == "Armor"){
			ArmorOrShield = "Armor";
		}
		else{
			ArmorOrShield = "Shield";
		}
		
		createArmorRows(ArmorOrShield,IDSuffix);
	}
	else if(ObjectType == "Ammunition"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = true;
		
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let AmmunitionTypeOptions = "";
		for(let tempAmmunitionType of allAmmunitionTypes){
			AmmunitionTypeOptions = AmmunitionTypeOptions + "<option value='"+tempAmmunitionType.Name+"'>"+tempAmmunitionType.DisplayName+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowAmmunitionType","<th><label for='AmmunitionType'>Ammunition Type:</label></th><td><select id='AmmunitionType' name='AmmunitionType' onchange='createAmmunitionTypeRows()'><option value='@@NewType'>New Type</option>"+AmmunitionTypeOptions+"</select></td>");
		nextRowIndex++;
		
		if(document.getElementById("AmmunitionType").value == "@@NewType"){
			createAmmunitionTypeRows();
			nextRowIndex++;
			nextRowIndex++;
		}

		addTableRow(tableID,nextRowIndex,"rowAmmunitionDamageHeader","<th style='text-align:center' colspan='2'>Additional Damage:<input type='hidden' id='AmmunitionDamageInstanceNumber' name='AmmunitionDamageInstanceNumber' value=0></th>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowAmmunitionDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"'+tableID+'","Ammunition"'+")'> <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Ammunition"'+")'></th>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "AdventuringGear"){
		//Nothing happens, this is the miscellaneous category
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "Clothing"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = true;
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ClothingTypes']"});
		let allClothingTypes = await request.json();
		let ClothingTypeSelection = createHTMLSelectOptions(allClothingTypes);

		addTableRow(tableID,nextRowIndex,"rowClothingType","<th><label for='ClothingType'>Clothing Type:</label></th><td><select id='ClothingType' name='ClothingType'>"+ClothingTypeSelection+"</select></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "Container"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = true;

		addTableRow(tableID,nextRowIndex,"rowContainerWeightCapacity","<th><label for='ContainterWeightCapacity'>Weight Capacity:</label></th><td><input type='number' id='ContainterWeightCapacity' name='ContainterWeightCapacity' min=0 step=0.1 style='width:35px'>lbs. <input type='checkbox' id='isContainterWeightCapacity' name='isContainterWeightCapacity' onchange='toggleFieldEnabled("+'"ContainterWeightCapacity","isContainterWeightCapacity"'+")'> No limit</td>");
		nextRowIndex++;
	
		addTableRow(tableID,nextRowIndex,"rowContainerSolidVolumeCapacity","<th><label for='ContainterSolidVolumeCapacity'>Solid Volume Capacity:</label></th><td><input type='number' id='ContainterSolidVolumeCapacity' name='ContainterSolidVolumeCapacity' min=0 step=0.1 style='width:35px'><select id='ContainterSolidVolumeCapacityUnits' name='ContainterSolidVolumeCapacityUnits'><option value='cubicfeet'>Cubic Feet</option><option value='cubicyard'>Cubic Yards</option></select><input type='checkbox' id='isContainterSolidVolumeCapacity' name='isContainterSolidVolumeCapacity' onchange='toggleFieldEnabled(["+'"ContainterSolidVolumeCapacity","ContainterSolidVolumeCapacityUnits"],"isContainterSolidVolumeCapacity"'+")'>No Solids</td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowContainerFluidVolumeCapacity","<th><label for='ContainterFluidVolumeCapacity'>Fluid Volume Capacity:</label></th><td><input type='number' id='ContainterFluidVolumeCapacity' name='ContainterFluidVolumeCapacity' min=0 step=0.1 style='width:35px'><select id='ContainterFluidVolumeCapacityUnits' name='ContainterFluidVolumeCapacityUnits'><option value='ounce'>Ounces</option><option value='pint'>Pints</option><option value='gallon'>Gallons</option><option value='milliliter'>Milliliters</option><option value='liter'>Liters</option></select><input type='checkbox' id='isContainterFluidVolumeCapacity' name='isContainterFluidVolumeCapacity' onchange='toggleFieldEnabled(["+'"ContainterFluidVolumeCapacity","ContainterFluidVolumeCapacityUnits"],"isContainterFluidVolumeCapacity"'+")'>No Fluids</td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowContainerIgnoreWeight","<th><label for='isContainerIgnoreWeight'>Ignore Weight of Contents:</label></th><td><input type='checkbox' id='isContainerIgnoreWeight' name='isContainerIgnoreWeight'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowContainerStorageTime","<th><label for='ContainerStorageTime'>Time to Store/Remove Contents:</label></th><td><select id='ContainerStorageTime' name='ContainerStorageTime' onchange='createNonstandardStorageRows("+'"'+tableID+'"'+")'><option value=''>Both are Item Interactions</option><option value='Action'>Both are Actions</option><option value='Custom'>Other</option></select></td>");
		nextRowIndex++;
	}
	else if(ObjectType == "Hazard" || ObjectType == "Trap"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "LightSource"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = false;

		addTableRow(tableID,nextRowIndex,"rowLightFuel","<th><label for='LightFuel'>Light Can be Refueled:</label></th><td><select id='LightFuel' name='LightFuel'><option value=''>None</option><option value='Oil'>Oil Flask</option><option value='Other'>Other Fuel</option></select></td>");
		nextRowIndex++;

		createLightTable("rowObjectType"+IDSuffix,"rowLightFuel",IDSuffix);

		createCustomDurationRows(tableID,"LightDuration","rowSize");
		nextRowIndex++;
		let lightDurationRow = document.getElementById("rowCustomLightDuration");
		lightDurationRow.firstElementChild.firstElementChild.innerHTML = "Maximum Light Duration:";
		document.getElementById("customLightDurationValue").value = 4;
		document.getElementById("customLightDurationUnits").value = "Hour";

		let lightDurationUnitsSelector = document.getElementById("customLightDurationUnits");
		let lightDurationToggle = document.createElement("input");
		lightDurationToggle.type = "checkbox";
		lightDurationToggle.id = "isLightDurationUnlimited";
		lightDurationToggle.name = "isLightDurationUnlimited";
		lightDurationToggle.onchange = function(){toggleLightDuration()};
		lightDurationUnitsSelector.after(lightDurationToggle,"Unlimited?");
		
		document.getElementById("lightType"+IDSuffix).dispatchEvent(new Event("change"));
	}
	else if(ObjectType == "Potion"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "Rod"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Scroll"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "SpellcastingFocus"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = false;
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
	}
	else if(ObjectType == "Staff"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Tool"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = false;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ToolTypes']"});
		let allToolTypes = await request.json();
		let ToolTypeSelection = createHTMLSelectOptions(allToolTypes);

		addTableRow(tableID,nextRowIndex,"rowToolType","<th><label for='ToolType'>Tool Type:</label></th><td><select id='ToolType' name='ToolType' onchange='updateToolSubtypeOptions("+'"'+tableID+'"'+")'>"+ToolTypeSelection+"<option value=''>None</option></select></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowToolSubtype","<th><label for='ToolSubtype'>Tool Subtype:</label></th><td><select id='ToolSubtype' name='ToolSubtype' onchange='createNewToolRows("+'"'+tableID+'"'+")'><option value=''>New Tool</option></select></td>");
		nextRowIndex++;

		updateToolSubtypeOptions(tableID);
	}
	else if(ObjectType == "Vehicle"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = false;
	}
	else if(ObjectType == "Wand"){
		document.getElementById("isWearable").checked = true;
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Wondrous"){
		document.getElementById("isWearable").checked = false;
		document.getElementById("isStackable").checked = false;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTypes']"});
		let allObjectTypes = await request.json();

		let nonWondrousTypes = allObjectTypes.filter(function(objectTypes){
			return objectTypes.Name != "Wondrous";
		});

		let ObjectTypeSelection = createHTMLSelectOptions(nonWondrousTypes);
		ObjectTypeSelection = "<option value=''>No Other</option>" + ObjectTypeSelection;

		addTableRow(tableID,nextRowIndex,"rowObjectWondrousType","<th><label for='WondrousType'>Wondrous Object Type:</label></th><td><select id='WondrousType' name='WondrousType' onchange='createObjectSubtypeRows("+'"CreateObjectTable","Wondrous"'+")'>"+ObjectTypeSelection+"</select></td>");
		nextRowIndex++;
	}
}

async function createAmmunitionTypeRows(){
	let referenceRow = document.getElementById("rowAmmunitionType");

	if(document.getElementById("AmmunitionType").value == "@@NewType"){
		createNewTemplateRows(referenceRow,"Ammunition");
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
			clearUnusedTable("CreateObjectTable","rowAmmunitionDamageHeader","rowAmmunitionDamageInstanceButtons");
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

		if(AmmunitionTypeData.MagicBonus != undefined){
			document.getElementById("MagicBonus").value = AmmunitionTypeData.MagicBonus;
		}

		updateGenericObjectTemplate(AmmunitionTypeData);
	}
}

function createNonstandardStorageRows(tableID){
	let nextRowIndex = document.getElementById("rowContainerStorageTime").rowIndex + 1;

	if(document.getElementById("ContainerStorageTime").value == "Custom"){
		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowStorageRemovalTime","<th><label for='StorageRemovalTime'>Time to Remove from Container:</label></th><td><select id='StorageRemovalTime' name='StorageRemovalTime'>"+UseTimeOptions+"</select><input type='checkbox' id='StorageCannotRemove' name='StorageCannotRemove' onchange='toggleFieldEnabled("+'"StorageRemovalTime","StorageCannotRemove"'+")'> <label for='StorageCannotRemove'>Cannot Remove Items?</label></td>");
		document.getElementById("StorageRemovalTime").value = "Item Interaction";
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowStorageAddTime","<th><label for='StorageAddToTime'>Time to Put in Container:</label></th><td><select id='StorageAddToTime' name='StorageAddToTime'>"+UseTimeOptions+"</select><input type='checkbox' id='StorageCannotAddTo' name='StorageCannotAddTo' onchange='toggleFieldEnabled("+'"StorageAddToTime","StorageCannotAddTo"'+")'> <label for='StorageCannotAddTo'>Cannot Store Items?</label></td>");
		document.getElementById("StorageAddToTime").value = "Item Interaction";
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowContainerStorageTime","rowSize");
	}
}

function createConsumableRows(tableID){
	if(document.getElementById("isConsumable").checked){
		let nextRowIndex = document.getElementById("rowIsConsumable").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowIsLeaveBehindContainer","<th><label for='isLeaveBehindContainer'>Leaves Behind a Container?</label></th><td><input type='checkbox' id='isLeaveBehindContainer' name='isLeaveBehindContainer' onchange='createLeaveBehindContainerRow("+'"'+tableID+'"'+")'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsConsumable","rowIsActivatable");
	}
}

function toggleLightDuration(){
	toggleFieldEnabled(["customLightDurationValue","customLightDurationUnits"],"isLightDurationUnlimited");
	
	activationTimeResourceRow();
}

function createNonstandardEquipRows(){
	let referenceRow = document.getElementById("rowIsNonstandardEquip");

	if(document.getElementById("isNonstandardEquip").value == "Custom" && document.getElementById("rowDonTime") == null){
		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","5 Minutes","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		referenceRow = createTableRow(referenceRow,"rowDonTime","<th><label for='DonTime'>Don Time:</label></th><td><select id='DonTime' name='DonTime'>"+UseTimeOptions+"</select></td>");
		document.getElementById("DonTime").value = "Item Interaction";

		referenceRow = createTableRow(referenceRow,"rowDoffTime","<th><label for='DoffTime'>Doff Time:</label></th><td><select id='DoffTime' name='DoffTime'>"+UseTimeOptions+"</select></td>");
		document.getElementById("DoffTime").value = "Item Interaction";

		referenceRow = createTableRow(referenceRow,"rowDropTime","<th><label for='DropTime'>Drop Time:</label></th><td><select id='DropTime' name='DropTime'>"+UseTimeOptions+"</select></td>");
		document.getElementById("DropTime").value = "Free";

		referenceRow = createTableRow(referenceRow,"rowNonstandardEquipEnd","<th></th><td></td>");
		referenceRow.classList.add("section-end");
	}
	else if(document.getElementById("isNonstandardEquip").value !== "Custom" && document.getElementById("rowNonstandardEquipEnd") !== null){
		deleteInterveningElements(referenceRow,document.getElementById("rowNonstandardEquipEnd").nextElementSibling);
	}
}

function createConsumableRows(tableID){
	if(document.getElementById("isConsumable").checked){
		let nextRowIndex = document.getElementById("rowIsConsumable").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowIsLeaveBehindContainer","<th><label for='isLeaveBehindContainer'>Leaves Behind a Container?</label></th><td><input type='checkbox' id='isLeaveBehindContainer' name='isLeaveBehindContainer' onchange='createLeaveBehindContainerRow("+'"'+tableID+'"'+")'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsConsumable","rowIsActivatable");
	}
}

async function createLeaveBehindContainerRow(tableID){
	if(document.getElementById("isLeaveBehindContainer").checked){
		let nextRowIndex = document.getElementById("rowIsLeaveBehindContainer").rowIndex + 1;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Objects']"});
		let allObjects = await request.json();
		let ContainerOptions = [];
		for(let tempObject of allObjects){
			if(tempObject.Type == "Container"){
				ContainerOptions.push(tempObject);
			}
		}
		let ContainerSelection = createHTMLSelectOptions(ContainerOptions,"ObjectID");

		addTableRow(tableID,nextRowIndex,"rowContainerLeftBehind","<th><label for='ContainerLeftBehind'>Container Left Behind:</label></th><td><select id='ContainerLeftBehind' name='ContainerLeftBehind'>"+ContainerSelection+"</select></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsLeaveBehindContainer","rowIsActivatable");
	}
}

async function updateToolSubtypeOptions(tableID){
	let requestTools = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Tools']"});
	let allTools = await requestTools.json();

	let selectedToolType = document.getElementById("ToolType").value;
	let validToolSubtypes = allTools.filter(function(toolSubtypes){
		return toolSubtypes.ToolType == selectedToolType;
	});
	let ToolSelection = createHTMLSelectOptions(validToolSubtypes);

	document.getElementById("ToolSubtype").innerHTML = ToolSelection+"<option value=''>New Tool</option>";

	if((ToolSelection == "" && document.getElementById("rowNewToolType") != null) || ToolSelection != ""){
		createNewToolRows(tableID);
	}
}

function createNewToolRows(tableID){
	if(document.getElementById("ToolSubtype").value == ""){
		let nextRowIndex = document.getElementById("rowToolSubtype").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowNewToolType","<th><label for='NewToolTypeDisplayName'>New Tool Subtype Name:</label></th><td><input type='text' id='NewToolTypeDisplayName' name='NewToolTypeDisplayName'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsNewToolSubtypeTemplate","<th><label for='isNewToolSubtypeTemplate'>Add as Template:</label></th><td><input type='checkbox' id='isNewToolSubtypeTemplate' name='isNewToolSubtypeTemplate'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowToolSubtype","rowSize");
	}
}

function createActivatableRows(){
	let tableID = document.getElementById("rowIsActivatable").closest("table").id;
	let nextRowIndex = document.getElementById("rowIsActivatable").rowIndex + 1;

	if(document.getElementById("isActivatable").checked){
		addTableRow(tableID,nextRowIndex,"rowIsActivationEffect","<th><label for='isActivationEffect'>Instantaneous Effect on Activation/Deactivation:</label></th><td><select id='isActivationEffect' name='isActivationEffect' onchange='createActivationEffectRows()'><option value=''>No (Passive Only)</option><option value='Activation'>Activation Only</option><option value='Deactivation'>Deactivation Only</option><option value='Both'>Both</option><select></td>");
		nextRowIndex++;

		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowActivationUseTime","<th><label for='ActivationUseTime'>Activation Time:</label></th><td><select id='ActivationUseTime' name='ActivationUseTime'>"+UseTimeOptions+"</select></td>");
		document.getElementById("ActivationUseTime").value = "Bonus Action";
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowActivationComponents","<th><label for='ActivationComponents'>Activation Requirements:</label></th><td><select id='ActivationComponents' name='ActivationComponents'><option value='None'>No Components</option><option value='Verbal'>Command Word (Verbal)</option><option value='Somatic'>Interaction (Somatic)</option><option value='Both'>Verbal and Somatic</option></select></td>");
		nextRowIndex++;

		activationTimeResourceRow(tableID);




















//Next thing to do: Create ActivationEffects and DeactivationEffects. Simple lights automatically add one that turns the light off/on if one is not made for you. ActivateItem runs effect through ExecuteEffect. Need to sort out having multiple places where subeffects can be created (fine in JSON, hard for input tracking the data)
























	}
	else{
		clearUnusedTable("CreateObjectTable","rowIsActivatable","rowIsCharges");
	}
}

function createActivationEffectRows(){

}

function activationTimeResourceRow(){
	let needsTimeRow = false;

	if(!document.getElementById("isActivatable").checked){
		
	}
	else if(document.getElementById("isActivationEffect").value != ""){
		
	}
	else{
		let timeResource = document.getElementById("rowIsTimeResource");
		if(timeResource != null){
			needsTimeRow = timeResource.checked;
		}

		let lightDuration = document.getElementById("customLightDurationValue");
		if(lightDuration != null){
			needsTimeRow = !lightDuration.disabled;
		}
	}
	
	if(needsTimeRow){
		let nextRowIndex = document.getElementById("rowActivationComponents").rowIndex + 1;
		let tableID = document.getElementById("rowActivationComponents").closest("table").id;
		addTableRow(tableID,nextRowIndex,"rowActivationUseTimeResource","<th><label for='isActivationUseTimeResource'>Activation Uses Time Resource:</label></th><td><input type='checkbox' id='isActivationUseTimeResource' name='isActivationUseTimeResource'></td>");
	}
	else if(document.getElementById("rowActivationUseTimeResource") != null){
		document.getElementById("rowActivationUseTimeResource").remove();
	}
}

function createChargesRows(tableID){
	if(document.getElementById("isCharges").value == "None"){
		clearUnusedTable(tableID,"rowIsCharges","rowObjectDuration");
	}
	else{
		let nextRowIndex = document.getElementById("rowIsCharges").rowIndex+1;
		if(document.getElementById("isCharges").value == "One"){
			addTableRow(tableID,nextRowIndex,"rowMaxCharges","<th><label for='MaxResource'>Maximum Number of Charges:</label></th><td><input type='number' id='MaxResource' name='MaxResource' min='0' value='0' style='width:35px'></td>");
			nextRowIndex++;
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowMultiResource0","<th style='text-align:center' colspan='2'><input type='hidden' id='MultiResourceNumber' name='MultiResourceNumber' value='0'><label for='ResourceDisplayName0'>Resource #1 Name:</label><input type='text' id='ResourceDisplayName0' name='ResourceDisplayName0'> Maximum Charges:<input type='number' id='MaxResource0' name='MaxResource0' min='0' value='0' style='width:35px'></th>");
			nextRowIndex++;
			
			addTableRow(tableID,nextRowIndex,"rowMultiResourceButtons","<th style='text-align:center' colspan='2'><input type='button' value='Add Resource' onclick='addMultiResourceRows("+'"'+tableID+'"'+")'>  <input type='button' value='Remove Resource' onclick='removeMultiResourceRows("+'"'+tableID+'"'+")'></th>");
			nextRowIndex++;
		}

		if(document.getElementById("rowRestoreWhen") == null){
			addTableRow(tableID,nextRowIndex,"rowRestoreWhen","<th>Instances When Resource Recharges:</th><td><div class='check-multiple' style='width:100%'><label><input type='checkbox' id='RestoreShortRest' name='RestoreShortRest'><span>Short Rest</span></label><label><input type='checkbox' id='RestoreLongRest' name='RestoreLongRest'><span>Long Rest</span></label><label><input type='checkbox' id='RestoreDawn' name='RestoreDawn'><span>Dawn</span></label><label><input type='checkbox' id='RestoreDusk' name='RestoreDusk'><span>Dusk</span></label><label><input type='checkbox' id='RestoreStartTurn' name='RestoreStartTurn'><span>Start of Turn</span></label><label><input type='checkbox' id='RestoreInitiative' name='RestoreInitiative'><span>Rolling Initiative</span></label><label><input type='checkbox' id='RestoreItem' name='RestoreItem'><span>Charged by an Item</span></label></div></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowRestoreMethod","<th><label for='RestoreMethod'>Recharge Method:</label></th><td><select id='RestoreMethod' name='RestoreMethod' onchange='createRestoreMethodRows()'><option value='Full'>Fully Recharge</option><option value='Fixed'>Fixed Amount Regained</option><option value='Rolled'>Rolled Amount</option><option value='Chance'>Chance to Recharge</option><option value='Attribute'>Based on Attribute</option><option value='Proficiency'>Based on Proficiency</option></select></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowInitialChargesMethod","<th><label for='InitialChargesMethod'>Charges When Gained:</label></th><td><select id='InitialChargesMethod' name='InitialChargesMethod' onchange='createInitialChargesMethodRows()'><option value='Full'>Fully Charged</option><option value='Fixed'>Fixed Amount</option><option value='Rolled'>Rolled Amount</option></select></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowHasDepletedEffect","<th><label for='HasDepletedEffect'>Effect Occurs when Charges Depleted:</label></th><td><input type='checkbox' id='HasDepletedEffect' name='HasDepletedEffect' onchange='createChargeDepletedRows()'></td>");
			nextRowIndex++;			
		}
		else if(document.getElementById("isCharges").value == "One"){
			clearUnusedTable(tableID,"rowMaxCharges","rowRestoreWhen");
		}
		else if(document.getElementById("isCharges").value == "Multiple"){
			clearUnusedTable(tableID,"rowMultiResourceButtons","rowRestoreWhen");
		}
	}
}

function createDurationRows(tableID,endRowID){
	if(document.getElementById("isDuration").checked){
		let nextRowIndex = document.getElementById("rowObjectDuration").rowIndex + 1;

		createCustomDurationRows(tableID,"ObjectDuration",endRowID);
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsPerishable","<th><label for='isPerishable'>Destroy Object when Unusable?</label></th><td><input type='checkbox' id='isPerishable' name='isPerishable'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowObjectDuration",endRowID);
	}
}

function addMultiResourceRows(tableID){
	let NewResourceNumber = Number(document.getElementById("MultiResourceNumber").value);
	NewResourceNumber = NewResourceNumber + 1;
	let nextRowIndex = document.getElementById("rowMultiResource"+(NewResourceNumber - 1)).rowIndex + 1;
	document.getElementById("MultiResourceNumber").value = NewResourceNumber;
	
	addTableRow(tableID,nextRowIndex,"rowMultiResource"+NewResourceNumber,"<th style='text-align:center' colspan='2'><label for='ResourceDisplayName"+NewResourceNumber+"'>Resource #"+(NewResourceNumber+1)+" Name:</label> <input type='text' id='ResourceDisplayName"+NewResourceNumber+"' name='ResourceDisplayName"+NewResourceNumber+"'> Maximum Charges:<input type='number' id='MaxResource"+NewResourceNumber+"' name='MaxResource"+NewResourceNumber+"' min='0' value='0' style='width:35px'></th>");
	nextRowIndex++;

	//TODO: Needs addition of resource types: Dice, Time, and Spell Slot
}

function removeMultiResourceRows(tableID){
	let lastResourceRowID = document.getElementById("rowMultiResourceButtons").rowIndex - 1;
	document.getElementById(tableID).deleteRow(lastResourceRowID);
	let NewResourceNumber = Number(document.getElementById("MultiResourceNumber").value);
	NewResourceNumber = NewResourceNumber - 1;
	document.getElementById("MultiResourceNumber").value = NewResourceNumber;
}

async function createRestoreMethodRows(){
	let tableID = document.getElementById("rowRestoreMethod").closest("table").id;
	clearUnusedTable(tableID,"rowRestoreMethod","rowInitialChargesMethod");
	let nextRowIndex = document.getElementById("rowRestoreMethod").rowIndex+1;

	if(document.getElementById("RestoreMethod").value == "Fixed"){
		addTableRow(tableID,nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmount'>Amount Recharged:</label></th><td><input type='number' id='RestoreAmount' name='RestoreAmount' min='0' value='1' style='width:35px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Rolled"){
		addTableRow(tableID,nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountDieNumber'>Amount Recharged:</label></th><td><input type='number' id='RestoreAmountDieNumber' name='RestoreAmountDieNumber' min='0' value='1' style='width:25px'> d <input type='number' id='RestoreAmountDieSize' name='RestoreAmountDieSize' min='0' value='6' style='width:25px'> + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Chance"){
		addTableRow(tableID,nextRowIndex,"rowRestoreChance","<th><label for='RestoreChanceDieNumber'>Dice Rolled:</label></th><td><input type='number' id='RestoreChanceDieNumber' name='RestoreChanceDieNumber' min='0' value='1' style='width:25px'> d <input type='number' id='RestoreChanceDieSize' name='RestoreChanceDieSize' min='0' value='6' style='width:25px'> + <input type='number' id='RestoreChanceBonus' name='RestoreChanceBonus' value=0 style='width:25px'></td>");
		
		addTableRow(tableID,nextRowIndex,"rowRestoreChanceTarget","<th><label for='RestoreChanceTarget'>Minimum Successful Recharge Roll:</label></th><td><input type='number' id='RestoreChanceTarget' name='RestoreChanceTarget' min='0' value='5' style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Attribute"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();
		let AttributeOptions = "";
		for(let tempAttribute of attributeList){
			AttributeOptions = AttributeOptions + "<option value='"+tempAttribute.Name+"'>"+tempAttribute.DisplayName+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountMultiplier'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier' name='RestoreAmountMultiplier' min='0' value='1' style='width:25px'> * <select id='RestoreAmountAttribute' name='RestoreAmountAttribute'>"+AttributeOptions+"</select>) + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
	else if(document.getElementById("RestoreMethod").value == "Proficiency"){
		addTableRow(tableID,nextRowIndex,"rowRestoreAmount","<th><label for='RestoreAmountMultiplier'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier' name='RestoreAmountMultiplier' min='0' value='1' style='width:25px'> * Proficiency) + <input type='number' id='RestoreAmountBonus' name='RestoreAmountBonus' value=0 style='width:25px'></td>");
	}
}

async function createInitialChargesMethodRows(){
	let tableID = document.getElementById("rowInitialChargesMethod").closest("table").id;
	clearUnusedTable(tableID,"rowInitialChargesMethod","rowHasDepletedEffect");
	let nextRowIndex = document.getElementById("rowInitialChargesMethod").rowIndex+1;

	if(document.getElementById("InitialChargesMethod").value == "Fixed"){
		addTableRow(tableID,nextRowIndex,"rowInitialChargesAmount","<th><label for='InitialChargesAmount'>Initial Charges:</label></th><td><input type='number' id='InitialChargesAmount' name='InitialChargesAmount' min='0' value='1' style='width:35px'></td>");
	}
	else if(document.getElementById("InitialChargesMethod").value == "Rolled"){
		addTableRow(tableID,nextRowIndex,"rowInitialChargesAmount","<th><label for='InitialChargesAmountDieNumber'>Initial Charges:</label></th><td><input type='number' id='InitialChargesAmountDieNumber' name='InitialChargesAmountDieNumber' min='0' value='1' style='width:25px'> d <input type='number' id='InitialChargesAmountDieSize' name='InitialChargesAmountDieSize' min='0' value='6' style='width:25px'> + <input type='number' id='InitialChargesAmountBonus' name='InitialChargesAmountBonus' value=0 style='width:25px'></td>");
	}
}

async function createSpellcastingFocusRows(tableID,endRowID){
	if(document.getElementById("isSpellcastingFocus").checked){
		let nextRowIndex = document.getElementById("rowIsSpellcastingFocus").rowIndex + 1;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.SpellcastingFocusTypes']"});
		allFocusTypes = await request.json();
		focusTypeOptions = createHTMLMultiselectOptions(allFocusTypes,"SpellcastingFocusType");

		addTableRow(tableID,nextRowIndex,"rowSpellcastingFocusType","<th>Spellcasting Focus Type(s):</th><td><div class='check-multiple' style='width:100%'>"+focusTypeOptions+"</div></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsSpellcastingFocus",endRowID);
	}	
}

async function createCastSpellsRows(tableID){
	let nextRowIndex = document.getElementById("rowIsCastSpells").rowIndex + 1;

	if(document.getElementById("isCastSpells").checked){
		addTableRow(tableID,nextRowIndex,"rowSpellButtons","<th style='text-align:center' colspan='2'><input type='button' value='Add Spell' onclick='addSpellSelectionRows("+'"'+tableID+'"'+")'>  <input type='button' value='Remove Spell' onclick='removeSpellSelectionRows("+'"'+tableID+'"'+")'></th>");
		nextRowIndex++;

		addSpellSelectionRows(tableID);
			
		addTableRow(tableID,nextRowIndex,"rowCastSpellModifierHow","<th>Spell Attack/DC Modifier Method:</th><td><select id='CastSpellModifierHow' name='CastSpellModifierHow' onchange='createCastSpellModifierRows("+'"'+tableID+'"'+")'><option value='AnyClass'>Any Class Spell Modifier</option><option value='SpecificClass'>Specific Class Spell Modifier</option><option value='SetValue'>Preset Modifier</option><option value='Stat'>Based on a Stat</option></select></td>");
		nextRowIndex++;

		//TODO: Add any modifications to spells
	}
	else{
		clearUnusedTable(tableID,"rowIsCastSpells","rowIsImprovisedWeapon");
	}
}

async function createImprovisedWeaponRows(tableID){
	if(document.getElementById("isImprovisedWeapon").checked){
		await createWeaponTableRows(tableID,"rowIsImprovisedWeapon");
		document.getElementById("rowWeaponType").remove();
		document.getElementById("rowNewTypeNameWeapon").remove();
		document.getElementById("rowIsNewTemplateWeapon").remove();
		document.getElementById("rowWeaponClass").remove();
	}
	else{
		clearUnusedTable(tableID,"rowIsImprovisedWeapon","rowIsStackable");
	}
}

async function addSpellSelectionRows(tableID){
	let nextRowIndex = document.getElementById("rowSpellButtons").rowIndex;
	let SpellNumber = Number(document.getElementById("CastSpellNumber").value);
	let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {"method":"POST","body":""});
	let allSpells = await request.json();
	allSpellOptions = createHTMLSelectOptions(allSpells);
	let firstSpellData = allSpells[0];
	let firstSpellLevel = Number(firstSpellData.Level);

	let levelInput = "<span id='CastSpellLevelInput"+SpellNumber+"'>";
	let AHLInput = "<span id='CastSpellAHLInput"+SpellNumber+"'>";
	if(firstSpellLevel == 0){
		levelInput = levelInput + "<input type='hidden' id='CastSpellLevel"+SpellNumber+"' name='CastSpellLevel"+SpellNumber+"' value=0>";
		AHLInput = "<input type='hidden' id='CanAHLSpell"+SpellNumber+"' name='CanAHLSpell"+SpellNumber+"' value=0>";
	}
	else{
		levelInput = levelInput + " at level <select id='CastSpellLevel"+SpellNumber+"' name='CastSpellLevel"+SpellNumber+"'>";
		for(let i=firstSpellLevel; i<=9; i++){
			levelInput = levelInput + "<option value='"+i+"'>"+i+"</option>";
		}
		levelInput = levelInput + "</select>";

		AHLInput = "; <select id='CanAHLSpell"+SpellNumber+"' name='CanAHLSpell"+SpellNumber+"' onchange='toggleSpellAHLResource("+SpellNumber+")'><option value='0'>Cannot</option><option value='1'>Can</option></select> spend <input type='number' id='SpellResourceAHL"+SpellNumber+"' name='SpellResourceAHL"+SpellNumber+"' style='width:25px' value='0' disabled> charge(s) per higher level.";
	}
	levelInput = levelInput + "</span>";
	AHLInput = AHLInput + "</span>";

	addTableRow(tableID,nextRowIndex,"rowCastSpell"+SpellNumber+"","<th style='text-align:center' colspan='2' id='headerCastSpell"+SpellNumber+"'>Cast <select id='CastSpellName"+SpellNumber+"' name='CastSpellName"+SpellNumber+"' onchange='adjustSpellLevelOptions("+SpellNumber+")'>"+allSpellOptions+"</select>"+levelInput+"</th>");
	nextRowIndex++;

	if(document.getElementById("isCharges").value!="None"){
		let ChargesInput = "<span id='CastSpellResourceUsed"+SpellNumber+"'>";
		if(document.getElementById("isCharges").value == "Multiple"){
			let ResourceNumber = Number(document.getElementById("MultiResourceNumber").value);
			let ResourceOptions = "";
			for(let i=0; i<=ResourceNumber; i++){
				let thisResourceDisplayName = document.getElementById("ResourceDisplayName"+i).value;
				thisResourceName = thisResourceDisplayName.split("'").join("");
				ResourceOptions = ResourceOptions + "<option value='"+thisResourceName+"'>"+thisResourceDisplayName+"</option>";
			}
			ChargesInput = ChargesInput + "<select id='CastSpellResourceKey"+SpellNumber+"' name='CastSpellResourceKey"+SpellNumber+"'>"+ResourceOptions+"</select>";
		}
		else{
			ChargesInput = ChargesInput + "charge(s)";
		}
		ChargesInput = ChargesInput + "</span>";

		addTableRow(tableID,nextRowIndex,"rowCastSpellResource"+SpellNumber+"","<th style='text-align:center' colspan='2' id='headerCastSpellResource"+SpellNumber+"'>Uses <input type='number' id='CastSpellResource"+SpellNumber+"' name='CastSpellResource"+SpellNumber+"' style='width:25px' value=1> "+ChargesInput+AHLInput+"</th>");
		nextRowIndex++;		
	}

	SpellNumber++;
	document.getElementById("CastSpellNumber").value = SpellNumber;
}

function removeSpellSelectionRows(tableID){
	let SpellNumber = Number(document.getElementById("CastSpellNumber").value) - 1;

	let finalRowPrefix;
	if(document.getElementById("isCharges").value=="None"){
		finalRowPrefix = "rowCastSpell";
	}
	else{
		finalRowPrefix = "rowSpellResource"
	}

	clearUnusedTable(tableID,finalRowPrefix+(SpellNumber-1),"rowSpellButtons");
	document.getElementById("CastSpellNumber").value = SpellNumber;
}

async function adjustSpellLevelOptions(SpellNumber){
	let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {"method":"POST","body":""});
	let allSpells = await request.json();

	let WhichSpell = document.getElementById("CastSpellName"+SpellNumber).selectedIndex;
	let SpellData = allSpells[WhichSpell];
	let SpellLevel = Number(SpellData.Level);
	document.getElementById("CastSpellLevel"+SpellNumber).selectedIndex = 0;
	let PriorSpellLevel = document.getElementById("CastSpellLevel"+SpellNumber).value;

	if(PriorSpellLevel != SpellLevel){
		let levelInput = "";
		let AHLInput = "";
		if(SpellLevel == 0){
			levelInput = "<input type='hidden' id='CastSpellLevel"+SpellNumber+"' name='CastSpellLevel"+SpellNumber+"' value=0>";
			document.getElementById("CastSpellLevelInput"+SpellNumber).innerHTML = levelInput;

			if(document.getElementById("isCharges").value != "None"){
				let SpellResourceRowText = document.getElementById("rowSpellResource"+SpellNumber).innerHTML;
				SpellResourceRowText = SpellResourceRowText.split(";")[0];
				AHLInput = "<input type='hidden' id='CanAHLSpell"+SpellNumber+"' name='CanAHLSpell"+SpellNumber+"' value=0>";
				SpellResourceRowText = SpellResourceRowText + AHLInput;
				document.getElementById("rowSpellResource"+SpellNumber).innerHTML = SpellResourceRowText;				
			}
		}
		else{
			let levelOptions;
			for(let i=SpellLevel; i<=9; i++){
				levelOptions = levelOptions + "<option value='"+i+"'>"+i+"</option>";
			}

			if(PriorSpellLevel == 0){
				levelInput = " at level <select id='CastSpellLevel"+SpellNumber+"' name='CastSpellLevel"+SpellNumber+"'>"+levelOptions+ "</select>";
				document.getElementById("CastSpellLevelInput"+SpellNumber).innerHTML = levelInput;

				if(document.getElementById("isCharges").value != "None"){
					AHLInput = "; <select id='CanAHLSpell"+SpellNumber+"' name='CanAHLSpell"+SpellNumber+"' onchange='toggleSpellAHLResource("+SpellNumber+")'><option value='"+SpellNumber+"'>Cannot</option><option value='1'>Can</option></select> spend <input type='number' id='SpellResourceAHL"+SpellNumber+"' name='SpellResourceAHL"+SpellNumber+"' style='width:25px' value='"+SpellNumber+"' disabled> charge(s) per higher level.";
					document.getElementById("CanAHLSpell"+SpellNumber).remove();

					document.getElementById("headerSpellResource"+SpellNumber).innerHTML = document.getElementById("headerSpellResource"+SpellNumber).innerHTML + AHLInput;
				}
			}
			else{
				document.getElementById("CastSpellLevel"+SpellNumber).innerHTML = levelOptions;
			}
		}
	}
}

function toggleSpellAHLResource(SpellNumber){
	if(document.getElementById("CanAHLSpell"+SpellNumber).value == 0){
		document.getElementById("SpellResourceAHL"+SpellNumber).setAttribute("disabled","");
	}
	else{
		document.getElementById("SpellResourceAHL"+SpellNumber).removeAttribute("disabled","");
	}
}

async function createCastSpellModifierRows(tableID){
	clearUnusedTable(tableID,"rowCastSpellModifierHow","rowIsStackable");
	let nextRowIndex = document.getElementById("rowCastSpellModifierHow").rowIndex + 1;

	if(document.getElementById("CastSpellModifierHow").value == "SetValue"){
		addTableRow(tableID,nextRowIndex,"rowCastSpellModifier","<th>Spell Flat Modifier:</th><td><input type='number' id='CastSpellFlatModifier' name='CastSpellFlatModifier' style='width:25px'></td>");
		nextRowIndex++;
	}
	else if(document.getElementById("CastSpellModifierHow").value == "SpecificClass"){
		let request = await fetch("macro:pm.GetClasses@Lib:pm.a5e.Core",{"method":"POST","body":""});
		let allClasses = await request.json();
		let allClassOptions = createHTMLMultiselectOptions(allClasses,"CastSpellClass");

		addTableRow(tableID,nextRowIndex,"rowCastSpellModifier","<th>Allowed Casting Classes:</th><td><div class='check-multiple' style='width:100%'>"+allClassOptions+"</div></td>");
		nextRowIndex++;
	}
	else if(document.getElementById("CastSpellModifierHow").value == "Stat"){
		let request = await fetch("macro:pm.GetAttributes@Lib:pm.a5e.Core",{"method":"POST","body":""});
		let AllAttributes = await request.json();
		let allAttributeOptions = createHTMLMultiselectOptions(AllAttributes,"CastSpellStat");

		addTableRow(tableID,nextRowIndex,"rowCastSpellModifier","<th>Allowed Casting Stats:</th><td><div class='check-multiple' style='width:100%'>"+allAttributeOptions+"</div></td>");
		nextRowIndex++;
	}
}

function createObjectACHPRows(tableID,endRowID){
	clearUnusedTable(tableID,"rowIsCustomACHP",endRowID);
	if(document.getElementById("isCustomACHP").checked){
		let nextRowIndex = document.getElementById("rowIsCustomACHP").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowObjectCustomAC","<th><label for='AC'>Object AC:</th><td><input type='number' value=10 min=0 style='width:25px' id='AC' name='AC'><input type='checkbox' id='isDefaultAC' name='isDefaultAC' onchange='toggleFieldEnabled("+'"AC","isDefaultAC"'+")'> <label for='isDefaultAC'>Use Default?</label></td>");
		nextRowIndex++;
		
		addTableRow(tableID,nextRowIndex,"rowObjectCustomAC","<th><label for='MaxHP'>Object HP:</th><td><input type='number' value=10 min=1 id='MaxHP' style='width:25px' name='MaxHP'><input type='checkbox' id='isDefaultMaxHP' name='isDefaultMaxHP' onchange='toggleFieldEnabled("+'"MaxHP","isDefaultMaxHP"'+")'> <label for='isDefaultMaxHP'>Use Default?</label></td>");
		nextRowIndex++;
	}
}

function createLockRows(tableID){
	if(document.getElementById("isLockable").checked){
		let nextRowIndex = document.getElementById("rowIsLockable").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowLockDC","<th><label for='LockDC'>DC to Pick Lock</th><td><input type='number' id='LockDC' name='LockDC' value=10 min=1 style='width:30px'><input type='checkbox' id='NeedsLock' name='NeedsLock' onchange='toggleFieldEnabled("+'"LockDC","NeedsLock"'+")'>Needs Separate Lock?</td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsLockable","rowIsFlammable");
	}
}

function createActiveEffectsRow(){
	let nextRowIndex = document.getElementById("rowHasActiveEffects").rowIndex + 1;
	let ActiveEffectsSelection = document.getElementById("HasActiveEffects").checked;

	if(ActiveEffectsSelection){
		addTableRow("CreateObjectTable",nextRowIndex,"rowActiveEffectsNumber","<th><label for='ActiveEffectsNumber'>Number of Effects:</label></th><td><input type='number' id='ActiveEffectsNumber' name='ActiveEffectsNumber' value='1' min='1' style='width:25px' onchange='createEffectChoiceMethodRow()'></td>");
		nextRowIndex++;

		addTableRow("CreateObjectTable",nextRowIndex,"rowActiveEffectsRandom","<th><label for='isEffectRandom'>Effect is Random:</label></th><td><input type='checkbox' id='isEffectRandom' name='isEffectRandom'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable("CreateObjectTable","rowHasActiveEffects","rowSourcebook");
	}
}

function createEffectChoiceMethodRow(){
	let nextRowIndex = document.getElementById("rowActiveEffectsNumber").rowIndex + 1;
	let tableID = document.getElementById("rowActiveEffectsNumber").closest("table").id;
	let currentEffectsNumber = document.getElementById("ActiveEffectsNumber").value;
	
	if(currentEffectsNumber > 1){
		if(document.getElementById("rowEffectChoiceMethod") == null){
			addTableRow(tableID,nextRowIndex,"rowEffectChoiceMethod","<th><label for='EffectChoiceMethod'>Method of Choosing Effect:</label></th><td><select id='EffectChoiceMethod' name='EffectChoiceMethod' onchange='createAdditionalEffectMethodRows()'><option value=''>User Choice</option><option value='Random'>Random</option><option value='Target'>Target Dependent</option><option value='StoredValue'>Based on Prior Choice</option><option value='OutsideRoll'>Based on Outside Roll</option><option value='ResourceType'>Type of Resource Used</option><option value='ItemActivationState'>Item Activation State</option></select></td>");
		}
	}
	else if(document.getElementById("rowEffectChoiceMethod") != null){
		clearUnusedTable(tableID,"rowActiveEffectsNumber","rowSourcebook");
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateObjectTable').innerHTML = userdata;

	createObjectSubtypeRows('CreateObjectTable','Type');
}

setTimeout(loadUserData, 1);