async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('InventoryTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);