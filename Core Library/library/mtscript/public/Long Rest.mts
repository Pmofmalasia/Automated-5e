[h:lr.Data = macro.args]
[h:Flavor=json.get(lr.Data,"Flavor")]
[h:ParentToken=json.get(lr.Data,"ParentToken")]
[h:a5e.GatherAbilities()]
[h:abilityTable = ""]

[h:setAllStates(0)]

[h:HP=MaxHP]
[h:TempHP=0]
[h:LongRestTest=1]

[h:Twelve=json.get(HitDice,"1d12")]
[h:MTwelve=json.get(MaxHitDice,"1d12")]
[h:Ten=json.get(HitDice,"1d10")]
[h:MTen=json.get(MaxHitDice,"1d10")]
[h:Eight=json.get(HitDice,"1d8")]
[h:MEight=json.get(MaxHitDice,"1d8")]
[h:Six=json.get(HitDice,"1d6")]
[h:MSix=json.get(MaxHitDice,"1d6")]

[h:HDRecharge=max(1,floor(Level/2))]

[h:DifTwelve=MTwelve-Twelve]
[h:DifTen=MTen-Ten]
[h:DifEight=MEight-Eight]
[h:DifSix=MSix-Six]

[h:Twelve=Twelve+min(DifTwelve,HDRecharge)][h:HDRecharge=max(HDRecharge-DifTwelve,0)]
[h:Ten=Ten+min(DifTen,HDRecharge)][h:HDRecharge=max(HDRecharge-DifTen,0)]
[h:Eight=Eight+min(DifEight,HDRecharge)][h:HDRecharge=max(HDRecharge-DifEight,0)]
[h:Six=Six+min(DifSix,HDRecharge)][h:HDRecharge=max(HDRecharge-DifSix,0)]

[h:HitDice=json.set("","1d12",Twelve,"1d10",Ten,"1d8",Eight,"1d6",Six)]
[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Hit Dice",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.HitDieDisplay(),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",""
			))]
	
[h:SpellSlots=MaxSpellSlots]
[h,if(json.get(MaxSpellSlots,"1")>0):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Spell Slots",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.SpellSlots(),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']",
		"Value",""
		))]
			
[h:Concentration=""]

[h:OldExhaustion = Exhaustion]
[h:Exhaustion=Max(Exhaustion-1,0)]
[h:setState("Exhaustion1",if(Exhaustion==1,1,0))]
[h:setState("Exhaustion2",if(Exhaustion==2,1,0))]
[h:setState("Exhaustion3",if(Exhaustion==3,1,0))]
[h:setState("Exhaustion4",if(Exhaustion==4,1,0))]
[h:setState("Exhaustion5",if(Exhaustion==5,1,0))]
[h,if(Exhaustion == 0): exhaustionMessage = "Exhaustion fully recovered."; exhaustionMessage = "Disadvantage on ability checks"+if(Exhaustion>=2 && Exhaustion<5,", speed halved","")+if(Exhaustion>=3,", disadvantage on attack rolls and saving throws","")+if(Exhaustion>=4,", hit point maximum halved","")+if(Exhaustion>=5,", speed reduced to 0","")]
	
[h,if(OldExhaustion>0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Level "+Exhaustion+" Exhaustion",
	"FalseHeader","",
	"FullContents",exhaustionMessage,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']",
	"Value",""
	))]
[h:"<!-- For each ability in the abilities array, checks to see if there is a magic item bonus to the max resource, then checks to see if restored on a long rest and sets resource equal to max resource plus any magic item bonuses. Magic item bonuses do not currently work for abilities with multiple resources (therefore stored as objects). -->"]

[h:lr.Resources = json.path.read(allAbilities,"[?(@.IsActive>0 && @.RestoreLongRest==1)]")]
[h,foreach(Ability,lr.Resources),CODE:{
	[h:miResourceBonus = 0]
	[h:miResourceBonusItems = json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+json.get(Ability,"Name")+"' && @.Class=='"+json.get(Ability,"Class")+"' && @.Subclass=='"+json.get(Ability,"Subclass")+"' && @.MaxResourceBonus!=0)]['MaxResourceBonus']")]
	[h,foreach(item,miResourceBonusItems),CODE:{[h:miResourceBonus=miResourceBonusItems+item]}]
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
		[h:ResourceRestoredFinal=(ResourceRestored+miResourceBonus)]
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
	[h:allAbilities = json.path.set(allAbilities,"[?(@.Name=='"+json.get(Ability,"Name")+"' && @.Class=='"+json.get(Ability,"Class")+"' && @.Subclass=='"+json.get(Ability,"Subclass")+"')]['Resource']",ResourceRestoredFinal)]
}]

[h:pm.PassiveFunction("LongRest")]

[h:ArcaneWard=if(json.get(Subclasses,"Wizard")=="Abjuration",json.set(ArcaneWard,"HP",0,"Active",0,"Use",1),ArcaneWard)]

[h:state.Dying=if(HP <= 0, 1, 0)]
[h:state.Bloodied=if(HP/MaxHP <= 0.5, 1, 0)]
[h:bar.Health = HP / MaxHP]

[h:DeathSaves=json.set("{ }", "Successes",0,"Failures",0)]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",json.get(lr.Data,"ParentToken"),
	"DMOnly",json.get(lr.Data,"DMOnly"),
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