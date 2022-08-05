[h:HideData = macro.args]
[h:Flavor=json.get(HideData,"Flavor")]
[h:ParentToken=json.get(HideData,"ParentToken")]
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

[h,MACRO("Hide@Lib:pm.a5e.Core"): HideData]
[h:HideData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(HideData,"Table"))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(HideData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(HideData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(HideData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(HideData,"AccentTextOverride"),
	"TitleFont",json.get(HideData,"TitleFont"),
	"BodyFont",json.get(HideData,"BodyFont"),
	"Class","zzOtherCombatActions",
	"Name","Hide",
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