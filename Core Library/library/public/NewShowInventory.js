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

async function rearrangeInventory(oldIndex,newIndex){
	let ParentToken = document.getElementById("ParentToken").value;
	let inventory = await MTFunction("getProperty",["a5e.stat.Inventory",ParentToken]);

	oldIndex = oldIndex - 1;
	newIndex = newIndex - 1;
	let itemsMovedNum = 1;

	if(inventory.Contents != null && inventory.Contents != ""){
		itemsMovedNum = inventory.Contents.length + 1;
	}

	let itemsMoved = inventory.splice(oldIndex,itemsMovedNum);
	for(let item of itemsMoved){
		inventory.splice(newIndex,0,item);
		newIndex++;
	}

	await fetch("macro:js.setProperty@Lib:pm.a5e.Core", {method: "POST", body: "['a5e.stat.Inventory',"+JSON.stringify(inventory)+",'"+ParentToken+"']"});
}

async function createInventoryTable(Inventory,ParentToken){
	let InventoryTableHTML = "<tr><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Item<input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'></th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Number</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Weight</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Context Menu</th></tr>";
	let TotalWeight = 0;

	for(let Item of Inventory){
		let DisplayName = Item.DisplayName;
		if(DisplayName.length > 21){
			DisplayName = "<span title='"+DisplayName+"'>"+DisplayName.substring(0,18)+"...</span>";
		}

		let ItemNumber = Item.Number;
		let Weight = Item.Weight;
		let TotalWeight = 0;
		if(typeof ItemNumber == "number" && typeof Weight == "number"){
			TotalWeight = ItemNumber * Weight;
		}
		let weightNeedsRounding = Math.floor(TotalWeight) == TotalWeight;

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
				let resourceNames = ResourceData.keys();
				let resourceDisplayNames = ResourceData.ResourceDisplayName;
				let isFirst = true;
				for(let tempResourceName of resourceNames){
					if(isFirst){
						//I'm like 99% sure there's a function that would make doing this unnecessary but I don't feel like finding it
						isFirst = false;
					}
					else{
						NumberDisplay = NumberDisplay + "<br>";
					}
					NumberDisplay = NumberDisplay + resourceDisplayNames[tempResourceName]+": " + Item.Resource[tempResourceName] + "<b>/<b>" + ResourceData[tempResourceName];
				}
			}			
		}

		let thisRowContextButtons = "";

		if(Item.Type == "Container"){
			thisRowContextButtons = thisRowContextButtons + "<input type='image' src='public/InterfaceImages/Container_Open'>";
		}

		if(thisRowContextButtons == ""){
			thisRowContextButtons = " --- ";
		}
		else{
			thisRowContextButtons = "<span class='context-button'>"+thisRowContextButtons+"</span>";
		}
	}
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	let table = document.getElementById('InventoryTable');
	table.innerHTML = userdata;
}

setTimeout(loadUserData, 1);