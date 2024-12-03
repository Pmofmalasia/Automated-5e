async function createObjectSubtypeRows(IDSuffix){
	if(arguments.length === 0){IDSuffix = "";}
	let referenceElement = document.getElementById("rowObjectType"+IDSuffix);
	//Reset selections
	let endRow = document.getElementById("rowObjectTypeEnd");
	deleteInterveningElements(referenceElement,endRow);

	let improvisedWeaponSelection = document.getElementById("isImprovisedWeapon");
	improvisedWeaponSelection.removeAttribute("disabled","");
	document.getElementById("isSpellcastingFocus").checked = false;
	document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));

	let ObjectType = document.getElementById("Type"+IDSuffix).value;

	if(ObjectType == "Weapon"){
		createWeaponTableRows("rowObjectType"+IDSuffix);
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
		document.getElementById("wornHeld").value = "Worn";
		document.getElementById("isStackable").checked = true;
		
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.AmmunitionTypes']"});
		let allAmmunitionTypes = await request.json();

		let AmmunitionTypeOptions = "";
		for(let tempAmmunitionType of allAmmunitionTypes){
			AmmunitionTypeOptions = AmmunitionTypeOptions + "<option value='"+tempAmmunitionType.Name+"'>"+tempAmmunitionType.DisplayName+"</option>";
		}

		referenceElement = createTableRow(referenceElement,"rowAmmunitionType","<th><label for='AmmunitionType'>Ammunition Type:</label></th><td><select id='AmmunitionType' name='AmmunitionType' onchange='createAmmunitionTypeRows()'><option value='@@NewType'>New Type</option>"+AmmunitionTypeOptions+"</select></td>");
		
		if(document.getElementById("AmmunitionType").value == "@@NewType"){
			createAmmunitionTypeRows();
			referenceElement = endRow.previousElementSibling;
		}

		referenceElement = createTableRow(referenceElement,"rowAmmunitionDamageHeader","<th style='text-align:center' colspan='2'>Additional Damage:<input type='hidden' id='AmmunitionDamageInstanceNumber' name='AmmunitionDamageInstanceNumber' value=0></th>");

		referenceElement = createTableRow(referenceElement,"rowAmmunitionDamageInstanceButtons","<th style='text-align:center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add Type' onclick='addDamageTypeRows("+'"Ammunition"'+")'> <input type='button' id='removeDamageType' name='removeDamageType' value='Remove Type' onclick='removeDamageTypeRows("+'"Ammunition"'+")'></th>");

		referenceElement = createTableRow(referenceElement,"rowMagicBonus","<th><label for='MagicBonus'>Magic Bonus:</label></th><td>+ <input type='number' id='MagicBonus' name='MagicBonus' min='0' value='0' style='width:25px' onchange='MagicBonusChanges()'></td>");
	}
	else if(ObjectType == "AdventuringGear"){
		//Nothing happens, this is the miscellaneous category
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "Clothing"){
		document.getElementById("wornHeld").value = "Worn";
		document.getElementById("isStackable").checked = true;
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ClothingTypes']"});
		let allClothingTypes = await request.json();
		let ClothingTypeSelection = createHTMLSelectOptions(allClothingTypes);

		referenceElement = createTableRow(referenceElement,"rowClothingType","<th><label for='ClothingType'>Clothing Type:</label></th><td><select id='ClothingType' name='ClothingType'>"+ClothingTypeSelection+"</select></td>");
	}
	else if(ObjectType == "Container"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;

		referenceElement = createTableRow(referenceElement,"rowContainerWeightCapacity","<th><label for='ContainterWeightCapacity'>Weight Capacity:</label></th><td><input type='number' id='ContainterWeightCapacity' name='ContainterWeightCapacity' min=0 step=0.1 style='width:35px'>lbs. <input type='checkbox' id='isContainterWeightCapacity' name='isContainterWeightCapacity' onchange='toggleFieldEnabled("+'"ContainterWeightCapacity","isContainterWeightCapacity"'+")'> No limit</td>");
	
		referenceElement = createTableRow(referenceElement,"rowContainerSolidVolumeCapacity","<th><label for='ContainterSolidVolumeCapacity'>Solid Volume Capacity:</label></th><td><input type='number' id='ContainterSolidVolumeCapacity' name='ContainterSolidVolumeCapacity' min=0 step=0.1 style='width:35px'><select id='ContainterSolidVolumeCapacityUnits' name='ContainterSolidVolumeCapacityUnits'><option value='cubicfeet'>Cubic Feet</option><option value='cubicyard'>Cubic Yards</option></select><input type='checkbox' id='isContainterSolidVolumeCapacity' name='isContainterSolidVolumeCapacity' onchange='toggleFieldEnabled(["+'"ContainterSolidVolumeCapacity","ContainterSolidVolumeCapacityUnits"],"isContainterSolidVolumeCapacity"'+")'>No Solids</td>");

		referenceElement = createTableRow(referenceElement,"rowContainerFluidVolumeCapacity","<th><label for='ContainterFluidVolumeCapacity'>Fluid Volume Capacity:</label></th><td><input type='number' id='ContainterFluidVolumeCapacity' name='ContainterFluidVolumeCapacity' min=0 step=0.1 style='width:35px'><select id='ContainterFluidVolumeCapacityUnits' name='ContainterFluidVolumeCapacityUnits'><option value='ounce'>Ounces</option><option value='pint'>Pints</option><option value='gallon'>Gallons</option><option value='milliliter'>Milliliters</option><option value='liter'>Liters</option></select><input type='checkbox' id='isContainterFluidVolumeCapacity' name='isContainterFluidVolumeCapacity' onchange='toggleFieldEnabled(["+'"ContainterFluidVolumeCapacity","ContainterFluidVolumeCapacityUnits"],"isContainterFluidVolumeCapacity"'+")'>No Fluids</td>");

		referenceElement = createTableRow(referenceElement,"rowContainerIgnoreWeight","<th><label for='isContainerIgnoreWeight'>Ignore Weight of Contents:</label></th><td><input type='checkbox' id='isContainerIgnoreWeight' name='isContainerIgnoreWeight'></td>");

		referenceElement = createTableRow(referenceElement,"rowContainerStorageTime","<th><label for='ContainerStorageTime'>Time to Store/Remove Contents:</label></th><td><select id='ContainerStorageTime' name='ContainerStorageTime' onchange='createNonstandardStorageRows()'><option value=''>Both are Item Interactions</option><option value='Action'>Both are Actions</option><option value='Custom'>Other</option></select></td>");
	}
	else if(ObjectType == "Hazard" || ObjectType == "Trap"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "LightSource"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;

		referenceElement = createTableRow(referenceElement,"rowLightFuel","<th><label for='LightFuel'>Light Can be Refueled:</label></th><td><select id='LightFuel' name='LightFuel'><option value=''>None</option><option value='Oil'>Oil Flask</option><option value='Other'>Other Fuel</option></select></td>");

		createLightTable("rowObjectType"+IDSuffix,"rowLightFuel",IDSuffix);

		createCustomDurationRows("LightDuration","rowObjectTypeEnd");
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
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType === "Poison"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;

		referenceElement = createTableRow(referenceElement,"rowPoisonAdministrationRoute","<th><label for='PoisonAdministrationRoute'>Administration Route:</label></th><td><select id='PoisonAdministrationRoute' name='PoisonAdministrationRoute'><option value='Contact'>Contact</option><option value='Ingested'>Ingested</option><option value='Inhaled'>Inhaled</option><option value='Injury'>Injury</option></select></td>");

		referenceElement = createTableRow(referenceElement,"rowPoisonEnd","<th colspan=2></th>");
		referenceElement.classList.add("section-end");
	
		document.getElementById("PoisonAdministrationRoute").addEventListener("change",function(){
			let PoisonChoice = this.value;
			let referenceElement = document.getElementById("rowPoisonAdministrationRoute");
			deleteInterveningElements(referenceElement,document.getElementById("rowPoisonEnd"));

			//TODO: Need to decide if I should link targeting to the poison type (as described below) or just make people reinput it each time (easier for programming)



			//TODO: For injury/contact, add details about what it can be applied to (e.g. surfaces (for contact), weapons, number of pieces of ammunition, traps, etc.); and how long it lasts when applied (e.g. duration vs. uses (single hit, no time limit by default))

			//For inhaled, should create an AoE (cloud of gas, default 5ft cube) and then maybe how long it lingers for (default instantaneous)

			//For ingested, should be able to apply it to food/water? But in actual play that would make no sense because nobody would have food tokens. Likely keep as just an active effect.

			//For injury/contact, effect should be targeting an item (limits above) and putting a condition on it that does a thing.
		});
	}
	else if(ObjectType == "Rod"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Scroll"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = true;
	}
	else if(ObjectType == "SpellcastingFocus"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
	}
	else if(ObjectType == "Staff"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Tool"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ToolTypes']"});
		let allToolTypes = await request.json();
		let ToolTypeSelection = createHTMLSelectOptions(allToolTypes);

		referenceElement = createTableRow(referenceElement,"rowToolType","<th><label for='ToolType'>Tool Type:</label></th><td><select id='ToolType' name='ToolType' onchange='updateToolSubtypeOptions()'>"+ToolTypeSelection+"<option value=''>None</option></select></td>");

		referenceElement = createTableRow(referenceElement,"rowToolSubtype","<th><label for='ToolSubtype'>Tool Subtype:</label></th><td><select id='ToolSubtype' name='ToolSubtype' onchange='createNewToolRows()'><option value=''>New Tool</option></select></td>");

		updateToolSubtypeOptions();
	}
	else if(ObjectType == "Vehicle"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = false;
	}
	else if(ObjectType == "Wand"){
		document.getElementById("wornHeld").value = "Held";
		document.getElementById("isStackable").checked = false;
	
		document.getElementById("isSpellcastingFocus").checked = true;
		document.getElementById("isSpellcastingFocus").dispatchEvent(new Event("change"));
		document.getElementById("SpellcastingFocusTypeArcane").checked = true;
	}
	else if(ObjectType == "Wondrous"){
		document.getElementById("wornHeld").value = "";
		document.getElementById("isStackable").checked = false;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTypes']"});
		let allObjectTypes = await request.json();

		let nonWondrousTypes = allObjectTypes.filter(function(objectTypes){
			return objectTypes.Name != "Wondrous";
		});

		let ObjectTypeSelection = createHTMLSelectOptions(nonWondrousTypes);
		ObjectTypeSelection = "<option value=''>No Other</option>" + ObjectTypeSelection;

		referenceElement = createTableRow(referenceElement,"rowObjectTypeWondrous","<th><label for='TypeWondrous'>Wondrous Object Type:</label></th><td><select id='TypeWondrous' name='TypeWondrous' onchange='createObjectSubtypeRows("+'"Wondrous"'+")'>"+ObjectTypeSelection+"</select></td>");
	}
}

async function createAmmunitionTypeRows(){
	let referenceRow = document.getElementById("rowAmmunitionType");

	if(document.getElementById("AmmunitionType").value == "@@NewType"){
		createNewTemplateRows(referenceRow,"Ammunition");
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowAmmunitionDamageHeader"));
		
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
			deleteInterveningElements(document.getElementById("rowAmmunitionDamageHeader"),document.getElementById("rowAmmunitionDamageInstanceButtons"));
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

		if(AmmunitionTypeData.MagicBonus != undefined){
			document.getElementById("MagicBonus").value = AmmunitionTypeData.MagicBonus;
		}

		updateGenericObjectTemplate(AmmunitionTypeData);
	}
}

function createNonstandardStorageRows(){
	let referenceElement = document.getElementById("rowContainerStorageTime").rowIndex;

	if(document.getElementById("ContainerStorageTime").value == "Custom"){
		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		referenceElement = createTableRow(referenceElement,"rowStorageRemovalTime","<th><label for='StorageRemovalTime'>Time to Remove from Container:</label></th><td><select id='StorageRemovalTime' name='StorageRemovalTime'>"+UseTimeOptions+"</select><input type='checkbox' id='StorageCannotRemove' name='StorageCannotRemove' onchange='toggleFieldEnabled("+'"StorageRemovalTime","StorageCannotRemove"'+")'> <label for='StorageCannotRemove'>Cannot Remove Items?</label></td>");
		document.getElementById("StorageRemovalTime").value = "Item Interaction";

		referenceElement = createTableRow(referenceElement,"rowStorageAddTime","<th><label for='StorageAddToTime'>Time to Put in Container:</label></th><td><select id='StorageAddToTime' name='StorageAddToTime'>"+UseTimeOptions+"</select><input type='checkbox' id='StorageCannotAddTo' name='StorageCannotAddTo' onchange='toggleFieldEnabled("+'"StorageAddToTime","StorageCannotAddTo"'+")'> <label for='StorageCannotAddTo'>Cannot Store Items?</label></td>");
		document.getElementById("StorageAddToTime").value = "Item Interaction";
	}
	else{
		deleteInterveningElements(document.getElementById("rowContainerStorageTime"),document.getElementById("rowObjectTypeEnd"));
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

		referenceRow = createTableRow(referenceRow,"rowNonstandardEquipEnd","<th colspan=2></th>");
		referenceRow.classList.add("section-end");
	}
	else if(document.getElementById("isNonstandardEquip").value !== "Custom" && document.getElementById("rowNonstandardEquipEnd") !== null){
		deleteInterveningElements(referenceRow,document.getElementById("rowNonstandardEquipEnd").nextElementSibling);
	}
}

function createConsumableRows(){
	let referenceElement = document.getElementById("rowIsConsumable");

	let endRow = document.getElementById("rowConsumableEnd");
	if(endRow === null){
		endRow = referenceElement.nextElementSibling;
	}
	else{
		endRow = endRow.nextElementSibling;
	}
	deleteInterveningElements(referenceElement,endRow);

	if(document.getElementById("isConsumable").checked){
		referenceElement = createTableRow(referenceElement,"rowIsLeaveBehindContainer","<th><label for='isLeaveBehindContainer'>Leaves Behind a Container?</label></th><td><input type='checkbox' id='isLeaveBehindContainer' name='isLeaveBehindContainer'></td>");

		document.getElementById("isLeaveBehindContainer").addEventListener("change",createLeaveBehindContainerRow);

		referenceElement = createTableRow(referenceElement,"rowConsumableEnd","<th></th><td></td>");
		referenceElement.setAttribute("hidden","");
	}
}

async function createLeaveBehindContainerRow(){
	let referenceElement = document.getElementById("rowIsLeaveBehindContainer");

	if(referenceElement.nextElementSibling.id === "rowContainerLeftBehind"){
		referenceElement.nextElementSibling.remove();
	}

	if(document.getElementById("isLeaveBehindContainer").checked){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Objects']"});
		let allObjects = await request.json();
		let ContainerOptions = [];
		for(let tempObject of allObjects){
			if(tempObject.Type == "Container"){
				ContainerOptions.push(tempObject);
			}
		}
		let ContainerSelection = createHTMLSelectOptions(ContainerOptions,"ObjectID");

		referenceElement = createTableRow(referenceElement,"rowContainerLeftBehind","<th><label for='ContainerLeftBehind'>Container Left Behind:</label></th><td><select id='ContainerLeftBehind' name='ContainerLeftBehind'>"+ContainerSelection+"</select></td>");
	}
}

async function updateToolSubtypeOptions(){
	let requestTools = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Tools']"});
	let allTools = await requestTools.json();

	let selectedToolType = document.getElementById("ToolType").value;
	let validToolSubtypes = allTools.filter(function(toolSubtypes){
		return toolSubtypes.ToolType == selectedToolType;
	});
	let ToolSelection = createHTMLSelectOptions(validToolSubtypes);

	document.getElementById("ToolSubtype").innerHTML = ToolSelection+"<option value=''>New Tool</option>";

	if((ToolSelection == "" && document.getElementById("rowNewToolType") != null) || ToolSelection != ""){
		createNewToolRows();
	}
}

function createNewToolRows(){
	if(document.getElementById("ToolSubtype").value == ""){
		let referenceElement = document.getElementById("rowToolSubtype");

		referenceElement = createTableRow(referenceElement,"rowNewToolType","<th><label for='NewToolTypeDisplayName'>New Tool Subtype Name:</label></th><td><input type='text' id='NewToolTypeDisplayName' name='NewToolTypeDisplayName'></td>");

		referenceElement = createTableRow(referenceElement,"rowIsNewToolSubtypeTemplate","<th><label for='isNewToolSubtypeTemplate'>Add as Template:</label></th><td><input type='checkbox' id='isNewToolSubtypeTemplate' name='isNewToolSubtypeTemplate'></td>");
	}
	else{
		deleteInterveningElements(document.getElementById("rowToolSubtype"),document.getElementById("rowObjectTypeEnd"));
	}
}

function createActivatableRows(){
	let referenceElement = document.getElementById("rowIsActivatable");

	if(document.getElementById("isActivatable").checked){
		referenceElement = createTableRow(referenceElement,"rowIsActivationEffect","<th><label for='isActivationEffect'>Instantaneous Effect on Activation/Deactivation:</label></th><td><select id='isActivationEffect' name='isActivationEffect' onchange='createActivationEffectRows()'><option value=''>No (Passive Only)</option><option value='Activation'>Activation Only</option><option value='Deactivation'>Deactivation Only</option><option value='Both'>Both</option><select></td>");

		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours","Custom"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		referenceElement = createTableRow(referenceElement,"rowUseTimeActivation","<th><label for='UseTimeActivation'>Activation Time:</label></th><td><select id='UseTimeActivation' name='UseTimeActivation'>"+UseTimeOptions+"</select></td>");
		document.getElementById("UseTimeActivation").value = "Bonus Action";
		document.getElementById("UseTimeActivation").addEventListener("change",function(){
			createCustomUseTimeRows("UseTimeActivation","rowActivationComponents");
		})

		referenceElement = createTableRow(referenceElement,"rowUseTimeDeactivation","<th><label for='UseTimeDeactivation'>Deactivation Time:</label></th><td><select id='UseTimeDeactivation' name='UseTimeDeactivation'><option value='Same'>Same as Activation</option>"+UseTimeOptions+"</select></td>");
		document.getElementById("UseTimeDeactivation").addEventListener("change",function(){
			createCustomUseTimeRows("UseTimeDeactivation","rowDeactivationComponents");
		})

		referenceElement = createTableRow(referenceElement,"rowActivationComponents","<th><label for='ActivationComponents'>Activation Requirements:</label></th><td><select id='ActivationComponents' name='ActivationComponents'><option value='None'>No Components</option><option value='Verbal'>Command Word (Verbal)</option><option value='Somatic'>Interaction (Somatic)</option><option value='Both'>Verbal and Somatic</option></select></td>");

		if(document.getElementById("rowIsActivatableEnd") === null){
			referenceElement = createTableRow(referenceElement,"rowIsActivatableEnd","<th colspan=2 class='section-end'></th>");
		}

		activationTimeResourceRow();
	}
	else{
		deleteInterveningElements(document.getElementById("rowIsActivatable"),document.getElementById("rowIsActivatableEnd").nextElementSibling);
	}
}

function createActivationEffectRows(){
	if(!document.getElementById("isActivatable").checked){
		
	}
	else if(document.getElementById("isActivationEffect").value != ""){
		//TODO: Items - Create ActivationEffects and DeactivationEffects. Simple lights automatically add one that turns the light off/on if one is not made for you. ActivateItem runs effect through ExecuteEffect. Need to sort out having multiple places where subeffects can be created (fine in JSON, hard for input tracking the data)
	}
}

function activationTimeResourceRow(){
	let needsTimeRow = false;

	if(!document.getElementById("isActivatable").checked){
		
	}
	else{
		let resourceChoice = document.getElementById("isResources").value;
		needsTimeRow = resourceChoice !== "";

		let lightDuration = document.getElementById("customLightDurationValue");
		if(lightDuration != null){
			needsTimeRow = !lightDuration.disabled;
		}
	}

	let timeResourceOptions = getInProgressResourceOptions({SpecialType:"Time"});

	let referenceElement = document.getElementById("rowActivationComponents");
	referenceElement = createTableRow(referenceElement,"rowActivationTimeResourceUsed","<th><label for='ActivationTimeResourceUsed'>Activation Uses Time Resource:</label></th><td><select id='ActivationTimeResourceUsed' name='ActivationTimeResourceUsed'><option value=''>None</option>"+timeResourceOptions+"</select></td>");

	//TODO: Resource - Gotta do a whole bunch of ass-covering here to prevent issues when changing resource amounts/names after the fact

	let resourceNum = document.getElementById("ResourceNumber");
	if(resourceNum === null){
		resourceNum = 1;
	}
	else{
		resourceNum = Number(resourceNum.value);
	}

	trackResourceOptionChanges(document.getElementById("ActivationTimeResourceUsed"),{SpecialType:"Time"});
}

function createDurationRows(endRowID){
	let referenceElement = document.getElementById("rowObjectDuration");
	if(document.getElementById("isDuration").checked){
		createCustomDurationRows("ObjectDuration",endRowID);

		referenceElement = createTableRow(referenceElement,"rowIsPerishable","<th><label for='isPerishable'>Destroy Object when Unusable?</label></th><td><input type='checkbox' id='isPerishable' name='isPerishable'></td>");
	}
	else{
		deleteInterveningElements(referenceElement,document.getElementById(endRowID));
	}
}

async function createSpellcastingFocusRows(endRowID){
	let referenceElement = document.getElementById("rowIsSpellcastingFocus");
	if(document.getElementById("isSpellcastingFocus").checked){

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.SpellcastingFocusTypes']"});
		allFocusTypes = await request.json();
		focusTypeOptions = createHTMLMultiselectOptions(allFocusTypes,"SpellcastingFocusType");

		referenceElement = createTableRow(referenceElement,"rowSpellcastingFocusType","<th>Spellcasting Focus Type(s):</th><td><div class='check-multiple' style='width:100%'>"+focusTypeOptions+"</div></td>");
	}
	else{
		deleteInterveningElements(referenceElement,document.getElementById(endRowID));
	}	
}

async function createCastSpellsRows(){
	let referenceElement = document.getElementById("rowIsCastSpells");

	if(document.getElementById("isCastSpells").checked){
		let spellcastingRows = [];
		let spellcastingListeners = [];

		let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {"method":"POST","body":""});
		let allSpells = await request.json();
		allSpellOptions = createHTMLSelectOptions(allSpells);

		spellcastingRows.push({
			RowID:"rowCastSpell",
			Contents:"<th style='text-align:center' colspan='2' id='headerCastSpell'>Cast <select id='CastSpellName' name='CastSpellName'>"+allSpellOptions+"</select><span id='CastSpellLevelInput'></span></th>"
		});
		spellcastingListeners.push({
			elementID:"CastSpellName",
			listener:"change",
			functionName:"adjustSpellLevelOptions",
			functionArgs:{}
		});

		createMultiRowButtonsInput("CastSpell",referenceElement,spellcastingRows,"Spell",spellcastingListeners);

		let addSpellButton = document.getElementById("AddCastSpellButton");
		addSpellButton.addEventListener("change",function(){
			if(document.getElementById("isResources").value !== ""){
				let currentNumber = Number(document.getElementById("CastSpellNumber").value);
				addItemSpellcastingCharges(currentNumber - 1);
			}
		});

		await adjustSpellLevelOptions(0);

		document.getElementById("isResources").addEventListener("change",toggleItemSpellcastingCharges);
		toggleItemSpellcastingCharges();

		referenceElement = document.getElementById("rowCastSpellButtons");

		referenceElement = createTableRow(referenceElement,"rowCastSpellModifierHow","<th>Spell Attack/DC Modifier Method:</th><td><select id='CastSpellModifierHow' name='CastSpellModifierHow' onchange='createCastSpellModifierRows()'><option value='AnyClass'>Any Class Spell Modifier</option><option value='SpecificClass'>Specific Class Spell Modifier</option><option value='SetValue'>Preset Modifier</option><option value='Stat'>Based on a Stat</option></select></td>");

		referenceElement = createTableRow(referenceElement,"rowCastSpellEnd","<th colspan = 2></th>");
		referenceElement.classList.add("section-end");

		//TODO: Add any modifications to spells
	}
	else{
		deleteInterveningElements(referenceElement,document.getElementById("rowCastSpellEnd").nextElementSibling);

		document.getElementById("isResources").removeEventListener("change",toggleItemSpellcastingCharges);
	}
}

async function adjustSpellLevelOptions(i){
	let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {"method":"POST","body":""});
	let allSpells = await request.json();

	let WhichSpell = document.getElementById("CastSpellName"+i).selectedIndex;
	let SpellData = allSpells[WhichSpell];
	let SpellLevel = Number(SpellData.Level);
	let priorLevelInput = document.getElementById("CastSpellLevel"+i);
	let PriorSpellLevel;
	if(priorLevelInput !== null){
		PriorSpellLevel = Number(priorLevelInput.value);
	}
	else{
		PriorSpellLevel = null;
	}

	if(PriorSpellLevel !== SpellLevel){
		let levelInput = "";
		if(SpellLevel === 0){
			levelInput = "<input type='hidden' id='CastSpellLevel"+i+"' name='CastSpellLevel"+i+"' value=0>";
			document.getElementById("CastSpellLevelInput"+i).innerHTML = levelInput;
		}
		else{
			let levelOptions;
			for(let j=SpellLevel; j<=9; j++){
				levelOptions = levelOptions + "<option value='"+j+"'>"+j+"</option>";
			}

			if(PriorSpellLevel === 0 || PriorSpellLevel === null){
				levelInput = " at level <select id='CastSpellLevel"+i+"' name='CastSpellLevel"+i+"'>"+levelOptions+ "</select>";
				document.getElementById("CastSpellLevelInput"+i).innerHTML = levelInput;
			}
			else{
				document.getElementById("CastSpellLevel"+i).innerHTML = levelOptions;
			}
		}

		updateItemSpellAHL(i);
	}
}

function toggleItemSpellcastingCharges(){
	let spellOptionsNumber = Number(document.getElementById("CastSpellNumber").value);
	let resourceChoice = document.getElementById("isResources").value;
	if(resourceChoice === ""){
		for(let i = 0; i < spellOptionsNumber; i++){
			let thisSpellResourceRow = document.getElementById("rowCastSpellResource"+i);
			if(thisSpellResourceRow !== null){
				thisSpellResourceRow.remove();
			}
		}
	}
	else if(document.getElementById("rowCastSpellResource0") === null){
		for(let i = 0; i < spellOptionsNumber; i++){
			addItemSpellcastingCharges(i);
		}
	}
}

function addItemSpellcastingCharges(i){
	let referenceElement = document.getElementById("rowCastSpell"+i);
	let castSpellResourceOptions = getInProgressResourceOptions();

	referenceElement = createTableRow(referenceElement,"rowCastSpellResource"+i,"<th style='text-align:center' colspan='2' id='headerCastSpellResource"+i+"'>Uses <input type='number' id='CastSpellResource"+i+"' name='CastSpellResource"+i+"' style='width:25px' value=1> <select id='CastSpellResourceKey"+i+"' name='CastSpellResourceKey"+i+"'><option value=''>No Resource</option>"+castSpellResourceOptions+"</select><span id='CastSpellAHLInput"+i+"'></span></th>");

	trackResourceOptionChanges(document.getElementById("CastSpellResourceKey"+i));

	updateItemSpellAHL(i);
}

async function updateItemSpellAHL(i){
	let AHLSpan = document.getElementById("CastSpellAHLInput"+i);
	if(AHLSpan === null){
		return;
	}

	let request = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {"method":"POST","body":""});
	let allSpells = await request.json();

	let WhichSpell = document.getElementById("CastSpellName"+i).selectedIndex;
	let SpellData = allSpells[WhichSpell];
	let SpellLevel = Number(SpellData.Level);

	if(SpellLevel === 0){
		AHLSpan.innerHTML = "";
	}
	else{
		AHLSpan.innerHTML = "; <select id='CanAHLSpell"+i+"' name='CanAHLSpell"+i+"'><option value='0'>Cannot</option><option value='1'>Can</option></select> spend <input type='number' id='SpellResourceAHL"+i+"' name='SpellResourceAHL"+i+"' class='small-number' value='0' disabled> charge(s) per additional level.";

		document.getElementById("CanAHLSpell"+i).addEventListener("change",function(){
			toggleSpellAHLResource(i);
		});
	}
}

function toggleSpellAHLResource(i){
	if(document.getElementById("CanAHLSpell"+i).value == 0){
		document.getElementById("SpellResourceAHL"+i).setAttribute("disabled","");
	}
	else{
		document.getElementById("SpellResourceAHL"+i).removeAttribute("disabled","");
	}
}

async function createCastSpellModifierRows(){
	let referenceElement = document.getElementById("rowCastSpellModifierHow");
	deleteInterveningElements(referenceElement,document.getElementById("rowIsStackable"));

	if(document.getElementById("CastSpellModifierHow").value == "SetValue"){
		referenceElement = createTableRow(referenceElement,"rowCastSpellModifier","<th>Spell Flat Modifier:</th><td><input type='number' id='CastSpellFlatModifier' name='CastSpellFlatModifier' style='width:25px'></td>");
	}
	else if(document.getElementById("CastSpellModifierHow").value == "SpecificClass"){
		let request = await fetch("macro:pm.GetClasses@Lib:pm.a5e.Core",{"method":"POST","body":""});
		let allClasses = await request.json();
		let allClassOptions = createHTMLMultiselectOptions(allClasses,"CastSpellClass");

		referenceElement = createTableRow(referenceElement,"rowCastSpellModifier","<th>Allowed Casting Classes:</th><td><div class='check-multiple' style='width:100%'>"+allClassOptions+"</div></td>");
	}
	else if(document.getElementById("CastSpellModifierHow").value == "Stat"){
		let request = await fetch("macro:pm.GetAttributes@Lib:pm.a5e.Core",{"method":"POST","body":""});
		let AllAttributes = await request.json();
		let allAttributeOptions = createHTMLMultiselectOptions(AllAttributes,"CastSpellStat");

		referenceElement = createTableRow(referenceElement,"rowCastSpellModifier","<th>Allowed Casting Stats:</th><td><div class='check-multiple' style='width:100%'>"+allAttributeOptions+"</div></td>");
	}
}

async function createImprovisedWeaponRows(){
	if(document.getElementById("isImprovisedWeapon").checked){
		await createWeaponTableRows("rowIsImprovisedWeapon");
		document.getElementById("rowWeaponType").remove();
		document.getElementById("rowNewTypeNameWeapon").remove();
		document.getElementById("rowIsNewTemplateWeapon").remove();
		document.getElementById("rowWeaponClass").remove();
	}
	else{
		deleteInterveningElements(document.getElementById("rowIsImprovisedWeapon"),document.getElementById("rowIsStackable"));
	}
}

function createObjectACHPRows(endRowID){
	let referenceElement = document.getElementById("rowIsCustomACHP");
	deleteInterveningElements(referenceElement,endRowID);
	if(document.getElementById("isCustomACHP").checked){
		referenceElement = createTableRow(referenceElement,"rowObjectCustomAC","<th><label for='AC'>Object AC:</th><td><input type='number' value=10 min=0 style='width:25px' id='AC' name='AC'><input type='checkbox' id='isDefaultAC' name='isDefaultAC' onchange='toggleFieldEnabled("+'"AC","isDefaultAC"'+")'> <label for='isDefaultAC'>Use Default?</label></td>");
		
		referenceElement = createTableRow(referenceElement,"rowObjectCustomAC","<th><label for='MaxHP'>Object HP:</th><td><input type='number' value=10 min=1 id='MaxHP' style='width:25px' name='MaxHP'><input type='checkbox' id='isDefaultMaxHP' name='isDefaultMaxHP' onchange='toggleFieldEnabled("+'"MaxHP","isDefaultMaxHP"'+")'> <label for='isDefaultMaxHP'>Use Default?</label></td>");
	}
}

function createLockRows(){
	let referenceElement = document.getElementById("rowIsLockable");
	if(document.getElementById("isLockable").checked){
		referenceElement = createTableRow(referenceElement,"rowLockDC","<th><label for='LockDC'>DC to Pick Lock</th><td><input type='number' id='LockDC' name='LockDC' value=10 min=1 style='width:30px'><input type='checkbox' id='NeedsLock' name='NeedsLock' onchange='toggleFieldEnabled("+'"LockDC","NeedsLock"'+")'>Needs Separate Lock?</td>");
	}
	else{
		deleteInterveningElements(referenceElement,document.getElementById("rowIsFlammable"));
	}
}

function createActiveEffectsRow(){
	let referenceElement = document.getElementById("rowHasActiveEffects");
	let ActiveEffectsSelection = document.getElementById("HasActiveEffects").checked;

	if(ActiveEffectsSelection){
		referenceElement = createTableRow(referenceElement,"rowActiveEffectsNumber","<th><label for='ActiveEffectsNumber'>Number of Effects:</label></th><td><input type='number' id='ActiveEffectsNumber' name='ActiveEffectsNumber' value='1' min='1' style='width:25px' onchange='createEffectChoiceMethodRow()'></td>");

		referenceElement = createTableRow(referenceElement,"rowActiveEffectsRandom","<th><label for='isEffectRandom'>Effect is Random:</label></th><td><input type='checkbox' id='isEffectRandom' name='isEffectRandom'></td>");
	}
	else{
		deleteInterveningElements(referenceElement,document.getElementById("rowSourcebook"));
	}
}

function createEffectChoiceMethodRow(){
	let referenceElement = document.getElementById("rowActiveEffectsNumber");
	let currentEffectsNumber = document.getElementById("ActiveEffectsNumber").value;
	
	if(currentEffectsNumber > 1){
		if(document.getElementById("rowEffectChoiceMethod") == null){
			referenceElement = createTableRow(referenceElement,"rowEffectChoiceMethod","<th><label for='EffectChoiceMethod'>Method of Choosing Effect:</label></th><td><select id='EffectChoiceMethod' name='EffectChoiceMethod' onchange='createAdditionalEffectMethodRows()'><option value=''>User Choice</option><option value='Random'>Random</option><option value='Target'>Target Dependent</option><option value='StoredValue'>Based on Prior Choice</option><option value='OutsideRoll'>Based on Outside Roll</option><option value='ResourceType'>Type of Resource Used</option><option value='ItemActivationState'>Item Activation State</option></select></td>");
		}
	}
	else if(document.getElementById("rowEffectChoiceMethod") != null){
		deleteInterveningElements(referenceElement,document.getElementById("rowSourcebook"));
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('CreateObjectTable').innerHTML = userdata;

	createObjectSubtypeRows('Type');

	document.getElementById("isResources").addEventListener("change",function(){
		let ItemData = {
			DisplayName:document.getElementById("DisplayName").value,
			Type:"Item"
		};
		createResourceRows(ItemData);
	});
}

setTimeout(loadUserData, 1);