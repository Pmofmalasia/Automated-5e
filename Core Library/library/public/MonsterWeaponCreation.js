function chooseSpecialEffectNumber(){
	let SpecialEffectChoice = document.getElementById("SpecialEffects").value;

	if(SpecialEffectChoice == "None" || SpecialEffectChoice == "SameSubeffect"){
		clearUnusedTable("MonsterWeaponCreationTable","rowSpecialEffects","rowSubmit");
	}
	else{
		let nextRowIndex = document.getElementById("rowSpecialEffects").rowIndex;

		addTableRow("MonsterWeaponCreationTable",nextRowIndex,"rowEffectNumber","<th><label for='EffectNumber'>Different Effects:</label></th><td><input type='text' id='EffectNumber' name='EffectNumber'></td>");
		nextRowIndex++;

		addTableRow("MonsterWeaponCreationTable",nextRowIndex,"rowSubeffectNumber","<th><label for='SubeffectNumber'>Different Subeffects:</label></th><td><input type='text' id='SubeffectNumber' name='SubeffectNumber'></td>");
		nextRowIndex++;
	}
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterWeaponCreationTable').innerHTML = userdata;

	await createWeaponTableRows("MonsterWeaponCreationTable","rowWeaponName");
}

setTimeout(loadUserData, 1);