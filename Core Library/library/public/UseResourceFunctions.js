async function createUseResourceRows(){
	let isUseResource = document.getElementById("isUseResource").checked;
	let referenceElement = document.getElementById("rowIsUseResource");

	let endRow = document.getElementById("rowUseResourceEnd");
	if(endRow === null){
		if(isUseResource){
			endRow = referenceElement.nextElementSibling;
			createTableRow(referenceElement,"rowUseResourceEnd","<th colspan=2; class='section-end'><th>");
		}
	}
	else{
		endRow = endRow.nextElementSibling;
	}

	if(isUseResource){
		createMultiRowButtonsInput("UseResourceTier",referenceElement,"<th colspan='2' style='text-align:center'>Priority Tier #<span id='UseResourceTierSpan'>99</span></th>","Priority Tier",[],{SuppressAutoAdd:true});

		document.getElementById("AddUseResourceTierButton").addEventListener("click",function(){
			let tierNumber = Number(document.getElementById("UseResourceTierNumber").value);
			for(let i = 0; i<tierNumber; i++){
				document.getElementById("UseResourceTierSpan"+i).innerHTML = (i+1);
			}			
		});

		let ResourceTypes = "<option value='SpellSlot'>Spell Slot</option><option value='HitDice'>Hit Dice</option><option value='OtherFeature'>Other Feature's Resource</option>";

		if(checkEffectType() !== "Spell"){
			let featureData = JSON.parse(atob(document.getElementById("FeatureData").value));
			hasResource = (featureData.ResourceData !== undefined);

			if(hasResource){
				ResourceTypes = "<option value='ThisFeature'>This Feature's Resource</option>" + ResourceTypes;
			}
		}

		let allFeatures = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(["sb.Abilities"])});
		allFeatures = await allFeatures.json();
		
		let allFeats = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(["sb.Feats"])});
		allFeats = await allFeats.json();
		
		let allBackgrounds = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(["sb.Backgrounds"])});
		allBackgrounds = await allBackgrounds.json();
		
		let allObjects = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(["sb.Objects"])});
		allObjects = await allObjects.json();

		combinedFeatures = allFeatures.concat(allFeats,allObjects,allBackgrounds);

		let allResourceFeatures = [];
		let allResourceNames = [];
		for(let feature of combinedFeatures){
			if(feature.ResourceData !== undefined){
				let thisFeatureResources = feature.ResourceData.Resources;

				let thisFeatureResourceNames = Object.keys(thisFeatureResources);
				for(let name of thisFeatureResourceNames){
					allResourceFeatures.push(feature);
					allResourceNames.push(thisFeatureResources[name].DisplayName);
				}
			}
		}

		document.getElementById("AddUseResourceTierButton").addEventListener("click",function(){
			let tierNumber = Number(document.getElementById("UseResourceTierNumber").value);
			let i = tierNumber - 1;

			let listeners = [{
				elementID:"UseResourceType"+i,
				listener:"change",
				functionName:"createUseResourceTypeRows",
				functionArgs:[i,allResourceNames,allResourceFeatures]
			}];

			let thisReferenceElement = document.getElementById("rowUseResourceTier"+i);
			createMultiRowButtonsInput("UseResourceType"+i,thisReferenceElement,"<th><label for='UseResourceType"+i+"'>Type of Resource:</label></th><td><select id='UseResourceType"+i+"' name='UseResourceType"+i+"'>"+ResourceTypes+"</select></td>","Resource Option",listeners);

			document.getElementById("UseResourceType"+i+0).dispatchEvent(new Event("change"));
		});

		document.getElementById("AddUseResourceTierButton").dispatchEvent(new Event("click"));

		//Add Resource Type selection as only row for second level of multi-button input, then all the other stuff is based on listeners from selecting type.

	}
	else{
		deleteInterveningElements(referenceElement,endRow);
	}
}

function createUseResourceTypeRows(j,otherArgs){
	let i = otherArgs[0];
	let resourceList = otherArgs[1];
	let featureList = otherArgs[2];

	let choice = document.getElementById("UseResourceType"+i+j).value;
	let referenceElement = document.getElementById("rowUseResourceType"+i+j);

	let endRow = document.getElementById("rowUseResourceTypeEnd"+i+j);
	if(endRow === null){
		endRow = referenceElement.nextElementSibling;
	}
	else{
		endRow = endRow.nextElementSibling;
	}

	deleteInterveningElements(referenceElement,endRow);

	createTableRow(referenceElement,"rowUseResourceTypeEnd"+i+j,"<th colspan=2></th>");

	function addFeatureResourceGeneralDetails(ij){
		let referenceElement = document.getElementById("rowUseFeatureResource"+ij);
		
		referenceElement = createTableRow(referenceElement,"rowUseFeatureResourceRange"+ij,"<th><label for='UseFeatureResourceMinimum"+ij+"'>Range of Amount Spent:</label></th><td><input type='number' id='UseFeatureResourceMinimum"+ij+"' name='UseFeatureResourceMinimum"+ij+"' min=1 value=1 class='small-number'> - <input type='number' id='UseFeatureResourceMaximum"+ij+"' name='UseFeatureResourceMaximum"+ij+"' min=1 value=1 class='small-number'><input type='checkbox' id='isNoFeatureResourceUseLimit"+ij+"' name='isNoFeatureResourceUseLimit"+ij+"'> No Limit</td>");

		document.getElementById("isNoFeatureResourceUseLimit"+ij).addEventListener("change",function(){
			toggleFieldEnabled("UseFeatureResourceMaximum"+ij,"isNoFeatureResourceUseLimit"+ij);
		});
		
		referenceElement = createTableRow(referenceElement,"rowUseFeatureResourceIncrements"+ij,"<th><label for='UseFeatureResourceIncrements"+ij+"'>Spend Resource in Increments of:</label></th><td><input type='number' id='UseFeatureResourceIncrements"+ij+"' name='UseFeatureResourceIncrements"+ij+"' min=1 value=1 class='small-number'></td>");
	}

	function createFeatureResourceSpecificDetails(){
		//TODO: Resource - Need ability to do time resource via input (here). Needs a way of pulling the resource info from the chosen resource, which may not exist yet? Might be able to indexOf input and get from featurelist.
	}

	if(choice === "SpellSlot"){
		referenceElement = createTableRow(referenceElement,"rowUseSpellSlotRange"+i+j,"<th><label for='UseSpellSlotMinimum"+i+j+"'>Usable Spell Slot Levels:</label></th><td><input type='number' id='UseSpellSlotMinimum"+i+j+"' name='UseSpellSlotMinimum"+i+j+"' min=1 value=1 class='small-number'> - <input type='number' id='UseSpellSlotMaximum"+i+j+"' name='UseSpellSlotMaximum"+i+j+"' min=1 value=9 class='small-number' disabled><input type='checkbox' id='isNoSpellSlotUseLimit"+i+j+"' name='isNoSpellSlotUseLimit"+i+j+"' checked> No Limit</td>");

		document.getElementById("isNoSpellSlotUseLimit"+i+j).addEventListener("change",function(){
			toggleFieldEnabled("UseSpellSlotMaximum"+i+j,"isNoSpellSlotUseLimit"+i+j);
		});
	}
	else if(choice === "HitDice"){
		referenceElement = createTableRow(referenceElement,"rowUseHitDiceRange"+i+j,"<th><label for='UseHitDiceMinimum"+i+j+"'>Number of Hit Dice Spent:</label></th><td><input type='number' id='UseHitDiceMinimum"+i+j+"' name='UseHitDiceMinimum"+i+j+"' min=1 value=1 class='small-number'> - <input type='number' id='UseHitDiceMaximum"+i+j+"' name='UseHitDiceMaximum"+i+j+"' min=1 value=1 class='small-number' disabled><input type='checkbox' id='isNoHitDiceUseLimit"+i+j+"' name='isNoHitDiceUseLimit"+i+j+"' checked> No Limit</td>");

		document.getElementById("isNoHitDiceUseLimit"+i+j).addEventListener("change",function(){
			toggleFieldEnabled("UseHitDiceMaximum"+i+j,"isNoHitDiceUseLimit"+i+j);
		});

		referenceElement = createTableRow(referenceElement,"rowUseHitDiceIncrements"+i+j,"<th><label for='UseHitDiceIncrements"+i+j+"'>Spend Hit Dice in Increments of:</label></th><td><input type='number' id='UseHitDiceIncrements"+i+j+"' name='UseHitDiceIncrements"+i+j+"' min=1 value=1 class='small-number'></td>");
	}
	else if(choice === "OtherFeature"){
		referenceElement = createTableRow(referenceElement,"rowUseFeatureResource"+i+j,"<th><label for='UseFeatureResourceDisplayName"+i+j+"'>Resource Spent:</label></th><td class='autocomplete-table'><input type='text' id='UseFeatureResourceDisplayName"+i+j+"' name='UseFeatureResourceDisplayName"+i+j+"'><span id='ValidationSpanUseFeatureResourceDisplayName"+i+j+"'></span></td>");

		let autocompleteOptions = {
			validationPath:["ResourceData","Resources","@","DisplayName"]
		};
		autocomplete(document.getElementById("UseFeatureResourceDisplayName"+i+j),resourceList,featureList,autocompleteOptions);
		
		addFeatureResourceGeneralDetails(i+""+j);

		document.getElementById("UseFeatureResource"+i+j).addEventListener("change",function(){
			createFeatureResourceSpecificDetails(i+""+j);
		});
	}
	else if(choice === "ThisFeature"){
		let featureData = JSON.parse(atob(document.getElementById("FeatureData").value));
		let resourceData = featureData.ResourceData.Resources;
		let resourceNames = Object.keys(resourceData);

		if(resourceNames.length > 1){
			let nameOptions = "";
			for(let resource of resourceNames){
				nameOptions += "<option value='"+resource+">"+resourceData[resource].DisplayName+"</option>";
			}

			referenceElement = createTableRow(referenceElement,"rowUseFeatureResource"+i+j,"<th><label for='UseFeatureResource"+i+j+"'>Use Which Resource:</label></th><td><select id='UseFeatureResource"+i+j+"' name='UseFeatureResource"+i+j+"'>"+nameOptions+"</select></td>");
		}
		else{
			referenceElement = createTableRow(referenceElement,"rowUseFeatureResource"+i+j,"<th><input type='hidden' id='UseFeatureResource"+i+j+"' name='UseFeatureResource"+i+j+"' value='"+resourceNames[0]+"'></th><td></td>");

			referenceElement.setAttribute("hidden","");
		}
		
		addFeatureResourceGeneralDetails(i+""+j);

		document.getElementById("UseFeatureResource"+i+j).addEventListener("change",function(){
			createFeatureResourceSpecificDetails(i+""+j);
		});
	}
}