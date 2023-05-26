[h:EffectData = macro.args]
[h:ParentToken = json.get(EffectData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:pm.a5e.EffectData = "[]"]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(EffectData,"Flavor"),
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class",json.get(EffectData,"Class"),
	"Name",json.get(EffectData,"DisplayName"),
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:EffectToExecute = json.get(EffectData,"Effect")]
[h:EffectToExecute = json.set(EffectToExecute,
	"DMOnly",0,
	"ParentToken",ParentToken
)]

[h,macro("ExecuteEffect@Lib:pm.a5e.Core"): EffectToExecute]
[h:abilityTable = json.get(macro.return,"Table")]
[h:effectsToMerge = json.get(macro.return,"Effect")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class",json.get(EffectData,"Class"),
	"DisplayName",json.get(EffectData,"DisplayName"),
	"Type",json.get(EffectData,"Class"),
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]

[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]