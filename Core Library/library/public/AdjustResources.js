async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('AdjustResourcesTable').innerHTML = userdata;

	document.getElementById("AdjustResources").addEventListener("submit",function(){
		submitData("AdjustResources","AdjustResourcesProcessing");
	});
}

setTimeout(loadUserData, 1);