async function doEffect(ename) {
    let request = fetch("macro:ManageEffectChoice@lib:pm.a5e.Core", {method: "POST", body: btoa(JSON.stringify(ename))});
    let result = await request.json();
}

async function loadUserData() {
	let allEffects = await MTFunction("data.getData",["addon:","pm.a5e.core","gd.Effects"]);

	document.getElementById("effectTable").innerHTML = "<tr id='rowEffectManagementHeader'><th>Origin</th><th>Target(s)</th><th>Status</th><th colspan=3>How to Resolve</th></tr>";

	let referenceElement = document.getElementById("rowEffectManagementHeader");
	for(let effect of allEffects){
		if(effect.ToResolve === undefined || effect.ToResolve === "undefined"){
			continue;
		}

		let ParentSubeffect = effect.ParentSubeffect;
		if(ParentSubeffect !== undefined){
			let hasCurrentParent = false;
			for(let otherEffect of allEffects){
				if(otherEffect.ID === ParentSubeffect){
					hasCurrentParent = true;
					break;
				}
			}

			if(hasCurrentParent){
				continue;
			}
		}

		let thisEffectID = effect.ID;
		let displayInfo = await fetch("macro:pm.a5e.GenerateEffectDisplay@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(effect)});
		displayInfo = await displayInfo.json();

		referenceElement = createTableRow(referenceElement,"rowEffect"+thisEffectID,"<td>"+displayInfo.ParentTokenName+"</td><td>"+displayInfo.TargetList+"</td><td>"+displayInfo.StatusDisplay+"</td><td><input type='button' id='buttonResolveNoMod"+thisEffectID+"' value='Resolve'></td><td><input type='button' id='buttonResolveMod"+thisEffectID+"' value='+ Modify'></td><td><input type='button' id='buttonRemove"+thisEffectID+"' value='Remove'></td>");

		document.getElementById("buttonResolveNoMod"+thisEffectID).addEventListener("click",function(){
			doEffect({
				Effect:thisEffectID,
				DisplayName:displayInfo.EffectDisplay,
				ResolveHow:"NoMod"
			});
		});

		document.getElementById("buttonResolveMod"+thisEffectID).addEventListener("click",function(){
			doEffect({
				Effect:thisEffectID,
				DisplayName:displayInfo.EffectDisplay,
				ResolveHow:"Mods"
			});
		});

		document.getElementById("buttonRemove"+thisEffectID).addEventListener("click",function(){
			doEffect({
				Effect:thisEffectID,
				DisplayName:displayInfo.EffectDisplay,
				ResolveHow:"Remove"
			});
		});
	}
}
setTimeout(loadUserData, 1);