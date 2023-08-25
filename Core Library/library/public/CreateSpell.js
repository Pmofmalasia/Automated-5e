function mCompInput() {
	let mCompLineIndex = document.getElementById("MaterialComponents").rowIndex;
	
	if(document.getElementById("mComp").checked){
		let table = document.getElementById("spellCreationTable");

		let mCompList = table.insertRow(mCompLineIndex+1);
		mCompList.innerHTML = "<th><label for='mComponents'>Material Components:</label></th><td><input type='text' id='mComponents' name='mComponents'></td>";

		let mCompConsumedList = table.insertRow(mCompLineIndex+2);
		mCompConsumedList.innerHTML = "<th><label for='mComponentsConsumed'>Consumed Material Components:</label></th><td><input type='text' id='mComponentsConsumed' name='mComponentsConsumed'></td>";
	}
	else{
		document.getElementById("spellCreationTable").deleteRow(mCompLineIndex+1);
		document.getElementById("spellCreationTable").deleteRow(mCompLineIndex+1);
	}
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('spellCreationTable').innerHTML = userdata;
}

async function submitSpellData() {
	let submitData = Object.fromEntries(new FormData(spellCreation));
	let request = fetch("macro:CreateSpellProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
	let result = await request.json();
}
setTimeout(loadUserData, 1);