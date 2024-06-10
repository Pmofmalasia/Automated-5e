[h:EndInstance = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:thisInstanceConditions = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.EndTriggers."+EndInstance+" != null && @.EndTriggers != null && @.EndTriggers != '')]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:alwaysRemovedConditions = json.path.read(thisInstanceConditions,"\$[*][?(@.EndTriggers."+EndInstance+" == 1)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:possiblyRemovedConditions = json.difference(thisInstanceConditions,alwaysRemovedConditions)]

[h:abilityTable = "[]"]
[h:conditionEndEffects = "[]"]
[h:RemovedConditions = alwaysRemovedConditions]
[h,foreach(conditionGroup,possiblyRemovedConditions),CODE:{
	[h:thisConditionEndInfo = json.get(json.get(conditionGroup,"EndTriggers"),EndInstance)]
	[h:thisConditionEndEffect = json.set("",
		"ConditionModificationInfo",json.set("","Method","End"),
		"TargetedConditions",json.set("",ParentToken,json.get(conditionGroup,"GroupID")),
		"Targets",json.append("",ParentToken),
		"ParentToken",json.get(conditionGroup,"SetBy")
	)]

	[h:isPrereqMet = 0]
	[h,if(json.get(thisConditionEndInfo,"Prereqs") != ""),CODE:{
		[h:"<!-- TODO: Add prerequisite checking here -->"]
	};{
		[h:isPrereqMet = 1]
	}]

	[h:needsResolutionTest = 0]
	[h:thisConditionSaveInfo = json.get(thisConditionEndInfo,"SaveType")]
	[h:thisConditionCheckInfo = json.get(thisConditionEndInfo,"CheckType")]
	[h,if(isPrereqMet),CODE:{
		[h:pm.a5e.TriggerConditionEndResolutionData()]

		[h:needsResolutionTest = or(thisConditionCheckInfo != "",thisConditionSaveInfo != "")]
		[h,if(needsResolutionTest):
			conditionEndEffects = json.append(conditionEndEffects,thisConditionEndEffect);
			RemovedConditions = json.append(RemovedConditions,conditionGroup)
		]
	};{}]
}]

[h,if(!json.isEmpty(RemovedConditions)),CODE:{
	[h:RemovedConditionGroups = json.path.read(RemovedConditions,"\$[*]['GroupID']")]
	[h,macro("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",RemovedConditionGroups,"Target",ParentToken)]
	[h:RemovedConditionData = macro.return]
	[h:RemovedConditionsFinal = json.get(macro.return,"Removed")]
	[h:abilityTable = json.get(macro.return,"Table")]
};{
	[h:RemovedConditionData = json.set("",
		"Table",abilityTable,
		"Removed","[]"
	)]
}]
[h:RemovedConditionData = json.set(RemovedConditionData,"Effects",conditionEndEffects)]

[h:macro.return = RemovedConditionData]