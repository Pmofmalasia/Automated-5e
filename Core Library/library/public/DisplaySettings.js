async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	let table = document.getElementById("DisplaySettingsTable");
	table.innerHTML = userdata;
}

setTimeout(loadUserData, 1);