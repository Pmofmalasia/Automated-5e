[h:HelpData = macro.args]
[h:Flavor=json.get(HelpData,"Flavor")]
[h:ParentToken=json.get(HelpData,"ParentToken")]
[h:abilityTable = "[]"]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Usage Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","1 Action",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,MACRO("Help@Lib:pm.a5e.Core"): HelpData]
[h:HelpData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(HelpData,"Table"))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",json.get(HelpData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(HelpData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(HelpData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(HelpData,"AccentTextOverride"),
	"TitleFont",json.get(HelpData,"TitleFont"),
	"BodyFont",json.get(HelpData,"BodyFont"),
	"Class","zzOtherCombatActions",
	"Name","Help",
	"FalseName","",
	"OnlyRules",1
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,0)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]