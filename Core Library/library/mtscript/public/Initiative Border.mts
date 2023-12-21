[h:InitData = macro.args]
[h:Flavor = json.get(InitData,"Flavor")]
[h:ParentToken = json.get(InitData,"ParentToken")]
[h:outputTargets = if(getProperty("a5e.stat.Allegiance") == "Enemy","none","not-gm")]
[h:"<!-- TODO: Settings: Add option to show NPC initiative rolls -->"]

[h,MACRO("Initiative@Lib:pm.a5e.Core"):InitData]
[h:ReturnData = macro.return]
[h:abilityTable = json.get(ReturnData,"Table")]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Initiative",
	"DisplayName","Initiative",
	"FalseName","",
	"DisplayClass","zzInitiative",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Initiative","ChecksAndSaves"),
	"OutputTargets",outputTargets
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]