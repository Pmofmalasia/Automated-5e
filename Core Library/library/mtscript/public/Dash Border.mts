[h:DashData = macro.args]
[h:Flavor=json.get(DashData,"Flavor")]
[h:ParentToken=json.get(DashData,"ParentToken")]
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

[h,MACRO("Dash@Lib:pm.a5e.Core"): DashData]
[h:DashData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DashData,"Table"))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(DashData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(DashData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(DashData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(DashData,"AccentTextOverride"),
	"TitleFont",json.get(DashData,"TitleFont"),
	"BodyFont",json.get(DashData,"BodyFont"),
	"Class","zzOtherCombatActions",
	"Name","Dash",
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