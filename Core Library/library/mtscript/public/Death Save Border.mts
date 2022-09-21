[h:DeathData = macro.args]
[h:Flavor=json.get(DeathData,"Flavor")]
[h:ParentToken=json.get(DeathData,"ParentToken")]
[h:outputTargets = if(getProperty("stat.Allegiance") == "Enemy","none","not-gm")]

[h,MACRO("Death Save@Lib:pm.a5e.Core"): DeathData]
[h:abilityTable = json.get(macro.return,"Table")]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(DeathData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(DeathData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(DeathData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(DeathData,"AccentTextOverride"),
	"TitleFont",json.get(DeathData,"TitleFont"),
	"BodyFont",json.get(DeathData,"BodyFont"),
	"Class","zzDeath",
	"Name","Death Saving Throw",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]