[h:EffectData = macro.args]
[h:ParentToken = json.get(EffectData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:pm.a5e.EffectData = "[]"]

[h:EffectToExecute = json.get(EffectData,"Effect")]
[h:"<!-- Note: Unsure why needsSplitGMOutput is set here, shouldn't be needed until later -->"]
[h:FinalEffectData = json.set(EffectData,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy")
)]

[h,macro("ExecuteEffect@Lib:pm.a5e.Core"): FinalEffectData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:effectsToMerge = json.get(macro.return,"Effect")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class",json.get(EffectData,"Class"),
	"DisplayName",json.get(EffectData,"DisplayName"),
	"Type",json.get(EffectData,"Class"),
	"ID",pm.a5e.GenerateEffectID(),
	"FalseName",json.get(EffectData,"FalseName"),
	"DisplayClass",json.get(EffectData,"DisplayClass"),
	"ColorSubtype",json.get(EffectData,"ColorSubtype"),
	"ParentToken",ParentToken
)]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]

[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h,if(json.get(EffectToExecute,"Description") == ""):
	EffectDescription = base64.decode(json.get(FinalEffectData,"Description"));
	EffectDescription = base64.decode(json.get(EffectToExecute,"Description"))
]

[h:BorderData = json.set("",
	"Flavor",json.get(EffectData,"Flavor"),
	"Name",json.get(EffectData,"Name"),
	"DisplayName",json.get(EffectData,"DisplayName"),
	"FalseName",json.get(EffectData,"FalseName"),
	"DisplayClass",json.get(EffectData,"Class"),
	"ColorSubtype",json.get(EffectData,"ColorSubtype")
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("",json.get(EffectData,"Class"),"Feature"),
	"OutputTargets","",
	"Description",EffectDescription,
	"AbridgedDescription",EffectDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]