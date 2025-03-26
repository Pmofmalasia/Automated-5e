function chooseSpecialEffectNumber(){
	let SpecialEffectChoice = document.getElementById("SpecialEffects").value;
	let referenceElement = document.getElementById("rowSpecialEffects");

	if(SpecialEffectChoice == "None" || SpecialEffectChoice == "SameSubeffect"){
		deleteInterveningElements(referenceElement,document.getElementById("rowSubmit"));
	}
	else{

		referenceElement = createTableRow(referenceElement,"rowEffectNumber","<th><label for='EffectsNumber'>Number of Effects:</label></th><td><input type='number' id='EffectsNumber' name='EffectsNumber' min=1 value=1></td>");
	}
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterWeaponCreationTable').innerHTML = userdata;

	await createWeaponTableRows("rowWeaponName");
}

setTimeout(loadUserData, 1);