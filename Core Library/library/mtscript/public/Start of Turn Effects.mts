[h:ParentToken = macro.args]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities()]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Start of "+token.name+"'s Turn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:pm.PassiveFunction("StartTurn")]

[h:validAbilities = json.path.read(a5e.UnifiedAbilities,"[*][?(@.Duration.AdvancePoint=='StartofTurn')]")]
[h,MACRO("AdvanceTime@Lib:pm.a5e.Core"): json.set("","Abilities",validAbilities,"Time",1,"TimeUnits","round","ParentToken",ParentToken)]

[h:pm.ConditionsExpired = json.unique(json.path.read(ConditionList,"[*][?(@.Duration.Expired==1)]['ConditionID']"))]
[h,if(json.isEmpty(pm.ConditionsExpired)),CODE:{};{
	[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","ConditionID",pm.ConditionsExpired,"ParentToken",ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:setState("Initiative", 1)]
[h:setState("ReactionUsed", 0)]
[h:macro.return = abilityTable]