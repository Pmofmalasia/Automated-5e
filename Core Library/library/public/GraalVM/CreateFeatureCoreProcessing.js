function coreFeatureProcessing(CoreFeatureData){
	if(typeof CoreFeatureData === "string"){
		CoreFeatureData = JSON.parse(CoreFeatureData);
	}
	let FeatureData = CoreFeatureData.Feature;

	let featureScalingType = FeatureData.FeatureTierType;
	if(featureScalingType === "consistent"){
		FeatureData.OverallScaling = "Consistent";
	}
	else if(featureScalingType === "inconsistent"){
		let breakPointNum = FeatureData.FeatureTierLevelNumber;
		let breakPoints = [];
		for(let i=0; i<breakPointNum; i++){
			breakPoints.push(FeatureData["FeatureTierLevelSeparator"+i]);
		}
		breakPoints.sort((a,b) => a - b);

		FeatureData.OverallScaling = breakPoints;
	}

	let resourceData = resourceProcessing(CoreFeatureData,FeatureData);
	if(resourceData.FeatureUpdates !== undefined){
		FeatureData.FeatureUpdates = resourceData.FeatureUpdates;
		delete resourceData.FeatureUpdates;
	}
	FeatureData.ResourceData = resourceData;

	if(CoreFeatureData.HasActiveEffects == 1){
		FeatureData.ActiveEffects = activeEffectsProcessing(CoreFeatureData);
	}
	return JSON.stringify(FeatureData);
}

function activeEffectsProcessing(inputData){
	let ActiveEffectsData = {};
	ActiveEffectsData.EffectsNumber = inputData.ActiveEffectsNumber;

	if(inputData.ActiveEffectsNumber === 1){
		return ActiveEffectsData;
	}

	let EffectChoiceMethod = inputData.EffectChoiceMethod;
	ActiveEffectsData.Method = EffectChoiceMethod;

	if(EffectChoiceMethod === "Choice"){

	}
	else if(EffectChoiceMethod === "Random"){
		
	}
	else if(EffectChoiceMethod === "Target"){
		
	}
	else if(EffectChoiceMethod === "StoredValue"){
		
	}
	else if(EffectChoiceMethod === "OutsideRoll"){
		
	}
	else if(EffectChoiceMethod === "ResourceType"){
		
	}

	return ActiveEffectsData;
}

function resourceProcessing(CoreFeatureData,FeatureData){
	let allResourceData = {};
	let updateResourceData = {};
	let updateRestorationData = {};

	let resourceNumber = CoreFeatureData.ResourceNumber;
	if(resourceNumber === undefined){
		if(CoreFeatureData.isResources === "one"){
			resourceNumber = 1;
		}
		else{
			resourceNumber = 0;
		}
	}
	else{
		resourceNumber = Number(resourceNumber);
	}

	let ResourceMax = [];
	let SlotLevels = {};
	let DieSizes = {};

	function resourceRestorationMethodProcessing(i){
		if(i === undefined){
			i = "";
		}
	
		let restoreData = {};
		let restoreMethod = CoreFeatureData["ResourceRestoreMethod"+i];
		restoreData.Method = restoreMethod;
		if(restoreMethod === "Fixed"){
			restoreData.Amount = CoreFeatureData["RestoreAmount"+i];
		}
		else if(restoreMethod === "Rolled"){
			restoreData.DieNumber = CoreFeatureData["RestoreAmountDieNumber"+i];
			restoreData.DieSize = CoreFeatureData["RestoreAmountDieSize"+i];
			restoreData.Bonus = CoreFeatureData["RestoreAmountBonus"+i];
		}
		else if(restoreMethod === "Chance"){
			restoreData.DieNumber = CoreFeatureData["RestoreChanceDieNumber"+i];
			restoreData.DieSize = CoreFeatureData["RestoreChanceDieSize"+i];
			restoreData.Bonus = CoreFeatureData["RestoreChanceBonus"+i];
			restoreData.Target = CoreFeatureData["RestoreChanceTarget"+i];
		}
		else if(restoreMethod === "UpTo"){
			restoreData.Amount = CoreFeatureData["RestoreAmount"+i];
		}
		else if(restoreMethod === "Attribute"){
			restoreData.Attribute = CoreFeatureData["RestoreAmountAttribute"+i];
			restoreData.Multiplier = CoreFeatureData["RestoreAmountMultiplier"+i];
			restoreData.Bonus = CoreFeatureData["RestoreAmountBonus"+i];
		}
		else if(restoreMethod === "Proficiency"){
			restoreData.Multiplier = CoreFeatureData["RestoreAmountMultiplier"+i];
			restoreData.Bonus = CoreFeatureData["RestoreAmountBonus"+i];
		}

		return restoreData;
	}

	let restoreWhenOptions = ["ShortRest","LongRest","Dawn","Dusk","StartTurn","EndTurn","Initiative","Item"]
	let isIndividualRestoration = false;
	let individualRestorationData;
	let ResourceRestorationMethod = CoreFeatureData.ResourceRestoreMethod;
	if(ResourceRestorationMethod === undefined){
		isIndividualRestoration = true;
		individualRestorationData = [];
	}
	else{
		let RestorationData = resourceRestorationMethodProcessing();

		let resourceRestoration = {}
		for(let instance of restoreWhenOptions){
			if(CoreFeatureData["ResourceRestore"+instance] == 1){
				resourceRestoration[instance] = RestorationData;
			}
		}
		allResourceData.Restoration = resourceRestoration;
	}

	let ResourceDisplayNames = {};
	for(let i = 0; i < resourceNumber; i++){
		let thisResourceName;
		let thisResourceDisplayName;
		let thisResourceMax = {};
		if(CoreFeatureData.isResourceDisplayNameUseFeature0 !== undefined || CoreFeatureData["ResourceDisplayName"+i] === ""){
			thisResourceDisplayName = FeatureData.DisplayName;
			thisResourceName = FeatureData.Name;
			ResourceDisplayNames[thisResourceName] = thisResourceDisplayName;
		}
		else{
			thisResourceDisplayName = CoreFeatureData["ResourceDisplayName"+i];

			//TODO: BUGFIX: Change this to use the setProperty method if ever able to set Lib properties natively in GraalVM
			thisResourceName = MTScript.execMacro(`[r:pm.RemoveSpecial("${thisResourceDisplayName}")]`);
		}
		ResourceDisplayNames[thisResourceName] = thisResourceDisplayName;
		thisResourceMax.Name = thisResourceName;
		thisResourceMax.DisplayName = thisResourceDisplayName;

		let thisResourceMinimum = CoreFeatureData["ResourceAmountMinimum"+i];
		if(thisResourceMinimum !== undefined && thisResourceMinimum > 0){
			thisResourceMax.Minimum = thisResourceMinimum;
		}

		let thisResourceCalcType = CoreFeatureData["ResourceAmountType"+i];
		if(thisResourceCalcType == 1){
			thisResourceMax.Base = 1;
		}
		else if(thisResourceCalcType === "OtherNumber"){
			thisResourceMax.Base = CoreFeatureData["ResourceAmount"+i];
		}
		else if(thisResourceCalcType === "NonlinearClass" || thisResourceCalcType === "NonlinearLevel"){
			let NonlinearNum = Number(CoreFeatureData["NonlinearLevelResource"+i+"Number"]);
			let breakPoints = [];
			for(let j = 0; j < NonlinearNum; j++){
				let thisBreakPoint = {
					Level:CoreFeatureData["NonlinearLevelResourceLevel"+i+j],
					Amount:CoreFeatureData["NonlinearLevelResourceAmount"+i+j]
				};
				breakPoints.push(thisBreakPoint);
			}

			breakPoints = sortData(breakPoints,"Level");

			let resourceKey;
			if(thisResourceCalcType === "NonlinearClass"){
				resourceKey = "ClassLevel";
			}
			else if(thisResourceCalcType === "NonlinearLevel"){
				resourceKey = "Level";
			}

			thisResourceMax[resourceKey] = {
				ScalingLevels:breakPoints
			};
		}
		else if(thisResourceCalcType === "combo"){
			//not a thing yet
		}
		else{
			let resourceKey;
			
			if(thisResourceCalcType === "Attribute"){
				resourceKey = "Attribute";
				thisResourceMax.Attribute = {};
				thisResourceMax.Attribute.Attribute = CoreFeatureData["ResourceAmount"+i];
			}
			else if(thisResourceCalcType === "Proficiency"){
				resourceKey = "Proficiency";
			}
			else if(thisResourceCalcType === "Level"){
				resourceKey = "Level";
			}
			else if(thisResourceCalcType === "Class"){
				resourceKey = "ClassLevel";
			}
			else if(thisResourceCalcType === "Tier"){
				resourceKey = "ConditionTier";
			}

			let thisResourceAmountModifier = CoreFeatureData["ResourceAmountModifier"+i];
			thisResourceMax[resourceKey] = {};
			thisResourceMax[resourceKey].ModifierAmount = thisResourceAmountModifier;
			let thisModifierType = CoreFeatureData["ResourceAmountModifierType"+i];
			thisResourceMax[resourceKey].Modifier = thisModifierType;
		}

		//Die size and Slot level will need to be calculated via separate functions - different keys and different usage.
		let specialResourceType = CoreFeatureData["ResourceSpecialType"+i];
		if(specialResourceType === "Die"){
			let dieInfo = {};
			dieInfo.Size = CoreFeatureData["ResourceSpecialDieSize"+i];
			dieInfo.ScalingAmount = CoreFeatureData["ResourceSpecialScaling"+i];
			dieInfo.Scaling = CoreFeatureData["ResourceSpecialScalingHow"+i];
			if(resourceNumber > 1){
				DieSizes[thisResourceName] = dieInfo;
			}
			else{
				DieSizes = dieInfo;
			}
		}
		else if(specialResourceType === "SpellSlot"){
			let slotInfo = {};
			slotInfo.Level = CoreFeatureData["ResourceSpecialSlotLevel"+i];
			slotInfo.ScalingAmount = CoreFeatureData["ResourceSpecialScaling"+i];
			slotInfo.Scaling = CoreFeatureData["ResourceSpecialScalingHow"+i];
			if(resourceNumber > 1){
				SlotLevels[thisResourceName] = slotInfo;
			}
			else{
				SlotLevels = slotInfo;
			}
		}
		else if(specialResourceType === "Time"){
			thisResourceMax.TimeUnits = CoreFeatureData["ResourceTimeUnits"+i];
		}

		if(resourceNumber > 1){
			let thisResourceGainedLevel = CoreFeatureData["ResourceGainedLevel"+i];
			if(thisResourceGainedLevel === FeatureData.Level){
				ResourceMax.push(thisResourceMax);

				if(isIndividualRestoration){
					let thisResourceRestoration = resourceRestorationMethodProcessing(i);
					thisResourceRestoration.Name = thisResourceName;

					for(let instance of restoreWhenOptions){
						if(CoreFeatureData["ResourceRestore"+i+instance] == 1){
							if(individualRestorationData[instance] === undefined){
								individualRestorationData[instance] = [thisResourceRestoration];
							}
							else{
								individualRestorationData[instance].push(thisResourceRestoration);
							}
						}
					}
				}
			}
			else{
				let priorLevelResources = updateResourceData[thisResourceGainedLevel];
				if(priorLevelResources === undefined){
					priorLevelResources = {[thisResourceMax.Name]:thisResourceMax};
				}
				else{
					priorLevelResources[thisResourceMax.Name] = thisResourceMax;
				}
				updateResourceData[thisResourceGainedLevel] = priorLevelResources;

				if(isIndividualRestoration){
					let thisResourceRestoration = resourceRestorationMethodProcessing(i);
					thisResourceRestoration.Name = thisResourceName;

					let priorLevelRestoration = updateRestorationData[thisResourceGainedLevel];

					if(priorLevelRestoration === undefined){
						priorLevelRestoration = {};
						for(let instance of restoreWhenOptions){
							if(CoreFeatureData["ResourceRestore"+i+instance] == 1){
								priorLevelRestoration[instance] = [thisResourceRestoration];
							}
						}
					}
					else{
						for(let instance of restoreWhenOptions){
							if(CoreFeatureData["ResourceRestore"+i+instance] == 1){
								if(priorLevelRestoration[instance] === undefined){
									priorLevelRestoration[instance] = [thisResourceRestoration];
								}
								else{
									priorLevelRestoration[instance].push(thisResourceRestoration);
								}
							}
						}
					}
					updateRestorationData[thisResourceGainedLevel] = priorLevelRestoration;
				}
			}
		}
		else{
			ResourceMax = {[thisResourceMax.Name]:thisResourceMax};
		}
	}

	allResourceData.Resources = ResourceMax;

	if(isIndividualRestoration){
		allResourceData.Restoration = individualRestorationData;
	}

	if(!jsonIsEmpty(updateResourceData) || !jsonIsEmpty(updateRestorationData)){
		let FeatureUpdates = FeatureData.FeatureUpdates;
		if(FeatureUpdates === undefined){
			FeatureUpdates = {};
		}

		if(!jsonIsEmpty(updateResourceData)){
			let newResourceLevels = Object.keys(updateResourceData);
			let cumulativeResources = ResourceMax;

			for(let level of newResourceLevels){
				if(FeatureUpdates[level] === undefined){
					FeatureUpdates[level] = {ResourceData:{}};
				}

				cumulativeResources = cumulativeResources.concat(updateResourceData[level]);
				FeatureUpdates[level].ResourceData.Resources = cumulativeResources;
			}			
		}

		if(!jsonIsEmpty(updateRestorationData)){
			let newRestorationLevels = Object.keys(updateRestorationData);
			let cumulativeRestoration = individualRestorationData;

			for(let level of newRestorationLevels){
				if(FeatureUpdates[level] === undefined){
					FeatureUpdates[level] = {ResourceData:{}};
				}

				let thisLevelInstances = updateRestorationData[level];
				for(let instance of Object.keys(thisLevelInstances)){
					if(cumulativeRestoration[instance] === undefined){
						cumulativeRestoration[instance] = thisLevelInstances[instance];
					}
					else{
						cumulativeRestoration[instance].concat(thisLevelInstances[instance]);
					}
				}
				
				FeatureUpdates[level].ResourceData.Restoration = cumulativeRestoration;
			}			
		}

		allResourceData.FeatureUpdates = FeatureUpdates;
	}

	if(!jsonIsEmpty(SlotLevels)){
		allResourceData.SlotLevel = SlotLevels;
	}
	if(!jsonIsEmpty(DieSizes)){
		allResourceData.DieSize = DieSizes;
	}

	return allResourceData;
}

MTScript.registerMacro("ct.a5e.CreateFeatureCoreProcessing",coreFeatureProcessing);