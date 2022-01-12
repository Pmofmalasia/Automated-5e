[h:CheckData = macro.args]
[h:Flavor=json.get(CheckData,"Flavor")]
[h:ParentToken=json.get(CheckData,"ParentToken")]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",if(json.get(CheckData,"OutputTargets")=="none",1,0),
	"BorderColorOverride",json.get(CheckData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(CheckData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(CheckData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(CheckData,"AccentTextOverride"),
	"TitleFont",json.get(CheckData,"TitleFont"),
	"BodyFont",json.get(CheckData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Skill Check Reroll",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(CheckData,"ParentToken",ParentToken,"Formatting",FormattingData,"Output",json.set("","Player",output.PC,"GM",output.GM))]

[h:output.PC = json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,json.get(CheckData,"OutputTargets"))]