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

[h,if(json.get(a5e.stat.MaxSpellSlots,"1")>0):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Spell Slots",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.SpellSlots(),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']",
		"Value",""
	))
]

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
[h:"<!-- For each ability in the abilities array, checks to see if there is a magic item bonus to the max resource, then checks to see if restored on a long rest and sets resource equal to max resource plus any magic item bonuses. Magic item bonuses do not currently work for abilities with multiple resources (therefore stored as objects). -->"]

[h:sr.Resources = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.IsActive>0 && @.RestoreShortRest==1)]")]
[h,foreach(Ability,sr.Resources),CODE:{

	[h:"<!-- TODO: Re-add magic items providing a bonus to the amount of resource restored -->"]

	[h:ResourceRestored = evalMacro(json.get(Ability,"MaxResource"))]
	[h,if(json.type(ResourceRestored)=="ARRAY"): ResourceRestored=json.get(ResourceRestored,0)]
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

[h:pm.PassiveFunction("ShortRest")]

[h:state.Dying=if(getProperty("a5e.stat.HP") <= 0, 1, 0)]
[h:state.Bloodied=if(getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP") <= 0.5, 1, 0)]
[h:bar.Health = getProperty("a5e.stat.HP") / getProperty("a5e.stat.MaxHP")]

[h:setProperty("a5e.stat.DeathSaves",json.set("","Successes",0,"Failures",0))]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",json.get(sr.Data,"ParentToken"),
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
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