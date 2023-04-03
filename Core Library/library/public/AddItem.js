//Note: All 'AddItem' variations (e.g. AddWeapon) can use this code by setting a hidden value for ObjectType to that type.

async function adjustItemTypeFilters(){
	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTypes','Name','json']"});
	let allObjectTypes = await request.json();

	let ValidObjectTypes = [];
	for(let tempType of allObjectTypes){
		if(document.getElementById("objectTypeFilter"+tempType).checked){
			ValidObjectTypes.push(tempType);
		}
	}

	let ObjectRequest = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Objects']"});
	let allObjects = await ObjectRequest.json();

	let validObjects;
	if(ValidObjectTypes.length == 0){
		validObjects = allObjects;
	}
	else{
		validObjects = [];
		for(let tempObject of allObjects){
			if(ValidObjectTypes.includes(tempObject.Type)){
				validObjects.push(tempObject);
			}
		}
	}

	let ItemOptions = createHTMLSelectOptions(validObjects,"");

	ItemOptions = "<option value='@@ImpromptuItem'>New Item</option>"+ItemOptions;

	document.getElementById("ItemChoice").innerHTML = ItemOptions;
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('AddItemTable').innerHTML = userdata;

	adjustItemTypeFilters();
}

setTimeout(loadUserData, 1);