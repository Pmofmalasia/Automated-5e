[h:EndInstance = arg(0)]
[h:InstanceData = arg(1)]
[h:ParentToken = arg(2)]

[h:AlwaysRemovedConditions = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.EndTriggers."+EndInstance+" != null && @.EndTriggers."+EndInstance+" == 1)]","DEFAULT_PATH_LEAF_TO_NULL")]

[h:ConditionallyRemovedConditions = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.EndTriggers."+EndInstance+" != null && @.EndTriggers."+EndInstance+" != 1 && @.EndTriggers."+EndInstance+" != 0)]","DEFAULT_PATH_LEAF_TO_NULL")]

[h:RemovedConditions = AlwaysRemovedConditions]

[h,foreach(condition,ConditionallyRemovedConditions),CODE:{

}]

[h,if(!json.isEmpty(RemovedConditions)),CODE:{
	[h:RemovedConditionGroups = json.path.read(RemovedConditions,"\$[*]['GroupID']")]
	[h,macro("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",RemovedConditionGroups,"Target",ParentToken)]
	[h:RemovedConditionData = macro.return]
	[h:RemovedConditionsFinal = json.get(macro.return,"Removed")]
	[h:abilityTable = json.get(macro.return,"Table")]
};{
	[h:RemovedConditionData = json.set("",
		"Table","[]",
		"Removed","[]"
	)]
}]

[h:macro.return = RemovedConditionData]