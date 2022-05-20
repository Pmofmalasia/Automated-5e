[h:DodgeData = macro.args]
[h:Flavor=json.get(DodgeData,"Flavor")]
[h:ParentToken=json.get(DodgeData,"ParentToken")]
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

[h,MACRO("Dodge@Lib:pm.a5e.Core"): DodgeData]
[h:DodgeData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DodgeData,"Table"))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(DodgeData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(DodgeData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(DodgeData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(DodgeData,"AccentTextOverride"),
	"TitleFont",json.get(DodgeData,"TitleFont"),
	"BodyFont",json.get(DodgeData,"BodyFont"),
	"Class","zzOtherCombatActions",
	"Name","Dodge",
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