async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());

	document.getElementById("SpendHitDieInputTable").innerHTML = userdata;
}

setTimeout(loadUserData, 1);