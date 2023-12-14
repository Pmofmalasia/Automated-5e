[h:DisengageData = macro.args]
[h:Flavor=json.get(DisengageData,"Flavor")]
[h:ParentToken=json.get(DisengageData,"ParentToken")]
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

[h,MACRO("Disengage@Lib:pm.a5e.Core"): DisengageData]
[h:DisengageData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DisengageData,"Table"))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",json.get(DisengageData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(DisengageData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(DisengageData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(DisengageData,"AccentTextOverride"),
	"TitleFont",json.get(DisengageData,"TitleFont"),
	"BodyFont",json.get(DisengageData,"BodyFont"),
	"Class","zzOtherCombatActions",
	"Name","Disengage",
	"FalseName","",
	"OnlyRules",1
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]