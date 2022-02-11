[h:ab.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:ab.ClassList = pm.GetClasses("DisplayName",",")]
[h:ab.AtrList = pm.GetAttributes("DisplayName")]
[h:ab.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:ab.Final = json.get(macro.args,"Feature")]
[h:ab.Type = json.get(ab.Final,"Type")]
[h:ab.Prereqs = json.get(macro.args,"PrereqsTest")]

[h:ab.Level = json.get(ab.Final,"Level")]
[h:ab.UpdateLevelOptions = string(ab.Level)]
[h,count(20-ab.Level): ab.UpdateLevelOptions = listAppend(ab.UpdateLevelOptions,ab.Level+roll.count+1)]

[h:ab.Updates = json.remove(ab.Final,"GainOnLevel")]
[h:ab.Updates = json.remove(ab.Updates,"Optional")]
[h:ab.Updates = json.remove(ab.Updates,"Multiability")]
[h:ab.NoUpdatesTest = ab.Updates]

[h:abort(input(
	" junkVar | ---------------------- Miscellaneous Choices on Gaining Feature ---------------------- |  | LABEL | SPAN=TRUE ",	" ab.IsClassOptions |  | <html><span title='Mostly for feats, e.g. Magic Initiate'>Choose an associated class?</span></html> | CHECK ",
	" ab.PrimeAttribute | None,"+ab.AtrList+",Variable | <html><span title='Variable option is mostly for feats that have you choose a stat. NOTE: This selection will not also grant the +1 or whatever bonus to that stat, that must be done separately later.'>Primary stat for feature</span></html> | LIST | VALUE=STRING ",
	" ab.IsSpellList | None,Preset Spells,Chosen When Gained,Mix of Both | <html><span title='Note: This ONLY applies for abilities that grant the spell for use with spell slots or as a cantrip (e.g. would NOT apply for tiefling innate spells, but would for cleric domain spells)'>Feature adds known spells</span></html> | LIST ",
	" ab.IsFightingStyles | 0 | Feature grants access to fighting styles | CHECK ",
	" ab.DamageType | No,Chosen When Gained,Chosen Through Button | Has an associated damage type | LIST ",
	" ab.StoredValue | None,Chosen When Gained,Chosen through button | <html><span title='For abilities that may require a choice to be made that modify how it functions (e.g. Transmutation Wizard - Transmuters Stone)'>Feature stores a miscellaneous value</span></html> | LIST",
	" ab.ChooseSubabilities | None,Chosen on Level Up,Chosen through button | <html><span title='For the main feature ONLY, e.g. Battle Master Fighter - Combat Superiority BUT not each individual maneuver. No mechanical difference between chosen through button/level up, but may want to choose via button for things subject to change.'>Feature has subfeatures</span></html> | LIST",	" ab.Resource |  | <html><span title='Does NOT apply for abilities that use resources of another feature, e.g. Lore Bard - Cutting Words/Bardic Inspiration, Battle Master Fighter - Superiority Dice'>Has its own associated resource</span></html> | CHECK "
	))]

[h,if(ab.ChooseSubabilities==1),CODE:{
[h:ab.Final = json.set(ab.Final,
	"ChooseSubabilities",1
)]
};{}]

[h,if(ab.IsClassOptions),CODE:{
	
	[h:disClassOptions = " junkVar | ---------------------- Class Choice Options ---------------------- |  | LABEL | SPAN=TRUE "]
	[h,foreach(TempClass,pm.GetClasses("DisplayName",",")): disClassOptions = listAppend(disClassOptions," temp."+pm.RemoveSpecial(TempClass)+" |  | "+TempClass+" | CHECK ","##")]
	
	[h:abort(input(disClassOptions))]

	[h:ab.ClassOptions = ""]
	[h,foreach(TempClass,pm.GetClasses("DisplayName",",")): ab.ClassOptions = if(eval("temp."+pm.RemoveSpecial(TempClass)),json.append(ab.ClassOptions,TempClass),ab.ClassOptions)]
	
	[h:ab.Final = json.set(ab.Final,
		"ClassOptions",ab.ClassOptions
	)]
};{}]

[h,if(ab.PrimeAttribute=="Variable"),CODE:{
	[h:ab.AttributeOptions = " junkVar | Choose which of the following can be selected as the primary stat for the feature |  | LABEL | SPAN=TRUE ## ab.AttrDescMethod | Choice,Chosen Attribute,Chosen Class Casting Stat,Maximum,Minimum | <html><span title='Choice vs. Chosen Attribute: Choice is for decisions made by the player independent of any other. Chosen attribute is for things like feats where the player chooses a stat to add points to, and then the prime stat becomes that stat. Chosen attribute and chosen class will ignore your selections of possible stats.'>Method of choosing among the options</span></html> | LIST | VALUE=STRING "]
	[h,foreach(TempAtr,ab.AtrList): ab.AttributeOptions = listAppend(ab.AttributeOptions,"ab."+pm.RemoveSpecial(TempAtr)+"Option |  | "+TempAtr+" | CHECK ","##")]

	[h:abort(input(ab.AttributeOptions))]

	[h:"<!-- Note: pm.RemoveSpecial call is correctly left out here so DisplayName can be used for choosing the attribute. pm.RemoveSpecial happens after the choice. -->"]
	[h,if(ab.AttrDescMethod == "Choice"),CODE:{
		[h:ab.PrimeOptions = json.set("","ChoiceMethod","Choice")]
		[h,foreach(TempAtr,ab.AtrList): ab.PrimeOptions = json.set(ab.PrimeOptions,TempAtr,eval("ab."+pm.RemoveSpecial(TempAtr)+"Option"))]
		[h:ab.Final = json.set(ab.Final,"PrimeStatOptions",ab.PrimeOptions)]
	};{}]
	
	[h,if(ab.AttrDescMethod == "Chosen Attribute"),CODE:{
		[h:ab.PrimeOptions = json.set("","ChoiceMethod","Attribute")]
		[h:ab.Final = json.set(ab.Final,"PrimeStatOptions",ab.PrimeOptions)]
	};{}]
	
	[h,if(ab.AttrDescMethod == "Chosen Class Casting Stat"),CODE:{
		[h:ab.PrimeOptions = json.set("","ChoiceMethod","Class")]
		[h:ab.Final = json.set(ab.Final,"PrimeStatOptions",ab.PrimeOptions)]
	};{}]
	
	[h,if(ab.AttrDescMethod == "Maximum" || ab.AttrDescMethod == "Minimum"),CODE:{
		[h:ab.PrimeOptions = ""]
		[h,foreach(TempAtr,ab.AtrList): ab.PrimeOptions = if(eval("ab."+pm.RemoveSpecial(TempAtr)+"Option"),json.append(ab.PrimeOptions,pm.RemoveSpecial(TempAtr)),ab.PrimeOptions)]
		[h:ab.Final = json.set(ab.Final,"PrimeStat",json.set("","Stats",ab.PrimeOptions,"EvalMethod",if(ab.AttrDescMethod=="Maximum","max","min")))]
	};{}]
};{
	[h,if(ab.PrimeAttribute!="None"): ab.Final = json.set(ab.Final,"PrimeStat",pm.RemoveSpecial(ab.PrimeAttribute))]
}]

[h,if(ab.IsSpellList==1 || ab.IsSpellList==3),CODE:{
	[h:DoneAddingSpellsTest = 0]
	[h:ab.SpellList = ""]
	[h:ReuseFilter = 0]
	[h:ab.LevelsChosen = ""]
	[h,while(DoneAddingSpellsTest == 0),CODE:{
		[h:abort(input(
			if(roll.count==0," junkVar | ---------------------- Spell List Selection ---------------------- |  | LABEL | SPAN=TRUE ",""),
			if(roll.count==0," junkVar | On the next screen, use the filters to find the spell you are looking for. |  | LABEL | SPAN=TRUE ",""),
			if(roll.count==0," SpellListLevelChanges |  | Are additional spells added at higher levels | CHECK ","")
		))]
		[h,if(ReuseFilter==0): TempSpellFilter = json.set(pm.SpellFilterInput(),"IgnoreLevelCap",1)]
		[h:abort(input(
			" TempSpellChoice | "+json.get(pm.SpellFilter(TempSpellFilter),"Options")+" | Choose a spell to add to the list | LIST | VALUE=STRING ",
			" ReuseFilter |  | Use same filter for next spell? | CHECK",
			" IgnoreChoice | Yes,No - Ignore choice and try again | Spell found in the list | RADIO ",
			if(SpellListLevelChanges," LevelGainedSpellList | "+ab.UpdateLevelOptions+" | Level spell is gained | LIST | VALUE=STRING ",""),
			" DoneAddingSpellsTest |  | Finish adding spells to the list | CHECK "
		))]
		[h,if(SpellListLevelChanges==0): LevelGainedSpellList=ab.Level]
		[h:ab.SpellList = if(IgnoreChoice,ab.SpellList,json.append(ab.SpellList,json.set("","Spell",TempSpellChoice,"Level",number(LevelGainedSpellList))))]
		[h:ab.LevelsChosen = if(json.contains(ab.LevelsChosen,number(LevelGainedSpellList)),ab.LevelsChosen,json.append(ab.LevelsChosen,number(LevelGainedSpellList)))]
	}]
	[h:ab.BaseSpellList=""]
	[h,foreach(spell,ab.SpellList): ab.BaseSpellList = if(json.get(spell,"Level")==ab.Level,json.append(ab.BaseSpellList,json.get(spell,"Spell")),ab.BaseSpellList)]
	[h,foreach(levelOption,ab.LevelsChosen),CODE:{
		[h:tempSpellList = ""]
		[h,foreach(spell,ab.SpellList): tempSpellList = if(levelOption>=json.get(spell,"Level"),json.append(tempSpellList,json.get(spell,"Spell")),tempSpellList)]
		[h,if(json.get(ab.Updates,levelOption)==""): ab.Updates = json.set(ab.Updates,levelOption,json.set("","SpellList",tempSpellList)); ab.Updates = json.set(ab.Updates,levelOption,json.set(json.get(ab.Updates,levelOption),"SpellList",tempSpellList))]
	}]
	[h:ab.Final = json.set(ab.Final,"SpellList",ab.BaseSpellList)]
};{}]

[h:ab.HigherLevelSpellOptions = ""]
[h:ab.SpellOptionsUpdatesTest = 0]
[h,if(ab.IsSpellList>=2),CODE:{
	[h:DoneAddingSpellsTest = 0]
	[h:ab.SpellOptionsUpdatesTest = 0]
	[h:ab.SpellOptions = ""]
	[h,while(DoneAddingSpellsTest < 2),CODE:{
		[h:NewFilterLevel = ab.Level]
		[h:ReuseFilter = 0]
		[h:abort(input(
			" junkVar | ---------------------- Spell Filter Creation ---------------------- |  | LABEL | SPAN=TRUE ",
			" junkVar | On the next screen, set the parameters that determine which spells can be chosen. |  | LABEL | SPAN=TRUE ",
			if(DoneAddingSpellsTest == 1," NewFilterLevel | "+ab.UpdateLevelOptions+" | Level spells can first be chosen from filter | LIST | VALUE=STRING ",""),
			" ClassChoiceFilter |  | <html><span title='Mostly for things like feats, e.g. Magic Initiate, that have you choose a class and then pick spells from that class. Will be added in addition to any classes chosen on the next screen. This is jank as fuck but will change it in updated interfaces... sorry.'>Add a filter by a chosen class</span></html> | CHECK "
		))]
		[h:TempSpellFilter = pm.SpellFilterInput()]
		[h,if(ClassChoiceFilter): TempSpellFilter = json.set(TempSpellFilter,"Class",json.append(json.get(TempSpellFilter,"Class"),"Chosen_Class"))]
		[h:abort(input(
			" TempSpellNum | 0,1,2,3,4,5,6,7,8,9,10 | Choose the number of spells that can be chosen using this filter | LIST | SELECT=1 ",
			" SpellChoiceLevelChanges |  | Does the amount of spells that can be chosen change by level | CHECK ",
			" DoneAddingSpellsTest | No,New Filter at Higher Level,Yes | Finish adding filters to the list | RADIO "
		))]		
		[h:ab.SpellOptions = if(NewFilterLevel == ab.Level,json.append(ab.SpellOptions,json.set(TempSpellFilter,"Number",TempSpellNum,"LevelChanges",SpellChoiceLevelChanges)),ab.SpellOptions)]
		[h:ab.HigherLevelSpellOptions = json.append(ab.HigherLevelSpellOptions,json.set(TempSpellFilter,"Number",TempSpellNum,"LevelChanges",SpellChoiceLevelChanges,"LevelGained",NewFilterLevel))]
		[h:ab.SpellOptionsUpdatesTest = max(ab.SpellOptionsUpdatesTest,if(or(NewFilterLevel!=ab.Level,SpellChoiceLevelChanges),1,0))]
	}]
	[h:ab.Final = json.set(ab.Final,"SpellOptions",ab.SpellOptions)]
	[h,foreach(tempLevel,ab.UpdateLevelOptions): set("ab.UpdateSpellOptions"+tempLevel,if(tempLevel==ab.Level,json.path.delete(ab.SpellOptions,"[*].LevelChanges"),""))]
};{
	[h:ab.SpellOptions=""]
}]

[h,foreach(filter,ab.HigherLevelSpellOptions),CODE:{
	[h:cumulativeSpellNum = if(json.get(filter,"LevelGained") == ab.Level,json.get(filter,"Number"),0)]
	[h,if(json.get(filter,"LevelChanges")),CODE:{
		[h:disFilterByLevel = ""]
		[h:tempLevelChangeCount = listDelete(ab.UpdateLevelOptions,0)]
		[h,foreach(tempLevel,tempLevelChangeCount): disFilterByLevel = listAppend(disFilterByLevel," filterChoiceNum"+tempLevel+" | 0,1,2,3,4,5,6,7,8,9,10 | Level "+tempLevel+" | LIST ","##")]
		[h:abort(input(
			" junkVar | ---------------- Grant Additonal Spell Choices by Level ---------------- |  | LABEL | SPAN=TRUE ",
			" junkVar | Choose the number of new spells granted at each level for the following filter. Do NOT use the cumulative total number of spells - e.g. going from 3 spells to 4, input '1' for that level instead of '4'. |  | LABEL | SPAN=TRUE ",
			" junkVar | Current Filter: "+json.toList(pm.SpellFilterDisplay(filter),";")+" |  | LABEL | SPAN=TRUE ",
			disFilterByLevel
		))]
	};{
		[h:tempLevelChangeCount = if(ab.SpellOptionsUpdatesTest,listDelete(ab.UpdateLevelOptions,0),"")]
		[h,foreach(tempLevel,tempLevelChangeCount): set("filterChoiceNum"+tempLevel,if(tempLevel == json.get(filter,"LevelGained"),json.get(filter,"Number"),0))]
	}]
	[h,foreach(tempLevel,tempLevelChangeCount),CODE:{
		[h:cumulativeSpellNum = cumulativeSpellNum + eval("filterChoiceNum"+tempLevel)]
		[h:set("ab.UpdateSpellOptions"+tempLevel,if(cumulativeSpellNum>0,json.append(eval("ab.UpdateSpellOptions"+tempLevel),json.set(json.remove(json.remove(filter,"LevelChanges"),"LevelGained"),"Number",cumulativeSpellNum)),eval("ab.UpdateSpellOptions"+tempLevel)))]
	}]
	[h:ab.Final = json.path.delete(ab.Final,"SpellOptions.[*].LevelChanges")]
}]

[h,if(ab.IsSpellList>=2 && ab.SpellOptionsUpdatesTest == 1),CODE:{
	[h,foreach(tempLevel,listDelete(ab.UpdateLevelOptions,0)),CODE:{
		[h:ab.Updates = if(json.equals(eval("ab.UpdateSpellOptions"+tempLevel),eval("ab.UpdateSpellOptions"+(tempLevel-1))),
				ab.Updates,
				json.set(ab.Updates,tempLevel,json.set(json.get(ab.Updates,tempLevel),"SpellOptions",eval("ab.UpdateSpellOptions"+tempLevel)))
				)]
	}]
	[h:ab.Updates = json.path.delete(ab.Updates,"*.SpellOptions.[*].LevelChanges")]
};{}]

[h,if(ab.IsSpellList>=1),CODE:{
	[h:abort(input(
		" ab.SpellMarker | -- Ignore/Blank for None -- | Enter a cosmetic marker to display on the spells' buttons "
		))]
	[h:ab.SpellMarker = if(ab.SpellMarker=="-- Ignore/Blank for None --","",ab.SpellMarker)]
	[h:ab.Final = json.set(ab.Final,"SpellMarker",ab.SpellMarker,"CallSpellClass",1)]
};{}]

[h:"<!-- Need to check the library of the fighting styles so fighting styles from different libraries from the base ability are added to a duplicate ability on the same library -->"]
[h:"<!-- See 'Create Fighting Style' macro for reasoning. -->"]
[h,if(ab.IsFightingStyles),CODE:{
	[h:fs.Input = " junkVar | ----------------------------- Choose Fighting Style Options ----------------------------- |  | LABEL | SPAN=TRUE "]
	[h:FightingStyleOptions = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Class == 'FightingStyle')]")]
	[h,foreach(TempFS,FightingStyleOptions): fs.Input = listAppend(fs.Input," pm.Choose"+json.get(TempFS,"Name")+" |  | "+json.get(TempFS,"DisplayName")+" | CHECK ","##")]
	
	[h:abort(input(fs.Input," junkVar | Note: Any fighting styles not added previously can be added to this list on fighting style creaton. |  | LABEL | SPAN=TRUE "))]
	
	[h:fs.ChoicesFinal = "[]"]
	[h:fs.OtherLibOptions = "{}"]
	[h,foreach(TempFS,FightingStyleOptions),CODE:{
		[h,if(json.get(TempFS,"Library")==json.get(ab.Final,"Library")): 
			fs.ChoicesFinal = if(eval("pm.Choose"+json.get(TempFS,"Name")),json.append(fs.ChoicesFinal,json.get(TempFS,"Name")),fs.ChoicesFinal);
			fs.OtherLibOptions = if(eval("pm.Choose"+json.get(TempFS,"Name")),json.set(fs.OtherLibOptions,json.get(TempFS,"Library"),json.append(json.get(fs.OtherLibOptions,json.get(TempFS,"Library")),json.get(TempFS,"Name"))),fs.OtherLibOptions)
		]
	}]
	
	[h:ab.Final = json.set(ab.Final,"FightingStyleList",fs.ChoicesFinal)]
};{}]

[h,if(ab.DamageType>=1),CODE:{
	[h:disDamageType = " junkVar | ---------------------- Damage Type Choices ---------------------- |  | LABEL | SPAN=TRUE ## ab.DamageTypeInclusive | Include Choices,Exclude Choices,Any Type | <html><span title='Include choices is for scenarios where you choose among the selected. Exclude choices is for scenarios where you choose from any damage type other than the ones indicated (e.g. can be any damage type other than psychic). Choosing Any Type will ignore your choices below.'>Which damage types are valid options</span></html> | LIST "]
	[h,foreach(dmgType,pm.GetDamageTypes()): disDamageType = listAppend(disDamageType," temp."+json.get(dmgType,"Name")+" |  | "+json.get(dmgType,"DisplayName")+" | CHECK ","##")]
	
	[h:abort(input(disDamageType))]

	[h,if(ab.DamageTypeInclusive == 2),CODE:{
		[h:ab.DamageOptions = json.set("","DamageTypes",json.append("","All_Types"))]
	};{
		[h:ab.TypesChosen = ""]
		[h,foreach(dmgType,pm.GetDamageTypes()): ab.TypesChosen = if(eval("temp."+json.get(dmgType,"Name")),json.append(ab.TypesChosen,dmgType),ab.TypesChosen)]
		[h:ab.DamageOptions = json.set("","DamageTypes",ab.TypesChosen,"Inclusive",!ab.DamageTypeInclusive)]
	}]
	
	[h:ab.Final = json.set(ab.Final,"DamageOptions",ab.DamageOptions)]
};{}]

[h,if(ab.StoredValue==1),CODE:{
	[h:abort(input(
		" junkVar | ---------------------- Miscellaneous Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
		" ab.ChoiceTitle |  | Type a description of the choice being made ",
		" ab.ChoiceOptions |  | Type the options available, separated by a comma "
		))]
	[h:ab.Final = json.set(ab.Final,
		"MiscChoice",json.set("","Title",ab.ChoiceTitle,"Options",ab.ChoiceOptions)
	)]
};{
	[h,if(ab.StoredValue==2): ab.Final = json.set(ab.Final,"StoredValue","")]
}]

[h,if(ab.Prereqs),CODE:{
	[h:ab.PrereqsFinal = ""]
	[h:abort(input(
	" junkVar | ---------------------- Feature Prerequisite Info ---------------------- |  | LABEL | SPAN=TRUE ",
		" ab.ClassPrereq | None,One,Multiple | Has required classes | LIST ",
		" ab.SubclassPrereq | None,One,Multiple | Has required subclasses | LIST ",
		" ab.LevelPrereq | "+ab.LevelList+" | Has total level requirement | LIST | ",
		" ab.AbilityPrereq | -- Ignore/Blank for None -- | Has required feature ",
		" ab.RacePrereq | None,One,Multiple | Has required races | LIST ",
		" ab.SubracePrereq | None,One,Multiple | Has required subraces | LIST ",
		" ab.AttrPrereq |  | Has base attribute requirements | CHECK ",
		" ab.SkillProfPrereq | None,One,Multiple | Has required skill proficiencies | LIST ",
		" ab.WeaponProfPrereq | None,One,Multiple | Has required weapon proficiencies | LIST ",
		" ab.ArmorProfPrereq | None,One,Multiple | Has required armor proficiencies | LIST ",
		" ab.SpellPrereq |  | Requires ability to cast spells | CHECK "
		))]
	
	[h,if(ab.LevelPrereq>0): ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Level",ab.LevelPrereq)]
	[h,if(ab.AbilityPrereq!=""): ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Ability",if(ab.AbilityPrereq=="-- Ignore/Blank for None --","",pm.RemoveSpecial(ab.AbilityPrereq)))]
	
	[h,if(ab.ClassPrereq>0),CODE:{
		[h:ab.ClassPrereqDis = ""]
		[h,foreach(ClassOption,ab.ClassList): ab.ClassPrereqDis = listAppend(ab.ClassPrereqDis," ab.Choice"+ClassOption+" |  | "+ClassOption+" | CHECK ","##")]
		[h:ab.ClassPrereqFinal = ""]
		[h:ab.ClassPrereqDis = if(ab.ClassPrereq == 1," ab.ClassPrereqChoice | "+ab.ClassList+" | Prerequisite Class | RADIO | VALUE=STRING ",ab.ClassPrereqDis)]
		
		[h:abort(input(ab.ClassPrereqDis))]
		
		[h,if(ab.ClassPrereq==2),foreach(ClassOption,ab.ClassList): ab.ClassPrereqFinal = if(eval("ab.Choice"+ClassOption),json.append(ab.ClassPrereqFinal,ClassOption),ab.ClassPrereqFinal)]
		[h,if(ab.ClassPrereq==1): ab.ClassPrereqFinal = json.append("",ab.ClassPrereqChoice)]

		[h:ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Class",ab.ClassPrereqFinal)]
	};{}]

	[h:ab.SubclassLoop = 1]
	[h:ab.SubclassPrereqFinal = ""]
	[h,while(ab.SubclassPrereq>0 && ab.SubclassLoop == 1),CODE:{
		[h:abort(input(
			" ab.ClassTemp | "+pm.GetClasses("DisplayName")+" | Class of prerequisite subclass | LIST "
			))]
		[h:ab.ClassTemp = pm.RemoveSpecial(ab.ClassTemp)]
		[h:ab.SubclassPrereqDis = ""]
		[h,foreach(Subclass,pm.GetSubclasses(ab.ClassTemp)): ab.SubclassPrereqDis = listAppend(ab.SubclassPrereqDis," ab.Choice"+Subclass+" |  | "+Subclass+" | CHECK ","##")]
		[h:ab.SubclassPrereqDis = if(ab.SubclassPrereq == 1,"ab.SubclassPrereqChoice | "+pm.GetSubclasses(ab.ClassTemp)+" | Prerequisite Subclass | RADIO | VALUE=STRING ",ab.SubclassPrereqDis)]
		
		[h:abort(input(
			ab.SubclassPrereqDis,
			" ab.SubclassLoop |  | Add subclasses from another class | CHECK"
		))]
		
		[h,if(ab.SubclassPrereq==2),foreach(Subclass,pm.GetSubclasses(ab.Class)): ab.SubclassPrereqFinal = if(eval("ab.Choice"+Subclass),json.append(ab.SubclassPrereqFinal,json.set("","Class",ab.ClassTemp,"Subclass",Subclass)),ab.SubclassPrereqFinal)]
		[h,if(ab.SubclassPrereq==1): ab.SubclassPrereqFinal = json.append(ab.SubclassPrereqFinal,json.set("","Class",ab.ClassTemp,"Subclass",ab.SubclassPrereqChoice))]
		[h:ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Subclass",ab.SubclassPrereqFinal)]
	};{}]
	
	[h,if(ab.RacePrereq>0 || ab.SubracePrereq>0),CODE:{
		[h:ab.RaceList = pm.GetRaces()]
		[h:ab.RacePrereqDis = ""]
		[h,foreach(RaceOption,ab.RaceList): ab.RacePrereqDis = listAppend(ab.RacePrereqDis," ab.Choice"+RaceOption+" |  | "+RaceOption+" | CHECK ","##")]
		[h:ab.RacePrereqFinal = ""]
		[h:ab.RacePrereqDis = if(ab.RacePrereq == 1,"ab.RacePrereqChoice | "+ab.RaceList+" | Prerequisite Race | RADIO | VALUE=STRING ",ab.RacePrereqDis)]
		[h:ab.RacePrereqDis = if(ab.RacePrereq == 0,"ab.RacePrereqChoice | "+ab.RaceList+" | Race of Subrace Prerequisite | RADIO | VALUE=STRING ",ab.RacePrereqDis)]
		
		[h:abort(input(ab.RacePrereqDis))]
		
		[h,if(ab.RacePrereq==2),foreach(RaceOption,ab.RaceList): ab.RacePrereqFinal = if(eval("ab.Choice"+RaceOption),json.append(ab.RacePrereqFinal,RaceOption),ab.RacePrereqFinal)]
		[h,if(ab.RacePrereq!=2): ab.RacePrereqFinal = json.append("",ab.RacePrereqChoice)]
		[h:ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Race",ab.RacePrereqFinal)]
	};{}]
	
	[h,if(ab.SubracePrereq>0),CODE:{
		[h:ab.SubraceList = pm.GetSubraces(ab.RacePrereqChoice)]
		[h:ab.SubracePrereqDis = ""]
		[h,foreach(SubraceOption,ab.SubraceList): ab.SubracePrereqDis = listAppend(ab.SubracePrereqDis," ab.Choice"+SubraceOption+" |  | "+SubraceOption+" | CHECK ","##")]
		[h:ab.SubracePrereqFinal = ""]
		[h:ab.SubracePrereqDis = if(ab.SubracePrereq == 1,"ab.SubracePrereqChoice | "+ab.SubraceList+" | Prerequisite Class | RADIO | VALUE=STRING ",ab.SubracePrereqDis)]
		
		[h:abort(input(ab.SubracePrereqDis))]
		
		[h,if(ab.SubracePrereq==2),foreach(SubraceOption,ab.SubraceList): ab.SubracePrereqFinal = if(eval("ab.Choice"+SubraceOption),json.append(ab.SubracePrereqFinal,SubraceOption),ab.SubracePrereqFinal)]
		[h,if(ab.SubracePrereq==1): ab.SubracePrereqFinal = json.append("",ab.SubracePrereqChoice)]
		[h:ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Subrace",ab.SubracePrereqFinal)]
	};{}]

	[h,if(ab.AttrPrereq),CODE:{
		[h:ab.AtrPreInput = ""]
		[h,foreach(TempAtr,ab.AtrList): ab.AtrPreInput = listAppend(ab.AtrPreInput," ab."+json.get(TempAtr,"Name")+"Prereq | "+ab.LevelList+" | "+json.get(TempAtr,"DisplayName")+" Prerequisite | LIST ","##")]
		[h:abort(input(
	" junkVar | ---------------------- Attribute Prerequisite Info ---------------------- |  | LABEL | SPAN=TRUE ",
	" ab.AttrAllOrOne | All,One | Requires all of the below to be met or just one | RADIO | SELECT=1 ",
	ab.AtrPreInput
		))]

		[h:ab.AtrPreChoices = ""]
		[h:ab.AttrPrereqCount = 0]
		[h,foreach(TempAtr,ab.AtrList): ab.AtrPreChoices = json.set(ab.AtrPreChoices,json.get(TempAtr,"Name"),eval("ab."+json.get(TempAtr,"Name")+"Prereq"))]
		[h,foreach(TempAtr,ab.AtrList): ab.AttrPrereqCount = if(ab.AttrAllOrOne,1,if(eval("ab."+json.get(TempAtr,"Name")+"Prereq")>0,ab.AttrPrereqCount+1,ab.AttrPrereqCount))]
		[h:ab.AtrPreChoices = json.set(ab.AtrPreChoices,"AllOrOne",ab.AttrPrereqCount)]
		[h:ab.PrereqsFinal = json.set(ab.PrereqsFinal,"Attributes",ab.AtrPreChoices)]
	};{}]
	[h:ab.Final = json.set(ab.Final,"Prereqs",ab.PrereqsFinal)]
};{}]

[h,if(ab.Resource == 1),CODE:{
	[h:abort(input(
		" ab.ResourceType | 1,Other Flat Number,Attribute Based,Linearly Class Level Based,Non-Linearly Class Level Based,Proficiency Based,Multiple Resources,Custom | Amount of Resource | LIST | VALUE=STRING ",
		" ab.RestoreShortRest |  | Resource Restored on Short Rests | CHECK ",
		" ab.RestoreLongRest | 1 | Resource Restored on Long Rests | CHECK "
	))]
	[h:ab.ResourceInfo = pm.ResourceInput(json.set("","Name",json.get(ab.Final,"Name"),"Class",json.get(ab.Final,"Class"),"Subclass",json.get(ab.Final,"Subclass"),"Level",ab.Level),ab.ResourceType)]
	[h:ab.Final = json.set(ab.Final,"RestoreShortRest",ab.RestoreShortRest,"RestoreLongRest",ab.RestoreLongRest,"MaxResource",json.get(ab.ResourceInfo,"Base"))]
	[h:ab.ResourceUpdateInfo = json.get(ab.ResourceInfo,"Updates")]
	[h,if(ab.ResourceUpdateInfo==""),CODE:{};{
		[h,foreach(tempLevel,ab.UpdateLevelOptions): ab.Updates = if(json.get(ab.ResourceUpdateInfo,tempLevel)=="",ab.Updates,json.set(ab.Updates,tempLevel,json.set(json.get(ab.Updates,tempLevel),"MaxResource",json.get(ab.ResourceUpdateInfo,tempLevel))))]
	}]
	[h:"<!-- Note: 'Resource' key is not set because amount is not known for things that vary based on the character that gains them, such as proficiency or attribute based. -->"]
};{}]

[h:abort(input(
	" junkVar | Choose general instances that the feature affects | 0 | LABEL | SPAN=TRUE ",	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Attributes | No,By Choice,Preset,Some of Both | Affects ability scores | LIST ",
	" ab.SkillProficiencies | No,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" ab.SaveProficiencies | No,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" ab.WeaponProficiencies | No,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" ab.ArmorProficiencies | No,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST ",
	" ab.MiscProficiencies | 0 | <html><span title='Non-Permanent Proficiency or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiencies in Some Other Way</span></html> | CHECK ",
	" ab.PassiveScore | 0 | Affects passive skills | LIST ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.AtrOther | 0 | <html><span title='For things that set a score to a certain value, raise the stat cap, or give a bonus conditionally'>Affects Ability Scores - Not Flat Bonuses</span></html> | CHECK ",
	" ab.AC | 0 | Affects AC | CHECK ",
	" ab.HP | 0 | Affects Max HP | CHECK ",
	" ab.DamageMod | 0 | Affects damage modifiers (e.g. Resistances) | CHECK ",
	" ab.CondImmun | 0 | Affects condition immunities | CHECK ",
	" ab.Speed | 0 | Affects movement speed | CHECK ",
	" ab.Languages | 0 | Affects languages known | CHECK ",
	" ab.Senses | 0 | Affects senses | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Check | 0 | Affects checks | CHECK ",
	" ab.Save | 0 | Affects saves | CHECK ",
	" ab.Init | 0 | Affects initiative | CHECK ",
	" ab.Conc | 0 | Affects concentration | CHECK ",
	" ab.Death | 0 | Affects death saves | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Attacks | 0 | Affects weapon attacks | CHECK ",
	" ab.Spells | 0 | Affects spells | CHECK ",
	" ab.OtherAbilities | 0 | Affects other features | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Damaged | 0 | Effect triggers when damaged | CHECK ",
	" ab.CondGain | 0 | Effect triggers when gaining a condition | CHECK ",
	" ab.CondEnd | 0 | Effect triggers when ending a condition | CHECK ",
	" ab.Rest | 0 | Effect triggers after rests | CHECK ",
	" ab.HitDie | 0 | Effect triggers after spending Hit Dice | CHECK ",
	" ab.StartTurn | 0 | Effect triggers on start of turn | CHECK ",
	" ab.EndTurn | 0 | Effect triggers on end of turn | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Button | 0 | <html><span title='Things that have their own action/reaction like granting Bardic Inspiration, going into a rage, etc. Can also be used for passive abilities that do not have a mechanical trigger that is feasible to program, like the Fighter Maneuver - Evasive Footwork'>Feature can be used independently of the above</span></html> | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.HasUpdates |  | <html><span title='Do not check if it has already been accounted for, e.g. resources. This is mostly for things that change unpredictably or inconsistently across all levels.'>Feature has any change not already accounted for as you level up</span></html> | CHECK "
	))]

[h,if(ab.Attributes==1 || ab.Attributes==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"AttributeOptions",pm.AttributeSelectionChoices())]
};{}]

[h,if(ab.Attributes==2 || ab.Attributes==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Attributes",pm.AttributeSelectionPreset())]
};{}]

[h,if(ab.AtrOther),CODE:{
	[h:abort(input(
		" junkVar | Choose aspects of attributes affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrSet | 0 | Sets Strength Score | CHECK ",
		" ab.DexSet | 0 | Sets Dexterity Score | CHECK ",
		" ab.ConSet | 0 | Sets Constitution Score | CHECK ",
		" ab.IntSet | 0 | Sets Intelligence Score | CHECK ",
		" ab.WisSet | 0 | Sets Wisdom Score | CHECK ",
		" ab.ChaSet | 0 | Sets Charisma Score | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrBonus | 0 | Gives Strength Score Bonus | CHECK ",
		" ab.DexBonus | 0 | Gives Dexterity Score Bonus | CHECK ",
		" ab.ConBonus | 0 | Gives Constitution Score Bonus | CHECK ",
		" ab.IntBonus | 0 | Gives Intelligence Score Bonus | CHECK ",
		" ab.WisBonus | 0 | Gives Wisdom Score Bonus | CHECK ",
		" ab.ChaBonus | 0 | Gives Charisma Score Bonus | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrMax | 0 | Increases Strength Score Maximum | CHECK ",
		" ab.DexMax | 0 | Increases Dexterity Score Maximum | CHECK ",
		" ab.ConMax | 0 | Increases Constitution Score Maximum | CHECK ",
		" ab.IntMax | 0 | Increases Intelligence Score Maximum | CHECK ",
		" ab.WisMax | 0 | Increases Wisdom Score Maximum | CHECK ",
		" ab.ChaMax | 0 | Increases Charisma Score Maximum | CHECK "
		))]

	[h,if(or(ab.StrSet,ab.DexSet,ab.ConSet,ab.IntSet,ab.WisSet,ab.ChaSet,ab.StrBonus,ab.DexBonus,ab.ConBonus,ab.IntBonus,ab.WisBonus,ab.ChaBonus)): ab.Final = json.set(ab.Final,"CallAbilityScore",1)]
	[h,if(or(ab.StrMax,ab.DexMax,ab.ConMax,ab.IntMax,ab.WisMax,ab.ChaMax)): ab.Final = json.set(ab.Final,"CallAbilityScoreMax",1)]
	
};{}]

[h,if(ab.SkillProficiencies==1 || ab.SkillProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(ab.SkillProficiencies==2 || ab.SkillProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(ab.SaveProficiencies==1 || ab.SaveProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(ab.SaveProficiencies==2 || ab.SaveProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(ab.WeaponProficiencies==1 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(ab.WeaponProficiencies==2 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(ab.ArmorProficiencies==1 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(ab.ArmorProficiencies==2 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h,if(ab.MiscProficiencies),CODE:{
	[h:abort(input(
		" junkVar | Instances Where Proficiency is Indirectly Affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.SaveMisc | 0 | Affects Save Proficiencies | CHECK ",
		" ab.CheckMisc | 0 | Affects Check Proficiencies | CHECK ",
		" ab.DeathMisc | 0 | Affects Death Save Proficiency | CHECK ",
		" ab.InitMisc | 0 | Affects Initiative Proficiency | CHECK ",
		" ab.ConcMisc | 0 | Affects Concentration Save Proficiency | CHECK ",
		" ab.WeaponMisc | 0 | Affects Weapon Proficiencies | CHECK ",
		" ab.ArmorMisc | 0 | Affects Armor Proficiencies | CHECK "
		)]
		[h:ab.Final = json.set(ab.Final,
		"CallSaveProf",ab.SaveMisc,
		"CallCheckProf",ab.CheckMisc,
		"CallDeathProf",ab.DeathMisc,
		"CallInitProf",ab.InitMisc,
		"CallConcProf",ab.ConcMisc,
		"CallWeaponProf",ab.WeaponMisc,
		"CallArmorProf",ab.ArmorMisc
		)]
};{}]

[h,if(ab.PassiveScore),CODE:{
[h:abort(input(
	" junkVar | Choose passive ability scores affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.PassIns | 0 | Gives Passive Insight Bonus | CHECK ",
	" ab.PassInv | 0 | Gives Passive Investigation Bonus | CHECK ",
	" ab.PassPcp | 0 | Gives Passive Perception Bonus | CHECK "
))]

[h:ab.Final = json.set(ab.Final,
	"CallPassiveIns",ab.PassIns,
	"CallPassiveInv",ab.PassInv,
	"CallPassivePcp",ab.PassPcp
	)]
};{}]

[h,if(ab.AC),CODE:{
	[h:abort(input(
		" junkVar | Choose how AC is affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.ACBonus | 0 | Grants Bonus to AC | CHECK ",
		" ab.ACSet | 0 | Sets Base AC | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallAC",1
	)]
};{}]

[h,if(ab.HP),CODE:{
	[h:abort(input(
		" junkVar | Choose aspects of Max HP affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.HPMaxBonus | 0 | Grants Bonus to Maximum HP | CHECK ",
		" ab.HPMaxSet | 0 | Sets Maximum HP Value | CHECK ",
		" ab.HPMaxSetOverride | 0 | Sets Maximum HP Value, Overriding Higher Values | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallMaxHP",1
	)]
};{}]

[h,if(ab.DamageMod),CODE:{
	[h:abort(input(
		" junkVar | Choose damage modifiers affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.Vuln | 0 | Grants Damage Vulnerability | CHECK ",
		" ab.Res | 0 | Grants Damage Resistance | CHECK ",
		" ab.Immun | 0 | Grants Damage Immunity | CHECK ",
		" ab.Absorb | 0 | Grants Damage Absorption | CHECK ",
		" ab.DR | 0 | Grants Damage Reduction (DR) | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallDamageMod",1
	)]
};{}]

[h,if(ab.CondImmun),CODE:{
[h:ab.Final = json.set(ab.Final,
	"CallCondImmun",1
)]
};{}]

[h,if(ab.Speed),CODE:{
	[h:abort(input(
		" junkVar | Choose aspects of attributes affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.SpeedBonus | 0 | Grants Bonus to Speed | CHECK ",
		" ab.SpeedSet | 0 | Sets Base Speed | CHECK ",
		" ab.BurrowBonus | 0 | Grants Bonus to Burrowing Speed | CHECK ",
		" ab.BurrowSet | 0 | Sets Base Burrowing Speed | CHECK ",
		" ab.ClimbBonus | 0 | Grants Bonus to Climbing Speed | CHECK ",
		" ab.ClimbSet | 0 | Sets Base Climbing Speed | CHECK ",
		" ab.FlyBonus | 0 | Grants Bonus to Flying Speed | CHECK ",
		" ab.FlySet | 0 | Sets Base Flying Speed | CHECK ",
		" ab.SwimBonus | 0 | Grants Bonus to Swimming Speed | CHECK ",
		" ab.SwimSet | 0 | Sets Base Swimming Speed | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallSpeed",1
	)]
};{}]

[h,if(ab.Languages),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallLanguages",1
	)]
	[h:ab.Final = json.merge(ab.Final,pm.LanguageChoices())]
};{}]

[h,if(ab.Senses),CODE:{
[h:ab.Final = json.set(ab.Final,
	"CallSenses",1
)]
};{}]

[h,if(ab.Check),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of checks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.CheckAdv | 0 | Grants (Dis)Advantage on Checks | CHECK ",
	" ab.CheckBonus | 0 | Grants Bonus to Checks | CHECK ",
	" ab.CheckProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Checks</span></html> | CHECK ",
	" ab.CheckMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Checks</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallCheckAdv",ab.CheckAdv,
	"CallCheckBonus",ab.CheckBonus,
	"CallCheckProf",ab.CheckProf,
	"CallAfterCheck",ab.CheckMsg
)]
};{}]

[h,if(ab.Save),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of Saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.SaveAdv | 0 | Grants (Dis)Advantage on Saves | CHECK ",
	" ab.SaveBonus | 0 | Grants Bonus to Saves | CHECK ",
	" ab.SaveProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Saves</span></html> | CHECK ",
	" ab.SaveMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSaveAdv",ab.SaveAdv,
	"CallSaveBonus",ab.SaveBonus,
	"CallSaveProf",ab.SaveProf,
	"CallAfterSave",ab.SaveMsg
)]
};{}]

[h,if(ab.Init),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of checks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.InitAdv | 0 | Grants (Dis)Advantage on Initiative | CHECK ",
	" ab.InitBonus | 0 | Grants Bonus to Initiative | CHECK ",
	" ab.InitProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Initiative Proficiency</span></html> | CHECK ",
	" ab.InitMsg | 0 | <html><span title='Use for misc effects that occur after initiative, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Initiative</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallCheckAdv",ab.InitAdv,
	"CallCheckBonus",ab.InitBonus,
	"CallCheckProf",ab.InitProf,
	"CallAfterCheck",ab.InitMsg
)]
};{}]

[h,if(ab.Conc),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of concentration saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.ConcAdv | 0 | Grants (Dis)Advantage on Concentration Saves | CHECK ",
	" ab.ConcBonus | 0 | Grants Bonus to Concentration Saves | CHECK ",
	" ab.ConcProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Concentration Saves</span></html> | CHECK ",
	" ab.ConcMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Concentration Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallConcAdv",ab.ConcAdv,
	"CallConcBonus",ab.ConcBonus,
	"CallConcProf",ab.ConcProf,
	"CallAfterConc",ab.ConcMsg
)]
};{}]

[h,if(ab.Death),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of death saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.DeathAdv | 0 | Grants (Dis)Advantage on Death Saves | CHECK ",
	" ab.DeathBonus | 0 | Grants Bonus to Death Saves | CHECK ",
	" ab.DeathProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Death Saves</span></html> | CHECK ",
	" ab.DeathMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Death Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSaveAdv",ab.DeathAdv,
	"CallSaveBonus",ab.DeathBonus,
	"CallSaveProf",ab.DeathProf,
	"CallAfterSave",ab.DeathMsg
)]
};{}]

[h,if(ab.Attacks),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of weapon attacks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackAdv | 0 | Grants (Dis)Advantage on Weapon Attacks | CHECK ",
	" ab.AttackBonus | 0 | Grants Bonus to Weapon Attack Rolls | CHECK ",
	" ab.AttackStat | 0 | Modifies Weapon Attack Primary Stat | CHECK ",
	" ab.AttackCritThresh | 0 | Affects Critical Hit Threshhold | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackNumber | 0 | <html><span title='Specifically for effects like Extra Attack - Does not apply to effects that let you make an attack as a bonus action, etc.'>Increases number of attacks granted by the Attack action</span></html> | CHECK ",
	" ab.AttackProps | 0 | <html><span title='Making weapons count as magical, count as monk weapons, etc.'>Modifies properties of weapons</span></html> | CHECK ",	" ab.AttackOptions | 0 | <html><span title='e.g. Feat - Great Weapons Master'>Has an optional effect which must be chosen when cast</span></html>| CHECK ",
	" ab.AttackRange | 0 | Affects range or reach of the attack | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackDamage | 0 | <html><span title='Use for effects that grant a damage type based on the weapon used. For effects that grant damage independent of the weapons damage type, use effect after attack or after each attack (whichever is appropriate)'>Grants Flat Bonus to Weapon Damage</span></html> | CHECK ",
	" ab.AttackRoll | 0 | <html><span title='Effects that change the value of the die, adding dice to the roll, using max damage, etc. (e.g. Great Weapon Fighting rerolling 1s and 2s, Barbarian - Brutal Critical, Tempest Cleric - Destructive Wrath)'>Modifies dice rolled for weapon damage</span></html> | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AfterAttack | 0 | <html><span title='Catch-all for effects that operate independently of the weapon damage itself. Can deal damage, force saving throws, force a condition upon an enemy, just display a message, and more. (e.g. Cleric - Divine Strike, Assassin - Death Strike, Eldritch Knight - Eldritch Strike, and Tempest Cleric - Thunderbolt Strike, respectively)'>Effect occurs after attacks</span></html> | CHECK ",
	" ab.AfterEachAttack | 0 | <html><span title='Same as above, but triggers on every attack instead of once per turn.'>Effect occurs after every attack</span></html> | CHECK ",
	" ab.AttackCrit | 0 | <html><span title='Same as above, but triggers only on critical hits.'>Effect occurs after critical hits</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallAttackAdv",ab.AttackAdv,
	"CallAttackBonus",ab.AttackBonus,
	"CallAttackStat",ab.AttackStat,
	"CallAttackCritThresh",ab.AttackCritThresh,
	"CallAttackNum",ab.AttackNumber,
	"CallAttackProps",ab.AttackProps,
	"CallAttackOptions",ab.AttackOptions,
	"CallAttackRange",ab.AttackRange,
	"CallAttackDamage",ab.AttackDamage,
	"CallAttackRoll",ab.AttackRoll,
	"CallAfterAttack",ab.AfterAttack,
	"CallAfterEachAttack",ab.AfterEachAttack,
	"CallAttackCrit",ab.AttackCrit
)]
};{}]

[h,if(ab.Spells),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of spells affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",

	" ab.SpellClass | No,Chosen on Level Up,Chosen through Button | <html><span title='Intended for abilities like Domain spells or Arcane Trickster. Effects that use their own resources and cannot use spell slots are intended to operate through a separate mechanism (e.g. NOT for Monk - Way of the Four Elements)'>Allows hardcast use of spells from outside of the regular class list</span></html> | CHECK ",	" ab.SpellParams | 0 | <html><span title='e.g. Duration, range, components, but can also extend to things like if a spell deals half damage on a successful save (Evocation Wizard - Potent Cantrip)'>Affects general parameters of the spell </span></html>| CHECK ",	" ab.SpellOptions | 0 | <html><span title='e.g. Evocation Wizard - Overchannel, Sorcerer - Metamagic'>Has an optional effect which must be chosen when cast</span></html>| CHECK ",
	" ab.SpellStat | 0 | Modifies Spell Primary Stat | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.SpellAdv | 0 | Grants (Dis)Advantage on Spell Attacks | CHECK ",
	" ab.SpellBonus | 0 | Grants Bonus to Spell Attack Rolls | CHECK ",
	" ab.SpellCritThresh | 0 | Affects Spell Critical Hit Threshhold | CHECK ",
	" ab.SpellCrit | 0 | <html><span title='See &#39;Event occurs after spells&#39; below, but triggers only on critical hits.'>Effect occurs after critical hits</span></html> | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.SpellDamage | 0 | <html><span title='Use for effects that grant a damage bonus based on the damage of the spell. (e.g. Cleric - Disciple of Life, Potent Spellcasting) For effects that grant damage independent of the spell&#39;s damage type, use effect after attack or after each attack (whichever is appropriate)'>Grants Flat Bonus to Spell Damage or Healing</span></html> | CHECK ",
	" ab.SpellRoll | 0 | <html><span title='Effects that change the value of the die, adding dice to the roll, using max damage, etc. (e.g. Elemental Adept feat setting 1s to 2s, Life Cleric - Supreme Healing)'>Modifies dice rolled for weapon damage</span></html> | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AfterSpell | 0 | <html><span title='Catch-all for effects that operate independently of the spell itself. Can deal damage, force saving throws, force a condition upon an enemy, just display a message, and more. Can still have conditions for types of spells they are triggered by. (e.g. Cleric - Divine Strike, Enchantment Wizard - Alter Memories, Cant find a PHB example, and Eldritch Knight - War Magic, respectively)'>Effect occurs after attacks</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSpellParams",ab.SpellParams,
	"CallSpellOptions",ab.SpellOptions,
	"CallSpellStat",ab.SpellStat,
	"CallSpellAdv",ab.SpellAdv,
	"CallSpellBonus",ab.SpellBonus,
	"CallSpellCritThresh",ab.SpellCritThresh,
	"CallSpellCrit",ab.SpellCrit,
	"CallSpellDamage",ab.SpellDamage,
	"CallSpellRoll",ab.SpellRoll,
	"CallAfterSpell",ab.AfterSpell
)]
};{[h:ab.SpellClass=0]}]

[h,if(ab.SpellClass>0),CODE:{
	[h:ab.SpellList = ""]
	[h:ab.disCurrentSpells = ""]
	[h,while(ab.SpellClass==1),CODE:{
		[h:ab.disCurrentSpellsBars = if(ab.SpellList=="",""," junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ")]		
		[h:abort(input(
			" ab.TempSpellName | -- Spell Name Here -- | Enter name of spell added to list ",
			ab.disCurrentSpellsBars,
			ab.disCurrentSpells,
			ab.disCurrentSpellsBars,
			" ab.SpellClass | 1 | Add another spell | CHECK "
			))]
		[h:ab.SpellList = json.append(ab.SpellList,ab.TempSpellName)]
		[h:ab.disCurrentSpells = listAppend(ab.disCurrentSpells," junkVar | "+ab.TempSpellName+" |  | LABEL | SPAN = TRUE ","##")]
	}]
	[h:ab.Final = json.set(ab.Final,"SpellList",ab.SpellList,"CallSpellClass",1)]
};{}]

[h:MoreAbilitiesTest = 2]
[h:AbilitiesAffected = ""]
[h,while(ab.OtherAbilities && MoreAbilitiesTest!=0),CODE:{
	[h,if(AbilitiesAffected!=""): otherAbInput = " junkVar | "+json.toList(json.path.read(AbilitiesAffected,"[*]['DisplayName']"))+" | Features Chosen | LABEL ## MoreAbilitiesTest | No,Yes,Yes - Same Filter | Add more features | RADIO "; otherAbInput = ""]
	
	[h:abort(input(otherAbInput))]
	
	[h,if(MoreAbilitiesTest>0),CODE:{
		[h,if(AbilitiesAffected==""): lastFilter = ""; lastFilter = json.get(AbilitiesAffected,json.length(AbilitiesAffected)-1)]
		[h,if(AbilitiesAffected=="" || MoreAbilitiesTest==1):
			pm.AbilityFilter(" junkVar | -------------- Choose Features Affected by the New Feature -------------- |  | LABEL | SPAN=TRUE ");
			pm.AbilityFilter(" junkVar | -------------- Choose Features Affected by the New Feature -------------- |  | LABEL | SPAN=TRUE ",json.get(lastFilter,"Type"),json.get(lastFilter,"Class"),json.get(lastFilter,"Subclass"))
		]
		[h:AbilitiesAffected = json.append(AbilitiesAffected,macro.return)]
	};{
		[h:ab.Final = json.set(ab.Final,"CallAfterAbility",json.path.delete(AbilitiesAffected,"[*]['Type']"))]
	}]
}]

[h,if(ab.Damaged),CODE:{
	[h:abort(input(
		" junkVar | Choose triggers for an ability after taking damage | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.AfterDamage | 0 | Triggers after taking damage | CHECK ",
		" ab.TempHPLost | 0 | <html><span title='Mostly for abilities that end when Temp HP is lost'>Triggers when losing all Temporary Hit Points</span></html> | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallAfterDamaged",ab.AfterDamage,
		"CallTempHPLost",ab.TempHPLost
	)]
};{}]

[h,if(ab.Rest),CODE:{
[h:abort(input(
	" junkVar | Choose triggers for an ability after resting | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AfterShort | 0 | Triggers after short rests | CHECK ",
	" ab.AfterLong | 0 | Triggers after long rests | CHECK "
))]
	[h:ab.Final = json.set(ab.Final,
		"CallShortRest",ab.AfterShort,
		"CallLongRest",ab.AfterLong
	)]
};{}]

[h,if(ab.HitDie),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallHitDieSpend",1
	)]
};{}]

[h,if(ab.StartTurn),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallStartTurn",1
	)]
};{}]

[h,if(ab.EndTurn),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallEndTurn",1
	)]
};{}]

[h,if(ab.CondGain),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallCondGain",1
	)]
};{}]

[h,if(ab.CondEnd),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallCondEnd",1
	)]
};{}]

[h,if(ab.Button),CODE:{
	[h:ab.MoreButtons = 1]
	[h:ab.NewButtons = ""]
	[h,while(ab.MoreButtons==1),CODE:{
		[h:abort(input(
	" ab.ButtonName | -- Name Here -- | Input Name of Button ",	" ab.CastTime | Action,BONUS,REACTION,1 MIN,10 MIN, 1 HOUR, 8 HOURS,None,Custom | Enter casting time for display on the button | LIST | VALUE=STRING ",
			"ab.Marker | -- Ignore/Blank for None -- | Enter marker for button group if desired ",
			"ab.MoreButtons |  | Add an additional button | CHECK "
			))]
		[h:abort(input(if(ab.CastTime=="Custom"," ab.CastTime |  | Enter custom casting time ","")))]
		[h:ab.Marker = if(ab.Marker=="-- Ignore/Blank for None --","",ab.Marker)]
		[h:ab.NewButtons = json.append(ab.NewButtons,json.set("","CastTime",if(ab.CastTime=="None","",ab.CastTime),"Marker",ab.Marker,"Class",json.get(ab.Final,"Class"),"Subclass",json.get(ab.Final,"Subclass"),"Name",pm.RemoveSpecial(ab.ButtonName),"DisplayName",ab.ButtonName,"Library",json.get(ab.Final,"Library")))]
	}]
	[h:ab.Final = json.set(ab.Final,"ButtonInfo",ab.NewButtons)]
};{}]

[h,if(ab.HasUpdates),CODE:{
	[h,MACRO("Create Ability Updates@Lib:pm.a5e.Core"): ab.Updates]
};{
	[h,if(!json.equals(ab.Updates,ab.NoUpdatesTest)): setLibProperty("sb.AbilityUpdates",json.append(getLibProperty("sb.AbilityUpdates","Lib:"+json.get(ab.Updates,"Library")),ab.Updates),"Lib:"+json.get(ab.Updates,"Library"))]
}]

[h,if(ab.IsFightingStyles),CODE:{
	[h,foreach(OtherLib,json.fields(fs.OtherLibOptions)),CODE:{
		[h:fs.List = json.get(fs.OtherLibOptions,OtherLib)]
		[h:setLibProperty("sb.Abilities",json.append(getLibProperty("sb.Abilities","Lib:"+OtherLib),json.set(ab.Final,"Library",OtherLib,"FightingStyleList",fs.List,"CreatedForMerging",1)),"Lib:"+OtherLib)]
	}]
}]

[h:macro.return = json.set("","Ability",ab.Final,"Updates",ab.Updates,"UpdateTest",ab.HasUpdates)]