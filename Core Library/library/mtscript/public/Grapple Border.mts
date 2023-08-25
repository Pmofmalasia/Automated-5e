[h:GrappleData = macro.args]
[h:Flavor = json.get(GrappleData,"Flavor")]
[h:ParentToken = json.get(GrappleData,"ParentToken")]
[h:outputTargets = "not-gm"]
[h:pm.a5e.EffectData = "[]"]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",json.get(GrappleData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(GrappleData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(GrappleData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(GrappleData,"AccentTextOverride"),
	"TitleFont",json.get(GrappleData,"TitleFont"),
	"BodyFont",json.get(GrappleData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Grapple",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","Grapple",
	"Type","Check",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:GrappleData = json.set(GrappleData,"BaseEffect",pm.a5e.BaseEffectData)]

[h,MACRO("Grapple@Lib:pm.a5e.Core"): GrappleData]
[h:GrappleInfo = macro.return]
[h:effectsToMerge = json.get(GrappleInfo,"Effect")]
[h:abilityTable = json.get(GrappleInfo,"Table")]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]