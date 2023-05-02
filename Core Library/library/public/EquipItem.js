async function currentEquipment(){
	for(let i; i<document.getElementById("LimbNumber").value; i++){
		let thisLimbHeldItem = '';
		document.getElementById("Limb"+i+"Choice").value = thisLimbHeldItem;
	}

	for(let i; i<document.getElementById("AttuneNumber").value; i++){
		let thisAttunementSlot = '';
		document.getElementById("AttuneChoice"+i).value = thisLimbHeldItem;
	}
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('EquipItemTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);