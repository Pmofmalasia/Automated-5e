[h:he.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(he.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Help"]

[h:HelpTargetNum = 1]
[h:HelpOrigin = ParentToken]
[h:HelpRange = 5]
[h:HelpRangeUnits = "feet"]

[h:HelpTargetOptions = pm.a5e.TargetCreatureFiltering(
	json.set("",
		"Number",HelpTargetNum,
		"Category","Creature",
		"Allegiance",json.set("","NotSelf",1),
		"Origin",HelpOrigin,
		"Range",json.set("","Value",HelpRange,"Units",HelpRangeUnits),
		"ParentToken",ParentToken
	),
	"{}"
)]
[h:HelpTargets = pm.a5e.TargetCreatureTargeting(json.get(HelpTargetOptions,"ValidTargets"),HelpTargetNum)]

[h:HelpConditionInfo = pm.a5e.GetSpecificCondition("Help","Condition")]
[h:HelpDuration = 1]
[h:HelpDurationUnits = "round"]
[h:HelpAdvancePoint = "StartofSetByTurn"]
[h:HelpEndTriggers = "{}"]

[h:GroupID = pm.a5e.CreateConditionID(ParentToken,HelpTargets)]

[h,foreach(target,HelpTargets),CODE:{
	[h:ConditionData = json.set("",
		"Conditions",json.append("",HelpConditionInfo),
		"EndInfo",json.set("",
			"Duration",HelpDuration,
			"DurationUnits",HelpDurationUnits,
			"AdvancePoint",HelpAdvancePoint,
			"AuraRange",0,
			"AuraUnits","",
			"EndTriggers",HelpEndTriggers
		),
		"GroupID",GroupID,
		"Target",target,
		"SetBy",ParentToken
	)]

	[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): ConditionData]
}]
[h:ConditionReturnData = macro.return]
[h:abilityTable = json.get(ConditionReturnData,"Table")]

[h:macro.return = ConditionReturnData]