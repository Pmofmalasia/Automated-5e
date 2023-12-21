[h:DeathData = macro.args]
[h:Flavor=json.get(DeathData,"Flavor")]
[h:ParentToken=json.get(DeathData,"ParentToken")]
[h:"<!-- TODO: Settings: Have option to show/hide enemy death saves -->"]
[h:outputTargets = if(getProperty("a5e.stat.Allegiance") == "Enemy","none","not-gm")]

[h,MACRO("Death Save@Lib:pm.a5e.Core"): DeathData]
[h:abilityTable = json.get(macro.return,"Table")]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","DeathSavingThrow",
	"DisplayName","Death Saving Throw",
	"FalseName","",
	"DisplayClass","zzDeath",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Death","ChecksAndSaves"),
	"OutputTargets",outputTargets,
	"Description","",
	"AbridgedDescription",""
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]