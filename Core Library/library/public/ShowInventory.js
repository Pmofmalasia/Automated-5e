function dragItem(ev){
	ev.dataTransfer.clearData();
	ev.dataTransfer.setData("text",ev.target.id);
}

function dropItem(ev){
	ev.preventDefault();
	let movedRow = document.getElementById(ev.dataTransfer.getData("text"));
	let dropTarget = ev.target.closest("tr");

	let oldIndex = movedRow.rowIndex;
	let newIndex = dropTarget.rowIndex;

	let targetTable = dropTarget.parentNode;
	targetTable.insertBefore(movedRow,dropTarget);

	rearrangeInventory(oldIndex,newIndex);
}

function allowDrop(ev){
	ev.preventDefault();
}

function rearrangeInventory(oldIndex,newIndex){
	oldIndex = oldIndex - 1;
	newIndex = newIndex - 1;
	let itemsMovedNum = 1;

	if(Inventory.Contents != null && Inventory.Contents != ""){
		itemsMovedNum = Inventory.Contents.length + 1;
	}

	let itemsMoved = Inventory.splice(oldIndex,itemsMovedNum);
	for(let item of itemsMoved){
		Inventory.splice(newIndex,0,item);
		newIndex++;
	}
console.log("Move");
	updateInventory();
}

async function updateInventory(){
	console.log(Inventory);
	await MTFunction("setProperty",["a5e.stat.Inventory",JSON.stringify(Inventory),ParentToken]);
	console.log("moved");
}

async function createInventoryTable(){
	let InventoryTableHTML = "<tr><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Item</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Number</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Weight</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Context Menu</th></tr>";
	let allItemsWeight = 0;
	let TableCellFormat = "<td style='text-align:center; padding-left:4px'>";

	for(let Item of Inventory){
		let thisRowUpdate = await updateItemRow(Item);
		let thisRowInnerHTML = thisRowUpdate.RowText;
		allItemsWeight = allItemsWeight + thisRowUpdate.Weight;

		InventoryTableHTML = InventoryTableHTML + "<tr class='Inventory-list' draggable='true' ondragstart='dragItem(event)' ondrop='dropItem(event)' ondragover='allowDrop(event)' id='rowItemID"+Item.ItemID+"'>"+thisRowInnerHTML+"</tr>";
	}

	InventoryTableHTML = InventoryTableHTML + "<tr ondrop='dropItem(event)' ondragover='allowDrop(event)'><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Weight Data</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Current Weight</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Carry Capacity</th><th style = 'text-align:center; background-color:#504A40; color:#FAF9F7; width:120px;'>Push Capacity</th></tr>";
	
	let submitData = {"ParentToken":ParentToken};
	let request = await fetch("macro:stat.a5e.CarryCapacity@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let WeightData = await request.json();

	InventoryTableHTML = InventoryTableHTML + "<tr class='Inventory-list' style='background-color:rgb(108, 223, 184); color:black'><td> --- </td><td>"+Math.round(allItemsWeight)+"</td><td>"+WeightData.Carry+"</td><td>"+WeightData.Push+"</td></tr>";

	document.getElementById("InventoryTable").innerHTML = InventoryTableHTML;
}

async function updateItemRow(Item){
	//This gets hung up sometimes so the frame doesn't load - not sure why
	let DisplayName = Item.DisplayName;
	if(DisplayName.length > 21){
		DisplayName = "<span title='"+DisplayName+"'>"+DisplayName.substring(0,18)+"...</span>";
	}
	let thisItemID = Item.ItemID;

	let ItemNumber = Item.Number;
	let Weight = Item.Weight;
	let TotalWeight = 0;
	if(typeof ItemNumber == "number" && typeof Weight == "number"){
		TotalWeight = ItemNumber * Weight;
	}
	let displayWeight = Math.round(Weight);

	let ResourceData = await MTFunction("evalMacro",[Item.MaxResource]);
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

	let thisRowContextButtons = "<span class='context-button'>";

	let isActive = Item.IsActive > 0;
	if(Item.Type == "Container"){
		thisRowContextButtons = thisRowContextButtons + " <span id='ContainerTitle"+thisItemID+"' title='Close Container, or Drag an Item to Store'><button type='button' id='Container"+thisItemID+"' onclick='toggleContainer()' value='open'><img src='lib://pm.a5e.core/InterfaceImages/Container_Open.png?cachelib=false'></button></span> ";
	}

	if(Item.isActivatable == 1){
		let buttonImage;
		let buttonTitle;
		let needsActivation;
		if(isActive){
			buttonImage = "Deactivate_Item";
			buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Deactivate Item'>"
			needsActivation = 0;
		}
		else{
			buttonImage = "Activate_Item";
			buttonTitle = " <span id='ActivateTitle"+thisItemID+"' title='Activate Item'>"
			needsActivation = 1;
		}
		thisRowContextButtons = thisRowContextButtons + buttonTitle + "<button id='Activate"+thisItemID+"' type='button' onclick='toggleActivation("+'"'+thisItemID+'",'+needsActivation+")'><img src='lib://pm.a5e.core/InterfaceImages/"+buttonImage+".png?cachelib=false'></button></span> ";
	}

	if(typeof Item.Effects == "object" && isActive){
		thisRowContextButtons = thisRowContextButtons + " <span id='UseTitle"+thisItemID+" title='Use Item'><button type='button' id='Use"+thisItemID+"' onclick='useItem("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Use.png?cachelib=false'></button></span> ";
	}

	if(typeof Item.ItemSpellcasting == "object" && isActive){
		thisRowContextButtons = thisRowContextButtons + " <span id='CastTitle"+thisItemID+"' title='Cast Spell'><button type='button' id='Cast"+thisItemID+"' onclick='castSpell("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Cast_Spell.png?cachelib=false'></button></span> ";
	}

	thisRowContextButtons = thisRowContextButtons + " <span id='RulesTitle"+thisItemID+"' title='Show Rules'><button type='button' id='Rules"+thisItemID+"' onclick='showRules("+'"'+thisItemID+'"'+")'><img src='lib://pm.a5e.core/InterfaceImages/Rules.png?cachelib=false'></button></span> ";

	thisRowContextButtons = thisRowContextButtons+"</span>";

	let returnData = {
		"RowText":"<td>"+DisplayName+"</td><td>"+NumberDisplay+"</td><td><span title='"+Weight+" Each'>"+displayWeight+"</span></td><td>"+thisRowContextButtons+"</td>",
		"Weight":TotalWeight
	};
	return returnData;
}

async function toggleActivation(ItemID,needsActivation){
	let submitData = {
		"ParentToken":ParentToken,
		"Activate":needsActivation,
		"Item":ItemID
	};
	let request = await fetch("macro:ActivateItem@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let activationResult = await request.text();

	if(activationResult == 1){
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Deactivate_Item.png?cachelib=false'>";
		document.getElementById("Activate"+ItemID).onclick = "toggleActivation("+'"'+ItemID+'",0'+")";
		document.getElementById("ActivateTitle"+ItemID).title = "Deactivate Item";
	}
	else{
		document.getElementById("Activate"+ItemID).innerHTML = "<img src='lib://pm.a5e.core/InterfaceImages/Activate_Item.png?cachelib=false'>";
		document.getElementById("Activate"+ItemID).onclick = "toggleActivation("+'"'+ItemID+'",1'+")";
		document.getElementById("ActivateTitle"+ItemID).title = "Activate Item";
	}
}

async function useItem(ItemID){
	let itemData = Inventory.filter(function(Inventory){
		return Inventory.ItemID == ItemID;
	});
	itemData = itemData[0];

	let request = await fetch("macro:UseItem@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(itemData)});
	let resultingInventory = await request.json();

	//compare resultingInventory with Inventory here to find differences, then update those rows
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	userdata = JSON.parse(userdata);

	ParentToken = userdata.ParentToken;
	Inventory = userdata.Inventory;
	
	createInventoryTable();
}

setTimeout(loadUserData, 1);