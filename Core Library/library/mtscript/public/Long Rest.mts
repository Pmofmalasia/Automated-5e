[h:lr.Data = macro.args]
[h:IsTooltip = 0]
[h:Flavor=json.get(lr.Data,"Flavor")]
[h:ParentToken=json.get(lr.Data,"ParentToken")]
[h:abilityTable = ""]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Long Rest"]

[h:setProperty("a5e.stat.HP",getProperty("a5e.stat.MaxHP"))]
[h:setProperty("a5e.stat.TempHP",0)]
[h:LongRestTest=1]

[h:HitDieSizes = json.fields(getProperty("a5e.stat.MaxHitDice"))]
[h,foreach(DieSize,HitDieSizes),CODE:{
	[h:CurrentHD = if(json.get(getProperty("a5e.stat.HitDice"),+DieSize)=="",0,json.get(getProperty("a5e.stat.HitDice"),DieSize))]
	[h:HDRecharge = max(1,floor(json.get(getProperty("a5e.stat.MaxHitDice"),DieSize)/2))]
	[h:HDNewTotal = min(json.get(getProperty("a5e.stat.MaxHitDice"),DieSize),CurrentHD+HDRecharge)]
	[h:setProperty("a5e.stat.HitDice",json.set(getProperty("a5e.stat.HitDice"),DieSize,HDNewTotal))]
}]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Hit Dice",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",a5e.HitDieDisplay(),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
	
[h:setProperty("a5e.stat.SpellSlots",getProperty("a5e.stat.MaxSpellSlots"))]
[h,if(json.get(a5e.stat.MaxSpellSlots,"1")>0):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Spell Slots",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.SpellSlots(),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h:setProperty("a5e.stat.Concentration","")]

[h:OldExhaustion = getProperty("a5e.stat.Exhaustion")]
[h:setProperty("a5e.stat.Exhaustion",Max(getProperty("a5e.stat.Exhaustion")-1,0))]
[h:setState("Exhaustion1",if(getProperty("a5e.stat.Exhaustion")==1,1,0))]
[h:setState("Exhaustion2",if(getProperty("a5e.stat.Exhaustion")==2,1,0))]
[h:setState("Exhaustion3",if(getProperty("a5e.stat.Exhaustion")==3,1,0))]
[h:setState("Exhaustion4",if(getProperty("a5e.stat.Exhaustion")==4,1,0))]
[h:setState("Exhaustion5",if(getProperty("a5e.stat.Exhaustion")==5,1,0))]
[h,if(getProperty("a5e.stat.Exhaustion") == 0): exhaustionMessage = "Exhaustion fully recovered."; exhaustionMessage = "Disadvantage on ability checks"+if(getProperty("a5e.stat.Exhaustion")>=2 && getProperty("a5e.stat.Exhaustion")<5,", speed halved","")+if(getProperty("a5e.stat.Exhaustion")>=3,", disadvantage on attack rolls and saving throws","")+if(getProperty("a5e.stat.Exhaustion")>=4,", hit point maximum halved","")+if(getProperty("a5e.stat.Exhaustion")>=5,", speed reduced to 0","")]
	
[h,if(OldExhaustion>0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Level "+getProperty("a5e.stat.Exhaustion")+" Exhaustion",
	"FalseHeader","",
	"FullContents",exhaustionMessage,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']"
))]

[h:pm.a5e.EventResourceRestoration(json.append("","LongRest","Dawn"))]

[h:pm.PassiveFunction("LongRest")]

[h:ArcaneWard=if(json.get(getProperty("a5e.stat.Subclasses"),"Wizard")=="Abjuration",json.set(ArcaneWard,"HP",0,"Active",0,"Use",1),ArcaneWard)]

[h:state.Dying=if(getProperty("a5e.stat.HP") <= 0, 1, 0)]
[h:bar.Health = getProperty("a5e.stat.HP") / getProperty("a5e.stat.MaxHP")]

[h:setProperty("a5e.stat.DeathSaves",json.set("", "Successes",0,"Failures",0))]

[h:"<!-- TODO: Settings: outputTargets options -->"]
[h:outputTargets = if(getProperty("a5e.stat.Allegiance") == "PC","not-gm","none")]
[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","LongRest",
	"DisplayName","Long Rest",
	"FalseName","",
	"DisplayClass","zzRest",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","LongRest","Rest"),
	"OutputTargets",outputTargets,
	"Description",token.name+" has completed a <b>Long Rest</b>.",
	"AbridgedDescription",token.name+" has completed a <b>Long Rest</b>."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]