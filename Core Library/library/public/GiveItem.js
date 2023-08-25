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

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('GiveItemTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);