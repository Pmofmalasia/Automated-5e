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
					Increment:Increment
				};

				if(resource.Powering === undefined){
					timeResourceParameters.Powering = "this";
				}
				else{
					timeResourceParameters.Powering = resource.Powering;
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
	let resourceUsed = [];

	for(let resource of resources){
		if(resource.Type === "Feature"){
			let feature = getFeatureProperty(resource.Feature,ParentToken);
			let resourceName = resource.Key;
			let newResourceAmount = Math.max(feature.Resource[resourceName] - resource.Amount,0);
			feature.Resource[resourceName] = newResourceAmount;
			setFeatureProperty(feature,ParentToken,["Resource"]);
			let resourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

			resourceUsed.push({
				ResourceName:resourceName,
				ResourceFeature:resource.Feature,
				ResourceType:"Feature",
				Used:resource.Amount
			});

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

			resourceUsed.push({
				HitDieSize:spentSize,
				ResourceName:"Hit Dice",
				ResourceType:"Hit Dice",
				Used:resource.Amount,
			});

			chatTable.push({
				ShowIfCondensed:1,
				Header:spentSize+" Hit Dice Remaining",
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

			resourceUsed.push({
				SpellLevel:spentLevel,
				ResourceName:"Spell Slot",
				ResourceType:"SpellSlot",
				Used:1,
			});

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
			//TODO: MaxResourceLowPriority - ability for spells to expend more than one resource at once

			let feature = getFeatureProperty(resource.Identifier,ParentToken);
			let resourceName = resource.Resource;
			let newResourceAmount = Math.max(feature.Resource[resourceName] - 1,0);
			feature.Resource[resourceName] = newResourceAmount;
			setFeatureProperty(feature,ParentToken,["Resource"]);

			let spentLevel = resource.SlotLevel;

			resourceUsed.push({
				SpellLevel:spentLevel,
				ResourceFeature:resource.Identifier,
				ResourceName:resource.DisplayName,
				ResourceType:"SpellSlot",
				Used:1
			});

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

			if(isActivating == 1){
				feature.Resource[resourceName].isActive = 1;
				let poweredFeatureData = {
					Identifier:resource.Powering,
					Minimum:resource.Minimum,
					Increment:resource.Increment
				}
				feature.Resource[resourceName].Powering = currentlyPowering.push(poweredFeatureData);

				activationDisplay = "Toggled On";
			}
			else{
				//TODO: MaxResource - Make function for ending time resource and apply it to AdvanceTime also

				activationDisplay = "Toggled Off";
			}

			setFeatureProperty(feature,ParentToken,["Resource"]);
			let resourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

			resourceUsed.push({
				ResourceName:resourceName,
				ResourceFeature:resource.Feature,
				ResourceType:"Time",
				Used:isActivating
			});

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
	if(resourceKey === undefined){
		resourceKey = resourceIdentifier.Name;
	}

	let matchingResources = [];
	for(let feature of unifiedFeatures){
		if((feature.AbilityType !== "Condition" && resource.Type === "Condition") || (feature.AbilityType === "Condition" && resource.Type !== "Condition")){
			continue;
		}

		if(typeof resourceIdentifier === "string"){
			if(feature.Name !== resourceIdentifier){
				continue;
			}
		}
		else if(resource.Type === "Item"){
			if(feature.ItemID === undefined){
				continue;
			}
			
			if(resourceIdentifier.ItemID === "this"){
				//TODO: MaxResourceLowPriority - After refactoring, need to implement this method
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

		if(amountNeeded === undefined){
			matchingResources.push(feature);
		}
		else if(currentResource >= amountNeeded){
			matchingResources.push(feature);
		}
	}

	return matchingResources;
}

MTScript.registerMacro("a5e.UseResource",useResource);
MTScript.registerMacro("a5e.ExpendResource",expendResource);
MTScript.registerMacro("a5e.UseResourceTooltip",useResourceTooltip);