[h:TargetCreatures = arg(0)]
[h:ConditionFilterData = arg(1)]

[h,if(json.isEmpty(ConditionFilterData)),CODE:{
	[h:validConditionTypesInclusive = ""]
	[h:validConditionTypesExclusive = ""]
	[h:validConditionNamesInclusive = ""]
	[h:validConditionNamesExclusive = ""]
	[h:validConditionMaxTier = ""]
	[h:validConditionCombineFiltersHow = "and"]
};{
	[h,if(json.get(ConditionFilterData,"ConditionTypes")!=""),CODE:{
		[h:validConditionTypesInclusive = json.get(json.get(ConditionFilterData,"ConditionTypes"),"Inclusive")]
		[h:validConditionTypesExclusive = json.get(json.get(ConditionFilterData,"ConditionTypes"),"Exclusive")]
	};{
		[h:validConditionTypesInclusive = ""]
		[h:validConditionTypesExclusive = ""]
	}]

	[h,if(json.get(ConditionFilterData,"ConditionNames")!=""),CODE:{
		[h:validConditionNamesInclusive = json.get(json.get(ConditionFilterData,"ConditionNames"),"Inclusive")]
		[h:validConditionNamesExclusive = json.get(json.get(ConditionFilterData,"ConditionNames"),"Exclusive")]
	};{
		[h:validConditionNamesInclusive = ""]
		[h:validConditionNamesExclusive = ""]
	}]

	[h:validConditionMaxTier = json.get(ConditionFilterData,"Tier")]
	[h:validConditionCombineFiltersHow = json.get(ConditionFilterData,"CombineFiltersHow")]
	[h,if(validConditionCombineFiltersHow == ""): validConditionCombineFiltersHow = "and"]
}]


[h,if(validConditionMaxTier==""): validConditionMaxTier = 1]

[h:allValidConditionGroups = "{}"]

[h:conditionsSelected = ""]
[h,foreach(creature,TargetCreatures),CODE:{
	[h:thisCreatureValidConditions = getProperty("a5e.stat.ConditionList",creature)]

	[h,if(validConditionTypesInclusive != ""),CODE:{
		[h,if(json.type(validConditionTypesInclusive) == "ARRAY"):
			thisCreatureValidConditionsByType = json.path.read(thisCreatureValidConditions,"[*][?(@.ConditionType anyof "+validConditionTypesInclusive+")]");
			thisCreatureValidConditionsByType = json.path.read(thisCreatureValidConditions,"[*][?("+validConditionTypesInclusive+" in @.ConditionType)]")
		]
	};{
		[h:thisCreatureValidConditionsByType = thisCreatureValidConditions]
	}]

	[h,if(validConditionTypesExclusive != ""),CODE:{
		[h,if(json.type(validConditionTypesExclusive) == "ARRAY"):
			thisCreatureValidConditionsByType = json.path.read(thisCreatureValidConditionsByType,"[*][?(@.ConditionType noneof "+validConditionTypesExclusive+")]");
			thisCreatureValidConditionsByType = json.path.read(thisCreatureValidConditionsByType,"[*][?("+validConditionTypesExclusive+" nin @.ConditionType)]")
		]
	};{}]

	[h,if(validConditionNamesInclusive != ""),CODE:{
		[h,if(json.type(validConditionNamesInclusive) == "ARRAY"):
			thisCreatureValidConditionsByName = json.path.read(thisCreatureValidConditions,"[*][?(@.Name in "+validConditionNamesInclusive+")]");
			thisCreatureValidConditionsByName = json.path.read(thisCreatureValidConditions,"[*][?(@.Name == "+validConditionNamesInclusive+")]")
		]
	};{
		[h:thisCreatureValidConditionsByName = thisCreatureValidConditions]
	}]

	[h,if(validConditionNamesExclusive != ""),CODE:{
		[h,if(json.type(validConditionNamesExclusive) == "ARRAY"):
			thisCreatureValidConditionsByName = json.path.read(thisCreatureValidConditionsByName,"[*][?(@.Name nin "+validConditionNamesExclusive+")]");
			thisCreatureValidConditionsByName = json.path.read(thisCreatureValidConditionsByName,"[*][?(@.Name != "+validConditionNamesExclusive+")]")
		]
	};{}]

	[h,if((validConditionNamesInclusive != "" || validConditionNamesExclusive != "") && (validConditionTypesInclusive !="" || validConditionTypesExclusive !="")),CODE:{
		[h,if(validConditionCombineFiltersHow == "and"):
			thisCreatureValidConditions = json.intersection(thisCreatureValidConditionsByName,thisCreatureValidConditionsByType);
			thisCreatureValidConditions = json.union(thisCreatureValidConditionsByName,thisCreatureValidConditionsByType)
		]
	};{
		[h,if(validConditionNamesInclusive != "" || validConditionNamesExclusive != ""): thisCreatureValidConditions = thisCreatureValidConditionsByName]
		[h,if(validConditionTypesInclusive !="" || validConditionTypesExclusive !=""): thisCreatureValidConditions = thisCreatureValidConditionsByType]
	}]

	[h:thisCreatureValidConditions = json.path.read(thisCreatureValidConditions,"[*][?(@.Tier <= "+validConditionMaxTier+" || @.Tier == null)]","DEFAULT_PATH_LEAF_TO_NULL")]

	[h:thisCreatureValidConditionGroups = json.unique(json.path.read(thisCreatureValidConditions,"[*]['GroupID']"))]

	[h:allValidConditionGroups = json.set(allValidConditionGroups,creature,thisCreatureValidConditionGroups)]
}]

[h:macro.return = allValidConditionGroups]