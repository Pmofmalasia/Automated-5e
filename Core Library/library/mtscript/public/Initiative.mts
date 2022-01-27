[h:InitData = macro.args]
[h:Flavor=json.get(InitData,"Flavor")]
[h:ParentToken=json.get(InitData,"ParentToken")]
[h:outputTargets = if(PC.Ally.Enemy == 2,"none","not-gm")]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(InitData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(InitData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(InitData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(InitData,"AccentTextOverride"),
	"TitleFont",json.get(InitData,"TitleFont"),
	"BodyFont",json.get(InitData,"BodyFont"),
	"Class","zzInitiative",
	"Name","Initiative",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(InitData,"Skill","Initiative","Type","Initiative","ParentToken",ParentToken,"PCOutput",outputTargets)]
[h:ReturnData = macro.return]
[h:abilityTable = json.get(ReturnData,"Table")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]

[h:addToInitiative()]
[h:setInitiative(json.get(ReturnData,"Value")+(json.get(AtrMods,"Dexterity")/100))]
[h:sortInitiative()]