function advanceTimeTokens(tokens,timeAdvanced){
	let chatTable = [];

	function advanceFeatureDuration(feature){
		if(feature.Duration !== undefined){
			feature.Duration = advanceTime(feature.Duration,timeAdvanced);
		}

		return {
			feature:feature,
			expired:(feature.Duration === 0)
		};
	}

	function advanceTimeResource(feature){
		let expiredFeatures = [];
		if(feature.Resources !== undefined){
			for(let resource of Object.keys(feature.Resources)){
				let thisResourceData = feature.Resources[resource];
				if(thisResourceData.Type === "Time" && thisResourceData.isActive == 1){
					feature.Resources[resource].Duration = advanceTime(thisResourceData.Duration,timeAdvanced);

					if(feature.Resources[resource].Duration === 0){
						if(thisResourceData.Powering === "this"){
							feature.IsActive = 0;
							expiredFeatures.push(feature);
						}
						else{
							//find feature/item/etc. it is powering and deactivate that
						}
					}
				}
			}
		}

		return {
			feature:feature,
			expired:expiredFeatures
		};
	}




	//TOOD: Add "cooldown" functionality option for restoration of resources (e.g. can be used once every 6 hours = restore resource 6 hours after use)





	for(let token of tokens){
		let thisTokenNewTableLines = [];
		if(typeof token === "string"){
			token = MapTool.tokens.getTokenByID(token);
		}

		let deactivatedFeatures = [];
		let features = JSON.parse(token.getProperty("a5e.stat.AllFeatures"));
		if(features === "null"){
			features = [];
		}
		for(let i = 0; i < features.length; i++){
			if(features[i].IsActive > 0){
				let thisFeatureData = advanceFeatureDuration(features[i]);
				features[i] = thisFeatureData.feature;
				if(thisFeatureData.expired){
					features[i].IsActive = 0;
					deactivatedFeatures.push(features[i]);
				}				
			}

			thisFeatureData = advanceTimeResource(features[i]);
			features[i] = thisFeatureData.feature;
			deactivatedFeatures = deactivatedFeatures.concat(thisFeatureData.expired);
		}

		if(deactivatedFeatures.length > 0){
			let featuresDisplayList = [];
			for(let feature of deactivatedFeatures){
				featuresDisplayList.push(feature.DisplayName);
			}
			let RulesContents = createDisplayList(featuresDisplayList,"and",{VariableDelimiter:true})
			thisTokenNewTableLines.push({
				ShowIfCondensed:1,
				Header:"Deactivated Features",
				FullContents:"",
				RulesContents:RulesContents,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}

		let expiredConditions = [];
		let conditions = JSON.parse(token.getProperty("a5e.stat.ConditionGroups"));
		if(conditions === "null"){
			conditions = [];
		}
		for(let i = 0; i < conditions.length; i++){
			let thisConditionData = advanceFeatureDuration(conditions[i]);
			conditions[i] = thisConditionData.feature;
			if(thisConditionData.expired){
				expiredConditions.push(conditions[i].GroupID);
			}
		}

		if(expiredConditions.length > 0){
			MTScript.setVariable("js.tempExpiredConditions",JSON.stringify(expiredConditions));
			let endedConditionsData = JSON.parse(MTScript.evalMacro(`[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",js.tempExpiredConditions,"Target","${token.getId()}")][r:macro.return]`));
			thisTokenNewTableLines = thisTokenNewTableLines.concat(endedConditionsData.Table);
		}

		let deactivatedItems = [];
		let expiredItems = [];
		let expiredItemConditions = [];
		let items = JSON.parse(token.getProperty("a5e.stat.Inventory"));
		if(items === "null"){
			items = [];
		}
		for(let i = items.length - 1; i >= 0; --i){
			if(items[i].IsActive){
				let thisItemData = advanceFeatureDuration(items[i]);
				if(thisItemData.expired){
					if(items[i].isPerishable == 1){
						expiredItems.push(items[i]);
						delete items[i];

						continue;
					}
					else{
						items[i] = thisItemData.feature;
						items[i].IsActive = 0;
						deactivatedItems.push(items[i]);
					}
				}
				else{
					items[i] = thisItemData.feature;
				}
			}

			thisItemData = advanceTimeResource(items[i]);
			items[i] = thisItemData.feature;
			deactivatedItems = deactivatedItems.concat(thisItemData.expired);

			if(items[i].ItemConditions !== undefined){
				let thisItemConditions = items[i].ItemConditions;
				for(let j = 0; i < thisItemConditions.length; j++){
					let thisConditionData = advanceFeatureDuration(thisItemConditions[j]);
					thisItemConditions[j] = thisConditionData.feature;
					if(thisConditionData.expired){
						let endedItemConditionsData = JSON.parse(MTScript.evalMacro(`[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID","${thisItemConditions[j].GroupID}","Target",json.set("","ItemID",${items[i].ItemID},"HeldBy","${token.getId()}")][r:macro.return]`));
						expiredItemConditions = expiredItemConditions.concat(endedItemConditionsData.Removed);
					}
				}
				items[i].ItemConditions = thisItemConditions;
			}
		}

		if(deactivatedItems.length > 0){
			let itemsDisplayList = [];
			for(let item of deactivatedItems){
				itemsDisplayList.push(item.DisplayName);
			}
			let RulesContents = createDisplayList(itemsDisplayList,"and",{VariableDelimiter:true})
			thisTokenNewTableLines.push({
				ShowIfCondensed:1,
				Header:"Deactivated Items",
				FullContents:"",
				RulesContents:RulesContents,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}

		if(expiredItems.length > 0){
			let itemsDisplayList = [];
			for(let item of expiredItems){
				itemsDisplayList.push(item.DisplayName);
			}
			let RulesContents = createDisplayList(itemsDisplayList,"and",{VariableDelimiter:true})
			thisTokenNewTableLines.push({
				ShowIfCondensed:1,
				Header:"Expired Perishable Items",
				FullContents:"",
				RulesContents:RulesContents,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}

		if(expiredItemConditions.length > 0){
			let conditionsDisplayList = [];
			for(let condition of expiredItemConditions){
				conditionsDisplayList.push(condition.DisplayName);
			}
			let RulesContents = createDisplayList(conditionsDisplayList,"and",{VariableDelimiter:true})
			thisTokenNewTableLines.push({
				ShowIfCondensed:1,
				Header:"Removed Item Conditions",
				FullContents:"",
				RulesContents:RulesContents,
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}

		if(tokens.length > 1 && thisTokenNewTableLines.length > 0){
			chatTable.push({
				ShowIfCondensed:1,
				Header:token.getName(),
				FullContents:"",
				RulesContents:"",
				RollContents:"",
				DisplayOrder:["Rules","Roll","Full"]
			});
		}

		chatTable = chatTable.concat(thisTokenNewTableLines);
	}

	return JSON.stringify({
		Table:chatTable
	});
}

function advanceTimeTokensMTScript(tokens,timeAdvanced){
	if(typeof tokens === "string"){
		tokens = JSON.parse(tokens);
	}
	if(typeof timeAdvanced === "string"){
		timeAdvanced = JSON.parse(timeAdvanced);
	}

	let returnData = advanceTimeTokens(tokens,timeAdvanced);

	return returnData;
}

function advanceTime(currentTime,timeAdvanced){
	if(typeof currentTime === "object"){
		let timeInRounds = 0;

		if(currentTime.year !== undefined){
			timeInRounds += currentTime.year * 5256000;
		}
		if(currentTime.day !== undefined){
			timeInRounds += currentTime.day * 14400;
		}
		if(currentTime.hour !== undefined){
			timeInRounds += currentTime.hour * 600;
		}
		if(currentTime.minute !== undefined){
			timeInRounds += currentTime.minute * 10;
		}
		if(currentTime.round !== undefined){
			timeInRounds += currentTime.round;
		}

		currentTime = timeInRounds;
	}

	currentTime = Math.max(0,currentTime - timeAdvanced);

	return currentTime;
}

MTScript.registerMacro("a5e.AdvanceTimeTokens",advanceTimeTokensMTScript);