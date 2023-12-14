[h:sr.Data = macro.args]
[h:Flavor=json.get(sr.Data,"Flavor")]
[h:ParentToken=json.get(sr.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Short Rest"]
[h:IsTooltip = 0]
[h:abilityTable = ""]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Hit Dice Available",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",a5e.HitDieDisplay(),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"Value",""
))]

[h:setProperty("stat.Concentration","")]

[h,if(getProperty("a5e.stat.Exhaustion") == 0): exhaustionMessage = "Exhaustion fully recovered."; exhaustionMessage = "Disadvantage on ability checks"+if(getProperty("a5e.stat.Exhaustion")>=2 && getProperty("a5e.stat.Exhaustion")<5,", speed halved","")+if(getProperty("a5e.stat.Exhaustion")>=3,", disadvantage on attack rolls and saving throws","")+if(getProperty("a5e.stat.Exhaustion")>=4,", hit point maximum halved","")+if(getProperty("a5e.stat.Exhaustion")>=5,", speed reduced to 0","")]
	
[h,if(getProperty("a5e.stat.Exhaustion")>0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Level "+getProperty("a5e.stat.Exhaustion")+" Exhaustion",
	"FalseHeader","",
	"FullContents",exhaustionMessage,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']",
	"Value",""
))]

[h:pm.a5e.EventResourceRestoration("ShortRest")]

[h:pm.PassiveFunction("ShortRest")]

[h:setProperty("a5e.stat.DeathSaves",json.set("","Successes",0,"Failures",0))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",json.get(sr.Data,"ParentToken"),
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",if(json.get(sr.Data,"BorderColorOverride")=="","#444444",json.get(sr.Data,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(sr.Data,"TitleFontColorOverride")=="","#FFFFFF",json.get(sr.Data,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(sr.Data,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(sr.Data,"AccentTextOverride"),
	"TitleFont",json.get(sr.Data,"TitleFont"),
	"BodyFont",json.get(sr.Data,"BodyFont"),
	"Class","",
	"Name","Short Rest",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")+json.get(output.Temp,"Player")+token.name+" has completed a <b>Short Rest</b></div></div>"]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")+json.get(output.Temp,"GM")+token.name+" has completed a <b>Short Rest</b></div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,if(isGM(),"none","self"))]