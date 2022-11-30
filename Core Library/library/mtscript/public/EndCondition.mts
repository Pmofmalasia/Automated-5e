[h:ParentToken = json.get(macro.args,"ParentToken")]
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

[h:RemovedConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?("+ConditionFilters+")]")]
[h:RemovedConditionsFinal = RemovedConditions]

[h:"<!-- The purpose of looping here is to catch any chain reactions - e.g. Ending Condition A causes the end of Condition B, which in turn ends Condition C. -->"]
[h:"<!-- There is almost certainly a better way to do this. -->"]
[h:OtherConditionsMaybeEnding = json.path.read(getProperty("a5e.stat.ConditionGroups"),"[*][?(@.EndTriggers.CondEnd!=null && @.EndTriggers!='')]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:FirstLoopTest = 1]
[h,while(!json.equals(RemovedConditions,RemovedConditionsFinal) || FirstLoopTest),CODE:{
	[h:RemovedConditionsFinal = RemovedConditions]
	[h:FirstLoopTest = 0]
	[h:NewConditionGroups = ""]
	[h,foreach(condition,OtherConditionsMaybeEnding),CODE:{
		[h:TriggersRemovalTest = !json.isEmpty(json.intersection(json.path.read(RemovedConditionsFinal,"[*]['Name']"),json.get(json.get(condition,"EndTriggers"),"CondEnd")))]
		[h:AlreadyListedTest = json.contains(GroupID,json.get(condition,"GroupID"))]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): GroupID = json.append(GroupID,json.get(condition,"GroupID"))]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): ConditionFilters = listAppend(ConditionFilters,"@.GroupID=='"+json.get(condition,"GroupID")+"'"," || ")]
		[h,if(TriggersRemovalTest && !AlreadyListedTest): GroupFilters = listAppend(GroupFilters,"@.GroupID=='"+json.get(condition,"GroupID")+"'"," || ")]
	}]
	
	[h:pm.PassiveFunction("ChangeCondEnd")]
	
	[h:RemovedConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?("+ConditionFilters+")]")]
}]

[h:"<!-- ReturnForPatch: Can replace the loop to delete conditions with no remaining targets and replace it with junkVar if they ever patch json.path functions to compare arrays. -->"]
[h:RemovedSetBy = json.unique(json.path.read(RemovedConditionsFinal,"[*][?(@.SetBy!='')]['SetBy']"))]
[h,foreach(setBy,RemovedSetBy),CODE:{
	[h:switchToken(setBy)]
	[h:RemovedGroups = json.unique(json.path.read(getProperty("a5e.stat.ConditionList",ParentToken),"[*][?(@.SetBy=='"+setBy+"')]['GroupID']"))]
	[h:RemovedGroupFilter = "@.GroupID=="+json.toList(RemovedGroups,+" || @.GroupID==")]
	[h:setProperty("a5e.stat.ConditionsSet",json.path.delete(getProperty("a5e.stat.ConditionsSet"),"[*][?("+RemovedGroupFilter+")]['Targets'][?(@=='"+ParentToken+"')]"))]
	[h:junkVar = json.path.delete(getProperty("a5e.stat.ConditionsSet"),"[*][?(@.Targets == [])]")]
	[h:tempCounter = json.length(getProperty("a5e.stat.ConditionsSet"))-1]
	[h,count(json.length(getProperty("a5e.stat.ConditionsSet"))),CODE:{
		[h:noTargetsTest = json.isEmpty(json.get(json.get(getProperty("a5e.stat.ConditionsSet"),tempCounter),"Targets"))]
		[h,if(noTargetsTest): setProperty("a5e.stat.ConditionsSet",json.remove(getProperty("a5e.stat.ConditionsSet"),tempCounter))]
		[h:tempCounter = tempCounter - 1]
	}]
}]
[h:switchToken(ParentToken)]

[h:setProperty("a5e.stat.ConditionList",json.path.delete(getProperty("a5e.stat.ConditionList"),"[?("+ConditionFilters+")]"))]
[h:setProperty("a5e.stat.ConditionGroups",json.path.delete(getProperty("a5e.stat.ConditionGroups"),"[?("+GroupFilters+")]"))]

[h,foreach(condition,RemovedConditionsFinal),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h:InactiveTest = json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionList"),"[?(@.Name == '"+json.get(condition,"Name")+"')]"))]
		[h,if(InactiveTest): setState(json.get(condition,"Name"),0)]
	};{
		[h,if(json.get(condition,"BackupState")==""): RemoveBackupTest = 0; RemoveBackupTest = json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionList"),"[?(@.BackupState == '"+json.get(condition,"BackupState")+"')]"))]
		[h,if(RemoveBackupTest): setState(json.get(condition,"BackupState"),0)]
	}]
	[h:tempReactivationTest = -1]
	[h:backupCounter = 0]
	[h,foreach(reactivationCondition,getProperty("a5e.stat.ConditionList")),CODE:{
		[h,if(json.get(reactivationCondition,"Name")==json.get(condition,"Name")): tempReactivationTest = backupCounter]
		[h:backupCounter = backupCounter + 1]
	}]
	[h,if(tempReactivationTest>=0): setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"["+tempReactivationTest+"]['IsActive']",1))]
}]

[h:pm.PassiveFunction("CondEnd")]

[h:macro.return = json.set("","Table",abilityTable,"Removed",RemovedConditions)]