function chooseSpecialEffectNumber(){
	let SpecialEffectChoice = document.getElementById("SpecialEffects").value;

	if(SpecialEffectChoice == "None" || SpecialEffectChoice == "SameSubeffect"){
		clearUnusedTable("MonsterWeaponCreationTable","rowSpecialEffects","rowSubmit");
	}
	else{
		let nextRowIndex = document.getElementById("rowSpecialEffects").rowIndex + 1;

		addTableRow("MonsterWeaponCreationTable",nextRowIndex,"rowEffectNumber","<th><label for='EffectsNumber'>Number of Effects:</label></th><td><input type='number' id='EffectsNumber' name='EffectsNumber' min=1 value=1></td>");
		nextRowIndex++;
	}
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterWeaponCreationTable').innerHTML = userdata;

	await createWeaponTableRows("MonsterWeaponCreationTable","rowWeaponName");
}

setTimeout(loadUserData, 1);