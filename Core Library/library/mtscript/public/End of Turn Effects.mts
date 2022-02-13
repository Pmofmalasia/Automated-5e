[h:switchToken(macro.args)]
[h:a5e.GatherAbilities()]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","End of "+token.name+"'s Turn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
		
[h:pm.PassiveFunction("EndTurn")]

[h:validAbilities = json.path.read(a5e.UnifiedAbilities,"[*][?(@.Duration.AdvancePoint=='EndofTurn')]")]
[h,MACRO("AdvanceTime@Lib:pm.a5e.Core"): json.set("","Abilities",validAbilities,"Time",1,"TimeUnits","round")]

[h:pm.ConditionsExpired = json.unique(json.path.read(ConditionList,"[*][?(@.Duration.Expired==1)]['ConditionID']"))]
[h,foreach(ExpiredGroup,pm.ConditionsExpired),CODE:{
   [h,MACRO("EndCondition@Lib:pm.a5e.Core"): ExpiredGroup]
   [h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:setState("Initiative", 0)]
[h:macro.return = abilityTable]