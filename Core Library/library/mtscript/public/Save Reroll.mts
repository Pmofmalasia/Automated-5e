[h:SaveData = macro.args]
[h:Flavor=json.get(SaveData,"Flavor")]
[h:ParentToken=json.get(SaveData,"ParentToken")]
[h:outputTargets = json.get(SaveData,"PCOutput")]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",if(json.get(SaveData,"OutputTargets")=="none",1,0),
	"BorderColorOverride",json.get(SaveData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(SaveData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(SaveData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(SaveData,"AccentTextOverride"),
	"TitleFont",json.get(SaveData,"TitleFont"),
	"BodyFont",json.get(SaveData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Saving Throw Reroll",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Save@Lib:pm.a5e.Core"): SaveData]
[h:SaveData = macro.return]
[h:abilityTable = json.get(SaveData,"Table")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]