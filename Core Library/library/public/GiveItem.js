function adjustMaxNumber(){
	let CurrentInventory = JSON.parse(document.getElementById("Inventory").value);
	let CurrentSelection = document.getElementById("ItemChoice").value;

	let SelectedItemData;
	for(let tempItem of CurrentInventory){
		if(tempItem.ItemID == CurrentSelection){
			SelectedItemData = tempItem;
		}
	}

	let ItemMaxNumber = SelectedItemData.Number;
	document.getElementById("rowNumberGiven").innerHTML = "<th><label for='NumberGiven'>Number Given:</label></th><td><input type='number' id='NumberGiven' name='NumberGiven' min=1 value="+ItemMaxNumber+" style='width:35px'> (Maximum "+ItemMaxNumber+")</td>";
}

function createIsLeaveBehindRow(){
	let GiveToChoice = document.getElementById("GiveToChoice").value;
	let startRow = document.getElementById("rowGiveToChoice");

	if(GiveToChoice === ""){
		let tableID = startRow.closest("table").id;
		addTableRow(tableID,startRow.rowIndex + 1,"rowIsLeaveBehind","<th><label for='isLeaveBehind'>Leave Behind Token:</label></th><td><input type='checkbox' id='isLeaveBehind' name='isLeaveBehind'></td>");
	}
	else if(startRow.nextElementSibling.id === "rowIsLeaveBehind"){
		startRow.nextElementSibling.remove();
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('GiveItemTable').innerHTML = userdata;

	document.getElementById("GiveToChoice").dispatchEvent(new Event("change"));
}

setTimeout(loadUserData, 1);