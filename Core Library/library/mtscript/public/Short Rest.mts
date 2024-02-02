[h:sr.Data = macro.args]
[h:Flavor=json.get(sr.Data,"Flavor")]
[h:ParentToken=json.get(sr.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Short Rest"]
[h:IsTooltip = 0]
[h:abilityTable = ""]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Hit Dice Available",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",a5e.HitDieDisplay(),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"Value",""
))]

[h:setProperty("stat.Concentration","")]

[h:pm.a5e.EventResourceRestoration("ShortRest")]

[h:pm.PassiveFunction("ShortRest")]

[h:setProperty("a5e.stat.DeathSaves",json.set("","Successes",0,"Failures",0))]

[h:"<!-- TODO: Settings: outputTargets options -->"]
[h:outputTargets = if(getProperty("a5e.stat.Allegiance") == "PC","not-gm","none")]
[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","ShortRest",
	"DisplayName","Short Rest",
	"FalseName","",
	"DisplayClass","zzRest",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","ShortRest","Rest"),
	"OutputTargets",outputTargets,
	"Description",token.name+" has completed a <b>Short Rest</b>.",
	"AbridgedDescription",token.name+" has completed a <b>Short Rest</b>."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]