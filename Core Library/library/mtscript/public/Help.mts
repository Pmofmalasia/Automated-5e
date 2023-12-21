[h:HelpData = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(HelpData,"ParentToken")]
[h:HelpType = json.get(HelpData,"HelpType")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Help"]

[h,if(HelpType == ""),CODE:{
	[h:abort(input(" HelpType | Help with Check,Help Attack | How You Are Helping | RADIO "))]

	[h,if(HelpType == 1):
		HelpType = "HelpAttack";
		HelpType = "Help"
	]
}]

[h:HelpTargetNum = 1]
[h:HelpOrigin = ParentToken]
[h:HelpRange = 5]
[h:HelpRangeUnits = "feet"]
[h,if(HelpType == "Help"):
	HelpAllegiance = json.set("","NotSelf",1);
	HelpAllegiance = json.set("","Foe",1)
]
[h:HelpDuration = 1]
[h:HelpDurationUnits = "round"]
[h:HelpAdvancePoint = "StartofSetByTurn"]
[h,if(HelpType == "Help"):
	HelpEndTriggers = json.set("","AfterAttackTarget",1);
	HelpEndTriggers = json.set("","AfterCheck",1)
]

[h:pm.PassiveFunction("Help")]

[h:HelpTargetOptions = pm.a5e.TargetCreatureFiltering(
	json.set("",
		"Number",HelpTargetNum,
		"Category","Creature",
		"Origin",HelpOrigin,
		"Range",json.set("","Value",HelpRange,"Units",HelpRangeUnits),
		"ParentToken",ParentToken),
	json.set("",
		"Allegiance",HelpAllegiance)
)]
[h:HelpTargets = pm.a5e.TargetCreatureTargeting(json.get(HelpTargetOptions,"ValidTargets"),HelpTargetNum)]

[h:HelpConditionInfo = pm.a5e.GetSpecificCondition(HelpType,"Condition")]

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
			"EndTriggers",HelpEndTriggers),
		"GroupID",GroupID,
		"Target",target,
		"SetBy",ParentToken
	)]

	[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): ConditionData]
}]
[h:ConditionReturnData = macro.return]
[h:abilityTable = json.get(ConditionReturnData,"Table","HelpType",HelpType)]

[h:macro.return = ConditionReturnData]