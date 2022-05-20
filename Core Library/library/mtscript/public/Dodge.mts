[h:do.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(do.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Dodge"]

[h:DodgeConditionInfo = pm.a5e.GetSpecificCondition("Dodge","Condition")]
[h:DodgeTarget = ParentToken]
[h:DodgeDuration = 1]
[h:DodgeDurationUnits = "round"]
[h:DodgeAdvancePoint = "StartofTurn"]

[h:GroupID = pm.a5e.CreateConditionID(ParentToken,DodgeTarget)]

[h:ConditionData = json.set("",
	"Conditions",json.append("",DodgeConditionInfo),
	"EndInfo",json.set("",
		"Duration",DodgeDuration,
		"DurationUnits",DodgeDurationUnits,
		"AdvancePoint",DodgeAdvancePoint,
		"AuraRange",0,
		"AuraUnits","",
		"EndTriggers","{}"
	),
	"GroupID",GroupID,
	"Target",ParentToken,
	"SetBy",ParentToken
)]

[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): ConditionData]
[h:ConditionReturnData = macro.return]
[h:abilityTable = json.get(ConditionReturnData,"Table")]

[h:macro.return = ConditionReturnData]