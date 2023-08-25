[h:AdvanceTimeTokens = json.get(macro.args,"Tokens")]
[h:TimeAdvancedData = json.get(macro.args,"TimeAdvanced")]

[h:abilityTable = "[]"]
[h,foreach(tempToken,AdvanceTimeTokens),CODE:{
	[h:switchToken(tempToken)]
	[h:thisTokenNewTableLines = "[]"]

	[h:"<!-- Advance time from conditions and remove any at 0 -->"]
	[h:OldConditionGroups = getProperty("a5e.stat.ConditionGroups")]
	[h:NewConditionGroups = "[]"]
	[h,foreach(condition,OldConditionGroups),CODE:{
		[h:HasDurationTest = !json.isEmpty(json.get(condition,"Duration"))]
		[h,if(HasDurationTest):
			newDuration = pm.a5e.AdvanceTime(json.set(TimeAdvancedData,"Duration",json.get(condition,"Duration")));
			newDuration = "{}"
		]
		[h:NewConditionGroups = json.append(NewConditionGroups,json.set(condition,"Duration",newDuration))]
		[h:setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"[*][?(@.GroupID=="+json.get(condition,"GroupID")+")]['Duration']",newDuration))]
	}]
	[h:setProperty("a5e.stat.ConditionGroups",NewConditionGroups)]
	[h:ConditionsExpired = json.unique(json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.Duration.Expired==1)]['GroupID']"))]

	[h,if(json.isEmpty(ConditionsExpired)),CODE:{};{
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",ConditionsExpired,"Target",tempToken)]
		[h:thisTokenNewTableLines = json.merge(thisTokenNewTableLines,json.get(macro.return,"Table"))]
	}]

	[h:ItemsWtihConditions = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemConditions != null && @.ItemConditions != '')]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:AdjustedItems = "[]"]
	[h:ExpiredItems = "[]"]
	[h,foreach(item,ItemsWtihConditions),CODE:{
		[h:UpdatedItem = item]
		[h:thisItemConditions = json.get(item,"ItemConditions")]
		[h:itemConditionsWithDuration = "[]"]
		[h,foreach(tempItemCondition,thisItemConditions),if(json.get(tempItemCondition,"Duration") != ""): itemConditionsWithDuration = json.append(itemConditionsWithDuration,tempItemCondition)]
		[h,foreach(tempItemCondition,itemConditionsWithDuration): UpdatedItem = json.path.set(UpdatedItem,"['ItemConditions'][?(@.GroupID =='"+json.get(tempItemCondition,"GroupID")+"')]['Duration']",pm.a5e.AdvanceTime(json.set(TimeAdvancedData,"Duration",json.get(tempItemCondition,"Duration"))))]

		[h:setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == '"+json.get(UpdatedItem,"ItemID")+"')]",UpdatedItem))]		
		[h:AdjustedItems = json.append(AdjustedItems,UpdatedItem)]

		[h:AnyExpiredTest = !json.isEmpty(json.path.read(UpdatedItem,"['ItemConditions'][*][?(@.Duration.Expired == 1)]"))]
		[h,if(AnyExpiredTest): ExpiredItems = json.append(ExpiredItems,UpdatedItem)]
	}]

	[h,foreach(item,ExpiredItems),CODE:{
		[h:thisItemConditionsExpired = json.path.read(item,"['ItemConditions'][?(@.Duration.Expired == 1)]['GroupID']")]
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",thisItemConditionsExpired,"Target",json.set(item,"HeldBy",tempToken))]
		[h:thisTokenNewTableLines = json.merge(thisTokenNewTableLines,json.get(macro.return,"Table"))]
	}]

	[h:"<!-- Advance time from perishable items and remove any at 0 -->"]
	[h:PerishableInventory = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.Duration != null && @.Duration.round != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:RemovedItems = "[]"]
	[h,foreach(item,PerishableInventory),CODE:{
		[h:newDuration = pm.a5e.AdvanceTime(json.set(TimeAdvancedData,"Duration",json.get(item,"Duration")))]
		[h:ExpiredTest = json.get(newDuration,"Expired") == 1]
		[h,if(ExpiredTest):
			setProperty("a5e.stat.Inventory",json.path.delete(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID=="+json.get(item,"ItemID")+")]"));
			setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID=="+json.get(item,"ItemID")+")]['Duration']",newDuration))
		]
		[h,if(ExpiredTest): RemovedItems = json.append(RemovedItems,item)]
	}]

	[h:RemovedItemDisplayList = pm.a5e.CreateDisplayList(json.unique(json.path.read(RemovedItems,"[*]['DisplayName']")),"and")]
	[h,if(!json.isEmpty(RemovedItems)): thisTokenNewTableLines = json.append(thisTokenNewTableLines,json.set("",
		"ShowIfCondensed",1,
		"Header","Expired Items",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",RemovedItemDisplayList,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:"<!-- TODO: Advance from features (cooldowns) and restore resource, or whatever other method is used to track -->"]
	[h:validAbilities = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Duration != null && @.Duration.round != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,foreach(ability,validAbilities),CODE:{
		[h:newDuration = pm.a5e.AdvanceTime(json.set("","Duration",json.get(ability,"Duration"),"Time",1,"TimeUnits","round","ParentToken",tempToken))]
		[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[*][?("+pm.a5e.PathFeatureFilter(ability)+")]['Duration']",newDuration))]
	}]
	
	[h:"<!-- Add token header if multiple targets and table lines added -->"]
	[h,if(json.length(AdvanceTimeTokens)>1 && !json.isEmpty(thisTokenNewTableLines)):
		abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",token.name,
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:abilityTable = json.merge(abilityTable,thisTokenNewTableLines)]
}]

[h:macro.return = json.set("","Table",abilityTable)]