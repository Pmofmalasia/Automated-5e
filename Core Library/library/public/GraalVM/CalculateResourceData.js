function calculateResourceDataMTScript(feature,ParentTokenID,options){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	if(typeof options === "string"){
		options = JSON.parse(options);
	}

	if(typeof feature === "string"){
		feature = JSON.parse(feature);
	}

	let returnData = calculateResourceData(feature,ParentToken,options);

	return JSON.stringify(returnData);
}

function calculateResourceData(feature,ParentToken,options){
	let specificResource;
	if(options !== undefined){
		specificResource = options.resource;
	}
	let finalResourceData = {};

	let featureResourceData = feature.ResourceData;
	if(featureResourceData === undefined){
		//Legacy code for pre-core feature input rework
		let rawMaxResource = feature.MaxResource;
		if(!isNaN(rawMaxResource)){
			finalResourceData[feature.Name] = {
				MaxResource: rawMaxResource
			};
		}
		else if(typeof rawMaxResource === "string"){
			MTScript.setVariable("tempResource",MTScript.execMacro(`[h:switchToken("${ParentToken.getId()}")]${rawMaxResource}`));
			let tempMaxResource = MTScript.evalMacro("[r,if(json.type(tempResource) == 'UNKNOWN'),CODE:{[r:json.set('','junkKey',tempResource)]};{[r:tempResource]}]");
			tempMaxResource = JSON.parse(tempMaxResource);

			if(tempMaxResource.junkKey !== undefined){
				finalResourceData[feature.Name] = {
					MaxResource:tempMaxResource.junkKey
				}
			}
			else{
				let resourceNames = Object.keys(tempMaxResource);
				for(let name of resourceNames){
					finalResourceData[name] = {
						MaxResource:tempMaxResource[name]
					};
				}
			}
		}

		let displayNameData = feature.ResourceDisplayName;
		if(displayNameData === undefined || displayNameData === ""){
			finalResourceData[feature.Name].DisplayName = feature.DisplayName;
		}
		else if(typeof displayNameData === "string"){
				finalResourceData[feature.Name].DisplayName = displayNameData;
		}
		else{
			let resourceNames = Object.keys(finalResourceData);
			for(let name of resourceNames){
				finalResourceData[name].DisplayName = displayNameData[name];
			}
		}

		if(feature.ResourceSpellLevel !== undefined){
			let spellLevel = MTScript.execMacro(`[h:switchToken("${ParentToken}")]${feature.ResourceSpellLevel}`);

			//Only legacy feature is Pact Magic, which only has one resource anyway - shortcut taken here.
			finalResourceData[feature.Name].SpellLevel = spellLevel;
		}

		if(specificResource !== undefined){
			return finalResourceData[specificResource];
		}
		else{
			return finalResourceData;
		}
	}
	else{
		function calcMaxResource(thisResource){
			let totalResource = 0;

			let minimumResource = thisResource.Minimum;
			if(minimumResource === undefined){
				minimumResource = 0;
			}

			let baseValue = thisResource.Base;
			if(baseValue === undefined){
				baseValue = 0;
			}

			let AttributeData = thisResource.Attribute;
			let AttributeBonus = 0;
			if(AttributeData !== undefined){
				//TODO: getProperty Bugfix
				let allAttributes = JSON.parse(ParentToken.getProperty("a5e.stat.Attributes"));
				let allAttributeModifiers = JSON.parse(MTScript.execMacro(`[r:getProperty("a5e.stat.AtrMods","${ParentToken.getId()}")]`));

				let AttributeModifier = AttributeData.Modifier;
				let AttributeModifierAmount = AttributeData.ModifierAmount;

				let whichAttribute = AttributeData.Attribute;
				let Attribute = "";
				if(whichAttribute === "PrimeStat"){
					let featurePrimeStat = feature.PrimeStat;
					if(typeof featurePrimeStat === "string"){
						Attribute = featurePrimeStat;
					}
					else{
						let possibleStats = featurePrimeStat.Stats;
						let chooseHow = featurePrimeStat.EvalMethod;
						if(chooseHow === "max" || chooseHow === "choose"){
							//TODO: Eventually, 'choose' should change to its own thing - when picking the primestat that can change at will is implemented. Also, need to be able to choose a stat if two are tied (not improtant for resources probably, but in general)

							let maxValue = 0;
							for(let stat of possibleStats){
								if(allAttributes[stat] > maxValue){
									Attribute = stat;
								}
							}
						}
						else if(chooseHow === "min"){
							let minValue = 100;
							for(let stat of possibleStats){
								if(allAttributes[stat] < minValue){
									Attribute = stat;
								}
							}
						}
					}
				}
				else{
					Attribute = whichAttribute;
				}

				let AttributeValue = allAttributeModifiers[Attribute];
				if(AttributeModifier === "Add"){
					AttributeBonus = AttributeValue + AttributeModifierAmount;
				}
				else if(AttributeModifier === "Multiply"){
					AttributeBonus = AttributeValue * AttributeModifierAmount;
				}
				else if(AttributeModifier === "Divide"){
					AttributeBonus = Math.floor(AttributeValue / AttributeModifierAmount);
				}
			}

			let ProficiencyData = thisResource.Proficiency;
			let ProficiencyBonus = 0;
			if(ProficiencyData !== undefined){
				//TODO: getProperty Bugfix
				let ProficiencyModifier = ProficiencyData.Modifier;
				let ProficiencyModifierAmount = ProficiencyData.ModifierAmount;
				let Proficiency = JSON.parse(MTScript.execMacro(`[r:getProperty("a5e.stat.Proficiency","${ParentToken.getId()}")]`));
				if(ProficiencyModifier === "Add"){
					ProficiencyBonus = Proficiency + ProficiencyModifierAmount;
				}
				else if(ProficiencyModifier === "Multiply"){
					ProficiencyBonus = Proficiency * ProficiencyModifierAmount;
				}
				else if(ProficiencyModifier === "Divide"){
					ProficiencyBonus = Math.floor(Proficiency / ProficiencyModifierAmount);
				}
			}

			let LevelData = thisResource.Level;
			let LevelBonus = 0;
			if(LevelData !== undefined){
				let LevelModifier = LevelData.Modifier;
				let LevelModifierAmount = LevelData.ModifierAmount;

				let resourceScalingHow = LevelData.ScalingLevels;
				let featureScalingHow = feature.OverallScaling;
				let rawLevel = ParentToken.getProperty("a5e.stat.Level");
				let Level = 0;
				if(resourceScalingHow !== undefined){
					for(let breakPoint of resourceScalingHow){
						if(rawLevel >= breakPoint.Level){
							LevelBonus = breakPoint.Amount;
						}
						else{
							break;
						}
					}
				}
				else{
					if(featureScalingHow !== undefined){
						for(let breakPoint of featureScalingHow){
							if(rawLevel >= breakPoint){
								Level++;
							}
							else{
								break;
							}
						}
					}
					else{
						Level = rawLevel;
					}

					if(LevelModifier === "Add"){
						LevelBonus = Level + LevelModifierAmount;
					}
					else if(LevelModifier === "Multiply"){
						LevelBonus = Level * LevelModifierAmount;
					}
					else if(LevelModifier === "Divide"){
						LevelBonus = Math.floor(Level / LevelModifierAmount);
					}
				}
			}

			let ClassLevelData = thisResource.ClassLevel;
			let ClassLevelBonus = 0;
			if(ClassLevelData !== undefined){
				let ClassLevelModifier = ClassLevelData.Modifier;
				let ClassLevelModifierAmount = ClassLevelData.ModifierAmount;

				let resourceScalingHow = ClassLevelData.ScalingLevels;
				let featureScalingHow = feature.OverallScaling;
				let rawClassLevel = feature.Level;
				let ClassLevel = 0;
				if(resourceScalingHow !== undefined){
					for(let breakPoint of resourceScalingHow){
						if(rawClassLevel >= breakPoint.Level){
							ClassLevelBonus = breakPoint.Amount;
						}
						else{
							break;
						}
					}
				}
				else{
					if(featureScalingHow !== undefined){
						for(let breakPoint of featureScalingHow){
							if(rawClassLevel >= breakPoint){
								ClassLevel++;
							}
							else{
								break;
							}
						}
					}
					else{
						ClassLevel = rawClassLevel;
					}

					if(ClassLevelModifier === "Add"){
						ClassLevelBonus = ClassLevel + ClassLevelModifierAmount;
					}
					else if(ClassLevelModifier === "Multiply"){
						ClassLevelBonus = ClassLevel * ClassLevelModifierAmount;
					}
					else if(ClassLevelModifier === "Divide"){
						ClassLevelBonus = Math.floor(ClassLevel / ClassLevelModifierAmount);
					}
				}
			}

			let ConditionTierData = thisResource.ConditionTier;
			let ConditionTierBonus = 0;
			if(ConditionTierData !== undefined){
				let ConditionTierModifier = ConditionTierData.Modifier;
				let ConditionTierModifierAmount = ConditionTierData.ModifierAmount;
				let ConditionTier = feature.Level;
				if(ConditionTierModifier === "Add"){
					ConditionTierBonus = ConditionTier + ConditionTierModifierAmount;
				}
				else if(ConditionTierModifier === "Multiply"){
					ConditionTierBonus = ConditionTier * ConditionTierModifierAmount;
				}
				else if(ConditionTierModifier === "Divide"){
					ConditionTierBonus = Math.floor(ConditionTier / ConditionTierModifierAmount);
				}
			}

			totalResource = Math.max(minimumResource,(baseValue + ProficiencyBonus + LevelBonus + ClassLevelBonus + ConditionTierBonus + AttributeBonus));

			let resourceFinal;
			if(thisResource.TimeUnits !== undefined){
				totalResource = timeInRounds(totalResource,thisResource.TimeUnits);
				resourceFinal = {
					Duration:totalResource,
					ExpendedThisUse:0,
					isActive:0,
					Type:"Time"
				};
			}
			else{
				resourceFinal = totalResource;
			}
			return resourceFinal;
		}

		function packageResourceData(resource){
			let thisResourceData = {};
			thisResourceData.MaxResource = calcMaxResource(resource);
			thisResourceData.DisplayName = resource.DisplayName;
			thisResourceData.Type = "";
			if(resource.SlotLevel !== undefined){
				thisResourceData.SlotLevel = calcResourceSlotLevel(resource.SlotLevel,feature);
				thisResourceData.Type = "SpellSlot";
			}

			if(resource.DieSize !== undefined){
				thisResourceData.DieSize = calcResourceDieSize(resource.DieSize,feature);
				thisResourceData.Type = "Die";
			}

			if(resource.TimeUnits !== undefined){
				//Note: Units are set as part of calcMaxResource.
				thisResourceData.Type = "Time";
			}

			return thisResourceData;
		}

		let rawMaxResource = featureResourceData.Resources;
		if(specificResource === undefined){
			for(let resource of Object.keys(rawMaxResource)){
				finalResourceData[resource] = packageResourceData(rawMaxResource[resource]);
			}		
		}
		else{
			finalResourceData = packageResourceData(rawMaxResource[specificResource]);
		}

		return finalResourceData;
	}

}

function calcResourceSlotLevel(slotLevelData,feature){
	let scalingHow = slotLevelData.Scaling;
	let baseLevel = slotLevelData.Level;
	let scalingAmount = slotLevelData.ScalingAmount;
	let levelMaximum = slotLevelData.Maximum;
	let scalingTier;

	if(typeof scalingHow === "object"){
		scalingTier = 1;
		for(let level of scalingHow){
			if(feature.Level >= level){
				scalingTier++;
			}
		}
	}
	else if(scalingHow === 0){
		return baseLevel;
	}
	else{
		scalingTier = getFeatureScalingLevel(feature);
	}

	let slotLevel = baseLevel + (scalingAmount * Math.floor(scalingTier/scalingHow));
	if(levelMaximum !== undefined){
		slotLevel = Math.max(levelMaximum,slotLevel);
	}
	return slotLevel;
}

function calcResourceDieSize(DieSizeData,feature){
	let scalingHow = DieSizeData.Scaling;
	let baseSize = DieSizeData.Size;
	let scalingAmount = DieSizeData.ScalingAmount;
	let scalingTier = getFeatureScalingLevel(feature);

	if(scalingHow === 0){
		return baseSize;
	}
	else{
		let dieSize = baseSize + (scalingAmount * Math.floor(scalingTier/scalingHow));
		return dieSize;
	}
}

function getMaximumResourcesMTScript(feature,ParentTokenID){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	if(typeof feature === "string"){
		feature = JSON.parse(feature);
	}

	let returnData = getMaximumResources(feature,ParentToken);

	return JSON.stringify(returnData);
}

function getMaximumResources(feature,ParentToken){
	let ResourceData = calculateResourceData(feature,ParentToken);

	let maxResources = {};
	for(let resource of Object.keys(ResourceData)){
		maxResources[resource] = ResourceData[resource].MaxResource;
	}

	return maxResources;
}

function getFeatureSpellSlotsMTScript(unifiedFeatures,ParentTokenID){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);

	if(typeof unifiedFeatures === "string"){
		unifiedFeatures = JSON.parse(unifiedFeatures);
	}

	let returnData = getFeatureSpellSlots(unifiedFeatures,ParentToken);

	return JSON.stringify(returnData);
}

function getFeatureSpellSlots(unifiedFeatures,ParentToken){
	let featureSpellSlots = [];
	for(let feature of unifiedFeatures){
		if(feature.ResourceData === undefined){
			continue;
		}

		for(let resourceName of Object.keys(feature.ResourceData.Resources)){
			let resource = feature.ResourceData.Resources[resourceName];
			if(resource.SlotLevel !== undefined){
				let thisResourceData = calculateResourceData(feature,ParentToken,{resource:resourceName});

				thisResourceData.Identifier = feature;
				thisResourceData.CurrentResource = feature.Resource[resourceName];
				thisResourceData.Resource = resourceName;

				featureSpellSlots.push(thisResourceData);				
			}
		}
	}

	return featureSpellSlots;
}

function getResourceDieSizeMTScript(feature,ParentTokenID){
	
}

function getResourceDieSize(feature,ParentToken){
	
}

MTScript.registerMacro("a5e.CalculateResourceData",calculateResourceDataMTScript);
MTScript.registerMacro("a5e.GetMaximumResources",getMaximumResourcesMTScript);
MTScript.registerMacro("a5e.GetFeatureSpellSlots",getFeatureSpellSlotsMTScript);
MTScript.registerMacro("a5e.GetResourceDieSize",getResourceDieSizeMTScript);