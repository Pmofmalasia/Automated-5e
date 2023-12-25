[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name",abilityName,
	"DisplayName",abilityDisplayName,
	"FalseName",abilityFalseName,
	"DisplayClass",abilityClass,
	"ColorSubtype",""
)]
[h:TooltipOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",needsSplitGMOutput,
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("",abilityClass,json.get(abilityInfo,"Type"),"Feature"),
	"OutputTargets","",
	"Description",FeatureFullDescription,
	"AbridgedDescription",FeatureAbridgedDescription
)]
[r,MACRO("GatherTooltipComponents@Lib:pm.a5e.Core"): TooltipOutputComponents]