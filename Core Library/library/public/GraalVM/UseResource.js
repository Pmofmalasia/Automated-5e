function useResource(resourceList,unifiedFeatures,ParentTokenID){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);
	let resourceOptions = [];
	if(typeof resourceList === "string"){
		resourceList = Array.from(JSON.parse(resourceList));
	}

	if(typeof unifiedFeatures === "string"){
		unifiedFeatures = Array.from(JSON.parse(unifiedFeatures));
	}
	//Note: resourceList structure is an array of arrays - a resourceTier is a set of priority for which resource gets used first, then any resources at that level are options to be used. If there is no resource at a tier, it moves on to the next tier.
	for(let resourceTier of resourceList){
		for(let resource of resourceTier){
			if(resource.Type === "SpellSlot"){
				let allValidSlots = {};

				let minimumLevel = resource.SpellLevelMin;
				if(minimumLevel === undefined){
					minimumLevel = 1;
				}
		
				let maximumLevel = resource.SpellLevelMax;
				if(maximumLevel === undefined){
					maximumLevel = 10;
				}
		
				let SharedSpellSlots = JSON.parse(ParentToken.getProperty("a5e.stat.SpellSlots"));
				let validSpellSlots = {};
				for(let i = minimumLevel; i < maximumLevel; i++){
					if(SharedSpellSlots[i] > 0){
						validSpellSlots[i] = SharedSpellSlots[i];
					}
				}

				if(!jsonisEmpty(validSpellSlots)){
					allValidSlots.SharedSpellSlots = validSpellSlots;
				}

				let featureSpellSlots = getFeatureSpellSlots(unifiedFeatures,ParentToken);
				if(!jsonisEmpty(featureSpellSlots)){
					let validFeatureSpellSlots = [];
					for(let spellResource of featureSpellSlots){
						if(spellResource.SlotLevel >= minimumLevel && spellResource.SlotLevel <= maximumLevel){
							validFeatureSpellSlots.push(spellResource);
						}
					}
					allValidSlots.FeatureSpellSlots = validFeatureSpellSlots;
				}

				if(!jsonisEmpty(allValidSlots)){
					resource.CurrentResource = allValidSlots;
					resourceOptions.push(resource);
				}
			}
			else if(resource.Type === "HitDice"){
				let allHitDice = {};
				let currentHitDice = JSON.parse(ParentToken.getProperty("a5e.stat.HitDice"));

				let amountNeeded = resource.ResourceUsed;
				if(amountNeeded === undefined){
					amountNeeded = 1;
				}

				let totalHitDice = 0;
				for(let dieSize of Object.keys(currentHitDice)){
					if(currentHitDice[dieSize] > 0){
						allHitDice[dieSize] = currentHitDice[dieSize];
					}

					totalHitDice += currentHitDice[dieSize];
				}

				if(totalHitDice >= amountNeeded){
					resource.CurrentResource = allHitDice;
					resourceOptions.push(resource);
				}
			}
			else{
				let amountNeeded = resource.ResourceUsed;

				if(resource.Type === "Time"){
					let isActivated = resource.Activate;

					if(isActivated == 1){
						if(amountNeeded === undefined){
							amountNeeded = 0;
						}

						let useIncrement = resource.Increment;
						if(useIncrement === undefined){
							useIncrement = 0;
						}

						amountNeeded = Math.max(amountNeeded,useIncrement,1);						
					}
					else{
						amountNeeded = 0;
					}
				}
				else if(amountNeeded === undefined){
					amountNeeded = 1;
				}

				let matchingResources = findValidFeatureResources(resource,unifiedFeatures,amountNeeded);
				resource.CurrentResource = matchingResources;
				resourceOptions.push(resource);
			}
		}

		if(resourceOptions.length > 0){
			break;
		}
	}

	return JSON.stringify(useResourceOptions(resourceOptions));
}

function useResourceOptions(resourceOptions){
	let resourceOptionsData = [];
	let resourceOptionsInput = [];
	let resourceSecondaryOptionsData = [];
	let resourceSecondaryOptionsInput = [];

	for(let resource of resourceOptions){
		let resourceUsedMax = resource.ResourceUsedMax;
		let resourceUsed = resource.ResourceUsed;
		let Increment = resource.Increment;
		let thisResourceSecondaryOptionsInput = [];
		let thisResourceSecondaryOptionsData = [];

		if(resource.Type === "SpellSlot"){
			resourceOptionsInput.push("Spell Slot");
			resourceOptionsData.push("SpellSlot");

			if(resource.CurrentResource.FeatureSpellSlots !== undefined){
				for(let resourceSpell of resource.CurrentResource.FeatureSpellSlots){
					thisResourceSecondaryOptionsInput.push(resourceSpell.DisplayName);
					resourceSpell.Type = "FeatureSpell";
					thisResourceSecondaryOptionsData.push(resourceSpell);
				}
			}

			let sharedSpellLevels = resource.CurrentResource.SharedSpellSlots;
			if(sharedSpellLevels !== undefined){
				for(let level of Object.keys(sharedSpellLevels)){
					thisResourceSecondaryOptionsInput.push("Level "+level);
					thisResourceSecondaryOptionsData.push({
						Type:"SharedSpell",
						SlotLevel:level
					});
				}
			}
		}
		else if(resource.Type === "HitDice"){
			resourceOptionsInput.push("Hit Dice");
			resourceOptionsData.push("HitDice");
			let hitDice = resource.CurrentResource;
			for(let dieSize of Object.keys(hitDice)){
				let thisHitDieData = {
					DieSize:dieSize,
					Minimum:resourceUsed,
					Maximum:Math.min(resourceUsedMax,hitDice[dieSize]),
					Increment:Increment
				};
				thisResourceSecondaryOptionsInput.push(thisHitDieData);
				thisResourceSecondaryOptionsData.push([]);
			}
		}
		else if(resource.Type === "Time"){
			let featureResources = resource.CurrentResource;
			let multiFeatureTest = (featureResources.length > 1);
			for(let feature of featureResources){
				let resourceIdentifier = resource.Identifier;
				let resourceKey = resourceIdentifier.Resource;
				if(resourceKey === undefined){
					resourceKey = feature.Name;
				}

				let resourceAmount = feature.Resource[resourceKey];
				let display = feature.ResourceData.Resources[resourceKey].DisplayName;
				if(multiFeatureTest){
					display += ": "+feature.Subclass+" "+feature["Class"];
				}
				let primaryData = {
					Feature:feature,
					Key:resourceKey,
					Activate:resource.Activate,
					Type:"Time",
				};

				if(resource.Activate == 1){
					display = "Activate "+display;
				}
				else{
					display = "Deactivate "+display;
					resourceAmount = resourceAmount.Duration;
				}

				let timeResourceParameters = {
					Minimum:resourceUsed,
					Increment:Increment,
					ExpendedThisUse:0
				};

				if(resource.Powering === undefined){
					timeResourceParameters.Identifier = "this";
				}
				else{
					timeResourceParameters.Identifier = resource.Powering;
				}

				primaryData.Parameters = timeResourceParameters;

				resourceOptionsInput.push(display);
				resourceOptionsData.push(primaryData);

				thisResourceSecondaryOptionsInput = {};

				//Basically serves no purpose here and for hit dice, but needed as a placeholder to make spell slots work. Can eventually be replaced when HTML5 inputs can be used (ha)
				thisResourceSecondaryOptionsData = {};
			}

			resourceSecondaryOptionsInput.push(thisResourceSecondaryOptionsInput);
			resourceSecondaryOptionsData.push(thisResourceSecondaryOptionsData);
		}
		else{
			let featureResources = resource.CurrentResource;
			let multiFeatureTest = (featureResources.length > 1);
			for(let feature of featureResources){
				let resourceIdentifier = resource.Identifier;
				let resourceKey = resourceIdentifier.Resource;
				if(resourceKey === undefined){
					resourceKey = feature.Name;
				}

				let resourceAmount = feature.Resource[resourceKey];
				let display = feature.ResourceData.Resources[resourceKey].DisplayName;
				if(multiFeatureTest){
					display += ": "+feature.Subclass+" "+feature["Class"];
				}
				let primaryData = {
					Feature:feature,
					Key:resourceKey,
					Type:"Feature"
				};

				resourceOptionsInput.push(display);
				resourceOptionsData.push(primaryData);

				let secondaryData = {
					Minimum:resourceUsed,
					Maximum:Math.min(resourceUsedMax,resourceAmount),
					Increment:Increment
				};
				thisResourceSecondaryOptionsInput = secondaryData;

				//Basically serves no purpose here and for hit dice, but needed as a placeholder to make spell slots work. Can eventually be replaced when HTML5 inputs can be used (ha)
				thisResourceSecondaryOptionsData = {};
			}

			resourceSecondaryOptionsInput.push(thisResourceSecondaryOptionsInput);
			resourceSecondaryOptionsData.push(thisResourceSecondaryOptionsData);
		}
	}

	let returnData = {
		Options:resourceOptionsInput,
		OptionsData:resourceOptionsData,
		SecondaryOptions:resourceSecondaryOptionsInput,
		SecondaryOptionsData:resourceSecondaryOptionsData
	};
	return returnData;
}

function expendResource(resources,ParentTokenID){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);
	if(typeof resources === "string"){
		resources = JSON.parse(resources);
	}
	let chatTable = [];
	let resourceUsed;
	let hitDiceUsed = [];
	for(let resource of resources){
		if(resource.Type === "Feature"){
			let feature = getFeatureProperty(resource.Feature,ParentToken);
			let resourceName = resource.Key;
			let newResourceAmount = Math.max(feature.Resource[resourceName] - resource.Amount,0);
			feature.Resource[resourceName] = newResourceAmount;
			setFeatureProperty(feature,ParentToken,["Resource"]);
			let resourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

			resourceUsed = {
				ResourceName:resourceName,
				ResourceFeature:resource.Feature,
				ResourceType:"Feature",
				Used:resource.Amount,
				Tier:resource.Tier
			};

			chatTable.push({
				ShowIfCondensed:1,
				Header:feature.ResourceData.Resources[resourceName].DisplayName+" Remaining",
				FullContents:"",
				RulesContents:newResourceAmount+" / "+resourceData.MaxResource,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}
		else if(resource.Type === "HitDice"){
			let currentHitDice = JSON.parse(ParentToken.getProperty("a5e.stat.HitDice"));
			let spentSize = resource.DieSize;
			currentHitDice[spentSize] = Math.max(currentHitDice[spentSize] - resource.Amount,0);
			ParentToken.setProperty("a5e.stat.HitDice",JSON.stringify(currentHitDice));

			for(let i = 0; i < resource.Amount; i++){
				hitDiceUsed.push(spentSize);
			}

			resourceUsed = {
				HitDice:hitDiceUsed,
				ResourceName:"Hit Dice",
				ResourceType:"Hit Dice",
				Used:resource.Amount,
			};

			chatTable.push({
				ShowIfCondensed:1,
				Header:"d"+spentSize+" Hit Dice Remaining",
				FullContents:"",
				RulesContents:currentHitDice[spentSize]+" / "+ParentToken.getProperty("a5e.stat.MaxHitDice"),
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}
		else if(resource.Type === "SharedSpell"){
			let currentSpellSlots = JSON.parse(ParentToken.getProperty("a5e.stat.SpellSlots"));
			let spentLevel = resource.SlotLevel;
			currentSpellSlots[spentLevel] = Math.max(currentSpellSlots[spentLevel] - 1,0);
			ParentToken.setProperty("a5e.stat.SpellSlots",JSON.stringify(currentSpellSlots));

			resourceUsed = {
				SpellLevel:spentLevel,
				ResourceName:"Spell Slot",
				ResourceType:"SpellSlot",
				Used:1,
			};

			chatTable.push({
				ShowIfCondensed:1,
				Header:"Spell Slots Remaining",
				FullContents:"",
				RulesContents:MTScript.execMacro(`[r:pm.SpellSlots("${ParentTokenID}")]`),
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}
		else if(resource.Type === "FeatureSpell"){
			//TODO: Resource - ability for spells to expend more than one resource at once

			let feature = getFeatureProperty(resource.Identifier,ParentToken);
			let resourceName = resource.Key;
			let newResourceAmount = Math.max(feature.Resource[resourceName] - 1,0);
			feature.Resource[resourceName] = newResourceAmount;
			setFeatureProperty(feature,ParentToken,["Resource"]);
			let resourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

			let spentLevel = resource.SlotLevel;

			resourceUsed = {
				SpellLevel:spentLevel,
				ResourceFeature:resource.Identifier,
				ResourceName:resource.DisplayName,
				ResourceType:"SpellSlot",
				Used:1
			};

			chatTable.push({
				ShowIfCondensed:1,
				Header:feature.ResourceData.Resources[resourceName].DisplayName+" Remaining",
				FullContents:"",
				RulesContents:newResourceAmount+" / "+resourceData.MaxResource,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}
		else if(resource.Type === "Time"){
			let feature = getFeatureProperty(resource.Feature,ParentToken);
			let resourceName = resource.Key;
			let isActivating = resource.Activate;
			let activationDisplay;

			let currentlyPowering = feature.Resource[resourceName].Powering;
			if(currentlyPowering === undefined){
				currentlyPowering = [];
			}

			//Note: This is for turning the resource itself on/off. Activation/deactivation of the associated feature is handled separately, as not every activation requires a resource. Outputs are therefore also handled separately.
			if(isActivating == 1){
				feature.Resource[resourceName].isActive = 1;

				let poweredFeatureData = resource.Parameters;
				currentlyPowering.push(poweredFeatureData);
				feature.Resource[resourceName].Powering = currentlyPowering;

				activationDisplay = "Toggled On";
			}
			else{
				deactivationData = deactivateFeatureResource(feature,resourceName,ParentToken);
				feature = deactivationData.feature;

				activationDisplay = "Toggled Off";
			}

			setFeatureProperty(feature,ParentToken,["Resource"]);

			let resourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

			resourceUsed = {
				ResourceName:resourceName,
				ResourceFeature:resource.Feature,
				ResourceType:"Time",
				Used:isActivating
			};

			chatTable.push({
				ShowIfCondensed:1,
				Header:"Time Resource: "+feature.ResourceData.Resources[resourceName].DisplayName,
				FullContents:"",
				RulesContents:activationDisplay,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}
	}

	return JSON.stringify({
		Table:chatTable,
		Data:resourceUsed
	});
}

function deactivateFeatureResource(feature,resourceName,ParentToken,specificPoweredFeature){
	let currentResource = feature.Resource[resourceName];
	let poweredFeatures = currentResource.Powering;
	let deactivatedFeatures = [];

	function deactivateSpecificFeature(specificFeature){
		let thisFeature;
		let extraExpended = 0;
		if(specificFeature.Identifier === "this"){
			thisFeature = feature;
		}
		else{
			thisFeature = getFeatureProperty(specificFeature.Identifier,ParentToken);
		}

		if(specificFeature.Minimum !== undefined && specificFeature.Minimum > specificFeature.ExpendedThisUse){
			extraExpended += specificFeature.Minimum - specificFeature.ExpendedThisUse;
			specificFeature.ExpendedThisUse = specificFeature.Minimum;
		}
		if(specificFeature.Increment !== undefined){
			let remainder = specificFeature.Increment % specificFeature.ExpendedThisUse;
			extraExpended += remainder;
			specificFeature.ExpendedThisUse += remainder;
		}

		thisFeature.IsActive = 0;
		setFeatureProperty(thisFeature,ParentToken,["IsActive"]);

		return {
			deactivatedFeature:thisFeature,
			extraDuration:extraExpended
		};
	}

	let extraExpended = 0;
	if(specificPoweredFeature === undefined){
		for(let poweredFeature of poweredFeatures){
			let deactivationData = deactivateSpecificFeature(poweredFeature);
			extraExpended += deactivationData.extraDuration;
			deactivatedFeatures.push(deactivationData.deactivatedFeature);
		}

		currentResource.Powering = [];
		currentResource.isActive = 0;
	}
	else{
		//TODO: Resource - Don't think there's any way for the UseResource function to hook into this (powering a feature other than the one associated with the resource), but don't think there's actually anything that needs it anyway.
		for(let i = poweredFeatures.length - 1; i >= 0; --i){
			let thisFeature = poweredFeatures[i];
			if(thisFeature.Identifier === "this"){
				let deactivationData = deactivateSpecificFeature(thisFeature);
				extraExpended += deactivationData.extraDuration;
				deactivatedFeatures.push(deactivationData.deactivatedFeature);

				delete poweredFeatures[i];
			}
			else if(compareFeatureIdentifier(thisFeature.Identifier,specificPoweredFeature)){
				let deactivationData = deactivateSpecificFeature(thisFeature);
				extraExpended += deactivationData.extraDuration;
				deactivatedFeatures.push(deactivationData.deactivatedFeature);
			}
		}

		currentResource.Powering = poweredFeatures;
		if(poweredFeatures.length === 0){
			currentResource.isActive = 0;
		}
	}

	currentResource.Duration = Math.max(0,currentResource.Duration - extraExpended);
	feature.Resource[resourceName] = currentResource;

	return {
		feature:feature,
		ended:deactivatedFeatures
	}
}

function useResourceTooltip(resourceList,unifiedFeatures,ParentTokenID){
	let chatTable = [];
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	if(typeof resourceList === "string"){
		resourceList = JSON.parse(resourceList);
	}

	if(typeof unifiedFeatures === "string"){
		unifiedFeatures = JSON.parse(unifiedFeatures);
	}

	for(let resourceTier of resourceList){
		for(let resource of resourceTier){
			if(resource.Type === "SpellSlot"){
				chatTable.push({
					ShowIfCondensed:1,
					Header:"Spell Slots",
					FullContents:"",
					RulesContents:MTScript.execMacro(`[r:pm.SpellSlots("${ParentTokenID}")]`),
					RollContents:"",
					DisplayOrder:["Rules","Roll","Full"]
				});
			}
			else if(resource.Type === "HitDice"){
				chatTable.push({
					ShowIfCondensed:1,
					Header:"Hit Dice",
					FullContents:"",
					RulesContents:MTScript.execMacro(`[r:a5e.HitDieDisplay("${ParentTokenID}")]`),
					RollContents:"",
					DisplayOrder:["Rules","Roll","Full"]
				});
			}
			else if(resource.Type === "Time"){
				let matchingResources = findValidFeatureResources(resource,unifiedFeatures);
				let resourceIdentifier = resource.Identifier;
				let resourceKey = resourceIdentifier.Resource;

				for(let feature of matchingResources){
					let resetKeyTest = false;
					if(resourceKey === undefined){
						resetKeyTest = true;
						resourceKey = feature.Name;
					}
			
					let thisResourceData = calculateResourceData(feature,ParentToken,resourceKey);
					let currentResource = feature.Resource[resourceKey];
					let currentResourceDisplay = MTScript.execMacro(`[r:pm.a5e.GenerateTimeDisplay(${currentResource})]`)

					chatTable.push({
						ShowIfCondensed:1,
						Header:"Time Resource: "+thisResourceData[resourceKey].DisplayName,
						FullContents:"",
						RulesContents:currentResourceDisplay,
						RollContents:"",
						DisplayOrder:["Rules","Roll","Full"]
					});

					if(resetKeyTest){
						resourceKey = undefined;
					}
				}
			}
			else{
				let matchingResources = findValidFeatureResources(resource,unifiedFeatures);
				let resourceIdentifier = resource.Identifier;
				let resourceKey = resourceIdentifier.Resource;

				for(let feature of matchingResources){
					//Allows for using feature resources when a resource key is not specified
					let resetKeyTest = false;
					if(resourceKey === undefined){
						resetKeyTest = true;
						resourceKey = feature.Name;
					}
			
					let thisResourceData = calculateResourceData(feature,ParentToken,resourceKey);
					let currentResource = feature.Resource[resourceKey];

					chatTable.push({
						ShowIfCondensed:1,
						Header:thisResourceData[resourceKey].DisplayName+" Remaining",
						FullContents:"",
						RulesContents:currentResource+" / "+thisResourceData[resourceKey].MaxResource,
						RollContents:"",
						DisplayOrder:["Rules","Roll","Full"]
					});

					if(resetKeyTest){
						resourceKey = undefined;
					}
				}
			}
		}

	}

	return JSON.stringify({
		Table:chatTable
	});
}

function findValidFeatureResources(resource,unifiedFeatures,amountNeeded){
	let resourceIdentifier = resource.Identifier;
	let resourceKey = resourceIdentifier.Resource;
	let resourceSourceType = resourceIdentifier.ResourceSource;
	if(resourceKey === undefined){
		resourceKey = resourceIdentifier.Name;
	}

	let matchingResources = [];
	for(let feature of unifiedFeatures){
		if((feature.AbilityType !== "Condition" && resourceSourceType === "Condition") || (feature.AbilityType === "Condition" && resourceSourceType !== "Condition")){
			continue;
		}

		if(typeof resourceIdentifier === "string"){
			if(feature.Name !== resourceIdentifier){
				continue;
			}
		}
		else if(resourceSourceType === "Item"){
			if(feature.ItemID === undefined){
				continue;
			}
			
			if(resourceIdentifier.ItemID === "this"){
				//TODO: Resource - After refactoring, need to implement this method (identifying item by using 'this' instead of requiring the ID)
				//TODO: Refactoring - see above
			}
			else{
				if(feature.ItemID !== resourceIdentifier.ItemID){
					continue;
				}
			}
		}
		else{
			if(resourceIdentifier.Subclass ===  undefined){
				resourceIdentifier.Subclass = "";
			}

			if(feature.Name !== resourceIdentifier.Name || feature["Class"] !== resourceIdentifier["Class"] || feature.Subclass !== resourceIdentifier.Subclass){
				continue;
			}
		}

		let allCurrentResources = feature.Resource;
		let currentResource = allCurrentResources[resourceKey];

		if(typeof currentResource !== "number"){
			if(currentResource.Type === "Time"){
				currentResource = currentResource.Duration;
			}			
		}

		if(amountNeeded === undefined){
			matchingResources.push(feature);
		}
		else if(currentResource >= amountNeeded){
			matchingResources.push(feature);
		}
	}

	return matchingResources;
}

function buildAdjustResourceInput(featuresWithResource,ParentTokenID){
	if(typeof featuresWithResource === "string"){
		featuresWithResource = Array.from(JSON.parse(featuresWithResource));
	}
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	let input = "";
	for(let feature of featuresWithResource){
		let identifier = feature.AbilityType+feature.Name+feature["Class"]+feature.Subclass;
		let resourceData = calculateResourceData(feature,ParentToken);
		let currentResource = feature.Resource;
		let resourceNames = Object.keys(resourceData);

		for(let resource of resourceNames){
			let thisResourceData = resourceData[resource];
			let resourceDisplayName = thisResourceData.DisplayName;
			let thisResourceMax = thisResourceData.MaxResource;

			let thisResourceInput = "";
			let thisResourceMaxDisplay;
			let resourceType = thisResourceData.Type;
			if(resourceType === "Time"){
				let maxTimeInUnits = roundsToTime(thisResourceMax.Duration);
				let largestTimeUnit = Object.keys(maxTimeInUnits)[0];
				
				let needsS = "";
				if(maxTimeInUnits[largestTimeUnit] > 1){
					needsS = "s";
				}
				thisResourceMaxDisplay = maxTimeInUnits[largestTimeUnit] + " " + largestTimeUnit + needsS;

				let currentTime = currentResource[resource].Duration;
				let currentTimeInUnits = roundsToTime(currentTime);

				let timeUnitsList = ["year","day","hour","minute","round"];
				timeUnitsList.splice(0,timeUnitsList.indexOf(largestTimeUnit));
				let firstLoop = true;
				for(let unit of timeUnitsList){
					if(!firstLoop){
						thisResourceInput += "<br>";
					}

					let currentTimeThisUnit = currentTimeInUnits[unit];
					if(currentTimeThisUnit === undefined){
						currentTimeThisUnit = 0;
					}

					//TODO: Resource - Could add a function to make sure total values don't exceed max (since split across multiple, max property won't do); but for now will just prevent going over max on processing side.

					thisResourceInput += "<input type='number' class='small-number' id='"+identifier+resource+unit+"' name='"+identifier+resource+unit+"' min=0 value="+currentTimeThisUnit+"> "+unit+"s";
					firstLoop = false;
				}
			}
			else{
				thisResourceInput = "<input type='number' class='small-number' id='"+identifier+resource+"' name='"+identifier+resource+"' min=0 max="+thisResourceMax+" value="+currentResource[resource]+">";
				thisResourceMaxDisplay = thisResourceMax;
			}

			let finalResourceDisplay;
			if(feature.DisplayName === resourceDisplayName){
				finalResourceDisplay = feature.DisplayName;
			}
			else{
				finalResourceDisplay = feature.DisplayName + " - " + resourceDisplayName;
			}

			input += "<tr id='row"+identifier+resource+"'><th><label for='"+identifier+resource+"'>"+finalResourceDisplay+":</label></th><td>"+thisResourceInput+" / "+thisResourceMaxDisplay+"</td>";
		}
	}

	return input;
}

function adjustResourcesProcessing(adjustedResourceData,featuresWithResource,ParentTokenID){
	if(typeof adjustedResourceData === "string"){
		adjustedResourceData = JSON.parse(adjustedResourceData);
	}
	if(typeof featuresWithResource === "string"){
		featuresWithResource = Array.from(JSON.parse(featuresWithResource));
	}
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	for(let feature of featuresWithResource){
		let identifier = feature.AbilityType+feature.Name+feature["Class"]+feature.Subclass;
		let resourceData = calculateResourceData(feature,ParentToken);
		let currentResource = feature.Resource;
		let resourceNames = Object.keys(resourceData);

		for(let resource of resourceNames){
			let thisResource = currentResource[resource];
			if(typeof thisResource === "object"){
				let timeUnitsList = ["year","day","hour","minute","round"];
				if(thisResource.Type === "Time"){
					let timeInUnits = {};
					for(let unit of timeUnitsList){
						let tempTime = adjustedResourceData[identifier+resource+unit];
						if(tempTime !== undefined){
							timeInUnits[unit] = tempTime;
						}
					}

					let adjustedTime = timeInRounds(timeInUnits);
					adjustedTime = Math.min(adjustedTime,resourceData[resource].MaxResource.Duration);

					currentResource[resource].Duration = adjustedTime;
				}
			}
			else{
				currentResource[resource] = adjustedResourceData[identifier+resource];
			}
		}

		feature.Resource = currentResource;
		setFeatureProperty(feature,ParentToken,["Resource"]);
	}
}

MTScript.registerMacro("a5e.UseResource",useResource);
MTScript.registerMacro("a5e.ExpendResource",expendResource);
MTScript.registerMacro("a5e.UseResourceTooltip",useResourceTooltip);
MTScript.registerMacro("a5e.BuildAdjustResourceInput",buildAdjustResourceInput);
MTScript.registerMacro("a5e.AdjustResourcesProcessing",adjustResourcesProcessing);