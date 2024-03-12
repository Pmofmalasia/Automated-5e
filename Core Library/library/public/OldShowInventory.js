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

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	let table = document.getElementById('InventoryTable');
	table.innerHTML = userdata;
}

setTimeout(loadUserData, 1);