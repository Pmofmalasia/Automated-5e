[h:TestData = macro.args]
[h:Flavor=json.get(TestData,"Flavor")]
[h:ParentToken=json.get(TestData,"ParentToken")]
[h:outputTargets = json.get(TestData,"PCOutput")]
[h:d20TestType = json.get(TestData,"TestType")]
[h,if(outputTargets == ""): outputTargets = "not-gm"]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",json.get(TestData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(TestData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(TestData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(TestData,"AccentTextOverride"),
	"TitleFont",json.get(TestData,"TitleFont"),
	"BodyFont",json.get(TestData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name",d20TestType+" Reroll",
	"FalseName","",
	"OnlyRules",0
)]

[h,if(d20TestType == "Attack"): ClassFeatureData = json.set(ClassFeatureData,"Class","zzWeaponAttack")]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("ModifyD20Test@Lib:pm.a5e.Core"): TestData]
[h:TestData = macro.return]
[h:abilityTable = json.get(TestData,"Table")]

[h:effectID = json.get(TestData,"ID")]
[h,if(effectID==""),CODE:{};{
	[h:"<!-- TODO: Add contested check data from the token setting the DC to the effect data -->"]
	[h,switch(d20TestType),CODE:
		case "Check":{
			[h,if(json.get(TestData,"Contested")==1):
				rerollEffectPath = "[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['DC']";
				rerollEffectPath = "[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+ParentToken+"']"
			]
		};
		case "Save":{
			[h:rerollEffectPath = "[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+ParentToken+"']"]
		};
		case "Attack":{
			[h:rerollEffectPath = "[*][?(@.ID=="+effectID+")]['ToResolve']['Attack']"]
		}
	]

	[h:rerolledEffect = json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),rerollEffectPath,json.remove(TestData,"ID"))]
	[h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
}]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]