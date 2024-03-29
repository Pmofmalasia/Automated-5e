async function createInventoryTable(){
	let allItemsWeight = 0;
	let allItemRows = "";
	let currentDepth = 1;
	let containerDepths = {};

	for(let Item of Inventory){
		let debug = false;
		let DisplayName = Item.DisplayName;
			if(debug){console.log(DisplayName);}
	
		//TODO: Need to set initial spacing here
		let thisItemID = Item.ItemID;
	
		let currentDepth = 1;
		let thisRowClass = "inventory-list";
		let containerStoredIn = Item.StoredIn;
		if(containerStoredIn != null){
			thisRowClass = "stored-item";
			currentDepth = containerDepths[containerStoredIn] + 1;
		}

		if(Item.Contents != null){
			containerDepths[thisItemID] = currentDepth;
		}

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

		let spacerCell = "<td class='inventory-spacer' id='Spacer"+thisItemID+"' colspan='"+currentDepth+"'>";
		if(Item.Type == "Container"){
			spacerCell = spacerCell + "<span class='context-button'><span id='ContainerTitle"+thisItemID+"' title='Close Container, or Drag an Item to Store'><button type='button' id='Container"+thisItemID+"' onclick='toggleContainer("+'"'+thisItemID+'"'+")' ondrop='dropStoreItem(event,"+'"'+thisItemID+'"'+")' ondragover='allowDrop(event)' value='open'><img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png'></button></span></span>";
		}
		spacerCell = spacerCell + "</td>";
	
		let thisRowContextButtons = "<span class='context-button'>";
	
		let isActive = Item.IsActive > 0;
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
			thisRowContextButtons = thisRowContextButtons + buttonTitle + "<button id='Activate"+thisItemID+"' type='button' onclick='toggleActivation("+'"'+thisItemID+'",'+needsActivation+")'><img src='lib://pm.a5e.core/InterfaceImages/"+buttonImage+".png'></button></span> ";
		}
		if(debug){console.log("6");}
	
		if(typeof Item.Effects == "object" && isActive){
			thisRowContextButtons = thisRowContextButtons + " <span id='UseTitle"+thisItemID+" title='Use Item'><button type='button' id='Use"+thisItemID+"' onclick='useItem("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Use.png'></button></span> ";
		}
		if(debug){console.log("7");}
	
		if(typeof Item.ItemSpellcasting == "object" && isActive){
			thisRowContextButtons = thisRowContextButtons + " <span id='CastTitle"+thisItemID+"' title='Cast Spell'><button type='button' id='Cast"+thisItemID+"' onclick='castSpell("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Cast_Spell.png'></button></span> ";
		}
		if(debug){console.log("8");}
	
		thisRowContextButtons = thisRowContextButtons + " <span id='RulesTitle"+thisItemID+"' title='Show Rules'><button type='button' id='Rules"+thisItemID+"' onclick='showRules("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Rules.png'></button></span> ";
	
		thisRowContextButtons = thisRowContextButtons+"</span>";
	
		if(debug){console.log("9");}
		let thisRowInnerHTML = spacerCell+"<td id='Name"+thisItemID+"' style='text-align:left' colspan='1'>"+DisplayName+"</td><td style='text-align:right'>"+NumberDisplay+"</td><td style='text-align:right'><span title='"+Weight+" Each'>"+displayWeight+"<input type='hidden' id='Weight"+thisItemID+"' value="+TotalWeight+"></span></td><td style='text-align:right'>"+thisRowContextButtons+"</td>";

		allItemsWeight = allItemsWeight + TotalWeight;

		allItemRows = allItemRows + "<tr class='"+thisRowClass+"' draggable='true' ondragstart='dragItem(event)' ondrop='dropItem(event)' ondragover='allowDrop(event)' id='rowItemID"+Item.ItemID+"'>"+thisRowInnerHTML+"</tr>";
	}

	let InventoryTableHTML = "<tr id='rowInventoryHeader' style='position:sticky; top:15px' class='inventory-list'><th></th><th id='NameHeader' style = 'text-align:left;' colspan='1'>Item</th><th style = 'text-align:right'>Number</th><th style = 'text-align:right'>Weight</th><th style = 'text-align:right'>Context Menu</th></tr><tr id='rowSpacer' class='spacer-row' style='height:10px'></tr>" + allItemRows;

	InventoryTableHTML = InventoryTableHTML + "<tr class='weight-data' id='rowWeightHeaders' ondrop='dropItem(event)' ondragover='allowDrop(event)'><th></th><th id='WeightHeader' style = 'text-align:left' colspan='1'>Weight Data</th><th style = 'text-align:right'>Current Weight</th><th style = 'text-align:right'>Carry Capacity</th><th style = 'text-align:right'>Push Capacity</th></tr>";

	let submitData = {"ParentToken":ParentToken};
	let request = await fetch("macro:stat.a5e.CarryCapacity@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let WeightData = await request.json();

	InventoryTableHTML = InventoryTableHTML + "<tr class='inventory-list' style='background-color:rgb(108, 223, 184); color:black'><td></td><td id='WeightColumn' style='text-align:center' colspan='1'> --- </td><td style='text-align:right'>"+Math.round(allItemsWeight)+"</td><td style='text-align:right'>"+WeightData.Carry+"</td><td style='text-align:right'>"+WeightData.Push+"</td></tr>";

	document.getElementById("InventoryTable").innerHTML = InventoryTableHTML;

	updateContainerIndenting();
}

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
	let movedItemData = Inventory[oldIndex - extraRowNum];
	let movedSpacerSpan = Number(movedRow.firstElementChild.colSpan);
	let NextRow = movedRow.nextElementSibling;

	let targetTable = dropTarget.parentNode;
	targetTable.insertBefore(movedRow,dropTarget);

	let newIndex = movedRow.rowIndex;

	//this is going above where it's supposed to be
	moveContents(targetTable,movedSpacerSpan,NextRow,newIndex);

	console.log(oldIndex+", "+newIndex);
	rearrangeInventory(oldIndex,newIndex);
}

function dropStoreItem(ev,ContainerID){
	ev.preventDefault();
	let movedRow = document.getElementById(ev.dataTransfer.getData("text"));
	let movedItemID = idFromRowID(movedRow.id);

	//May need additional check here to make sure that it is a container button, not sure if different functions covers this
	let contextButtonDropTarget = ev.target.closest("button");
	if(contextButtonDropTarget != null){
		let ContainerData = getItemData(ContainerID);
		let movedItemData = getItemData(movedItemID);
		let ContainerContents = ContainerData.Contents;
		if(!Array.isArray(ContainerContents)){
			ContainerContents = [];
		}

		let returnData;
		let storedItemNum;
		//storedItemNum must be set before unpacking and after storing
		if(ContainerContents.includes(movedItemID)){
			console.log("before unpack");
			storedItemNum = ContainerContents.length;
			returnData = unpackItem(movedItemData,ContainerData);
			movedRow.class = "inventory-list";
		}
		else{
			console.log("storing");
			returnData = storeItem(movedItemData,ContainerData);
			storedItemNum = ContainerContents.length;
			movedRow.class = "stored-item";
		}

		console.log("update spacer");
		updateSpacerSpan(movedItemData,returnData.SpacerShift);
		console.log("update indent");
		updateContainerIndenting();

		//just need to get index of last item in stored list here
		let targetTable = movedRow.parentNode;
		let oldIndex = movedRow.rowIndex;

		//BUGFIX: this does not work if the last item is a container with something in it
			console.log("get index");
		let newIndex = document.getElementById("rowItemID"+ContainerID).rowIndex + storedItemNum;
		let NextRow = document.getElementById("rowItemID"+ContainerID).nextElementSibling;
		let NextSpacer = NextRow.firstElementChild;
		let NextSpacerSpan = Number(NextSpacer.colSpan);
		targetTable.insertBefore(movedRow,targetTable.rows[newIndex]);

		while(NextSpacerSpan > movedSpacerSpan){
			//Moves until the spacer depth equals that of the moved item (and therefore is not contained within the moved item)
			let currentRow = NextRow;
			NextRow = NextRow.nextElementSibling;
			NextSpacer = NextRow.firstElementChild;
			NextSpacerSpan = Number(NextSpacer.colSpan);
			targetTable.insertBefore(currentRow,targetTable.rows[newIndex]);
		};
	
		console.log("rearrange");
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
	//moves tracking in JSON, not visually
	oldIndex = oldIndex - extraRowNum;
	newIndex = newIndex - extraRowNum;
	let movedItemData = Inventory[oldIndex];
	let itemsMovedNum = 1;

	if(Array.isArray(movedItemData.Contents)){
		itemsMovedNum = movedItemData.Contents.length + 1;
	}

	let itemsMoved = Inventory.splice(oldIndex,itemsMovedNum);
	Inventory.splice(newIndex,0,...itemsMoved);

	updateInventory();
}

async function updateInventory(){
	evaluateMacro("[r:setProperty('a5e.stat.Inventory','"+JSON.stringify(Inventory)+"','"+ParentToken+"')]");
}

function toggleContainer(ContainerID){
	let ContainerData = getItemData(ContainerID);
	let containedItems = ContainerData.Contents;
	let containerButton = document.getElementById("Container"+ContainerID);
	let isOpen = containerButton.value == "open";

	if(isOpen){
		containerButton.value = "closed";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Closed.png'>";
		for(let itemID of containedItems){
			//perhaps change this to while itemID isn't the last one in the list, hide the rows (to hide contained container contents) - and loop through row indices instead of contained items. Need corresponding update to opening. NOTE: this method would not apply changes to container if it is the last contained item
			document.getElementById("rowItemID"+itemID).setAttribute("hidden","");
		}
	}
	else{
		containerButton.value = "open";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png'>";
		for(let itemID of containedItems){
			document.getElementById("rowItemID"+itemID).removeAttribute("hidden","");
		}
	}
}

function storeItem(ItemID,ContainerID){
	let storedItemData;
	if(typeof ItemID == "object"){
		storedItemData = ItemID;
		ItemID = storedItemData.ItemID+"";	
	}
	else{
		storedItemData = getItemData(ItemID);
	}
	let ContainerData;
	if(typeof ContainerID == "object"){
		ContainerData = ContainerID;
		ContainerID = ContainerData.ItemID+"";	
	}
	else{
		ContainerData = getItemData(ItemID);
	}
	
	document.getElementById("rowItemID"+ItemID).class = "stored-item";

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

	let SpacerShift = Number(document.getElementById("Spacer"+ContainerID).colSpan);

	return {
		"ContainerData":ContainerData,
		"SpacerShift":SpacerShift
	};
}

function unpackItem(ItemID,ContainerData){
	let storedItemData;
	if(typeof ItemID == "object"){
		storedItemData = ItemID;
		ItemID = storedItemData.ItemID+"";	
	}
	else{
		storedItemData = getItemData(ItemID);
	}
	//Specifically removes item from contents list of container, this function does not move it on the list as the destination depends on method of unpacking

	let storedItemIndex = Inventory.indexOf(storedItemData);
	delete storedItemData.StoredIn;
	Inventory[storedItemIndex] = storedItemData;
	
	document.getElementById("rowItemID"+ItemID).class = "inventory-list";

	let containedItems = ContainerData.Contents;
	if(Array.isArray(containedItems)){
		let unpackedIndex = containedItems.indexOf(ItemID);
		if(unpackedIndex != -1){
			containedItems.splice(unpackedIndex,1);
			ContainerData.Contents = containedItems;
			console.log("unpacking spacer prior span: "+document.getElementById("Spacer"+ItemID).colSpan);
			let spacerShift = Number(document.getElementById("Spacer"+ItemID).colSpan) - 1;
			console.log("unpacking spacer shift: "+spacerShift);

			let ContainerIndex = Inventory.indexOf(ContainerData);
			Inventory[ContainerIndex] = ContainerData;
			return {
				"ContainerData":ContainerData,
				"SpacerShift":-spacerShift
			};
		}
	}
}

function updateSpacerSpan(MovedItemData,SpacerShift){
	let MovedItemID = MovedItemData.ItemID;
	console.log(MovedItemID);
	let movedSpacerSpan = document.getElementById("Spacer"+MovedItemID).colSpan;
	console.log(movedSpacerSpan);
	console.log(SpacerShift);
	
	document.getElementById("Spacer"+MovedItemID).colSpan = Number(document.getElementById("Spacer"+MovedItemID).colSpan) + SpacerShift;
	console.log(document.getElementById("Spacer"+MovedItemID).colSpan);

	if(MovedItemData.Contents != null){
		let NextRow = document.getElementById("rowItemID"+MovedItemID).nextElementSibling;
		let NextSpacer = NextRow.firstElementChild;
		let NextSpacerSpan = Number(NextSpacer.colSpan);
		while(NextSpacerSpan > movedSpacerSpan){
			//Moves until the spacer depth equals that of the moved item (and therefore is not contained within the moved item)
			NextSpacer.colSpan = NextSpacerSpan + SpacerShift;
			NextRow = NextRow.nextElementSibling;
			NextSpacer = NextRow.firstElementChild;
			NextSpacerSpan = Number(NextSpacer.colSpan);
		};	
	}
}

function updateContainerIndenting(){
	let table = document.getElementById("InventoryTable");
	let storedItemRows = table.getElementsByClassName("inventory-spacer");
	maxColumnDepth = 1;
	for(let spacerTag of storedItemRows){
		maxColumnDepth = Math.max(maxColumnDepth,Number(spacerTag.colSpan));
	}
	
	document.getElementById("NameHeader").colSpan = maxColumnDepth;
	document.getElementById("WeightHeader").colSpan = maxColumnDepth;
	document.getElementById("WeightColumn").colSpan = maxColumnDepth;

	let spacerRowInnerHTML = "";
	for(let i=0; i<(maxColumnDepth + 4); i++){
		spacerRowInnerHTML = spacerRowInnerHTML + "<td></td>";
	}
	document.getElementById("rowSpacer").innerHTML = spacerRowInnerHTML;
	
	for(let spacerTag of storedItemRows){
		let nameColumn = spacerTag.nextElementSibling;
		nameColumn.colSpan = maxColumnDepth - Number(spacerTag.colSpan) + 1;
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
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Deactivate_Item.png'>";
		document.getElementById("needsActivation"+ItemID).value = 0;
		document.getElementById("ActivateTitle"+ItemID).title = "Deactivate Item";
	}
	else{
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Activate_Item.png'>";
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

function idFromRowID(rowID){
	return rowID.substring(9);
}

function moveContents(targetTable,movedSpacerSpan,nextRow,newIndex){
	let NextSpacer = nextRow.firstElementChild;
	let NextSpacerSpan = Number(NextSpacer.colSpan);

	while(NextSpacerSpan > movedSpacerSpan){
		//Moves until the spacer depth equals that of the moved item (and therefore is not contained within the moved item)
		let currentRow = nextRow;
		nextRow = nextRow.nextElementSibling;
		NextSpacer = nextRow.firstElementChild;
		NextSpacerSpan = Number(NextSpacer.colSpan);
		targetTable.insertBefore(currentRow,targetTable.rows[newIndex]);
	};
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	userdata = JSON.parse(userdata);

	ParentToken = userdata.ParentToken;
	Inventory = userdata.Inventory;
	maxColumnDepth = 1;
	extraRowNum = 2;
	
	createInventoryTable();

	document.title = "Inventory: "+userdata.TokenName;
}

setTimeout(loadUserData, 1);