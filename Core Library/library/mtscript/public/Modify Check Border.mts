[h:CheckData = macro.args]
[h:Flavor=json.get(CheckData,"Flavor")]
[h:ParentToken=json.get(CheckData,"ParentToken")]
[h:outputTargets = json.get(CheckData,"PCOutput")]
[h,if(outputTargets == ""): outputTargets = "not-gm"]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
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

[h,MACRO("Modify Check@Lib:pm.a5e.Core"): CheckData]
[h:CheckData = macro.return]
[h:abilityTable = json.get(CheckData,"Table")]

[h:effectID = json.get(CheckData,"ID")]
[h,if(effectID==""),CODE:{};{
	[h:"<!-- TODO: Add contested check data from the token setting the DC to the effect data -->"]
	[h,if(json.get(CheckData,"Contested")==1): 
		rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['DC']",json.remove(CheckData,"EffectID"));
		rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+ParentToken+"']",json.remove(CheckData,"EffectID"))
	]
	[h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
}]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]