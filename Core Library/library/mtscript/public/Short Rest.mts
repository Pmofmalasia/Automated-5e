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

[h,if(getProperty("a5e.stat.Exhaustion") == 0): exhaustionMessage = "Exhaustion fully recovered."; exhaustionMessage = "Disadvantage on ability checks"+if(getProperty("a5e.stat.Exhaustion")>=2 && getProperty("a5e.stat.Exhaustion")<5,", speed halved","")+if(getProperty("a5e.stat.Exhaustion")>=3,", disadvantage on attack rolls and saving throws","")+if(getProperty("a5e.stat.Exhaustion")>=4,", hit point maximum halved","")+if(getProperty("a5e.stat.Exhaustion")>=5,", speed reduced to 0","")]
	
[h,if(getProperty("a5e.stat.Exhaustion")>0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Level "+getProperty("a5e.stat.Exhaustion")+" Exhaustion",
	"FalseHeader","",
	"FullContents",exhaustionMessage,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']",
	"Value",""
))]

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