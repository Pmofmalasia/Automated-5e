[h:hi.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(hi.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Hide"]

[h:HideConditionInfo = pm.a5e.GetSpecificCondition("Hidden","Condition")]
[h:HideTarget = ParentToken]
[h:HideDuration = 10]
[h:HideDurationUnits = "round"]
[h:HideAdvancePoint = "EndofTurn"]
[h:HideEndTriggers = json.set("{}","AfterAttack",1)]

[h:GroupID = pm.a5e.CreateConditionID(ParentToken,HideTarget)]

[h:ConditionData = json.set("",
	"Conditions",json.append("",HideConditionInfo),
	"EndInfo",json.set("",
		"Duration",HideDuration,
		"DurationUnits",HideDurationUnits,
		"AdvancePoint",HideAdvancePoint,
		"AuraRange",0,
		"AuraUnits","",
		"EndTriggers",HideEndTriggers
	),
	"GroupID",GroupID,
	"Target",ParentToken,
	"SetBy",ParentToken
)]

[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): ConditionData]
[h:ConditionReturnData = macro.return]
[h:abilityTable = json.get(ConditionReturnData,"Table")]

[h:macro.return = ConditionReturnData]