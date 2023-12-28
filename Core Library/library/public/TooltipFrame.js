async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	document.body.innerHTML = userdata;
}

setTimeout(loadUserData, 1);