function dragItem(ev){
	ev.dataTransfer.clearData();
	ev.dataTransfer.setData("text",ev.target.id);
}

function dropItem(ev){
	ev.preventDefault();
	let movedRowID = ev.dataTransfer.getData("text");
	let movedRow = document.getElementById(movedRowID);

	let contextButtonDropTarget = ev.target.closest("button");
	if(contextButtonDropTarget != null){
		let buttonType = contextButtonDropTarget.value;
		let nonValidButtons = ["open","closed","charge"];
		if(nonValidButtons.includes(buttonType)){
			return;
		}
	}

	let dropTarget = ev.target.closest("tr");

	let oldIndex = movedRow.rowIndex;
	let movedItemData = Inventory[oldIndex - 1];

	let targetTable = dropTarget.parentNode;
	targetTable.insertBefore(movedRow,dropTarget);

	if(Array.isArray(movedItemData.Contents)){
		for(let containedItem of movedItemData.Contents){
			targetTable.insertBefore(document.getElementById("rowItemID"+containedItem),dropTarget);
		}
	}
	let newIndex = movedRow.rowIndex;

	rearrangeInventory(oldIndex,newIndex);
}

function dropStoreItem(ev,ContainerID){
	ev.preventDefault();
	let movedRow = document.getElementById(ev.dataTransfer.getData("text"));
	let movedItemID = movedRow.id.substring(9);

	//May need additional check here to make sure that it is a container button, not sure if different functions covers this
	let contextButtonDropTarget = ev.target.closest("button");
	if(contextButtonDropTarget != null){
		let ContainerData = getItemData(ContainerID);
		let ContainerContents = ContainerData.Contents;
		if(!Array.isArray(ContainerContents)){
			ContainerContents = [];
		}
		let storedItemNum = ContainerContents.length;
		if(ContainerContents.includes(movedItemID)){
			unpackItem(movedItemID,ContainerID);
			movedRow.class = "inventory-list";
		}
		else{
			storeItem(movedItemID,ContainerID);
			movedRow.class = "stored-item";
		}

		//just need to get index of last item in stored list here
		let targetTable = movedRow.parentNode;
		let oldIndex = movedRow.rowIndex;
		let newIndex = document.getElementById("rowItemID"+ContainerID).rowIndex + storedItemNum;
		targetTable.insertBefore(movedRow,targetTable.rows[newIndex + 1]);
	
		rearrangeInventory(oldIndex,newIndex);
	}
	else{
		dropItem(ev);
	}
}

function allowDrop(ev){
	ev.preventDefault();
}

function rearrangeInventory(oldIndex,newIndex){
	//Minus 1 because inventory indices don't include the header row
	oldIndex = oldIndex - 1;
	newIndex = newIndex - 1;
	let movedItemData = Inventory[oldIndex];
	let itemsMovedNum = 1;

	if(Array.isArray(movedItemData.Contents)){
		itemsMovedNum = movedItemData.Contents.length + 1;
	}

	//moves tracking in JSON, not visually
	let itemsMoved = Inventory.splice(oldIndex,itemsMovedNum);
	Inventory.splice(newIndex,0,...itemsMoved);

	updateInventory();
}

async function updateInventory(){
	await fetch("macro:js.setProperty@Lib:pm.a5e.Core", {method: "POST", body: '["a5e.stat.Inventory",'+JSON.stringify(Inventory)+','+ParentToken+']'});
}

async function createInventoryTable(){
	let InventoryTableHTML = "<tr style='position:sticky; top:15px'><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Item</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Number</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Weight</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Context Menu</th></tr>";
	let allItemsWeight = 0;

	for(let Item of Inventory){
		let thisRowUpdate = await generateItemRow(Item);
		let thisRowInnerHTML = thisRowUpdate.RowText;
		allItemsWeight = allItemsWeight + thisRowUpdate.Weight;
		
		let thisRowClass = "inventory-list";
		if(Item.StoredIn != null){
			thisRowClass = "stored-item";
		}

		InventoryTableHTML = InventoryTableHTML + "<tr class='"+thisRowClass+"' draggable='true' ondragstart='dragItem(event)' ondrop='dropItem(event)' ondragover='allowDrop(event)' id='rowItemID"+Item.ItemID+"'>"+thisRowInnerHTML+"</tr>";
	}

	InventoryTableHTML = InventoryTableHTML + "<tr id='rowWeightHeaders' ondrop='dropItem(event)' ondragover='allowDrop(event)'><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Weight Data</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Current Weight</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Carry Capacity</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Push Capacity</th></tr>";
	
	let submitData = {"ParentToken":ParentToken};
	let request = await fetch("macro:stat.a5e.CarryCapacity@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let WeightData = await request.json();

	InventoryTableHTML = InventoryTableHTML + "<tr class='Inventory-list' style='background-color:rgb(108, 223, 184); color:black'><td> --- </td><td>"+Math.round(allItemsWeight)+"</td><td>"+WeightData.Carry+"</td><td>"+WeightData.Push+"</td></tr>";

	document.getElementById("InventoryTable").innerHTML = InventoryTableHTML;
}

async function generateItemRow(Item){
	let debug = false;
	let DisplayName = Item.DisplayName;
		if(debug){console.log(DisplayName);}
	let thisRowClass = "inventory-list";
	if(Item.StoredIn != null){
		thisRowClass = "stored-item";
	}
	let thisItemID = Item.ItemID;

	let ItemNumber = Item.Number;
	let Weight = Item.Weight;
	let TotalWeight = 0;
	if(typeof ItemNumber == "number" && typeof Weight == "number"){
		TotalWeight = ItemNumber * Weight;
	}
	let displayWeight = Math.round(Weight);
if(debug){console.log("2");}

	let ResourceData = await MTFunction("evalMacro",[Item.MaxResource]);
	if(debug){console.log("3");}
	let NumberDisplay = "";
	if (ResourceData == ""){
		NumberDisplay = ItemNumber;
	}
	else{
		if(typeof ResourceData == "number"){
			NumberDisplay = Item.Resource+"<b>/</b>"+ResourceData;
		}
		else{
			let resourceNames = Object.keys(ResourceData);
			let resourceDisplayNames = Item.ResourceDisplayName;
			let isFirst = true;
			for(let tempResourceName of resourceNames){
				if(isFirst){
					//I'm like 99% sure there's a function that would make doing this unnecessary but I don't feel like finding it
					isFirst = false;
				}
				else{
					NumberDisplay = NumberDisplay + "<br>";
				}
				NumberDisplay = NumberDisplay + resourceDisplayNames[tempResourceName]+": " + Item.Resource[tempResourceName] + "<b>/</b>" + ResourceData[tempResourceName];
			}
		}			
	}
	if(debug){console.log("4");}

	let thisRowContextButtons = "<span class='context-button'>";

	let isActive = Item.IsActive > 0;
	if(Item.Type == "Container"){
		thisRowContextButtons = thisRowContextButtons + " <span id='ContainerTitle"+thisItemID+"' title='Close Container, or Drag an Item to Store'><button type='button' id='Container"+thisItemID+"' onclick='toggleContainer("+'"'+thisItemID+'"'+")' ondrop='dropStoreItem(event,"+'"'+thisItemID+'"'+")' ondragover='allowDrop(event)' value='open'><img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png?cachelib=false'></button></span> ";
	}
	if(debug){console.log("5");}

	if(Item.isActivatable == 1){
		let buttonImage;
		let buttonTitle;
		let needsActivation;
		if(isActive){
			buttonImage = "Deactivate_Item";
			buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Deactivate Item'><input type='hidden' id='needsActivation"+thisItemID+"' value=0>"
			needsActivation = 0;
		}
		else{
			buttonImage = "Activate_Item";
			buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Activate Item'><input type='hidden' id='needsActivation"+thisItemID+"' value=1>"
			needsActivation = 1;
		}
		thisRowContextButtons = thisRowContextButtons + buttonTitle + "<button id='Activate"+thisItemID+"' type='button' onclick='toggleActivation("+'"'+thisItemID+'",'+needsActivation+")'><img src='lib://pm.a5e.core/InterfaceImages/"+buttonImage+".png?cachelib=false'></button></span> ";
	}
	if(debug){console.log("6");}

	if(typeof Item.Effects == "object" && isActive){
		thisRowContextButtons = thisRowContextButtons + " <span id='UseTitle"+thisItemID+" title='Use Item'><button type='button' id='Use"+thisItemID+"' onclick='useItem("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Use.png?cachelib=false'></button></span> ";
	}
	if(debug){console.log("7");}

	if(typeof Item.ItemSpellcasting == "object" && isActive){
		thisRowContextButtons = thisRowContextButtons + " <span id='CastTitle"+thisItemID+"' title='Cast Spell'><button type='button' id='Cast"+thisItemID+"' onclick='castSpell("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Cast_Spell.png?cachelib=false'></button></span> ";
	}
	if(debug){console.log("8");}

	thisRowContextButtons = thisRowContextButtons + " <span id='RulesTitle"+thisItemID+"' title='Show Rules'><button type='button' id='Rules"+thisItemID+"' onclick='showRules("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Rules.png?cachelib=false'></button></span> ";

	thisRowContextButtons = thisRowContextButtons+"</span>";

	if(debug){console.log("9");}
	let returnData = {
		"RowText":"<td>"+DisplayName+"</td><td>"+NumberDisplay+"</td><td><span title='"+Weight+" Each'>"+displayWeight+"</span></td><td>"+thisRowContextButtons+"</td>",
		"Weight":TotalWeight
	};
	return returnData;
}

async function updateItems(ItemList){
	for(let Item of ItemList){
		let thisRowUpdate = await generateItemRow(Item);
		thisItemRow = document.getElementById("rowItemID"+Item.ItemID);
		if(thisItemRow == null){
			let newRowIndex = document.getElementById("rowWeightHeaders").rowIndex;
			let thisItemStored = Item.StoredIn;
			let thisItemClass = "inventory-list";
			if(thisItemStored != null){
				thisItemClass = "stored-item";
			}
			let thisItemAttributes = {
				"id":"rowItemID"+Item.ItemID,
				"class":thisItemClass,
				"draggable":"true",
				"ondragstart":"dragItem(event)",
				"ondrop":"dropItem(event)",
				"ondragover":"allowDrop(event)"
			};

			//I think the events will not set correctly
			thisItemRow = 
			addTableRow("InventoryTable",newRowIndex,thisItemAttributes,thisRowUpdate.RowText);
		}
		else{
			thisItemRow.innerHTML = thisRowUpdate.RowText;
		}
	}
}

function toggleContainer(ContainerID){
	let ContainerData = getItemData(ContainerID);
	let containedItems = ContainerData.Contents;
	let containerButton = document.getElementById("Container"+ContainerID);
	let isOpen = containerButton.value == "open";

	if(isOpen){
		containerButton.value = "closed";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Closed.png?cachelib=false'>";
		for(let itemID of containedItems){
			document.getElementById("rowItemID"+itemID).setAttribute("hidden","");
		}
	}
	else{
		containerButton.value = "open";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png?cachelib=false'>";
		for(let itemID of containedItems){
			document.getElementById("rowItemID"+itemID).removeAttribute("hidden","");
		}
	}
}

function storeItem(ItemID,ContainerID){
	let ContainerData = getItemData(ContainerID);
	let storedItemData = getItemData(ItemID);

	let containedItems = ContainerData.Contents;
	if(Array.isArray(containedItems)){
		if(!containedItems.includes(ItemID)){
			containedItems.push(ItemID);
			ContainerData.Contents = containedItems;
		};
	}
	else{
		ContainerData.Contents = [ItemID];
	}

	if(document.getElementById("Container"+ContainerID).value == "closed"){
		document.getElementById("rowItemID"+ItemID).setAttribute("hidden","");
	}

	let ContainerIndex = Inventory.findIndex(obj => obj.ItemID == ContainerID);
	Inventory[ContainerIndex] = ContainerData;

	let priorContainerID = storedItemData.StoredIn;
	if(priorContainerID != null){
		let priorContainerData = getItemData(priorContainerID);
		priorContainerData.Contents.splice(priorContainerContents.indexOf(ItemID),1);
		let priorContainerIndex = Inventory.findIndex(obj => obj.ItemID == priorContainerID);
		Inventory[priorContainerIndex] = priorContainerData;
	}

	Inventory[Inventory.indexOf(storedItemData)].StoredIn = ContainerID;

	return ContainerData;
}

function unpackItem(ItemID,ContainerID){
	//Specifically removes item from contents list of container, this function does not move it on the list as the destination depends on method of unpacking

	let storedItemData = getItemData(ItemID);
	let storedItemIndex = Inventory.indexOf(storedItemData);
	delete storedItemData.StoredIn;
	Inventory[storedItemIndex] = storedItemData;
	
	let ContainerData = getItemData(ContainerID);
	let containedItems = ContainerData.Contents;
	if(Array.isArray(containedItems)){
		let unpackedIndex = containedItems.indexOf(ItemID);
		if(unpackedIndex != -1){
			containedItems.splice(unpackedIndex,1);
			ContainerData.Contents = containedItems;

			let ContainerIndex = Inventory.indexOf(ContainerData);
			Inventory[ContainerIndex] = ContainerData;
			return ContainerData;
		}
	}
}

async function toggleActivation(ItemID){
	let submitData = {
		"ParentToken":ParentToken,
		"Activate":document.getElementById("needsActivation"+ItemID).value,
		"Item":ItemID
	};
	let request = await fetch("macro:ActivateItem@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let activationResult = await request.text();

	if(activationResult == 1){
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Deactivate_Item.png?cachelib=false'>";
		document.getElementById("needsActivation"+ItemID).value = 0;
		document.getElementById("ActivateTitle"+ItemID).title = "Deactivate Item";
	}
	else{
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Activate_Item.png?cachelib=false'>";
		document.getElementById("needsActivation"+ItemID).value = 1;
		document.getElementById("ActivateTitle"+ItemID).title = "Activate Item";
	}
}

async function useItem(ItemID){
	itemData = getItemData(ItemID);
	itemData.ParentToken = ParentToken;

	let request = await fetch("macro:UseItem@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(itemData)});
	let resultingInventory = await request.json();

	//compare resultingInventory with Inventory here to find differences, then update those rows
}

async function castSpell(ItemID){
	itemData = getItemData(ItemID);
	itemData.ParentToken = ParentToken;

	let request = await fetch("macro:ItemSpellcastingInput@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(itemData)});
	let resultingInventory = await request.json();
}

function getItemData(ItemID){
	let itemData = Inventory.filter(function(Inventory){
		return Inventory.ItemID == ItemID;
	});
	return itemData[0];
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	userdata = JSON.parse(userdata);

	ParentToken = userdata.ParentToken;
	Inventory = userdata.Inventory;
	
	createInventoryTable();

	document.title = "Inventory: "+userdata.TokenName;
}

setTimeout(loadUserData, 1);