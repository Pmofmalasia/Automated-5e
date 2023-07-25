function initialEquipmentRows(tableID,Inventory,HeldItems,Limbs,EquippedArmor,AttunementSlots){
	createEquippedArmorRow(tableID,Inventory,EquippedArmor);
	createHeldItemsRows(tableID,Inventory,HeldItems,Limbs);
	createAttunedItemsRows(tableID,Inventory,AttunementSlots);
	createWornItemsRows(tableID,Inventory);
}

function createEquippedArmorRow(tableID,Inventory,EquippedArmor){
	let nextRowIndex = document.getElementById("rowEquipmentHeader").rowIndex + 1;

	let AllArmor = [];
	for(let tempItem of Inventory){
		if(tempItem.Type == "Armor"){
			AllArmor.push(tempItem);
		}
	}

	let ArmorOptions = createHTMLSelectOptions(AllArmor,"ItemID");
	ArmorOptions = "<option value=''>None</option>" + ArmorOptions;

	addTableRow(tableID,nextRowIndex,"rowArmorChoice","<th><label for='ArmorChoice'>Armor:</label></th><td><select id='ArmorChoice' name='ArmorChoice'>"+ArmorOptions+"</select></td>");

	document.getElementById("ArmorChoice").value = EquippedArmor;
}

function createHeldItemsRows(tableID,Inventory,HeldItems,Limbs){
	let nextRowIndex = document.getElementById("rowArmorChoice").rowIndex + 1;

	let AllHoldables = [];
	let HoldableTypes = ["Weapon","Shield","CastingFocus","Tool","Rod","Staff"];
	for(let tempItem of Inventory){
		if(HoldableTypes.includes(tempItem.Type)){
			AllHoldables.push(tempItem);
		}
	}

	let HoldableOptions = createHTMLSelectOptions(AllHoldables,"ItemID");
	HoldableOptions = "<option value=''>None</option>" + HoldableOptions;

	for(let i=0; i<Limbs.length; i++){
		let thisLimbItem = "";
		if(i < HeldItems.length){
			thisLimbItem = HeldItems[i];
		}
		let thisLimb = Limbs[i];

		addTableRow(tableID,nextRowIndex,"rowLimb"+i+"Choice","<th><label for='Limb"+i+"Choice'>"+thisLimb.DisplayName+":</label></th><td><select id='Limb"+i+"Choice' name='Limb"+i+"Choice' value='"+thisLimbItem+"'>"+HoldableOptions+"</select></td>");

		thisLimbSelectElement = document.getElementById("Limb"+i+"Choice");
		thisLimbSelectElement.value = thisLimbItem;
		thisLimbSelectElement.onchange = function(){createLimbChoiceRows(tableID,Inventory,i);};
		nextRowIndex++;
	}
}

function createLimbChoiceRows(tableID,Inventory,whichLimb){
	let nextRowIndex = document.getElementById("rowLimb"+whichLimb+"Choice").rowIndex + 1;
	let itemChoiceID = document.getElementById("Limb"+whichLimb+"Choice").value;

	let chosenItemData;
	let ammunitionItems = [];
	for(let tempItem of Inventory){
		if(tempItem.ItemID == itemChoiceID){
			chosenItemData = tempItem;
		}
		if(tempItem.Type == "Ammunition"){
			ammunitionItems.push(tempItem);
		}
	}

	let NoAmmoTest = true;
	if(chosenItemData != ""){
		if(chosenItemData.Type == "Weapon"){
			let chosenItemWeaponProperties = chosenItemData.WeaponProperties;
			if(chosenItemWeaponProperties.includes("Ammunition")){
				NoAmmoTest = false;
				let validAmmunition = [];
				let currentAmmunition = chosenItemWeaponProperties.AmmunitionID;
				if(currentAmmunition == null){
					currentAmmunition = "";
				}
	
				let compatibleAmmunitionTypes = chosenItemData.CompatibleAmmunition;
				for(let tempItem of ammunitionItems){
					if(compatibleAmmunitionTypes.includes(tempItem.AmmunitionType)){
						validAmmunition.push(tempItem);
					}
				}
	
				AmmunitionOptions = createHTMLSelectOptions(validAmmunition,"ItemID");
				AmmunitionOptions = "<option value=''>None</option>" + AmmunitionOptions;
	
				addTableRow(tableID,nextRowIndex,"rowAmmunitionChoiceLimb"+whichLimb,"<th><label for='AmmunitionChoiceLimb"+whichLimb+"'>Ammunition Used:</label></th><td><select id='AmmunitionChoiceLimb"+whichLimb+"' name='AmmunitionChoiceLimb"+whichLimb+"' value='"+currentAmmunition+"'>"+AmmunitionOptions+"</select>");
				nextRowIndex++;
			}
		}	
	}

	if(NoAmmoTest){
		if(document.getElementById("AmmunitionChoiceLimb"+whichLimb) != null){
			document.getElementById(tableID).deleteRow(document.getElementById("rowAmmunitionChoiceLimb"+whichLimb).rowIndex);
		}
	}
}

function createAttunedItemsRows(tableID,Inventory,AttunementSlots){
	let nextRowIndex = document.getElementById("rowMagicItemHeader").rowIndex + 1;

	let AttunableItems = [];
	let AttunedItems = [];
	for(let tempItem of Inventory){
		if(tempItem.isAttunement == 1){
			AttunableItems.push(tempItem);

			if(tempItem.IsActive == 1 && tempItem.AttunedTo == document.getElementById("ParentToken").value){
				AttunedItems.push(tempItem.ItemID);
			}
		}
	}

	let AttunableOptions = createHTMLSelectOptions(AttunableItems,"ItemID");
	AttunableOptions = "<option value=''>None</option>" + AttunableOptions;

	for(let i=0; i<AttunementSlots; i++){
		let thisAttunement = "";
		if(i < AttunedItems.length){
			thisAttunement = AttunedItems[i];
		}

		addTableRow(tableID,nextRowIndex,"rowAttunementChoice"+i,"<th><label for='AttunementChoice"+i+"'>Attunement Slot #"+(i+1)+":</label></th><td><select id='AttunementChoice"+i+"' name='AttunementChoice"+i+"'>"+AttunableOptions+"</select></td>");
		nextRowIndex++;

		document.getElementById("AttunementChoice"+i).value = thisAttunement;
	}
}

function createWornItemsRows(tableID,Inventory){
	let nextRowIndex = document.getElementById("rowWornItemsHeader").rowIndex + 1;

	let HoldableTypes = ["Weapon","Shield","CastingFocus","Tool","Armor","Ammunition","Rod","Staff"];
	for(let tempItem of Inventory){
		if(HoldableTypes.includes(tempItem.Type) === false && tempItem.isAttunement != 1 && tempItem.isWearable == 1){
			let tempElementName = "WearableChoice"+tempItem.ItemID;
			let checkedTest = "";
			if(tempItem.IsActive == 1){
				checkedTest = " checked";
			}

			addTableRow(tableID,nextRowIndex,"row"+tempElementName,"<th><label for='"+tempElementName+"'>Wear "+tempItem.DisplayName+":</label></th><td><input type='checkbox' id='"+tempElementName+"' name='"+tempElementName+"'"+checkedTest+"></td>");
			nextRowIndex++;
		}
	}

	//If equal, that means no worn item rows have been made. Header not needed.
	if(document.getElementById("rowSubmit").rowIndex == nextRowIndex){
		document.getElementById(tableID).deleteRow(rowWornItemsHeaderIndex);
	}
}

async function loadUserData(){
	let tableID = 'EquipItemTable';
	let userdata = JSON.parse(atob(await MapTool.getUserData()));

	let nextRowIndex = 0;

	let ParentToken = userdata.ParentToken;
	let Limbs = userdata.Limbs;

	addTableRow(tableID,nextRowIndex,"rowEquipmentHeader","<th text-align='center' colspan='2'>Armor and Held Items</th><input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'><input type='hidden' name='Inventory' id='Inventory' value='"+btoa(userdata.Inventory)+"'><input type='hidden' name='LimbNumber' id='LimbNumber' value='"+Limbs.length+"'>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMagicItemHeader","<th text-align='center' colspan='2'>Magic Item Attunement</th><input type='hidden' name='AttunementNumber' id='AttunementNumber' value='"+userdata.AttunementSlots+"'>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowWornItemsHeader","<th text-align='center' colspan='2'>Other Worn Items</th>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowSubmit","<th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Change Equipment'></th>");
	nextRowIndex++;

	initialEquipmentRows("EquipItemTable",userdata.Inventory,userdata.HeldItems,userdata.Limbs,userdata.EquippedArmor,userdata.AttunementSlots);
}

setTimeout(loadUserData, 1);