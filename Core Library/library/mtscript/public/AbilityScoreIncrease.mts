[h:AbilityList=""]
[h:ValidAbilities=""]
[h:AbilityChoices = ""]
[h:FeatConditions = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(FeatConditions,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]

[h:as.MaxStatScores = ""]
[h,foreach(TempAbilityScore,pm.GetAttributes("Name")): as.MaxStatScores = json.set(as.MaxStatScores,TempAbilityScore,20)]
[h:pm.PassiveFunction("AbilityScoreMax")]

[h,foreach(TempAbilityScore,pm.GetAttributes()),CODE:{
	[h:HasAttributeTest = (json.get(getProperty("a5e.stat.Attributes"),json.get(TempAbilityScore,"Name"))!="")]
	[h,if(HasAttributeTest),CODE:{
		[h:AbilityList = if(json.get(getProperty("a5e.stat.Attributes"),json.get(TempAbilityScore,"Name"))<json.get(as.MaxStatScores,json.get(TempAbilityScore,"Name")),listAppend(AbilityList,json.get(TempAbilityScore,"DisplayName")+" ("+json.get(getProperty("a5e.stat.Attributes"),json.get(TempAbilityScore,"Name"))+")"),AbilityList)]
		
		[h:ValidAbilities = if(json.get(getProperty("a5e.stat.Attributes"),json.get(TempAbilityScore,"Name"))<json.get(as.MaxStatScores,json.get(TempAbilityScore,"Name")),json.append(ValidAbilities,json.get(TempAbilityScore,"Name")),ValidAbilities)]
		
		[h:AbilityChoices = json.set(AbilityChoices,json.get(TempAbilityScore,"Name"),0)]
	};{}]
}]

[h:AbilityOverMaxTest = 1]
[h:AbilityOne = 0]
[h:FeatInstead = 0]

[h,while(AbilityOverMaxTest == 1),CODE:{
	[h:abort(input(
		if(json.isEmpty(pm.GetFeats()),"","FeatInstead|No,Yes|Choose a Feat instead?|LIST"),
		"junkVar|Ability Score Increase|Level Up|LABEL",
		if(roll.count>0,"maxOverride |  | Note: Previous selection brought "+json.get(ValidAbilities,AbilityOne)+" over its maximum value of "+json.get(as.MaxStatScores,json.get(ValidAbilities,AbilityOne))+". Override? | CHECK ",""),
		"junkVar|2 Abilities (May be the same)|Choose|LABEL",
		"AbilityOne|"+AbilityList+"|Choose One|Radio",
		"AbilityTwo|"+AbilityList+"|Choose One|Radio"
	))]
	
	[h,if(FeatInstead),CODE:{
		[h:AbilityOverMaxTest = 0]
	};{
		[h,if(AbilityOne!=AbilityTwo): AbilityOverMaxTest = 0; AbilityOverMaxTest = (json.get(getProperty("a5e.stat.Attributes"),json.get(ValidAbilities,AbilityOne))+2 > json.get(as.MaxStatScores,json.get(ValidAbilities,AbilityOne)))]
		[h,if(roll.count>0 && AbilityOverMaxTest): AbilityOverMaxTest = !maxOverride]
	}]
}]
[h,if(FeatInstead==0),code:{
	[h:AbilityChoices = json.set(AbilityChoices,json.get(ValidAbilities,AbilityOne),1)]
	[h:AbilityChoices = json.set(AbilityChoices,json.get(ValidAbilities,AbilityTwo),json.get(AbilityChoices,json.get(ValidAbilities,AbilityTwo))+1)]
	[h:macro.return = json.set("","Name","AbilityScoreIncrease","DisplayName","Ability Score Increase","Attributes",AbilityChoices)]
};{
	[macro("FeatSelection@Lib:pm.a5e.Core"): FeatConditions]
	[h:macro.return = macro.return]
}]