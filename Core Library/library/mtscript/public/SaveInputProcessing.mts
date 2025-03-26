[h:SaveInputData = macro.args]
[h:SaveInputData = pm.a5e.KeyStringsToNumbers(SaveInputData)]
[h:ParentToken = json.get(SaveInputData,"ParentToken")]
[h:Flavor = json.get(SaveInputData,"Flavor")]
[h:switchToken(ParentToken)]

[h:EffectChoice = json.get(SaveInputData,"EffectChoice")]
[h,if(EffectChoice == ""),CODE:{
	[h:OutputOptions = json.get(SaveInputData,"OutputOptions")]
	[h:SaveChoice = json.get(SaveInputData,"SaveChoice")]
	[h:SituationalBonus = json.get(SaveInputData,"SituationalBonus")]
	[h:AdvantageChoice = json.get(SaveInputData,"AdvantageChoice")]
	[h:SaveDescription = json.get(SaveInputData,"SaveDescription")]

	[h,switch(OutputOptions),CODE:
		case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
		case 1:{[h:outputTargets = "self"][h:linkPermissions = "gm-self"]};
		case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
	]

	[h:SaveData = json.set("",
		"Save",SaveChoice,
		"Type","Save",
		"ParentToken",ParentToken,
		"Bonus",SituationalBonus,
		"Advantage",or(AdvantageChoice==3,AdvantageChoice==4),
		"Disadvantage",or(AdvantageChoice==0,AdvantageChoice==1),
		"ForcedAdvantage",or(AdvantageChoice==0,AdvantageChoice==4),
		"OutputTargets",outputTargets
	)]

	[h,MACRO("Save@Lib:pm.a5e.Core"): SaveData]
	[h:SaveData = macro.return]
	[h:abilityTable = json.get(SaveData,"Table")]

	[h:BorderData = json.set("",
		"Flavor",if(SaveDescription=="",Flavor,SaveDescription),
		"Name","SavingThrow",
		"DisplayName","Saving Throw",
		"FalseName","",
		"DisplayClass","zzChecksAndSaves",
		"ColorSubtype",""
	)]
	[h:AllOutputComponents = json.set("",
		"ParentToken",ParentToken,
		"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
		"BorderData",BorderData,
		"Table",abilityTable,
		"ShowFullRulesType",json.append("","Check","ChecksAndSaves"),
		"OutputTargets",outputTargets,
		"Description","",
		"AbridgedDescription",""
	)]

	[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]
};{
	[h:EffectToResolve = base64.decode(EffectChoice)]

	[h,if(json.contains(SaveInputData,"isChooseFailure")): EffectToResolve = json.set(EffectToResolve,"ForcedModifications",json.set("","isForcedResult","AutoFailure"))]

	[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): json.set(EffectToResolve,"SpecificTargets",ParentToken)]

	[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]
}]

[h:closeDialog("SaveInput")]