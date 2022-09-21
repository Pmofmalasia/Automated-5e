[h:lu.NewAbilities = json.get(macro.args,"Abilities")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]
[h:lu.ClassArray = pm.GetClasses()]
[h:lu.ClassOptions = ""]
[h:lu.FinalClassArray = ""]
[h:lu.FinalClassOptions = ""]
[h:lu.NewAbilities = json.get(macro.args,"Abilities")]
[h:lu.SourcebookLibs = pm.GetBookInfo("Library","json")] 

[h:lu.AttrPrereqList = pm.GetAttributes("Name","json")]
[h,foreach(ClassTemp,lu.ClassArray),CODE:{
[h:lu.ClassPrereqNum = 0]
	[h,foreach(PrereqTemp,lu.AttrPrereqList),CODE:{
		[h:lu.HasPrereqs = json.get(json.get(ClassTemp,"Prereqs"),PrereqTemp)]
		[h,if(lu.HasPrereqs!="" && json.get(Attributes,PrereqTemp)!=""): lu.ClassPrereqNum = if(and(lu.HasPrereqs>0,json.get(Attributes,PrereqTemp)>=lu.HasPrereqs),lu.ClassPrereqNum+1,lu.ClassPrereqNum)]
	}]
	[h:lu.FinalClassArray = if(or(Level==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(LClass,json.get(ClassTemp,"Name"))!=""),json.append(lu.FinalClassArray,ClassTemp),lu.FinalClassArray)]
	[h:lu.FinalClassOptions = if(or(Level==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(LClass,json.get(ClassTemp,"Name"))!=""),json.append(lu.FinalClassOptions,json.get(ClassTemp,"Name")),lu.FinalClassOptions)]
	[h:lu.ClassOptions = if(or(Level==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(LClass,json.get(ClassTemp,"Name"))!=""),listAppend(lu.ClassOptions,json.get(ClassTemp,"DisplayName")+" - "+if(json.get(LClass,json.get(ClassTemp,"Name"))=="",0,json.get(LClass,json.get(ClassTemp,"Name")))),lu.ClassOptions)]
}]

[h:HPOption=if(Level==0,"","HowHP | Take Average (1d12=7   1d10=6   1d8=5   1d6=4),Roll HP | New HP | RADIO")]

[h:abort(input(
	" junkVar | Level up! |  | LABEL | SPAN=TRUE ",
	" lu.ClassChoice | "+lu.ClassOptions+" | Choose a class | RADIO ",
	HPOption
	))]
[h:lu.Class = json.get(lu.FinalClassOptions,lu.ClassChoice)]

[h:lu.NewLevel = json.get(LClass,lu.Class)+1]

[h,if(Level == 0),CODE:{
	[h:lu.NewAbilities = json.append(lu.NewAbilities,json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"FullProficiencies"))]
	[h:lu.HitDieSize = json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"HitDie")]
	[h:lu.HPIncrease = lu.HitDieSize]
};{
	[h,if(lu.NewLevel == 1),CODE:{
		[h:lu.NewAbilities = json.append(lu.NewAbilities,json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"MultiProficiencies"))]
	};{}]
	[h:lu.HitDieSize = json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"HitDie")]

	[h:lu.HPIncrease = if(HowHP == 0,floor(lu.HitDieSize/2)+1,if(HowHP == 1,eval("1d"+lu.HitDieSize),max(eval("1d"+lu.HitDieSize),floor(lu.HitDieSize/2)+1)))]
}]
[h:lu.OldConMod = json.get(AtrMods,"Constitution")]

[h:lu.SubclassTest = if(json.get(json.path.read(lu.ClassArray,"[?(@.Name=='"+lu.Class+"')]['SubclassLevel']"),0)==lu.NewLevel,1,0)]
[h,if(lu.SubclassTest),CODE:{
	[h:abort(input(
		" lu.SubclassChoice | "+pm.GetSubclasses(lu.Class,"DisplayName")+" | Choose a subclass | RADIO | VALUE=STRING "
		))]
	[h:Subclasses = json.set(Subclasses,lu.Class,lu.SubclassChoice)]
};{}]

[h:lu.ASITest = json.contains(json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"ASILevels"),lu.NewLevel)]
[h,if(lu.ASITest),CODE:{
	[MACRO("AbilityScoreIncrease@Lib:pm.a5e.Core"): json.set("","LevelUp",1,"Restrictions",if(Level==0,0,1),"ParentToken",ParentToken)]
	[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
};{}]

[h:"<!-- Adds abilities based on class, race, and background that are gained on level up, separately since race and background go off of total level -->"]

[h:tempNewAbilities = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?((@.Class=='"+pm.RemoveSpecial(Race)+"' || @.Class=='') && (@.Subclass=='"+pm.RemoveSpecial(Subrace)+"' || @.Subclass=='') && @.Level=="+(Level+1)+" && @.GainOnLevel==1)]")]

[h:tempNewAbilities = json.merge(tempNewAbilities,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Class=='Background' && @.Subclass=='"+pm.RemoveSpecial(Background)+"' && @.Level=="+(Level+1)+" && @.GainOnLevel==1)]"))]

[h:tempNewAbilities = json.merge(tempNewAbilities,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?((@.Class=='"+lu.Class+"' || @.Class=='') && (@.Subclass=='"+pm.RemoveSpecial(json.get(Subclasses,lu.Class))+"' || @.Subclass=='') && @.Level=="+lu.NewLevel+" && @.GainOnLevel==1)]"))]

[h:tempNewAbilitiesWithPrereqs = json.path.read(tempNewAbilities,"[*][?(@.Prereqs!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(feature,tempNewAbilitiesWithPrereqs),CODE:{
	[h:pm.a5e.CheckFeaturePrereqs(json.get(feature,"Prereqs"),"ParentToken",ParentToken)]
	[h,if(!macro.return): tempNewAbilities = json.path.delete(tempNewAbilities,"[*][?(@.Name=='"+json.get(feature,"Name")+"' && @.Class=='"+json.get(feature,"Class")+"' && @.Subclass=='"+json.get(feature,"Subclass")+"')]")]
}]

[h:lu.NewAbilities = json.merge(lu.NewAbilities,tempNewAbilities)]

[h:lu.FightingStyleTest = !json.isEmpty(json.path.read(lu.NewAbilities,"[*][?(@.FightingStyleList!=null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
[h,if(lu.FightingStyleTest),CODE:{
	[h:needsMacroTest = !json.contains(getMacros("json"),"Manage Fighting Styles")]
	[h,if(needsMacroTest): createMacro(json.set("","label","Manage Fighting Styles","command",'[MACRO("ManageFightingStyles@Lib:pm.a5e.Core"): json.set("","LevelUp",0,"Class","'+lu.Class+'","ParentToken",ParentToken)]',"group"," New Macros","color",pm.BorderColor("FightingStyle"),"fontColor",pm.TitleColor("FightingStyle"),"applyToSelected",1,"playerEditable",0,"minWidth",89))]
};{}]

[h,MACRO("NewAbilityProcessing@Lib:pm.a5e.Core"): json.set("","Abilities",lu.NewAbilities,"ParentToken",ParentToken)]
[h:lu.NewAbilities = json.get(macro.return,"Abilities")]
[h:lu.NewButtons = json.get(macro.return,"Buttons")]
[h:lu.NewSpells = json.get(macro.return,"Spells")]

[h:"<!-- Looks up the current amount of max resources for each ability. After all abilities are added and updated, this will be checked again. If there is increase in the in the amount of max resource, the current amount of resource is increased for that amount. This is done instead of just giving the players a long rest in case anyone wants to run a game where leveling can occur without regaining all resources.-->"]
[h,if(json.isEmpty(allAbilities)): lu.OldResources = ""; lu.OldResources = json.path.read(allAbilities,"[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:lu.OldResourcesMax = ""]
[h,foreach(ability,lu.OldResources),CODE:{
	[h:lu.OldResourcesMax = json.set(lu.OldResourcesMax,json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass"),evalMacro(json.get(ability,"MaxResource")))]
}]

[h:"<!-- Checks to see if there is already a spellcasting ability associated with this class, so that spells will be added later even if it is not the 'correct' level for it by the calculation ceiling(Level*(1/2)*(1/CastingType)). Also needed for cantrips. -->"]
[h,if(json.isEmpty(allAbilities)): lu.HadSpellcastingTest = 0; lu.HadSpellcastingTest = !json.isEmpty(json.path.read(allAbilities,"[*][?((@.Name == 'Spellcasting' || @.Name == 'PactMagic') && @.Class=='"+lu.Class+"' && (@.Subclass=='"+json.get(Subclasses,lu.Class)+"' || @.Subclass == ''))]","DEFAULT_PATH_LEAF_TO_NULL"))]

[h:"<!-- Searches AbilityUpdates for any updates to the leveled class, plus subclass combo. The object keys of any updates found replace the current corresponding object keys for that ability. -->"]
[h:lu.AbilityUpdates = json.path.read(getLibProperty("sb.AbilityUpdates","Lib:pm.a5e.Core"),"[*][?(@.Class == '"+lu.Class+"' && (@.Subclass == null || @.Subclass == '' || @.Subclass == '"+pm.RemoveSpecial(json.get(Subclasses,lu.Class))+"') && @."+lu.NewLevel+" != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.AbilityUpdates),CODE:{
	[h:lu.TempUpdates = json.fields(json.get(ability,lu.NewLevel),"json")]
	[h,foreach(updateKey,lu.TempUpdates),CODE:{
		[h:lu.ValidKeyTest = !json.isEmpty(json.path.read(allAbilities,"[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]['"+updateKey+"']"))]
		[h,if(lu.ValidKeyTest):
			allAbilities = json.path.set(allAbilities,"[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]['"+updateKey+"']",json.get(json.get(ability,lu.NewLevel),updateKey));
			allAbilities = json.path.put(allAbilities,"[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]",updateKey,json.get(json.get(ability,lu.NewLevel),updateKey))
		]
	}]
}]

[h:"<!-- Make setting everything happen last, so that cancelling level up returns to the state prior to starting the macro and not halfway. -->"]
[h:LClass = json.set(LClass,lu.Class,lu.NewLevel)]

[h:abilityTable=""]
[h,foreach(ClassTemp,lu.ClassArray),CODE:{
	[h:TempClassLevel = if(json.get(LClass,json.get(ClassTemp,"Name"))=="",0,json.get(LClass,json.get(ClassTemp,"Name")))]
	[h:abilityTable = if(TempClassLevel>0,json.append(abilityTable,json.set("","ShowIfCondensed",1,"Header",json.get(ClassTemp,"Name")+" Level","FalseHeader","","FullContents","","RulesContents",json.get(LClass,json.get(ClassTemp,"Name")),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",json.get(LClass,json.get(ClassTemp,"Name")),"Units","")),abilityTable)]
}]

[h:lu.DisplayNewAbilities = ""]
[h,foreach(ability,lu.NewAbilities),CODE:{
	[h:allAbilities = json.append(allAbilities,json.set(ability,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None"))]
	[h:lu.DisplayNewAbilities = listAppend(lu.DisplayNewAbilities,json.get(ability,"DisplayName"),"<br>")]
}]
[h:allAbilities = json.path.set(allAbilities,"[?(@.Class=='"+lu.Class+"' && @.MagicItemLink=='None')]['Level']",lu.NewLevel)]

[h:"<!-- Adds newly gained resources to the abilities array, see above. If resource existed previously, added resource amount = New difference - old difference. If resource did not exist previously, just sets resource = maxresource. -->"]
[h,if(json.isEmpty(allAbilities)): lu.NewResources = ""; lu.NewResources = json.path.read(allAbilities,"[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:lu.NewResourcesMax = ""]
[h,foreach(ability,lu.NewResources),CODE:{
	[h:lu.CurrentResource = json.get(ability,"Resource")]
	[h:lu.CurrentMax = evalMacro(json.get(ability,"MaxResource"))]
	[h,if(json.type(lu.CurrentResource)=="OBJECT"),CODE:{
		[h:lu.MultiResourceList = json.fields(lu.CurrentResource,"json")]
		[h:TempNewResources = ""]
		[h,foreach(resource,lu.MultiResourceList): TempNewResources = json.set(TempNewResources,resource,json.get(lu.CurrentResource,resource)+json.get(lu.CurrentMax,resource)-json.get(json.get(lu.OldResourcesMax,json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")),resource))]
		[h:allAbilities = json.path.set(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Resource']",TempNewResources)]
	};{
		[h,if(lu.CurrentResource == ""):
			allAbilities = json.path.put(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]","Resource",evalMacro(json.get(ability,"MaxResource"))); 
			allAbilities = json.path.set(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Resource']",lu.CurrentResource+lu.CurrentMax-json.get(lu.OldResourcesMax,json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")))]
	}]
}]

[h:abilityTable = json.append(abilityTable,json.set("","ShowIfCondensed",1,"Header","Abilities Gained","FalseHeader","","FullContents","","RulesContents",lu.DisplayNewAbilities,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",""))]

[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): json.set("","AbilityList",lu.NewButtons,"ParentToken",ParentToken)]

[h:"<!-- Addition of general resources: Happens last because the addition of abilities may change things (e.g. getting more health from a Con increase) -->"]

[h:lu.NewConMod = json.get(AtrMods,"Constitution")]
[h:MaxHitDice = json.set(MaxHitDice,"1d"+lu.HitDieSize,json.get(MaxHitDice,"1d"+lu.HitDieSize)+1)]
[h:HitDice = json.set(HitDice,"1d"+lu.HitDieSize,json.get(HitDice,"1d"+lu.HitDieSize)+1)]
[h:RolledMaxHP = RolledMaxHP+lu.HPIncrease]
[h:HP = HP+lu.HPIncrease+json.get(AtrMods,"Constitution")+((lu.NewConMod - lu.OldConMod)*(Level-1))]

[h:MaxSpellSlotsOld = MaxSpellSlots]
[h:MaxSpellSlots = table("Spell Slots",LSpellSlots)]
[h:SpellAdd = 0]
[h,count(10),CODE:{
	[h:SpellAdd = number(json.get(MaxSpellSlots,string(roll.count)))-number(json.get(MaxSpellSlotsOld,string(roll.count)))]
	[h:SpellSlots = json.set(SpellSlots,roll.count,(number(json.get(SpellSlots,string(roll.count)))+SpellAdd))]
	[h:SpellAdd = 0]
}]
[h,if(!json.equals(MaxSpellSlotsOld,MaxSpellSlots)),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","New Spell Slot Maximum",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.a5e.MaxSpellSlots(ParentToken),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h:newProfBonusTest = ceiling(Level/4)+1 != ceiling((Level-1)/4)+1]
[h,if(newProfBonusTest):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Proficiency",
		"FalseHeader","",
		"FullContents","",
		"RulesContents","Your proficiency bonus is now "+Proficiency+".",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h:"<!-- Adds newly gained spell macros to the character. Occurs after gaining spell slots because filtering macro limits to spells that you have slots for by default -->"]
[h:"<!-- Switch statement is temporary until spells are adjusted in the way their classes are stored -->"]
[h,if(json.isEmpty(allAbilities)): lu.NewSpellClass = "[]"; lu.NewSpellClass = json.path.read(allAbilities,"[*][?((@.Name == 'Spellcasting' || @.Name == 'PactMagic') && @.Class=='"+lu.Class+"' && (@.Subclass=='"+json.get(Subclasses,lu.Class)+"' || @.Subclass == ''))]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(lu.NewSpellClass)),CODE:{
	[h:lu.NewSpellClass = json.get(lu.NewSpellClass,0)]
	[h,switch(json.get(lu.NewSpellClass,"Class")),CODE:
		case "Artificer": {[h:TempSpellClass = "Art"]};
		case "Bard": {[h:TempSpellClass = "Brd"]};
		case "Cleric": {[h:TempSpellClass = "Clc"]};
		case "Druid": {[h:TempSpellClass = "Drd"]};
		case "Paladin": {[h:TempSpellClass = "Pdn"]};
		case "Ranger": {[h:TempSpellClass = "Rgr"]};
		case "Sorcerer": {[h:TempSpellClass = "Scr"]};
		case "Warlock": {[h:TempSpellClass = "Wlk"]};
		case "Wizard": {[h:TempSpellClass = "Wiz"]};
		default: {[h:TempSpellClass = "Wiz"]}
		]
	[h:TempSpellClass = json.get(lu.NewSpellClass,"Class")]
	
	[h:MaxSpellLevel = 9]
	[h:spellLevelCap = if(json.get(lu.NewSpellClass,"CasterCap")=="",MaxSpellLevel,json.get(lu.NewSpellClass,"CasterCap"))]
	[h:lu.NewSpellFilter = if(
		or(lu.HadSpellcastingTest==0,and(ceiling(json.get(lu.NewSpellClass,"Level")*(1/2)*json.get(lu.NewSpellClass,"CasterType"))!=ceiling((json.get(lu.NewSpellClass,"Level")-1)*(1/2)*json.get(lu.NewSpellClass,"CasterType")),ceiling(json.get(lu.NewSpellClass,"Level")*(1/2)*json.get(lu.NewSpellClass,"CasterType"))<=spellLevelCap)),
		json.set("","Class",json.append("",TempSpellClass),"Level",json.append("",ceiling(json.get(lu.NewSpellClass,"Level")*(1/2)*json.get(lu.NewSpellClass,"CasterType")))),
		"")]
		
	[h,if(lu.NewSpellFilter==""): 
		lu.NewSpellFilter = if(lu.HadSpellcastingTest,lu.NewSpellFilter,json.set("","Class",json.append("",TempSpellClass),"Level",json.append("",0)));
		lu.NewSpellFilter = if(lu.HadSpellcastingTest,lu.NewSpellFilter,json.set(lu.NewSpellFilter,"Class",json.append(json.get(lu.NewSpellFilter,"Class"),TempSpellClass),"Level",json.append(json.get(lu.NewSpellFilter,"Level"),0)))
	]
	
	[h,if(lu.NewSpellFilter!=""),CODE:{
		[h,MACRO("CreatePlayerSpellMacro@Lib:pm.a5e.Core"): json.set("","Spells",json.get(pm.SpellFilter(lu.NewSpellFilter),"Spells"),"ParentToken",ParentToken)]
	};{}]
};{}]

[h:"<!-- Adds newly gained spell macros from outside of the regular spell list, e.g. Cleric domain spells, feats, etc. -->"]
[h,if(!json.isEmpty(lu.NewSpells)),CODE:{
	[h,MACRO("CreatePlayerSpellMacro@Lib:pm.a5e.Core"): json.set("","Spells",lu.NewSpells,"ParentToken",ParentToken)]
}]

[h:"<!-- Start of output creation -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",token.name+" suddenly feels empowered by experience!",
	"ParentToken",ParentToken,
	"DMOnly",if(getProperty("stat.Allegiance")=="PC",0,1),
	"BorderColorOverride","",
	"TitleFontColorOverride","",
	"AccentBackgroundOverride","",
	"AccentTextOverride","",
	"TitleFont","",
	"BodyFont","",
	"Class",lu.Class,
	"Name","Level Up!",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:AccentFormat = json.get(FormattingData,"AccentFormat")]
[h:VerticalFormat = json.get(FormattingData,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(FormattingData,"VerticalFormatLinks")]
[h:TableFormat = json.get(FormattingData,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(FormattingData,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(FormattingData,"NoRolls")]
[h:outputTest.NoRules = json.get(FormattingData,"NoRules")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1,ParentToken)]

[h:output.PC = output.PC + json.get(output.Temp,"Player")]
[h:output.GM = output.GM + json.get(output.Temp,"GM")]

[h:AbilityGainedText = ""]
[h:output.PC = output.PC + AbilityGainedText + "</div></div>"]
[h:output.GM = output.GM + AbilityGainedText + "</div></div>"]
[h:broadcastAsToken(output.PC,"not-gm")]
[h:broadcastAsToken(output.GM,"gm")]