async function currentEquipment(){
	for(let i; i<document.getElementById("LimbNumber").value; i++){
		document.getElementById("Limb"+i+"Choice").value = document.getElementById("Limb"+i+"Choice").value;
	}

	for(let i; i<document.getElementById("AttuneNumber").value; i++){
		document.getElementById("AttuneChoice"+i).value = document.getElementById("AttuneChoice"+i).value;
	}
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('EquipItemTable').innerHTML = userdata;
	currentEquipment();
}

setTimeout(loadUserData, 1);