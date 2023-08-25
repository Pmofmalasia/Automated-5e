function getCurrentInventory(){
	let AllInventories = JSON.parse(document.getElementById("Inventories").value);
	let CurrentSelection = document.getElementById("TakeFromChoice").value;
	let CurrentSelectedInventory = AllInventories[CurrentSelection];

	return CurrentSelectedInventory;
}

function getCurrentItem(CurrentInventory){
	let CurrentSelection = document.getElementById("ItemChoice").value;
	let SelectedItemData;
	for(let tempItem of CurrentInventory){
		if(tempItem.ItemID == CurrentSelection){
			SelectedItemData = tempItem;
		}
	}
}

function adjustInventoryOptions(){
	let CurrentInventory = getCurrentInventory();
	let ItemOptions = createHTMLSelectOptions(CurrentInventory,"ItemID");

	document.getElementById("ItemChoice").innerHTML = ItemOptions;
	adjustMaxNumber();
}

function adjustMaxNumber(){
	let CurrentInventory = getCurrentInventory();
	let CurrentItem = getCurrentItem(CurrentInventory);

	let ItemMaxNumber = CurrentItem.Number;
	document.getElementById("rowNumberGiven").innerHTML = "<th><label for='NumberTaken'>Number To Take:</label></th><td><input type='number' id='NumberTaken' name='NumberTaken' min=1 value="+ItemMaxNumber+" style='width:35px'> (Maximum "+ItemMaxNumber+")</td>";
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('PickUpItemTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);