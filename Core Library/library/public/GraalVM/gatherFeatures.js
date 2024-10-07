function gatherFeatures(ParentToken,options){
	let includeAuras;
	let ignoreRequirePassive = false;
	if(options === undefined){
		includeAuras = undefined;
		ignoreRequirePassive = false;
	}
	else{
		includeAuras = options.includeAuras;
		ignoreRequirePassive = options.ignoreRequirePassive;
		if(ignoreRequirePassive === undefined){
			ignoreRequirePassive = false;
		}
	}

	function gatherFeatureType(features,type,isRequirePassive){
		finalFeatures = [];

		if(ignoreRequirePassive){
			isRequirePassive = false;
		}

		for(let feature of features){
			if(feature.IsActive > 0){
				feature.AbilityType = type;

				if((isRequirePassive && feature.isPassiveFunction == 1) || !isRequirePassive){
					if(includeAuras === undefined){
						finalFeatures.push(feature);
					}
					else if(includeAuras && finalFeatures.Aura !== undefined){
						finalFeatures.push(feature);
					}
					else if(!includeAuras && finalFeatures.Aura === undefined){
						finalFeatures.push(feature);
					}
				}
			}
		}
		return finalFeatures;
	}

	function gatherFeaturesThisToken(ParentToken){
		let unifiedFeatures = ParentToken.getProperty("a5e.stat.AllFeatures");
		if(unifiedFeatures === "null"){
			unifiedFeatures = "[]";
		}
		gatherFeatureType(JSON.parse(unifiedFeatures),"Feature",false);
		
		let unifiedConditions = ParentToken.getProperty("a5e.stat.ConditionList");
		if(unifiedConditions === "null"){
			unifiedConditions = "[]";
		}
		gatherFeatureType(JSON.parse(unifiedConditions),"Condition",false);

		function mergeTieredFeatures(features){
			let finalFeatures = [];
			for(let feature of features){
				if(feature.HasTiers == 1){
					let totalTier = 0;
					for(let i = features.length -1; i >= 0; --i){
						let equivalentTest = (features[i].Name === feature.Name && features[i]["Class"] === feature['Class'] && features[i].Subclass === feature.Subclass);

						if(equivalentTest){
							if(feature.MultiFeature == 1){
								totalTier += features[i].Level;
							}
							else{
								totalTier = Math.max(totalTier,features[i].Level);
							}
							features.splice(i,1);
						}
					}
					feature.Level = totalTier;
				}
				finalFeatures.push(feature);
			}
			return finalFeatures;
		}

		unifiedConditions = mergeTieredFeatures(unifiedConditions);
		
		let inventory = ParentToken.getProperty("a5e.stat.Inventory");
		if(inventory === "null"){
			inventory = "[]";
		}
		gatherFeatureType(JSON.parse(inventory),"Condition",true);

		let tempItemConditions = inventory.filter(function(item){
			return (item.ItemConditions !== undefined || item.ItemConditions !== "");
		});
		let itemConditions = [];
		for(let item of tempItemConditions){
			itemConditions.concat(item.ItemConditions);
		}
		let unifiedItemConditions = gatherFeatureType(itemConditions,"ItemCondition",false);

		return unifiedFeatures.concat(unifiedConditions).concat(unifiedItems).concat(unifiedItemConditions);
	}

	let thisTokenFeatures = gatherFeaturesThisToken(ParentToken,false);
	let AuraTokens = JSON.parse(MTScript.execMacro('[r:getTokens("json",json.set("","light",json.set("","category","A5E_Auras")))]'));

	for(let tokenID of AuraTokens){
		let token = MapTool.tokens.getTokenByID(tokenID);

		let tokenAuras = gatherFeaturesThisToken(token,true);
		for(let auraFeature of tokenAuras){
			let auraData = auraFeature.Aura;
			let validAuraTargets = JSON.parse(MTScript.execMacro(`[h:FilteredTargets = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken","${token}","List",json.append("","${ParentToken}"),"Range",${JSON.stringify(auraData.Range)},${JSON.stringify(auraData.TargetLimits.Creature)}"]`)).ValidTargets;

			if(validAuraTargets.indexOf(ParentToken.getId()) !== -1){
				auraFeature.AuraSource = tokenID;
				thisTokenFeatures.push(auraFeature);
			}
		}
	}

	return thisTokenFeatures;
}

function gatherFeaturesMTScript(ParentTokenID,options){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);
	let AllFeatures = gatherFeatures(ParentToken,options);
	return JSON.stringify(AllFeatures);
}

MTScript.registerMacro("a5e.GatherFeatures",gatherFeaturesMTScript);