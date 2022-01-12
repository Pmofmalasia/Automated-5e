[h:AbilityList=""]
[h:ValidAbilities=""]
[h:AbilityChoices = ""]
[h:FeatConditions = macro.args]
[h,foreach(TempAbilityScore,pm.GetAttributes("json")),CODE:{
	[h,if(json.get(Attributes,TempAbilityScore)!=""),CODE:{
		[h:AbilityList = if(json.get(Attributes,TempAbilityScore)<20,listAppend(AbilityList,TempAbilityScore+" ("+json.get(Attributes,TempAbilityScore)+")"),AbilityList)]
		[h:ValidAbilities = if(json.get(Attributes,TempAbilityScore)<20,json.append(ValidAbilities,TempAbilityScore),ValidAbilities)]
		[h:AbilityChoices = json.set(AbilityChoices,TempAbilityScore,0)]
	};{}]
}]
[h:"<!-- Will need to eventually replace the '20' above with a calculation of the maximum possible (e.g. Barbarian capstone) -->"]

[h:abort(input(
	"FeatInstead|No,Yes|Choose a Feat instead?|LIST",
	"junkVar|Ability Score Increase|Level Up|LABEL",
	"junkVar|2 Abilities (May be the same)|Choose|LABEL",
	"AbilityOne|"+AbilityList+"|Choose One|Radio",
	"AbilityTwo|"+AbilityList+"|Choose One|Radio"
))]

[h,if(FeatInstead==0),code:{
	[h:AbilityChoices = json.set(AbilityChoices,json.get(ValidAbilities,AbilityOne),1)]
	[h:AbilityChoices = json.set(AbilityChoices,json.get(ValidAbilities,AbilityTwo),json.get(AbilityChoices,json.get(ValidAbilities,AbilityTwo))+1)]
	[h:macro.return = json.set("","Name","AbilityScoreIncrease","DisplayName","Ability Score Increase","Attributes",AbilityChoices)]
};{
	[macro("Feat Selection@Lib:pm.a5e.Core"):FeatConditions]
	[h:macro.return = macro.return]
}]