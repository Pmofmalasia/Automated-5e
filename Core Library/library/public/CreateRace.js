async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('CreateRaceTable').innerHTML = userdata;

	document.getElementById("LanguageKnown0").value = "Common";
	document.getElementById("CreatureType").value = "Humanoid";
}

setTimeout(loadUserData, 1);