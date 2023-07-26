[h:lr.Data = macro.args]
[h:IsTooltip = 0]
[h:Flavor=json.get(lr.Data,"Flavor")]
[h:ParentToken=json.get(lr.Data,"ParentToken")]
[h:abilityTable = ""]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Long Rest"]

[h:setAllStates(0)]

[h:setProperty("a5e.stat.HP",getProperty("a5e.stat.MaxHP"))]
[h:setProperty("a5e.stat.TempHP",0)]
[h:LongRestTest=1]

[h:HitDieSizes = json.fields(getProperty("a5e.stat.MaxHitDice"))]
[h,foreach(DieSize,HitDieSizes),CODE:{
	[h:CurrentHD = if(json.get(getProperty("a5e.stat.HitDice"),+DieSize)=="",0,json.get(getProperty("a5e.stat.HitDice"),DieSize))]
	[h:HDRecharge = max(1,floor(json.get(getProperty("a5e.stat.MaxHitDice"),DieSize)/2))]
	[h:HDNewTotal = min(json.get(getProperty("a5e.stat.MaxHitDice"),DieSize),CurrentHD+HDRecharge)]
	[h:setProperty("a5e.stat.HitDice",json.set(getProperty("a5e.stat.HitDice"),DieSize,HDNewTotal))]
}]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Hit Dice",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",a5e.HitDieDisplay(),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
	
[h:setProperty("a5e.stat.SpellSlots",getProperty("a5e.stat.MaxSpellSlots"))]
[h,if(json.get(a5e.stat.MaxSpellSlots,"1")>0):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Spell Slots",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.SpellSlots(),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h:setProperty("a5e.stat.Concentration","")]

[h:OldExhaustion = getProperty("a5e.stat.Exhaustion")]
[h:setProperty("a5e.stat.Exhaustion",Max(getProperty("a5e.stat.Exhaustion")-1,0))]
[h:setState("Exhaustion1",if(getProperty("a5e.stat.Exhaustion")==1,1,0))]
[h:setState("Exhaustion2",if(getProperty("a5e.stat.Exhaustion")==2,1,0))]
[h:setState("Exhaustion3",if(getProperty("a5e.stat.Exhaustion")==3,1,0))]
[h:setState("Exhaustion4",if(getProperty("a5e.stat.Exhaustion")==4,1,0))]
[h:setState("Exhaustion5",if(getProperty("a5e.stat.Exhaustion")==5,1,0))]
[h,if(getProperty("a5e.stat.Exhaustion") == 0): exhaustionMessage = "Exhaustion fully recovered."; exhaustionMessage = "Disadvantage on ability checks"+if(getProperty("a5e.stat.Exhaustion")>=2 && getProperty("a5e.stat.Exhaustion")<5,", speed halved","")+if(getProperty("a5e.stat.Exhaustion")>=3,", disadvantage on attack rolls and saving throws","")+if(getProperty("a5e.stat.Exhaustion")>=4,", hit point maximum halved","")+if(getProperty("a5e.stat.Exhaustion")>=5,", speed reduced to 0","")]
	
[h,if(OldExhaustion>0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Level "+getProperty("a5e.stat.Exhaustion")+" Exhaustion",
	"FalseHeader","",
	"FullContents",exhaustionMessage,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']"
))]
[h:"<!-- For each ability in the abilities array, checks to see if there is a magic item bonus to the max resource, then checks to see if restored on a long rest and sets resource equal to max resource plus any magic item bonuses. Magic item bonuses do not currently work for abilities with multiple resources (therefore stored as objects). -->"]

[h:lr.Resources = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.RestoreLongRest==1)]")]
[h,foreach(Ability,lr.Resources),CODE:{
	[h:ResourceRestored = evalMacro(json.get(Ability,"MaxResource"))]
	[h,if(json.type(ResourceRestored)=="ARRAY"): ResourceRestored=json.get(ResourceRestored,0)]

	[h:"<!-- TODO: Re-add magic items providing a bonus to the amount of resource restored -->"]

	[h,if(json.type(ResourceRestored)=="OBJECT"),CODE:{
		[h:ResourceRestoredFinal=ResourceRestored]
		[h,foreach(tempResource,json.fields(ResourceRestoredFinal,"json")): abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(Ability,"DisplayName")+": "+tempResource,
			"FalseHeader","",
			"FullContents","",
			"RulesContents",json.get(ResourceRestoredFinal,tempResource),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",json.get(ResourceRestoredFinal,tempResource)
		))]
	};{
		[h:ResourceRestoredFinal=ResourceRestored]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(Ability,"DisplayName"),
			"FalseHeader","",
			"FullContents","",
			"RulesContents",ResourceRestoredFinal,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",ResourceRestoredFinal
		))]
	}]

	[h:needsPutTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?("+pm.a5e.PathFeatureFilter(Ability)+" && @.Resource==null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
	[h,if(needsPutTest):
		setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"[?("+pm.a5e.PathFeatureFilter(Ability)+")]","Resource",ResourceRestoredFinal));
		setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[?("+pm.a5e.PathFeatureFilter(Ability)+")]['Resource']",ResourceRestoredFinal))
	]
}]

[h:lr.ItemResources = json.path.read(getProperty("a5e.stat.Inventory"),"[?(@.RestoreLongRest==1 || @.RestoreDawn==1)]")]
[h,foreach(tempItem,lr.ItemResources),CODE:{
	[h:ResourceRestored = evalMacro(json.get(tempItem,"MaxResource"))]
	[h,if(json.type(ResourceRestored)=="ARRAY"): ResourceRestored=json.get(ResourceRestored,0)]

	[h,if(json.type(ResourceRestored)=="OBJECT"),CODE:{
		[h:ResourceRestoredFinal=ResourceRestored]
		[h,foreach(tempResource,json.fields(ResourceRestoredFinal,"json")): abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(tempItem,"DisplayName")+": "+tempResource,
			"FalseHeader","",
			"FullContents","",
			"RulesContents",json.get(ResourceRestoredFinal,tempResource),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",json.get(ResourceRestoredFinal,tempResource)
		))]
	};{
		[h:ResourceRestoredFinal=ResourceRestored]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(tempItem,"DisplayName"),
			"FalseHeader","",
			"FullContents","",
			"RulesContents",ResourceRestoredFinal,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",ResourceRestoredFinal
		))]
	}]

	[h:needsPutTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.Inventory"),"[?(@.ItemID=='"+json.get(tempItem,"ItemID")+"' && @.Resource==null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
	[h,if(needsPutTest):
		setProperty("a5e.stat.Inventory",json.path.put(getProperty("a5e.stat.Inventory"),"[?(@.ItemID=='"+json.get(tempItem,"ItemID")+"')]","Resource",ResourceRestoredFinal));
		setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"[?(@.ItemID=='"+json.get(tempItem,"ItemID")+"')]['Resource']",ResourceRestoredFinal))
	]
}]

[h:pm.PassiveFunction("LongRest")]

[h:ArcaneWard=if(json.get(getProperty("a5e.stat.Subclasses"),"Wizard")=="Abjuration",json.set(ArcaneWard,"HP",0,"Active",0,"Use",1),ArcaneWard)]

[h:state.Dying=if(getProperty("a5e.stat.HP") <= 0, 1, 0)]
[h:state.Bloodied=if(getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP") <= 0.5, 1, 0)]
[h:bar.Health = getProperty("a5e.stat.HP") / getProperty("a5e.stat.MaxHP")]

[h:setProperty("a5e.stat.DeathSaves",json.set("", "Successes",0,"Failures",0))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",json.get(lr.Data,"ParentToken"),
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderColorOverride",if(json.get(lr.Data,"BorderColorOverride")=="","#444444",json.get(lr.Data,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(lr.Data,"TitleFontColorOverride")=="","#FFFFFF",json.get(lr.Data,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(lr.Data,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(lr.Data,"AccentTextOverride"),
	"TitleFont",json.get(lr.Data,"TitleFont"),
	"BodyFont",json.get(lr.Data,"BodyFont"),
	"Class","",
	"Name","Long Rest",
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

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")+json.get(output.Temp,"Player")+token.name+" has completed a <b>Long Rest</b></div></div>"]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")+json.get(output.Temp,"GM")+token.name+" has completed a <b>Long Rest</b></div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,if(isGM(),"none","self"))]