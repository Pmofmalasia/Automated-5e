async function setRaceDefaults(){
	let allFeatures = await fetch("macro:pm.a5e.GetCoreData@Lib:pm.a5e.Core", {method: "POST", body: "['sb.Abilities']"});
	allFeatures = await allFeatures.json();

	let allRaces = await fetch("macro:pm.GetRaces@Lib:pm.a5e.Core", {method: "POST", body: ""});
	allRaces = await allRaces.json();

	let allAttributes = await fetch("macro:pm.GetAttributes@Lib:pm.a5e.Core", {method: "POST", body: ""});
	allAttributes = await allAttributes.json();

	let raceChoice = document.getElementById("Race").value;
	let thisRaceData;
	for(let race of allRaces){
		if(race.Name === raceChoice){
			thisRaceData = race;
			break;
		}
	}
	let thisRaceTraits = thisRaceData.Traits;

	document.getElementById("CreatureType").value = thisRaceData.CreatureType;

	if(thisRaceData.RaceCountsAs != undefined){
		document.getElementById("RaceCountsAs").value = thisRaceData.RaceCountsAs;
	}

	document.getElementById("Lifespan").value = thisRaceTraits.CallLifespan.Base;

	if(thisRaceTraits.Size != undefined){
		document.getElementById("Size").value = thisRaceTraits.Size;
		document.getElementById("Size").dispatchEvent(new Event("change"));
	}
	else{
		document.getElementById("Size").value = "Choose";
		document.getElementById("Size").dispatchEvent(new Event("change"));
		
		let SizeOptionsArray = ["Tiny","Small","Medium","Large","Huge"];
		for(let size of SizeOptionsArray){
			if(thisRaceTraits.SizeOptions.includes(size)){
				document.getElementById("Size"+size).setAttribute("checked","");
			}
			else{
				document.getElementById("Size"+size).removeAttribute("checked","");
			}
		}
	}

	let attributeChoices = thisRaceTraits.AttributeOptions;
	let presetAttributes = thisRaceTraits.Attributes;
	if(attributeChoices != undefined && presetAttributes != undefined){
		document.getElementById("AttributeAllocationMethod").value = "Mixed";
	}
	else if(attributeChoices != undefined){
		if(attributeChoices === "FlexibleChoice"){
			document.getElementById("AttributeAllocationMethod").value = "FlexibleChoice";
		}
		else{
			document.getElementById("AttributeAllocationMethod").value = "Choice";
		}
	}
	else if(presetAttributes != undefined){
		document.getElementById("AttributeAllocationMethod").value = "Preset";
	}
	else{
		document.getElementById("AttributeAllocationMethod").value = "";
	}

	await createAttributeSelectionRows("rowSpeed");

	if(attributeChoices != undefined && attributeChoices != "FlexibleChoice"){
		for(let i = 0; i < attributeChoices.length; i++){
			if(i > 0){
				addAttributeChoiceRow();
			}

			document.getElementById("AttributeChoicePoints"+i).value = attributeChoices[i].Points;

			if(attributeChoices[i].AllAttributes === 1){
				document.getElementById("AttributeChoiceMethod"+i).value = "Any";
				await createAttributeChoiceInput(i);
			}
			else{
				if(attributeChoices[i].Inclusive === 1){
					document.getElementById("AttributeChoiceMethod"+i).value = "Inclusive";
				}
				else{
					document.getElementById("AttributeChoiceMethod"+i).value = "Exclusive";
				}
				await createAttributeChoiceInput(i);


				for(let attribute of allAttributes){
					if(attributeChoices[i][attribute.Name] == 1){
						document.getElementById("AttributeChoice"+i+attribute.Name).setAttribute("checked","");
					}
					else{
						document.getElementById("AttributeChoice"+i+attribute.Name).removeAttribute("checked","");
					}
				}
			}
		}
	}

	if(presetAttributes != undefined){
		for(let tempAttribute of allAttributes){
			let tempAtrSelection = document.getElementById("PresetAttributes"+tempAttribute.Name);
			if(presetAttributes[tempAttribute.Name] == undefined){
				tempAtrSelection.value = 0;
			}
			else{
				tempAtrSelection.value = presetAttributes[tempAttribute.Name];
			}
		}
	}

	if(thisRaceTraits.CallSpeed != undefined){
		let thisRaceSpeed = thisRaceTraits.CallSpeed;
		let speedTypes = ["","Burrow","Climb","Fly","Swim"];
		if(thisRaceSpeed.All != undefined){
			for(let speedType of speedTypes){
				document.getElementById("Base"+speedType+"Speed").value = thisRaceSpeed.All.Base;
			}
		}
		else{
			for(let speedType of speedTypes){
				let tempSpeedType = speedType;
				if(tempSpeedType == ""){
					tempSpeedType = "Speed";
				}
				if(thisRaceSpeed[tempSpeedType] == undefined){
					document.getElementById("Base"+speedType+"Speed").value = 0;
				}
				else{
					document.getElementById("Base"+speedType+"Speed").value = thisRaceSpeed[tempSpeedType].Base;
				}
			}
		}
	}

	if(thisRaceTraits.CallVision != undefined){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core",{method: "POST", body: "['sb.VisionTypes','Name','json']"});
		let AllVisionTypes = await request.json();
		let specialVisionTypes = [];
		for(let visionType of AllVisionTypes){
			if(visionType != "NormalSight"){
				specialVisionTypes.push(visionType);
			}
		}

		if(!document.getElementById("isVision").checked){
			document.getElementById("isVision").setAttribute("checked","");
			await createVisionRows("rowLanguageOptions");			
		}

		let anySpecialTest = false;
		let thisRaceVision = thisRaceTraits.CallVision;
		for(let visionType of specialVisionTypes){
			if(thisRaceVision[visionType] != undefined){
				anySpecialTest = true;
				if(thisRaceVision[visionType].Unlimited === 1){
					document.getElementById("isVision"+visionType+"Unlimited").setAttribute("checked","");
					document.getElementById("isVision"+visionType+"Unlimited").dispatchEvent(new Event("change"));
				}
				else{
					document.getElementById("isVision"+visionType+"Unlimited").removeAttribute("checked","");
					document.getElementById("isVision"+visionType+"Unlimited").dispatchEvent(new Event("change"));

					document.getElementById("Vision"+visionType+"Distance").value = thisRaceVision[visionType].Base;
				}
			}
			else{
				document.getElementById("isVision"+visionType+"Unlimited").removeAttribute("checked","");
				document.getElementById("isVision"+visionType+"Unlimited").dispatchEvent(new Event("change"));

				document.getElementById("Vision"+visionType+"Distance").value = 0;				
			}
		}

		if(anySpecialTest){
			if(thisRaceVision.NormalSight != undefined){
				if(thisRaceVision["NormalSight"].Unlimited === 1){
					document.getElementById("isVisionNormalSightUnlimited").setAttribute("checked","");
					document.getElementById("isVisionNormalSightUnlimited").dispatchEvent(new Event("change"));
				}
				else{
					document.getElementById("isVisionNormalSightUnlimited").removeAttribute("checked","");
					document.getElementById("isVisionNormalSightUnlimited").dispatchEvent(new Event("change"));

					document.getElementById("VisionNormalSightDistance").value = thisRaceVision.NormalSight.Base;
				}		
			}
			else{
				document.getElementById("isVisionNormalSightUnlimited").removeAttribute("checked","");
				document.getElementById("isVisionNormalSightUnlimited").dispatchEvent(new Event("change"));

				document.getElementById("VisionNormalSightDistance").value = 0;
			}
		}
		else{
			if(thisRaceVision.NormalSight != undefined){
				if(thisRaceVision.NormalSight.Unlimited === 1){
					document.getElementById("isVision").removeAttribute("checked","");
					document.getElementById("isVision").dispatchEvent(new Event("change"));
				}
				else{
					document.getElementById("isVisionNormalSightUnlimited").removeAttribute("checked","");
					document.getElementById("isVisionNormalSightUnlimited").dispatchEvent(new Event("change"));

					document.getElementById("VisionNormalSightDistance").value = thisRaceVision.NormalSight.Base;
				}		
			}
			else{
				document.getElementById("isVisionNormalSightUnlimited").removeAttribute("checked","");
				document.getElementById("isVisionNormalSightUnlimited").dispatchEvent(new Event("change"));

				document.getElementById("VisionNormalSightDistance").value = 0;
			}
		}
	}

	if(thisRaceTraits.LanguageOptions != undefined){
		document.getElementById("LanguageOptions").value = thisRaceTraits.LanguageOptions;
	}
	else{
		document.getElementById("LanguageOptions").value = 0;
	}

	finalLanguageKnownNumber = 1;
	if(thisRaceTraits.Languages != undefined){
		let selectedLanguages = Object.keys(thisRaceTraits.Languages);
		for(let i=0; i < selectedLanguages.length; i++){
			if(document.getElementById("rowLanguageKnown"+i) == null){
				await addLanguageKnownRow();
			}

			document.getElementById("LanguageKnown"+i).value = selectedLanguages[i];
		}

		finalLanguageKnownNumber = selectedLanguages.length;
	}

	while(Number(document.getElementById("LanguageKnownNumber").value) >= finalLanguageKnownNumber){
		removeLanguageKnownRow();
	}

	baseRaceFeatures = [];
	for(let feature of allFeatures){
		if(feature["Class"] === raceChoice && feature.Subclass === ""){
			baseRaceFeatures.push(feature);
		}
	}

	baseRaceFeatureOptions = createHTMLMultiselectOptions(baseRaceFeatures,"IgnoredBaseFeature");
	document.getElementById("IgnoredBaseFeatures").innerHTML = baseRaceFeatureOptions;

	if(thisRaceData.FeatChoice == 1){
		document.getElementById("FeatChoice").setAttribute("checked","");
	}
	else{
		document.getElementById("FeatChoice").removeAttribute("checked","");
	}
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('CreateRaceTable').innerHTML = userdata;

	document.getElementById("LanguageKnown0").value = "Common";
	document.getElementById("CreatureType").value = "Humanoid";

	if(document.getElementById("Race") != null){
		document.getElementById("Race").dispatchEvent(new Event("change"));
	}
}

setTimeout(loadUserData, 1);