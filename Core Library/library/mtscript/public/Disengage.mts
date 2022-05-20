[h:de.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(de.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Disengage"]

[h:DisengageConditionInfo = pm.a5e.GetSpecificCondition("Disengage","Condition")]
[h:DisengageTarget = ParentToken]
[h:DisengageDuration = 1]
[h:DisengageDurationUnits = "round"]
[h:DisengageAdvancePoint = "EndofTurn"]

[h:GroupID = pm.a5e.CreateConditionID(ParentToken,DisengageTarget)]

[h:ConditionData = json.set("",
	"Conditions",json.append("",DisengageConditionInfo),
	"EndInfo",json.set("",
		"Duration",DisengageDuration,
		"DurationUnits",DisengageDurationUnits,
		"AdvancePoint",DisengageAdvancePoint,
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