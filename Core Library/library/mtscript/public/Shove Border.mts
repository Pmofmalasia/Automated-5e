[h:ShoveData = macro.args]
[h:Flavor = json.get(ShoveData,"Flavor")]
[h:ParentToken = json.get(ShoveData,"ParentToken")]
[h:outputTargets = "not-gm"]
[h:pm.a5e.EffectData = "[]"]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",json.get(ShoveData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(ShoveData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(ShoveData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(ShoveData,"AccentTextOverride"),
	"TitleFont",json.get(ShoveData,"TitleFont"),
	"BodyFont",json.get(ShoveData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Shove",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","Shove",
	"Type","Check",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:ShoveData = json.set(ShoveData,"BaseEffect",pm.a5e.BaseEffectData)]

[h,MACRO("Shove@Lib:pm.a5e.Core"): ShoveData]
[h:ShoveInfo = macro.return]
[h:effectsToMerge = json.get(ShoveInfo,"Effect")]
[h:abilityTable = json.get(ShoveInfo,"Table")]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]