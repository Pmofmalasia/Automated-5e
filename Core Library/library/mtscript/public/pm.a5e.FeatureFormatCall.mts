[h:BorderData = json.set(abilityInfo,
	"DisplayClass",json.get(abilityInfo,"Class"),
	"ColorSubtype",""
)]
[h:FeatureType = json.get(abilityInfo,"Class")]
[h,if(FeatureType == getProperty("a5e.stat.Race")): FeatureType = "Race"]
[h:allClasses = pm.GetClasses("Name","json")]
[h,if(json.contains(allClasses,FeatureType)): FeatureType = "Class"]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("",json.get(abilityInfo,"Class"),FeatureType,"Feature"),
	"OutputTargets","",
	"Description",FeatureFullDescription,
	"AbridgedDescription",FeatureAbridgedDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]

[h:pm.a5e.AbilityGatherEffect()]