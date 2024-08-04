[h:TargetData = json.get(macro.args,"Target")]
[h,if(json.type(TargetData) == "OBJECT"),CODE:{
	[h:ParentToken = json.get(TargetData,"HeldBy")]
	[h:TargetType = "Item"]
	[h:TargetID = json.get(TargetData,"ItemID")]
};{
	[h:ParentToken = if(TargetData=="",currentToken(),TargetData)]
	[h:TargetType = "Token"]
	[h:TargetID = ParentToken]
}]
[h,if(ParentToken!=""): switchToken(ParentToken)]
[h:MultiConditionTest = json.type(json.get(macro.args,"GroupID"))]
[h,if(MultiConditionTest=="UNKNOWN"): GroupID = json.append("",json.get(macro.args,"GroupID")); GroupID = json.get(macro.args,"GroupID")]
[h:ConditionFilters = ""]
[h:GroupFilters = ""]
[h,foreach(UniqueID,json.unique(GroupID)): ConditionFilters = listAppend(ConditionFilters,"@.GroupID=='"+UniqueID+"'"," || ")]
[h,foreach(UniqueID,json.unique(GroupID)): GroupFilters = listAppend(GroupFilters,"@.GroupID=='"+UniqueID+"'"," || ")]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "EndCondition"]

[h:IsTooltip = 0]
[h:abilityTable = "[]"]
[h:pm.a5e.EffectData = "[]"]

[h,switch(TargetType),CODE:
	case "Token":{
		[h:RemovedConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?("+ConditionFilters+")]")]
	};
	case "Item":{
		[h:RemovedConditions = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*]['ItemConditions'][*][?("+ConditionFilters+")]")]
	}
]

[h,if(!json.isEmpty(RemovedConditions)): RemovedConditions = json.path.put(RemovedConditions,"\$[*]","TargetType",TargetType)]
[h:RemovedConditionsFinal = RemovedConditions]

[h:"<!-- The purpose of looping here is to catch any chain reactions - e.g. Ending Condition A causes the end of Condition B, which in turn ends Condition C. -->"]
[h:"<!-- There is almost certainly a better way to do this. -->"]
[h:OtherConditionsMaybeEnding = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.EndTriggers.CondEnd!=null && @.EndTriggers!='')]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:FirstLoopTest = 1]
[h:"<!-- Note: This only checks for other conditions to end on the token, not on items -->"]
[h,while(!json.equals(RemovedConditions,RemovedConditionsFinal) || FirstLoopTest),CODE:{
	[h:RemovedConditionsFinal = RemovedConditions]
	[h:FirstLoopTest = 0]
	[h:NewConditionFilters = ""]
	[h:NewConditionGroups = ""]
	[h,foreach(condition,OtherConditionsMaybeEnding),CODE:{
		[h:TriggersRemovalTest = !json.isEmpty(json.intersection(json.path.read(RemovedConditionsFinal,"\$[*]['Name']"),json.get(json.get(condition,"EndTriggers"),"CondEnd")))]
		[h:AlreadyListedTest = json.contains(GroupID,json.get(condition,"GroupID"))]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): GroupID = json.append(GroupID,json.get(condition,"GroupID"))]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): NewConditionFilters = listAppend(NewConditionFilters,"@.GroupID=='"+json.get(condition,"GroupID")+"'"," || ")]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): GroupFilters = listAppend(GroupFilters,"@.GroupID=='"+json.get(condition,"GroupID")+"'"," || ")]
	}]
	
	[h:pm.PassiveFunction("ChangeCondEnd")]

	[h,if(NewConditionFilters != ""),CODE:{
		[h:NewRemovedConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?("+NewConditionFilters+")]")]
		[h:RemovedConditions = json.merge(RemovedConditions,json.path.put(NewRemovedConditions,"\$[*]","TargetType","Token"))]
		[h:ConditionFilters = ConditionFilters + " || " + NewConditionFilters]
	};{}]
}]

[h:RemovedSetBy = json.unique(json.path.read(RemovedConditionsFinal,"\$[*][?(@.SetBy!='')]['SetBy']"))]
[h:RemovedSetBy = json.intersection(getTokens("json"),RemovedSetBy)]
[h,foreach(setBy,RemovedSetBy),CODE:{
	[h:switchToken(setBy)]

	[h:RemovedGroups = json.unique(json.path.read(RemovedConditionsFinal,"\$[*][?(@.SetBy=='"+setBy+"')]['GroupID']"))]
	[h:RemovedGroupFilter = "@.GroupID=='"+json.toList(RemovedGroups,+"' || @.GroupID=='")+"'"]
	[h:prunedConditionsSet = getProperty("a5e.stat.ConditionsSet")]
	[h,foreach(tempConditionGroup,prunedConditionsSet),CODE:{
		[h:removedGroupTest = json.contains(RemovedGroups,json.get(tempConditionGroup,"GroupID"))]
		[h,if(removedGroupTest): prunedConditionsSet = json.path.set(prunedConditionsSet,"\$["+roll.count+"]['Targets']",json.difference(json.get(tempConditionGroup,"Targets"),ParentToken))]
	}]
	[h,if(TargetType == "Item"): setProperty("a5e.stat.ConditionsSet",json.path.delete(getProperty("a5e.stat.ConditionsSet"),"\$[*][?("+RemovedGroupFilter+")]['Targets'][*][?(@.ItemID == '"+TargetID+"')]"))]

	[h:prunedConditionsSet = json.path.delete(prunedConditionsSet,"\$[*][?(@.Targets empty true)]")]

	[h:setProperty("a5e.stat.ConditionsSet",prunedConditionsSet)]
}]
[h:switchToken(ParentToken)]

[h:setProperty("a5e.stat.ConditionList",json.path.delete(getProperty("a5e.stat.ConditionList"),"\$[*][?("+ConditionFilters+")]"))]
[h:setProperty("a5e.stat.Inventory",json.path.delete(getProperty("a5e.stat.Inventory"),"\$[*]['ItemConditions'][*][?("+ConditionFilters+")]"))]
[h:setProperty("a5e.stat.ConditionGroups",json.path.delete(getProperty("a5e.stat.ConditionGroups"),"\$[*][?("+GroupFilters+")]"))]

[h,foreach(condition,RemovedConditionsFinal),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"\$.states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h:InactiveTest = json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Name == '"+json.get(condition,"Name")+"')]"))]
		[h,if(InactiveTest): setState(json.get(condition,"Name"),0)]
	};{
		[h,if(json.get(condition,"BackupState")==""): RemoveBackupTest = 0; RemoveBackupTest = json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.BackupState == '"+json.get(condition,"BackupState")+"')]"))]
		[h,if(RemoveBackupTest): setState(json.get(condition,"BackupState"),0)]
	}]
	[h:tempReactivationTest = -1]
	[h:backupCounter = 0]
	[h,foreach(reactivationCondition,getProperty("a5e.stat.ConditionList")),CODE:{
		[h,if(json.get(reactivationCondition,"Name")==json.get(condition,"Name")): tempReactivationTest = backupCounter]
		[h:backupCounter = backupCounter + 1]
	}]
	[h,if(tempReactivationTest>=0): setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"\$[*]["+tempReactivationTest+"]['IsActive']",1))]
}]

[h:pm.PassiveFunction("CondEnd")]

[h,if(0),CODE:{
	[h:oldUnifiedAbilities = a5e.UnifiedAbilities]
	[h:a5e.UnifiedAbilities = json.path.put(RemovedConditionsFinal,"\$[*]","AbilityType","Condition")]
	[h:pm.PassiveFunction("CondEndThis")]
	[h:a5e.UnifiedAbilities = oldUnifiedAbilities]
};{
	[h,foreach(condition,RemovedConditionsFinal),if(json.get(condition,"CondEndThis") != ""),CODE:{
		[h:CondEndThisEffect = json.get(condition,"CondEndThis")]
		[h,if(json.get(CondEndThisEffect,"RevertTransformation") != ""): RevertTransformationData = js.a5e.RevertTransformation(json.get(condition,"GroupID"),ParentToken); RevertTransformationData = "{}"]
		[h:abilityTable = json.merge(abilityTable,json.get(RevertTransformationData,"Table"))]
	}]
}]


[h,if(!json.isEmpty(RemovedConditionsFinal)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Conditions Removed",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(json.path.read(RemovedConditionsFinal,"\$[*][?(@.IsAssociated!=1 || @.IsAssociated==null)]['DisplayName']"),"and"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:macro.return = json.set("","Table",abilityTable,"Removed",RemovedConditionsFinal)]