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

	let ItemOptions = "<option value='@@ImpromptuItem'>New Item</option>"+createHTMLSelectOptions(validObjects);
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('AddItemTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);