async function createInventoryTable(scrollPosition){
	let allItemsWeight = 0;
	let allItemRows = "";
	let containerDepths = {};
	let closedContainers = [];

	for(let Item of Inventory){
		let DisplayName = Item.DisplayName;
	
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
		let displayWeight = Math.round(TotalWeight);
	
		let NumberDisplay = "";
		if(Item.ResourceData == undefined){
			NumberDisplay = ItemNumber;
		}
		else{
			let ResourceData = await MTFunction("js.a5e.CalculateResourceData",[Item,ParentToken]);
			let resourceNames = Object.keys(ResourceData);
			let isFirst = true;
			for(let tempResourceName of resourceNames){
				if(isFirst){
					//I'm like 99% sure there's a function that would make doing this unnecessary but I don't feel like finding it
					isFirst = false;
				}
				else{
					NumberDisplay += "<br>";
				}
				let thisResourceData = ResourceData[tempResourceName];
				if(resourceNames.length > 1){
					NumberDisplay += thisResourceData.DisplayName + ": ";
				}

				let thisResourceDisplay;
				let thisCurrentResource = Item.Resource[tempResourceName];
				if(typeof thisCurrentResource === "object"){
					if(thisCurrentResource.Type === "Time"){
						let maxTime = await MTFunction("pm.a5e.GenerateTimeDisplay",[thisResourceData.MaxResource.Duration]);
						let currTime = await MTFunction("pm.a5e.GenerateTimeDisplay",[thisCurrentResource.Duration]);

						thisResourceDisplay = currTime + " <b>/</b> " + maxTime;
					}
				}
				else{
					thisResourceDisplay = thisCurrentResource + "<b>/</b>" + thisResourceData.MaxResource;
				}
				NumberDisplay += thisResourceDisplay;
			}
		}

		//Note: Cannot change this class even if it no longer needs different styling in the future, as it is used to calculate maxColumnDepth
		let spacerCell = "<td class='inventory-spacer' id='Spacer"+thisItemID+"' colspan='"+currentDepth+"'>";
		if(Item.Type == "Container" || Array.isArray(Item.Contents)){
			let containerState = Item.isOpen;
			if(containerState == undefined){
				containerState = "open";
			}

			if(containerState !== "open"){
				let outerContainer = "";
				let currentContainer = Item;
				while(outerContainer !== undefined){
					outerContainer = getItemData(currentContainer.StoredIn);
					if(outerContainer === undefined){
						closedContainers.push(thisItemID);						
					}
					else if(closedContainers.includes(outerContainer.ItemID)){
						break;
					}
					else{
						currentContainer = outerContainer;
					}
				}
			}

			spacerCell = spacerCell + "<span class='context-button'><span id='ContainerTitle"+thisItemID+"' title='Close Container, or Drag an Item to Store'><button type='button' id='Container"+thisItemID+"' onclick='toggleContainer("+'"'+thisItemID+'"'+")' ondrop='dropStoreItem(event,"+'"'+thisItemID+'"'+")' ondragover='allowDrop(event)' value='open'><img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png'></button></span></span>";
		}
		spacerCell = spacerCell + "</td>";
	
		let thisRowContextButtons = "<span class='context-button'>";
	
		let isActive = Item.IsActive > 0;
	
		if(Item.isActivatable == 1){
			let buttonImage;
			let buttonTitle;
			if(isActive){
				buttonImage = "Deactivate_Item";
				buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Deactivate Item'><input type='hidden' id='needsActivation"+thisItemID+"' value=0>"
			}
			else{
				buttonImage = "Activate_Item";
				buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Activate Item'><input type='hidden' id='needsActivation"+thisItemID+"' value=1>"
			}
			thisRowContextButtons = thisRowContextButtons + buttonTitle + "<button id='Activate"+thisItemID+"' type='button' onclick='toggleActivation("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/"+buttonImage+".png'></button></span> ";
		}

		let useItemTest = (typeof Item.Effects == "object" && isActive);
		let bypassActiveTest = (Item.EffectChoiceMethod == "ItemActivationState");
		if(useItemTest || bypassActiveTest){
			thisRowContextButtons = thisRowContextButtons + " <span id='UseTitle"+thisItemID+" title='Use Item'><button type='button' id='Use"+thisItemID+"' onclick='useItem("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Use.png'></button></span> ";
		}
	
		if(typeof Item.ItemSpellcasting == "object" && isActive){
			thisRowContextButtons = thisRowContextButtons + " <span id='CastTitle"+thisItemID+"' title='Cast Spell'><button type='button' id='Cast"+thisItemID+"' onclick='castSpell("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Cast_Spell.png'></button></span> ";
		}
	
		thisRowContextButtons = thisRowContextButtons + " <span id='RulesTitle"+thisItemID+"' title='Show Rules'><button type='button' id='Rules"+thisItemID+"' onclick='showRules("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Rules.png'></button></span> ";
	
		thisRowContextButtons = thisRowContextButtons+"</span>";

		let thisRowInnerHTML = spacerCell+"<td id='Name"+thisItemID+"' style='text-align:left' colspan='1'>"+DisplayName+"</td><td style='text-align:right'>"+NumberDisplay+"</td><td style='text-align:right'><span title='"+Weight+" Each'>"+displayWeight+"<input type='hidden' id='Weight"+thisItemID+"' value="+TotalWeight+"></span></td><td style='text-align:right'>"+thisRowContextButtons+"</td>";

		allItemsWeight = allItemsWeight + TotalWeight;

		allItemRows = allItemRows + "<tr class='"+thisRowClass+"' draggable='true' ondragstart='dragItem(event)' ondrop='dropItem(event)' ondragover='allowDrop(event)' id='rowItemID"+Item.ItemID+"' ItemID='"+Item.ItemID+"'>"+thisRowInnerHTML+"</tr>";
	}

	let InventoryTableHTML = "<tr id='rowInventoryHeader' style='position:sticky; top:0px; z-index:99' class='inventory-list'><th class='header-button'><button type='button' id='SettingsButton' onclick='chooseSettings()'><img src='lib://pm.a5e.core/InterfaceImages/Settings.png'></button></th><th id='NameHeader' style = 'text-align:left;' colspan='1'>Item</th><th style = 'text-align:right'>Number</th><th id='WeightMainHeader' style = 'text-align:right'>Weight</th><th style = 'text-align:right'>Actions</th></tr><tr id='rowSpacer' class='spacer-row' style='height:10px'></tr><input type='hidden' id='draggedItemID' value=''><input type='hidden' id='currentSort' value=''>" + allItemRows;

	InventoryTableHTML = InventoryTableHTML + "<tr class='weight-data' id='rowWeightHeaders' ondrop='dropItem(event)' ondragover='allowDrop(event)'><th></th><th id='WeightHeader' style = 'text-align:left' colspan='1'>Weight Data</th><th style = 'text-align:right'>Current Weight</th><th style = 'text-align:right'>Carry Capacity</th><th style = 'text-align:right'>Push Capacity</th></tr>";

	let submitData = {"ParentToken":ParentToken};
	let request = await fetch("macro:stat.a5e.CarryCapacity@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let WeightData = await request.json();

	InventoryTableHTML = InventoryTableHTML + "<tr class='inventory-list' style='background-color:var(--mt-theme-color-actions-green-dark); color:black'><td></td><td id='WeightColumn' style='text-align:center' colspan='1'> --- </td><td style='text-align:right'>"+Math.round(allItemsWeight)+"</td><td style='text-align:right'>"+WeightData.Carry+"</td><td style='text-align:right'>"+WeightData.Push+"</td></tr>";

	document.getElementById("InventoryTable").innerHTML = InventoryTableHTML;

	document.getElementById("NameHeader").addEventListener("click",function(){
		sortInventory("name");
	});
	document.getElementById("WeightMainHeader").addEventListener("click",function(){
		sortInventory("weight");
	});

	updateContainerIndenting();

	//Will create issues with nested closed containers being visually reopened when the outer one is opened - need to go in and fix that
	for(let container of closedContainers){
		toggleContainer(container);
	}

	if(scrollPosition !== null){
		window.scrollTo({
			"top":scrollPosition,
			"behavior":"instant"
		});
	}
}

function dragItem(ev){
	ev.dataTransfer.clearData();
	ev.dataTransfer.setData("text",ev.target.id);
	document.getElementById("draggedItemID").value = ev.target.id;
}

function dropItem(ev){
	ev.preventDefault();

	let contextButtonDropTarget = ev.target.closest("button");
	if(contextButtonDropTarget != null){
		let buttonType = contextButtonDropTarget.value;
		let nonValidButtons = ["open","closed","charge"];
		if(nonValidButtons.includes(buttonType)){
			return;
		}
	}

	let dropTarget = ev.target.closest("tr");

	let movedRowID = ev.dataTransfer.getData("text");
	ev.dataTransfer.dropEffect = "move";
	let movedRow = document.getElementById(movedRowID);
	let movedItemID = idFromRowID(movedRowID);
	let oldIndex = Number(movedRow.rowIndex);
	let movedItemData = Inventory[oldIndex - extraRowNum];
	let movedSpacerSpan = Number(movedRow.firstElementChild.colSpan);

	let targetTable = dropTarget.parentNode;
	let newIndex = dropTarget.rowIndex;

	let movedItemContainer = getContainer(movedRow);
	let dropTargetContainer = getContainer(dropTarget);
	let returnData = {"ContainerData":"","SpacerShift":0};
	let movedItemNum;

	if(dropTargetContainer != movedItemContainer){
		if(dropTargetContainer != ""){
			returnData = storeItem(movedItemID,dropTargetContainer);

			updateSpacerSpan(movedItemData,returnData.SpacerShift);
			updateContainerIndenting();

			movedItemNum = moveItem(targetTable,movedSpacerSpan,movedRow,dropTarget);
		}
		else if(movedItemContainer != ""){
			returnData = unpackItem(movedItemID,movedItemContainer);

			movedItemNum = moveItem(targetTable,movedSpacerSpan,movedRow,dropTarget);

			updateSpacerSpan(movedItemData,returnData.SpacerShift);
			updateContainerIndenting();
		}
	}
	else{
		movedItemNum = moveItem(targetTable,movedSpacerSpan,movedRow,dropTarget);	
	}

	rearrangeInventory(oldIndex,newIndex,movedItemNum);
}

function dropStoreItem(ev,ContainerID){
	ev.preventDefault();
	let movedRow = document.getElementById(ev.dataTransfer.getData("text"));
	let movedItemID = idFromRowID(movedRow.id);

	if(movedItemID == ContainerID){
		return;
	}

	//May need additional check here to make sure that it is a container button, not sure if different functions covers this
	let contextButtonDropTarget = ev.target.closest("button");
	if(contextButtonDropTarget != null){
		let ContainerData = getItemData(ContainerID);
		let movedItemData = getItemData(movedItemID);
		let ContainerContents = ContainerData.Contents;
		if(!Array.isArray(ContainerContents)){
			ContainerContents = [];
		}

		let insertionTargetRow;
		let newIndex;
		let movedItemNum = 1;
		let targetTable = movedRow.parentNode;
		let oldIndex = movedRow.rowIndex;

		if(ContainerContents.includes(movedItemID)){
			insertionTargetRow = getNextUnstoredRow(document.getElementById("rowItemID"+ContainerID),true);
			if(insertionTargetRow === movedRow){
				insertionTargetRow = getNextUnstoredRow(movedRow,true);
			}
			newIndex = insertionTargetRow.rowIndex;

			let returnData = unpackItem(movedItemData,ContainerData);
			let movedSpacerSpan = movedRow.firstElementChild.colSpan;

			movedItemNum = moveItem(targetTable,movedSpacerSpan,movedRow,insertionTargetRow);

			updateSpacerSpan(movedItemData,returnData.SpacerShift);
			updateContainerIndenting();
		}
		else{
			insertionTargetRow = getNextUnstoredRow(document.getElementById("rowItemID"+ContainerID),false);
			if(insertionTargetRow === movedRow){
				insertionTargetRow = getNextUnstoredRow(movedRow,false);
			}
			newIndex = insertionTargetRow.rowIndex;

			let returnData = storeItem(movedItemData,ContainerData);
			let movedSpacerSpan = movedRow.firstElementChild.colSpan;

			updateSpacerSpan(movedItemData,returnData.SpacerShift);
			updateContainerIndenting();

			movedItemNum = moveItem(targetTable,movedSpacerSpan,movedRow,insertionTargetRow);
		}
	
		rearrangeInventory(oldIndex,newIndex,movedItemNum);
	}
	else{
		dropItem(ev);
	}
}

function allowDrop(ev){
	ev.preventDefault();
}

function toggleContainer(ContainerID){
	let ContainerData = getItemData(ContainerID);
	let containedItems = ContainerData.Contents;
	let containerButton = document.getElementById("Container"+ContainerID);
	let isOpen = containerButton.value == "open";

	let containerSpacerSpan = Number(document.getElementById("rowItemID"+ContainerID).firstElementChild.colSpan);
	let nextRow = document.getElementById("rowItemID"+ContainerID).nextElementSibling;
	let NextSpacerSpan = Number(nextRow.firstElementChild.colSpan);

	function newClosedContainerTest(nextRow){
		let nextRowItemData = getItemData(idFromRowID(nextRow.id));
		if((nextRowItemData.isOpen === "closed" || nextRowItemData.isOpen === "locked")){
			return {
				"spacer":NextSpacerSpan,
				"newstart":true
			}
		}
		return false;
	}

	if(isOpen){
		//<!-- TODO: Inventory: Add locking container as an option
		ContainerData.isOpen = "closed";
		containerButton.value = "closed";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Closed.png'>";

		while(NextSpacerSpan > containerSpacerSpan){
			nextRow.setAttribute("hidden","");
			nextRow = nextRow.nextElementSibling;
			NextSpacerSpan = Number(nextRow.firstElementChild.colSpan);
		}
	}
	else{
		ContainerData.isOpen = "open";
		containerButton.value = "open";
		containerButton.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png'>";

		let closedSpacerSpan = -1;
		let newStart = false;
		let updatedData = newClosedContainerTest(nextRow);
		if(updatedData != false){
			closedSpacerSpan = updatedData.spacer;
			newStart = updatedData.newstart;
		}
		while(NextSpacerSpan > containerSpacerSpan){
			if(closedSpacerSpan < NextSpacerSpan && closedSpacerSpan != -1){
				//if within a nested closed container, do not open that container/do not reveal items
			}
			else if(newStart){
				newStart = false;
				nextRow.removeAttribute("hidden","");
			}
			else{
				nextRow.removeAttribute("hidden","");
				updatedData = newClosedContainerTest(nextRow);
				if(updatedData != false){
					closedSpacerSpan = updatedData.spacer;
					newStart = updatedData.newstart;
				}
				else{
					newStart = false;
					closedSpacerSpan = -1;
				}
			}
			
			nextRow = nextRow.nextElementSibling;
			NextSpacerSpan = Number(nextRow.firstElementChild.colSpan);

			if(closedSpacerSpan === -1){
				updatedData = newClosedContainerTest(nextRow);
				if(updatedData != false){
					closedSpacerSpan = updatedData.spacer;
					newStart = updatedData.newstart;
				}
			}
		}
	}

	setItemData(ContainerData);
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
		ContainerData = getItemData(ContainerID);
	}

	let priorSpacerShift = 0;
	let priorContainerID = storedItemData.StoredIn;
	if(priorContainerID != null){
		let returnData = unpackItem(ItemID,priorContainerID);
		priorSpacerShift = returnData.SpacerShift;
	}

	document.getElementById("rowItemID"+ItemID).className = "stored-item";

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

	Inventory[Inventory.indexOf(storedItemData)].StoredIn = ContainerID;

	let SpacerShift = Number(document.getElementById("Spacer"+ContainerID).colSpan) + priorSpacerShift;

	return {
		"ContainerData":ContainerData,
		"SpacerShift":SpacerShift
	};
}

function unpackItem(ItemID,ContainerID){
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
		ContainerData = getItemData(ContainerID);
	}
	//Specifically removes item from contents list of container, this function does not move it on the list as the destination depends on method of unpacking

	let storedItemIndex = Inventory.indexOf(storedItemData);
	delete storedItemData.StoredIn;
	Inventory[storedItemIndex] = storedItemData;
	
	document.getElementById("rowItemID"+ItemID).className = "inventory-list";

	let containedItems = ContainerData.Contents;
	if(Array.isArray(containedItems)){
		let unpackedIndex = containedItems.indexOf(ItemID);
		if(unpackedIndex != -1){
			containedItems.splice(unpackedIndex,1);
			ContainerData.Contents = containedItems;
			let spacerShift = Number(document.getElementById("Spacer"+ItemID).colSpan) - 1;

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
	let movedSpacerSpan = document.getElementById("Spacer"+MovedItemID).colSpan;
	
	document.getElementById("Spacer"+MovedItemID).colSpan = Number(document.getElementById("Spacer"+MovedItemID).colSpan) + SpacerShift;

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

	if(false){
		//now performed as part of UDF UpdateOtherInventories
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

}

async function useItem(ItemID){
	itemData = getItemData(ItemID);
	itemData.ParentToken = ParentToken;
	itemData.IsTooltip = 0;
	try {
		let request = await fetch("macro:UseItem@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(itemData)});
		let resultingInventory = await request.json();
		
		//compare resultingInventory with Inventory here to find differences, then update those rows
	} catch (error) {
		console.log(error.message);
	}
}

async function castSpell(ItemID){
	itemData = getItemData(ItemID);
	itemData.ParentToken = ParentToken;
	itemData.IsTooltip = 0;
	try {
		let request = await fetch("macro:ItemSpellcastingInput@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(itemData)});
	  } catch(e) {
		console.log(""+e+"\n"+e.stack);
	  }
	
	let resultingInventory = await request.json();
}

async function showRules(ItemID){
	let thisItemData = getItemData(ItemID);
	thisItemData.ParentToken = ParentToken;

	await fetch("macro:FeatureTooltipBorder@Lib:pm.a5e.Core",{method: "POST", body: JSON.stringify(thisItemData)});
}

function getItemData(ItemID){
	let itemData = Inventory.filter(function(Inventory){
		return Inventory.ItemID == ItemID;
	});
	return itemData[0];
}

function setItemData(Item,key,value){
	//accepts either full item object (key/value not used) or itemID, key to change, and value to change key to
	let itemID;
	if(typeof Item === "string"){
		itemID = Item;
		Item = getItemData(itemID);
		Item[key] = value;
	}
	else{
		itemID = Item.ItemID;
	}

	let itemIndex = Inventory.findIndex(obj => obj.ItemID === itemID);
	if(itemIndex !== -1){
		Inventory[itemIndex] = Item;
	}

	updateInventory();
}

function idFromRowID(rowID){
	let itemID = document.getElementById(rowID).ItemID;
	if(itemID == undefined){
		return rowID.substring(9);
	}
	else{
		return itemID;
	}
}

//moves item visually on table
function moveItem(targetTable,movedSpacerSpan,nextRow,insertionTargetRow){
	let firstRowMoved = nextRow;
	let NextSpacer = nextRow.firstElementChild;
	let NextSpacerSpan = Number(NextSpacer.colSpan);
	let movedItemNum = 0;

	do{
		//Moves until the spacer depth equals that of the moved item (and therefore is not contained within the moved item)
		let currentRow = nextRow;
		nextRow = nextRow.nextElementSibling;
		NextSpacer = nextRow.firstElementChild;
		NextSpacerSpan = Number(NextSpacer.colSpan);

		targetTable.insertBefore(currentRow,insertionTargetRow);

		movedItemNum++;
	} while(NextSpacerSpan > movedSpacerSpan && nextRow != firstRowMoved);

	return movedItemNum;
}

//moves item in JSON, not visually
function rearrangeInventory(oldIndex,newIndex,itemsMovedNum){
	oldIndex = oldIndex - extraRowNum;
	newIndex = newIndex - extraRowNum;

	let itemsMoved = Inventory.splice(oldIndex,itemsMovedNum);
	if(newIndex > oldIndex){
		newIndex = newIndex - itemsMovedNum;
	}

	let remainderItems = Inventory.splice(newIndex);

	Inventory.push(...itemsMoved);
	Inventory.push(...remainderItems);

	updateInventory();
}

async function updateInventory(){
	mtSetProperty("a5e.stat.Inventory",JSON.stringify(Inventory),ParentToken);

	MTFunction("pm.a5e.UpdateOtherInventories",[ParentToken,"not-self"]);
}

function getNextUnstoredRow(originRow,exitAllContainers){
	let originSpacerSpan = originRow.firstElementChild.colSpan;
	let nextRow = originRow.nextElementSibling;
	let nextSpacerSpan = Number(nextRow.firstElementChild.colSpan);

	if(exitAllContainers){
		//This option makes items stored in nested containers come all the way out when used
		originSpacerSpan = 1;
	}

	while(nextSpacerSpan > originSpacerSpan){
		nextRow = nextRow.nextElementSibling;
		nextSpacerSpan = Number(nextRow.firstElementChild.colSpan);
	}

	return nextRow;
}

function getContainer(containedRow){
	let containedRowSpan = Number(containedRow.firstElementChild.colSpan);
	if(containedRowSpan > 1){
		let previousRow = containedRow;
		let previousRowSpan = Number(previousRow.firstElementChild.colSpan);
		while(previousRowSpan === containedRowSpan){
			previousRow = previousRow.previousElementSibling;
			previousRowSpan = previousRow.firstElementChild.colSpan;
		}
		return idFromRowID(previousRow.id);
	}
	else{
		return "";
	}
}

function buildEquipmentTable(scrollPosition){
	let table = document.getElementById("InventoryTable");
	
	let headerRow = document.createElement("tr");
	headerRow.id = "rowEquipmentHeader";
	headerRow.style.position = "sticky";
	headerRow.style.top = "0px";
	headerRow.style.zIndex = 99;
	headerRow.padding = "7px";
	table.insertAdjacentElement("afterbegin",headerRow);

	let nameHeader = document.createElement("th");
	nameHeader.id = "NameHeader";
	nameHeader.style.textAlign = "left";
	nameHeader.innerHTML = "Item";
	headerRow.insertAdjacentElement("beforeend",nameHeader);

	let statusHeader = document.createElement("th");
	statusHeader.id = "StatusHeader";
	statusHeader.style.textAlign = "left";
	statusHeader.innerHTML = "Status";
	headerRow.insertAdjacentElement("beforeend",statusHeader);

	let contextHeader = document.createElement("th");
	contextHeader.id = "ContextHeader";
	contextHeader.style.textAlign = "left";
	contextHeader.innerHTML = "Actions";
	headerRow.insertAdjacentElement("beforeend",contextHeader);

	let draggedItemInput = document.createElement("input");
	draggedItemInput.type = "hidden";
	draggedItemInput.value = "";
	draggedItemInput.id = "draggedItemID";
	headerRow.insertAdjacentElement("beforeend",draggedItemInput);

	let rowAttunement = document.createElement("tr");
	rowAttunement.id = "rowAttunement";
	table.insertAdjacentElement("beforeend",rowAttunement);
	let rowAttunementHeader = document.createElement("th");
	rowAttunementHeader.style.textAlign = "center";
	rowAttunementHeader.innerHTML = "Attunable Items";
	rowAttunementHeader.colSpan = 3;
	rowAttunement.insertAdjacentElement("beforeend",rowAttunementHeader);

	let rowArmor = document.createElement("tr");
	rowArmor.id = "rowArmor";
	table.insertAdjacentElement("beforeend",rowArmor);
	let rowArmorHeader = document.createElement("th");
	rowArmorHeader.style.textAlign = "center";
	rowArmorHeader.innerHTML = "Armor";
	rowArmorHeader.colSpan = 3;
	rowArmor.insertAdjacentElement("beforeend",rowArmorHeader);

	let rowWeapon = document.createElement("tr");
	rowWeapon.id = "rowWeapon";
	table.insertAdjacentElement("beforeend",rowWeapon);
	let rowWeaponHeader = document.createElement("th");
	rowWeaponHeader.style.textAlign = "center";
	rowWeaponHeader.innerHTML = "Weapons";
	rowWeaponHeader.colSpan = 3;
	rowWeapon.insertAdjacentElement("beforeend",rowWeaponHeader);

	let rowCastingFocus = document.createElement("tr");
	rowCastingFocus.id = "rowCastingFocus";
	table.insertAdjacentElement("beforeend",rowCastingFocus);
	let rowCastingFocusHeader = document.createElement("th");
	rowCastingFocusHeader.style.textAlign = "center";
	rowCastingFocusHeader.innerHTML = "Casting Foci";
	rowCastingFocusHeader.colSpan = 3;
	rowCastingFocus.insertAdjacentElement("beforeend",rowCastingFocusHeader);

	let rowWorn = document.createElement("tr");
	rowWorn.id = "rowWorn";
	table.insertAdjacentElement("beforeend",rowWorn);
	let rowWornHeader = document.createElement("th");
	rowWornHeader.style.textAlign = "center";
	rowWornHeader.innerHTML = "Wearable Items";
	rowWornHeader.colSpan = 3;
	rowWorn.insertAdjacentElement("beforeend",rowWornHeader);

	let rowHeld = document.createElement("tr");
	rowHeld.id = "rowHeld";
	table.insertAdjacentElement("beforeend",rowHeld);
	let rowHeldHeader = document.createElement("th");
	rowHeldHeader.style.textAlign = "center";
	rowHeldHeader.innerHTML = "Miscellaneous Holdable Items";
	rowHeldHeader.colSpan = 3;
	rowHeld.insertAdjacentElement("beforeend",rowHeldHeader);

	let rowAmmunition = document.createElement("tr");
	rowAmmunition.id = "rowAmmunition";
	table.insertAdjacentElement("beforeend",rowAmmunition);
	let rowAmmunitionHeader = document.createElement("th");
	rowAmmunitionHeader.style.textAlign = "center";
	rowAmmunitionHeader.innerHTML = "Ammunition";
	rowAmmunitionHeader.colSpan = 3;
	rowAmmunition.insertAdjacentElement("beforeend",rowAmmunitionHeader);
	
	for(let item of Inventory){
		let thisItemID = item.ItemID;

		let thisLine = document.createElement("tr");
		thisLine.draggable = true;

		let nameCell = document.createElement("td");
		nameCell.style.textAlign = "left";
		nameCell.innerHTML = item.DisplayName;
		thisLine.insertAdjacentElement("beforeend",nameCell);

		let statusCell = document.createElement("td");
		statusCell.style.textAlign = "right";
		statusCell.classList.add("status-button");
		thisLine.insertAdjacentElement("beforeend",statusCell);

		let contextCell = document.createElement("td");
		contextCell.style.textAlign = "center";
		thisLine.insertAdjacentElement("beforeend",contextCell);

		if(item.isAttunement == "1"){
			let attunementLine = thisLine.cloneNode(true);
			attunementLine.addEventListener("dragstart",dragItem);
			attunementLine.id = "rowAttunement"+thisItemID;
			attunementLine.ItemID = thisItemID;
			let attunementStatus = attunementLine.firstElementChild.nextElementSibling;
			attunementStatus.id = "AttunementStatus"+thisItemID;
			if(AttunedItems.includes(thisItemID)){
				attunementStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				attunementStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowAttunement.insertAdjacentElement("afterend",attunementLine);
		}

		if(item.Type === "Armor"){
			let armorLine = thisLine.cloneNode(true);
			armorLine.addEventListener("dragstart",dragItem);
			armorLine.ItemID = thisItemID;
			armorLine.id = "rowArmor"+thisItemID;
			let armorStatus = armorLine.firstElementChild.nextElementSibling;
			armorStatus.id = "ArmorStatus"+thisItemID;
			if(EquippedArmor === thisItemID){
				armorStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				armorStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowArmor.insertAdjacentElement("afterend",armorLine);
		}

		if(item.Type == "Weapon"){
			let weaponLine = thisLine.cloneNode(true);
			weaponLine.addEventListener("dragstart",dragItem);
			weaponLine.ItemID = thisItemID;
			weaponLine.id = "rowWeapon"+thisItemID;
			let weaponStatus = weaponLine.firstElementChild.nextElementSibling;
			weaponStatus.id = "WeaponStatus"+thisItemID;
			if(HeldItems.includes(thisItemID)){
				weaponStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				weaponStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowWeapon.insertAdjacentElement("afterend",weaponLine);
		}

		if(item.Type == "CastingFocus"){
			let focusLine = thisLine.cloneNode(true);
			focusLine.addEventListener("dragstart",dragItem);
			focusLine.ItemID = thisItemID;
			focusLine.id = "rowCastingFocus"+thisItemID;
			let focusStatus = focusLine.firstElementChild.nextElementSibling;
			focusStatus.id = "CastingFocusStatus"+thisItemID;
			if(HeldItems.includes(thisItemID)){
				focusStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				focusStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowCastingFocus.insertAdjacentElement("afterend",focusLine);
		}

		if(item.isWearable == "1" && item.Type != "Armor"){
			let wornLine = thisLine.cloneNode(true);
			wornLine.addEventListener("dragstart",dragItem);
			wornLine.ItemID = thisItemID;
			wornLine.id = "rowWorn"+thisItemID;
			let wornStatus = wornLine.firstElementChild.nextElementSibling;
			wornStatus.id = "WornStatus"+thisItemID;
			if(item.isWorn == "1"){
				wornStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				wornStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowWorn.insertAdjacentElement("afterend",wornLine);
		}

		if(item.mustHold == "1" && item.Type != "Weapon" && item.Type != "CastingFocus"){
			let heldLine = thisLine.cloneNode(true);
			heldLine.addEventListener("dragstart",dragItem);
			heldLine.ItemID = thisItemID;
			heldLine.id = "rowHeld"+thisItemID;
			let heldStatus = heldLine.firstElementChild.nextElementSibling;
			heldStatus.id = "HeldStatus"+thisItemID;
			if(HeldItems.includes(thisItemID)){
				heldStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				heldStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowHeld.insertAdjacentElement("afterend",heldLine);
		}

		if(item.Type == "Ammunition"){
			//TODO: Equipment: Determine method of displaying/confirming whether ammo is used by any weapons (or is the default ammo)
			let ammunitionLine = thisLine.cloneNode(true);
			ammunitionLine.addEventListener("dragstart",dragItem);
			ammunitionLine.ItemID = thisItemID;
			ammunitionLine.id = "rowAmmunition"+thisItemID;
			let ammunitionStatus = ammunitionLine.firstElementChild.nextElementSibling;
			ammunitionStatus.id = "AmmunitionStatus"+thisItemID;
			if(false){
				ammunitionStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				ammunitionStatus.innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
			rowAmmunition.insertAdjacentElement("afterend",ammunitionLine);
		}

		thisLine.remove();
	}

	if(rowAttunement.nextElementSibling.id === "rowArmor"){
		rowAttunement.setAttribute("hidden","");
	}

	if(rowArmor.nextElementSibling.id === "rowWeapon"){
		rowArmor.setAttribute("hidden","");
	}

	if(rowWeapon.nextElementSibling.id === "rowCastingFocus"){
		rowWeapon.setAttribute("hidden","");
	}

	if(rowCastingFocus.nextElementSibling.id === "rowWorn"){
		rowCastingFocus.setAttribute("hidden","");
	}

	if(rowWorn.nextElementSibling.id === "rowHeld"){
		rowWorn.setAttribute("hidden","");
	}

	if(rowHeld.nextElementSibling.id === "rowAmmunition"){
		rowHeld.setAttribute("hidden","");
	}

	if(rowAmmunition.nextElementSibling === null){
		rowAmmunition.setAttribute("hidden","");
	}
}

function updateEquipmentStatuses(){
	for(let item of Inventory){
		let thisItemID = item.ItemID;

		if(item.isAttunement == "1"){
			if(AttunedItems.contains(thisItemID)){
				document.getElementById("AttunementStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("AttunementStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.Type == "Armor"){
			if(EquippedArmor === thisItemID){
				document.getElementById("ArmorStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("ArmorStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.Type == "Weapon"){
			if(HeldItems.includes(thisItemID)){
				document.getElementById("WeaponStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("WeaponStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.Type == "CastingFocus"){
			if(HeldItems.includes(thisItemID)){
				document.getElementById("CastingFocusStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("CastingFocusStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.isWearable == "1" && item.Type != "Armor"){
			if(item.isWorn == "1"){
				document.getElementById("WearStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("WearStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.mustHold == "1" && item.Type != "Weapon" && item.Type != "CastingFocus"){
			if(HeldItems.includes(thisItemID)){
				document.getElementById("HeldStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("HeldStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}

		if(item.Type == "Ammunition"){
			//TODO: Equipment: Determine method of displaying/confirming whether ammo is used by any weapons (or is the default ammo)
			if(false){
				document.getElementById("AmmunitionStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Valid.png'></button>";
			}
			else{
				document.getElementById("AmmunitionStatus"+thisItemID).innerHTML = "<button><img src='lib://pm.a5e.core/InterfaceImages/Invalid.png'></button>";
			}
		}
	}
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	userdata = JSON.parse(userdata);
	setGlobals(userdata);

	maxColumnDepth = 1;
	extraRowNum = 2;

	createInventoryTable();
	createGeneralEquipButtons();
	document.getElementById("tabFullInventory").classList.add("active-tab");
	document.getElementById("tabFullInventory").addEventListener("click",showInventory);
	document.getElementById("tabEquipment").addEventListener("click",showEquipment);
	document.title = "Inventory: "+userdata.TokenName;
}

function setGlobals(userData){
	ParentToken = userData.ParentToken;
	Inventory = userData.Inventory;
	Limbs = userData.Limbs;
	HeldItems = userData.HeldItems;
	EquippedArmor = userData.EquippedArmor;
	AttunedItems = userData.AttunedItems;
	//<!-- TODO: Equipment: Include actual calcuation of number of attuned items when possible 
	AttunementSlots = userData.AttunementSlots;
}

function showInventory(){
	let tabFullInventory = document.getElementById("tabFullInventory");
	if(tabFullInventory.classList.contains("active-tab")) return;
	
	let table = document.getElementById("InventoryTable");
	table.classList.remove("equipment-list");
	table.classList.add("inventory-list");

	document.getElementById("tabEquipment").classList.remove("active-tab");
	tabFullInventory.classList.add("active-tab");

	document.getElementById("InventoryTable").innerHTML = "";
	createInventoryTable();
}

function showEquipment(){
	let tabEquipment = document.getElementById("tabEquipment");
	if(tabEquipment.classList.contains("active-tab")) return;
	
	let table = document.getElementById("InventoryTable");
	table.classList.remove("inventory-list");
	table.classList.add("equipment-list");

	document.getElementById("tabFullInventory").classList.remove("active-tab");
	tabEquipment.classList.add("active-tab");

	document.getElementById("InventoryTable").innerHTML = "";
	buildEquipmentTable();
}

function refreshInventory(userData){
	setGlobals(userData);

	let scrollPosition = window.scrollY;
	if(document.getElementById("tabFullInventory").classList.contains("active-tab")){
		createInventoryTable(scrollPosition);
	}
	else{
		document.getElementById("tabEquipment").classList.remove("active-tab");
		showEquipment(scrollPosition);
	}
}

setTimeout(loadUserData, 1);

function createGeneralEquipButtons(){
	let itemButtonDIV = document.getElementById("ItemButtons");
	itemButtonDIV.classList.add("equipment-button");

	let GiveItemButton = document.createElement("button");
	GiveItemButton.className = "equipment-button";
	GiveItemButton.id = "GiveItemButton";
	GiveItemButton.innerHTML = "<span title='Click to select an item, or drag and drop an item from the list to give that item.'><img src='lib://pm.a5e.core/InterfaceImages/Give.png'></span>";
	GiveItemButton.addEventListener("click",async function(){
		await fetch("macro:GiveItemInput@Lib:pm.a5e.Core",{method: "POST", body:JSON.stringify({"ParentToken":ParentToken})});
	});
	GiveItemButton.addEventListener("dragover",allowDrop);
	GiveItemButton.addEventListener("dragenter",handleEnterValidDrop);
	GiveItemButton.addEventListener("dragleave",handleLeaveValidDrop);
	GiveItemButton.addEventListener("drop",dropSpecificItem);
	itemButtonDIV.insertAdjacentElement("beforeend",GiveItemButton);

	let TakeItemButton = document.createElement("button");
	TakeItemButton.className = "equipment-button";
	TakeItemButton.id = "TakeItemButton";
	TakeItemButton.innerHTML = "<span title='Click to pick up an item from the ground.'><img src='lib://pm.a5e.core/InterfaceImages/Take.png'></span>";
	TakeItemButton.addEventListener("click",async function(){
		await fetch("macro:PickUpItem@Lib:pm.a5e.Core",{method: "POST", body:JSON.stringify({"ParentToken":ParentToken})});
	});
	itemButtonDIV.insertAdjacentElement("beforeend",TakeItemButton);

	let SplitItemButton = document.createElement("button");
	SplitItemButton.className = "equipment-button";
	SplitItemButton.id = "SplitItemButton";
	SplitItemButton.innerHTML = "<span class='no-drag' title='Drag an item over to split it into two separate stacks.'><img id='SplitItemButtonImage' class='no-drag' src='lib://pm.a5e.core/InterfaceImages/Split.png'></span>";
	SplitItemButton.addEventListener("dragover",allowDrop);
	SplitItemButton.addEventListener("dragenter",handleSplitDragEnter);
	SplitItemButton.addEventListener("dragleave",handleSplitDragLeave);
	SplitItemButton.addEventListener("drop",handleSplitItemDrop);
	itemButtonDIV.insertAdjacentElement("beforeend",SplitItemButton);

	let CombineItemButton = document.createElement("button");
	CombineItemButton.className = "equipment-button";
	CombineItemButton.id = "CombineItemButton";
	CombineItemButton.innerHTML = "<span class='no-drag' title='Drag and drop equivalent items to combine their stacks.'><img id='CombineItemButtonImage' class='no-drag' src='lib://pm.a5e.core/InterfaceImages/Combine.png'></span>";
	if(false){
		CombineItemButton.addEventListener("dragover",allowDrop);
		CombineItemButton.addEventListener("dragenter",handleCombineDragEnter);
		CombineItemButton.addEventListener("dragleave",handleCombineDragLeave);
		GiveItemButton.addEventListener("dragenter",handleEnterValidDrop);
		GiveItemButton.addEventListener("dragleave",handleLeaveValidDrop);
		CombineItemButton.addEventListener("drop",handleCombineItemDrop);
	}
	itemButtonDIV.insertAdjacentElement("beforeend",CombineItemButton);		

	let buttonDIV = document.getElementById("EquipmentButtons");
	buttonDIV.classList.add("equipment-button");

	let AttunementItemButton = document.createElement("button");
	AttunementItemButton.className = "equipment-button";
	AttunementItemButton.id = "AttuneItemButton";
	AttunementItemButton.innerHTML = "<span class='no-drag' title='Drag and drop to attune to a specific item.'><img id='AttunementItemButtonImage' class='no-drag' src='lib://pm.a5e.core/InterfaceImages/Attunement.png'></span>";
	AttunementItemButton.addEventListener("drop",attuneToItem);
	AttunementItemButton.addEventListener("dragenter",handleAttunementParentDragEnter);
	AttunementItemButton.addEventListener("dragleave",handleAttunementParentDragLeave);
	AttunementItemButton.addEventListener("dragover", allowDrop);
	buttonDIV.insertAdjacentElement("beforeend",AttunementItemButton);

	let HoldItemButton = document.createElement("button");
	HoldItemButton.className = "equipment-button";
	HoldItemButton.id = "HoldItemButton";
	HoldItemButton.innerHTML = "<span class='no-drag' title='Drag and drop to hold or stow a specific item.'><img class='no-drag' id='HoldItemButtonImage' src='lib://pm.a5e.core/InterfaceImages/Hold.png'></span>";
	HoldItemButton.addEventListener("drop", holdItem);
	HoldItemButton.addEventListener("dragenter", handleHoldItemParentDragEnter);
	HoldItemButton.addEventListener("dragover", allowDrop);
	buttonDIV.insertAdjacentElement("beforeend",HoldItemButton);

	let EquipItemButton = document.createElement("button");
	EquipItemButton.className = "equipment-button";
	EquipItemButton.id = "EquipItemButton";
	EquipItemButton.innerHTML = "<span class='no-drag' title='Drag and drop to don or doff a specific set of armor.'><img class='no-drag' id='EquipItemButtonImage' src='lib://pm.a5e.core/InterfaceImages/Equip_Armor.png'></span>";
	EquipItemButton.addEventListener("click",function(){

	});
	EquipItemButton.addEventListener("drop", equipItem);
	EquipItemButton.addEventListener("dragenter", handleEquipItemDragEnter);
	EquipItemButton.addEventListener("dragover", allowDrop);
	EquipItemButton.addEventListener("dragleave", handleEquipItemDragLeave);
	buttonDIV.insertAdjacentElement("beforeend",EquipItemButton);

	let WearItemButton = document.createElement("button");
	WearItemButton.className = "equipment-button";
	WearItemButton.id = "WearItemButton";
	WearItemButton.innerHTML = "<span class='no-drag' title='Drag and drop to wear or take off a specific item.'><img class='no-drag' id='WearItemButtonImage' src='lib://pm.a5e.core/InterfaceImages/Wear.png'></span>";
	WearItemButton.addEventListener("drop", wearItem);
	WearItemButton.addEventListener("dragenter", handleWearItemDragEnter);
	WearItemButton.addEventListener("dragover", allowDrop);
	WearItemButton.addEventListener("dragleave", handleWearItemDragLeave);
	buttonDIV.insertAdjacentElement("beforeend",WearItemButton);

	let ThrowItemButton = document.createElement("button");
	ThrowItemButton.className = "equipment-button";
	ThrowItemButton.id = "ThrowItemButton";
	ThrowItemButton.innerHTML = "<span class='no-drag' title='Drag an item over to throw that specific item.'><img class='no-drag' id='ThrowItemButtonImage' src='lib://pm.a5e.core/InterfaceImages/Throw.png'></span>";
	ThrowItemButton.addEventListener("drop", throwItem);
	ThrowItemButton.addEventListener("dragenter", handleThrowItemDragEnter);
	ThrowItemButton.addEventListener("dragover", allowDrop);
	ThrowItemButton.addEventListener("dragleave", handleThrowItemDragLeave);
	buttonDIV.insertAdjacentElement("beforeend",ThrowItemButton);

	//counter detects if dragleave is a "true" dragleave event, or if it is just dragging over a child element. dragenter triggers first and increments, dragleave decrements. If 0, it has moved all the way out of the element.
	buttonDIV.counter = 0;
	buttonDIV.addEventListener("dragleave",handleContextButtonDragLeave);
	buttonDIV.addEventListener("dragenter",handleContextButtonDragEnter);
}

function getDraggedItemID(){
	return idFromRowID(document.getElementById("draggedItemID").value);
}

function handleContextButtonDragEnter(ev){
	ev.preventDefault();
	
	let dndCounter = Number(document.getElementById("EquipmentButtons").counter);
	dndCounter++;
	document.getElementById("EquipmentButtons").counter = dndCounter;
}

function handleContextButtonDragLeave(ev){
	let dndCounter = Number(document.getElementById("EquipmentButtons").counter);
	dndCounter--;
	document.getElementById("EquipmentButtons").counter = dndCounter;
	if(dndCounter == 0){
		resetEquipmentButtons();
	}
}

function resetEquipmentButtons(){
	removeAdditionalHoldButtons();
	removeAdditionalAttunementButtons();
	splitItemCancel();
	combineItemCancel();
}

function handleEnterValidDrop(ev){
	ev.target.classList.add("valid-drop");
}

function handleLeaveValidDrop(ev){
	ev.target.classList.remove("valid-drop");
}

async function dropSpecificItem(ev){
    let ItemID = getDraggedItemID();
	let ItemData = getItemData(ItemID);

	let dropData = {
		ParentToken:ParentToken,
		ItemID:ItemID,
		ItemNumber:ItemData.Number
	}
	await fetch("macro:GiveItemInput@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(dropData)});
}

function handleSplitItemDrop(ev){
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);
	let itemNumber = Number(itemData.Number);

	splitItemCancel();

	let splitItemContainer = document.createElement("div");
	splitItemContainer.classList.add("split-item-container");
	splitItemContainer.id = "SplitItemContainer";
	splitItemContainer.style.textAlign = "center";
	document.getElementById("ItemButtons").insertAdjacentElement("beforebegin",splitItemContainer);

	let splitItemSliderContainer = document.createElement("div");
	splitItemSliderContainer.classList.add("split-item-container");
	splitItemSliderContainer.id = "SplitItemSliderContainer";
	splitItemSliderContainer.style.textAlign = "center";
	document.getElementById("ItemButtons").insertAdjacentElement("beforebegin",splitItemSliderContainer);

	let splitItemConfirmContainer = document.createElement("div");
	splitItemConfirmContainer.classList.add("split-item-container");
	splitItemConfirmContainer.id = "SplitItemConfirmContainer";
	splitItemConfirmContainer.style.textAlign = "center";
	document.getElementById("ItemButtons").insertAdjacentElement("beforebegin",splitItemConfirmContainer);

	let nameSpan = document.createElement("span");
	nameSpan.innerHTML = "Splitting "+itemData.DisplayName+" Stack: ";
	splitItemContainer.insertAdjacentElement("beforeend",nameSpan);

	let splitNumInput = document.createElement("input");
	splitNumInput.type = "number";
	splitNumInput.id = "ItemSplitAmount";
	splitNumInput.min = 0;
	splitNumInput.max = itemNumber;
	splitNumInput.value = 0;
	splitNumInput.classList.add("small-number");
	splitNumInput.addEventListener("change",function(){
		document.getElementById("ItemSplitAmountRange").value = this.value;
	});
	splitItemContainer.insertAdjacentElement("beforeend",splitNumInput);

	let splitNumRangeInput = document.createElement("input");
	splitNumRangeInput.type = "range";
	splitNumRangeInput.id = "ItemSplitAmountRange";
	splitNumRangeInput.min = 0;
	splitNumRangeInput.max = itemNumber;
	splitNumRangeInput.value = 0;
	splitNumRangeInput.classList.add("small-number");
	splitNumRangeInput.addEventListener("change",function(){
		document.getElementById("ItemSplitAmount").value = this.value;
	});
	splitItemSliderContainer.insertAdjacentElement("beforeend",splitNumRangeInput);

	let splitNumConfirm = document.createElement("input");
	splitNumConfirm.type = "button";
	splitNumConfirm.value = "Split";
	splitNumConfirm.addEventListener("click",function(){
		splitItem(ItemID);
	});
	splitItemConfirmContainer.insertAdjacentElement("beforeend",splitNumConfirm);

	let splitNumCancel = document.createElement("input");
	splitNumCancel.type = "button";
	splitNumCancel.value = "Cancel";
	splitNumCancel.addEventListener("click",splitItemCancel);
	splitItemConfirmContainer.insertAdjacentElement("beforeend",splitNumCancel);
}

function handleSplitDragEnter(ev){
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

	if(itemData.isStackable == 0 || itemData.Number == 1){
        ev.dataTransfer.dropEffect = "none";
		document.getElementById("SplitItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
	}
	else{
		//TODO: valid-drop class only applying border to image? Maybe equipment-button class is superceding?
		handleEnterValidDrop(ev);
	}
}

function handleSplitDragLeave(ev){
	document.getElementById("SplitItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Split.png";
	ev.target.classList.remove("valid-drop");
}

function splitItem(itemID){
	let itemData = getItemData(itemID);
	let newStackSize = document.getElementById("ItemSplitAmount").value;
	if(!isNumeric(newStackSize)){
		//TODO: give angry warning about using numbers
		return;
	}
	newStackSize = Number(newStackSize);
	let oldStackSize = itemData.Number - newStackSize;

	if(newStackSize !== 0 && oldStackSize !== 0){
		itemData.Number = oldStackSize;
		setItemData(itemData);
		let oldItemIndex = Inventory.findIndex(obj => obj.ItemID === itemID);

		let newItemData = Object.assign({},itemData);
		newItemData.Number = newStackSize;
		newItemData.ItemID = generateItemID();
		Inventory.splice((oldItemIndex+1),0,newItemData);

		let containerID = newItemData.StoredIn;
		if(containerID != "" && containerID != undefined){
			let containerData = getItemData(containerID);
			containerData.Contents.push()
			setItemData(containerData);
		}
	}
	
	splitItemCancel();
	createInventoryTable(window.scrollY);

	MTFunction("pm.a5e.UpdateOtherInventories",[ParentToken,"not-self"]);
}

function splitItemCancel(){
	if(document.getElementById("SplitItemContainer")){
		document.getElementById("SplitItemContainer").remove();
		document.getElementById("SplitItemSliderContainer").remove();
		document.getElementById("SplitItemConfirmContainer").remove();		
	}
}

function handleCombineItemDrop(ev){
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);
	let itemNumber = Number(itemData.Number);

	combineItemCancel();

	let combineItemContainer = document.createElement("div");
	combineItemContainer.classList.add("combine-item-container");
	combineItemContainer.id = "CombineItemContainer";
	combineItemContainer.style.textAlign = "center";
	document.getElementById("ItemButtons").insertAdjacentElement("beforebegin",combineItemContainer);

	let combineItemConfirmContainer = document.createElement("div");
	combineItemConfirmContainer.classList.add("combine-item-container");
	combineItemConfirmContainer.id = "CombineItemConfirmContainer";
	combineItemConfirmContainer.style.textAlign = "center";
	document.getElementById("ItemButtons").insertAdjacentElement("beforebegin",combineItemConfirmContainer);

	let nameSpan = document.createElement("span");
	nameSpan.innerHTML = "Combining "+itemData.DisplayName+" Stacks - Current Total: ";
	combineItemContainer.insertAdjacentElement("beforeend",nameSpan);
	let numberSpan = document.createElement("span");
	numberSpan.innerHTML = itemNumber;
	combineItemContainer.insertAdjacentElement("beforeend",numberSpan);

	let combineNumInput = document.createElement("input");
	combineNumInput.type = "hidden";
	combineNumInput.id = "ItemCombineAmount";
	combineNumInput.value = itemNumber;
	combineItemContainer.insertAdjacentElement("beforeend",combineNumInput);

	let combineNumConfirm = document.createElement("input");
	combineNumConfirm.type = "button";
	combineNumConfirm.value = "Combine";
	combineNumConfirm.addEventListener("click",function(){
		combineItem(ItemID);
	});
	combineItemConfirmContainer.insertAdjacentElement("beforeend",combineNumConfirm);

	let combineNumCancel = document.createElement("input");
	combineNumCancel.type = "button";
	combineNumCancel.value = "Cancel";
	combineNumCancel.addEventListener("click",combineItemCancel);
	combineItemConfirmContainer.insertAdjacentElement("beforeend",combineNumCancel);
}

function handleCombineDragEnter(ev){
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

	if(itemData.isStackable == 0 || itemData.Number == 1){
        ev.dataTransfer.dropEffect = "none";
		document.getElementById("CombineItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
	}
	else{
		handleEnterValidDrop(ev);
	}
}

function handleCombineDragLeave(ev){
	document.getElementById("CombineItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Combine.png";
	ev.target.classList.remove("valid-drop");
}

function combineItem(itemID){
	let itemData = getItemData(itemID);
	let newStackSize = document.getElementById("ItemCombineAmount").value;
	if(!isNumeric(newStackSize)){
		return;
	}
	newStackSize = Number(newStackSize);
	let oldStackSize = itemData.Number - newStackSize;

	if(newStackSize !== 0 && oldStackSize !== 0){
		itemData.Number = oldStackSize;
		setItemData(itemData);
		let oldItemIndex = Inventory.findIndex(obj => obj.ItemID === itemID);

		let newItemData = Object.assign({},itemData);
		newItemData.Number = newStackSize;
		newItemData.ItemID = generateItemID();
		Inventory.splice((oldItemIndex+1),0,newItemData);

		let containerID = newItemData.StoredIn;
		if(containerID != "" && containerID != undefined){
			let containerData = getItemData(containerID);
			containerData.Contents.push()
			setItemData(containerData);
		}
	}
	
	combineItemCancel();
	createInventoryTable(window.scrollY);

	MTFunction("pm.a5e.UpdateOtherInventories",[ParentToken,"not-self"]);
}

function combineItemCancel(){
	if(document.getElementById("CombineItemContainer")){
		document.getElementById("CombineItemContainer").remove();
		document.getElementById("CombineItemSliderContainer").remove();
		document.getElementById("CombineItemConfirmContainer").remove();		
	}
}

function handleAttunementParentDragEnter(ev){
	if(document.getElementById("AttunementButtonContainer")){
		return;
	}
	resetEquipmentButtons();
	
    let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);
    
	if(itemData.isAttunement == 1){
		ev.target.classList.add("valid-drop");
		createAdditionalAttuneButtons(itemData);
	}
	else{
		document.getElementById("AttunementItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
	}
}

function handleAttunementParentDragLeave(ev){
	document.getElementById("AttunementItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Attunement.png";
	ev.target.classList.remove("valid-drop");
}

function createAdditionalAttuneButtons() {
    let numAttuneSlots = AttunementSlots;

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "attunement-button-container";
	buttonContainer.tabindex = -1;
    buttonContainer.style.position = "relative";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "0px";
    buttonContainer.style.borderWidth = "10px";
    buttonContainer.id = "AttunementButtonContainer";

    for (let i = 0; i < numAttuneSlots; i++) {
		let button = addAttunementButton(i);
        buttonContainer.appendChild(button);
		button.dispatchEvent(new Event("dragenter"));
		button.classList.remove("valid-drop");
		button.removeEventListener("dragenter",handleAttunementDragEnter);
		button.removeEventListener("dragleave",handleAttunementDragLeave);
    }

    document.getElementById("EquipmentButtons").insertAdjacentElement("beforeend", buttonContainer);
}

function addAttunementButton(i){
	let button = document.createElement("button");
	button.className = "attunement-button";
	button.style.margin = "2px";
	button.id = `AttunementButton${i}`;
	button.attuneSlot = i;
	button.tabindex = -1;

	let attuneImage;
	if(AttunedItems[i] == undefined){
		attuneImage = "Attunement_Empty_" + (i + 1);
	}
	else{
		attuneImage = "Attunement_" + (i + 1);
	}
	
	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${attuneImage}.png'>`;

	button.addEventListener("drop", (ev) => attuneToItem(ev, i));
	button.addEventListener("dragover", allowDrop);
	button.addEventListener("dragenter", handleAttunementDragEnter);
	button.addEventListener("dragleave", handleAttunementDragLeave);
	button.addEventListener("dragenter",handleEnterValidDrop);
	button.addEventListener("dragleave",handleLeaveValidDrop);

	return button;
	//TODO: Will need to remove the handleValidDrop events if all buttons are shown at once, as it will otherwise recognize everything as valid
}

function handleAttunementDragEnter(ev){
	let itemID = getDraggedItemID();
	let itemData = getItemData(itemID)

	if(itemData.isAttunement != 1){
		button.innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png'>";

		return;
	}

	button.classList.add("valid-drop");

	let button = ev.target;
	let i = Number(button.attuneSlot);

	let attuneImage;
	let thisSlotItem = AttunedItems[i];
	if(thisSlotItem == undefined){
		attuneImage = "Attunement_Empty_Add";
	}
	else if(thisSlotItem == itemID){
		attuneImage = "Attunement_Remove";
	}
	else{
		attuneImage = "Attunement_Add";
	}

	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${attuneImage}.png'>`;
}

function handleAttunementDragLeave(ev){
	let button = ev.target;
	let i = Number(button.attuneSlot);
	let thisSlotItem = AttunedItems[i];

	let attuneImage;
	if(thisSlotItem == undefined){
		attuneImage = "Attunement_Empty_"+(i+1);
	}
	else{
		attuneImage = "Attunement_"+(i+1);
	}

	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${attuneImage}.png'>`;
}

async function attuneToItem(ev, slotNumber){
	if(slotNumber == null) slotNumber = 0;

    let ItemID = getDraggedItemID();

	let currentSlot = AttunedItems.indexOf(ItemID);
	if(currentSlot === -1){
		let attunedData = await fetch("macro:pm.a5e.AttuneItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,slotNumber,ParentToken])});
	}
	else if(currentSlot === slotNumber){
		let attunedData = await fetch("macro:pm.a5e.UnattuneItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,slotNumber,ParentToken])});
		attunedData = await attunedData.json();
		Inventory = attunedData.Inventory;
	}
	else{
		if(AttunedItems[slotNumber] != ""){
			let attunedData = await fetch("macro:pm.a5e.UnattuneItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,slotNumber,ParentToken])});
			attunedData = await attunedData.json();
			Inventory = attunedData.Inventory;			
		}

		AttunedItems[slotNumber] = ItemID;
		AttunedItems[currentSlot] = "";

		MTFunction("pm.a5e.UpdateOtherInventories",[ParentToken,"not-self"]);
	}

	removeAdditionalAttunementButtons();
}

function removeAdditionalAttunementButtons(){
    let buttonContainer = document.getElementById("AttunementButtonContainer");
    if (buttonContainer) {
        buttonContainer.remove();
    }
}

function handleHoldItemParentDragEnter(ev) {
    ev.preventDefault();

	if(document.getElementById("HoldHandButtonContainer")){
		return;
	}
	resetEquipmentButtons();

    let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

    if(Limbs.length > 1){
        createAdditionalHoldButtons(itemData);
    }
	else {
		holdItem(ev,0);
	}
}

function createAdditionalHoldButtons(){
    let numHands = Math.max(1, Limbs.length);

    let buttonContainer = document.createElement("div");
	buttonContainer.classList.add("equipment-button");
	buttonContainer.tabindex = -1;
    buttonContainer.style.position = "relative";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "0px";
    buttonContainer.id = "HoldHandButtonContainer";

	for(i = 0; i < numHands; i++){
		button = createHoldButton(i);
        buttonContainer.appendChild(button);
		button.dispatchEvent(new Event("dragenter"));
		button.classList.remove("valid-drop");
		button.removeEventListener("dragenter",handleHoldItemDragEnter);
		button.removeEventListener("dragleave",handleHoldItemDragLeave);
	}

    document.getElementById("EquipmentButtons").insertAdjacentElement("beforeend", buttonContainer);
}

function createHoldButton(i){
	let button = document.createElement("button");
	button.className = "hold-hand-button";
	button.style.margin = "2px";
	button.id = `HoldHandButton${i}`;
	button.handSlot = i;
	button.tabindex = -1;

	let handImage;
	if(HeldItems[i] == ""){
		handImage = "Hold_Empty_" + (i + 1);
	}
	else{
		handImage = "Hold_" + (i + 1);
	}

	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${handImage}.png'>`;
	button.addEventListener("drop", (ev) => holdItem(ev, i));
	button.addEventListener("dragover", allowDrop);
	button.addEventListener("dragenter", handleHoldItemDragEnter);
	button.addEventListener("dragleave", handleHoldItemDragLeave);
	button.addEventListener("dragenter",handleEnterValidDrop);
	button.addEventListener("dragleave",handleLeaveValidDrop);

	return button;
}

function handleHoldItemDragEnter(){
	let itemID = getDraggedItemID();
	let button = ev.target;
	let i = Number(button.handSlot);

	let handImage;
	let thisSlotItem = HeldItems[i];
	if(thisSlotItem == ""){
		handImage = "Hold_Empty_Add";
	}
	else if(thisSlotItem == itemID){
		handImage = "Hold_Remove";
	}
	else{
		handImage = "Hold_Add";
	}

	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${handImage}.png'>`
}

function handleHoldItemDragLeave(){
	let button = ev.target;
	let i = Number(button.handSlot);
	let thisSlotItem = HeldItems[i];

	if(thisSlotItem == ""){
		handImage = "Hold_Empty_"+(i+1);
	}
	else{
		handImage = "Hold_"+(i+1);
	}

	button.innerHTML = `<img src='lib://pm.a5e.core/InterfaceImages/${handImage}.png'>`
}

function removeAdditionalHoldButtons() {
    let buttonContainer = document.getElementById("HoldHandButtonContainer");
    if (buttonContainer) {
        buttonContainer.remove();
    }
}

async function holdItem(ev, handNumber) {
	if(handNumber == null) handNumber = 0;

    let ItemID = getDraggedItemID();

	let currentHand = HeldItems.indexOf(ItemID);
	if(currentHand === -1){
		let heldData = await fetch("macro:pm.a5e.HoldItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,handNumber,ParentToken])});
	}
	else if(currentHand === handNumber){
		let heldData = await fetch("macro:pm.a5e.StowItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,handNumber,ParentToken])});
	}
	else{
		if(HeldItems[handNumber] != ""){
			let heldData = await fetch("macro:pm.a5e.StowItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,handNumber,ParentToken])});
			heldData = await heldData.json();
			Inventory = heldData.Inventory;			
		}

		HeldItems[handNumber] = ItemID;
		HeldItems[currentHand] = "";

		MTFunction("pm.a5e.UpdateOtherInventories",[ParentToken,"not-self"]);
	}

	removeAdditionalHoldButtons();
}

function handleEquipItemDragEnter(ev) {
    ev.preventDefault();
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

    if (itemData.Type !== "Armor") {
        ev.dataTransfer.dropEffect = "none";
		document.getElementById("EquipItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
    }
	else{
		ev.target.classList.add("valid-drop");
	
		if(ItemID == EquippedArmor){
			document.getElementById("EquipItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Equip_Armor_Remove.png";
		}
		else {
			document.getElementById("EquipItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Equip_Armor_Add.png";
		}
	}
}

function handleEquipItemDragLeave(ev) {
    ev.preventDefault();
	document.getElementById("EquipItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Equip_Armor.png";
	ev.target.classList.remove("valid-drop");
}

async function equipItem(ev) {
    ev.preventDefault();
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

	if(ItemID == EquippedArmor){
		let equipData = await fetch("macro:pm.a5e.UnequipArmor@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,ParentToken])});
	}
    else if (itemData.Type === "Armor") {
       let equipData = await fetch("macro:pm.a5e.EquipArmor@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,ParentToken])});
    } else {
        console.log(itemData.DisplayName+" is not armor and cannot be equipped.");
    }
	document.getElementById("EquipItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Equip_Armor.png";
	ev.target.classList.remove("valid-drop");
}

function handleWearItemDragEnter(ev) {
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

    if(itemData.isWearable != 1) {
        ev.dataTransfer.dropEffect = "none";
		document.getElementById("WearItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
    }
	else{
		ev.target.classList.add("valid-drop");

		if(itemData.isWorn == 1){
			document.getElementById("WearItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Wear_Remove.png";
		}
		else {
			document.getElementById("WearItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Wear_Add.png";
		}
	} 
}

function handleWearItemDragLeave(ev) {
	document.getElementById("WearItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Wear.png";
	ev.target.classList.remove("valid-drop");
}

async function wearItem(ev) {
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

	if(itemData.isWorn == 1){
		let wearData = await fetch("macro:pm.a5e.UnwearItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,ParentToken])});
	}
    else if (itemData.isWearable == 1) {
		let wearData = await fetch("macro:pm.a5e.WearItem@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify([ItemID,ParentToken])});
    } else {
        console.log(itemData.DisplayName+" is not wearable.");
    }
	document.getElementById("WearItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Wear.png";
	ev.target.classList.remove("valid-drop");
}

function handleThrowItemDragEnter(ev) {
	let ItemID = getDraggedItemID();
    let itemData = getItemData(ItemID);

    if(itemData.Type != "Weapon") {
        ev.dataTransfer.dropEffect = "none";
		document.getElementById("ThrowItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Prohibit_Overlay.png";
    }
	else{
		ev.target.classList.add("valid-drop");
	} 
}

function handleThrowItemDragLeave(ev) {
	document.getElementById("ThrowItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Throw.png";
	ev.target.classList.remove("valid-drop");
}

async function throwItem(ev) {
	let ItemID = getDraggedItemID();

	let throwData = await fetch("macro:ThrowWeapon@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify({ParentToken:ParentToken,ItemID:ItemID})});

	document.getElementById("ThrowItemButtonImage").src = "lib://pm.a5e.core/InterfaceImages/Throw.png";
	ev.target.classList.remove("valid-drop");
}