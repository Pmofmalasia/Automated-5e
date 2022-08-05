[h:da.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(da.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Dash"]

[h:DashConditionInfo = pm.a5e.GetSpecificCondition("Dash","Movement")]
[h:DashTarget = ParentToken]
[h:DashDuration = 1]
[h:DashDurationUnits = "round"]
[h:DashAdvancePoint = "EndofTurn"]

[h:GroupID = pm.a5e.CreateConditionID(ParentToken,DashTarget)]

[h:ConditionData = json.set("",
	"Conditions",json.append("",DashConditionInfo),
	"EndInfo",json.set("",
		"Duration",DashDuration,
		"DurationUnits",DashDurationUnits,
		"AdvancePoint",DashAdvancePoint,
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