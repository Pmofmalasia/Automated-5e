function dragItem(ev){
	ev.dataTransfer.clearData();
	ev.dataTransfer.setData("text",ev.target);
}

function dropItem(ev){
	ev.preventDefault();
	let dropTarget = ev.target;
	if(dropTarget.tagName.toLowerCase() != "tr"){
		ev.preventDefault();
	}
	else{
		let rowText = ev.dataTransfer.getData("text");
		console.log(rowText);
		console.log(ev.target);
		let destinationRow = document.getElementById(ev.target.rowIndex);
		console.log(destinationRow);
		let newRow = document.getElementById("InventoryTable").insertRow(destinationRow);
		newRow = ev.dataTransfer.getData("text");		
	}

}

function allowDrop(ev){
	ev.preventDefault();
}

function rearrangeInventory(){

}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	let table = document.getElementById('InventoryTable');
	table.innerHTML = userdata;
}

setTimeout(loadUserData, 1);