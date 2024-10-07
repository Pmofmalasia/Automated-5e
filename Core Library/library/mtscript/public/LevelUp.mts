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
		[h:AtrPrereq = json.get(getProperty("a5e.stat.Attributes"),PrereqTemp)]
		[h,if(lu.HasPrereqs!="" && AtrPrereq!=""): lu.ClassPrereqNum = if(and(lu.HasPrereqs>0,AtrPrereq>=lu.HasPrereqs),lu.ClassPrereqNum+1,lu.ClassPrereqNum)]
	}]
	[h:lu.FinalClassArray = if(or(getProperty("a5e.stat.Level")==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name"))!=""),json.append(lu.FinalClassArray,ClassTemp),lu.FinalClassArray)]
	[h:lu.FinalClassOptions = if(or(getProperty("a5e.stat.Level")==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name"))!=""),json.append(lu.FinalClassOptions,json.get(ClassTemp,"Name")),lu.FinalClassOptions)]
	[h:lu.ClassOptions = if(or(getProperty("a5e.stat.Level")==0,lu.ClassPrereqNum>=json.get(json.get(ClassTemp,"Prereqs"),"AllOrOne"),json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name"))!=""),listAppend(lu.ClassOptions,json.get(ClassTemp,"DisplayName")+" - "+if(json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name"))=="",0,json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name")))),lu.ClassOptions)]
}]

[h:HPOption=if(getProperty("a5e.stat.Level")==0,"","HowHP | Take Average (1d12=7   1d10=6   1d8=5   1d6=4),Roll HP | New HP | RADIO")]

[h:abort(input(
	" junkVar | Level up! |  | LABEL | SPAN=TRUE ",
	" lu.ClassChoice | "+lu.ClassOptions+" | Choose a class | RADIO ",
	HPOption
))]
[h:lu.Class = json.get(lu.FinalClassOptions,lu.ClassChoice)]

[h:lu.NewLevel = json.get(getProperty("a5e.stat.ClassLevels"),lu.Class)+1]

[h,if(getProperty("a5e.stat.Level") == 0),CODE:{
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
[h:lu.OldConMod = json.get(getProperty("a5e.stat.AtrMods"),"Constitution")]

[h:lu.SubclassTest = if(json.get(json.path.read(lu.ClassArray,"\$[*][?(@.Name=='"+lu.Class+"')]['SubclassLevel']"),0)==lu.NewLevel,1,0)]
[h,if(lu.SubclassTest),CODE:{
	[h:abort(input(
		" lu.SubclassChoice | "+pm.GetSubclasses(lu.Class,"DisplayName")+" | Choose a subclass | RADIO | VALUE=STRING "
	))]
	[h:setProperty("a5e.stat.Subclasses",json.set(getProperty("a5e.stat.Subclasses"),lu.Class,lu.SubclassChoice))]
};{}]

[h:lu.ASITest = json.contains(json.get(json.get(lu.FinalClassArray,lu.ClassChoice),"ASILevels"),lu.NewLevel)]
[h,if(lu.ASITest),CODE:{
	[MACRO("AbilityScoreIncrease@Lib:pm.a5e.Core"): json.set("","LevelUp",1,"Restrictions",if(getProperty("a5e.stat.Level")==0,0,1),"ParentToken",ParentToken)]
	[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
};{}]

[h:tokenSubrace = pm.RemoveSpecial(getProperty("a5e.stat.Subrace"))]
[h,if(tokenSubrace != ""),CODE:{
	[h:"<!-- SubraceIgnoredFeatures specifically removes features from the base race that the subrace does not get (usually when a race that formerly did not have a subrace is given one later) -->"]
	[h:subraceData = json.get(json.path.read(data.getData("addon:","pm.a5e.core","sb.Subraces"),"\$[*][?(@.Name == '"+tokenSubrace+"')]"),0)]
	[h:subraceIgnoredFeatures = json.get(subraceData,"IgnoredFeatures")]
	[h,if(subraceIgnoredFeatures != ""),CODE:{
		[h:subraceIgnoredFeaturesPath = "!(@.Name in "+subraceIgnoredFeatures+" && @.Class == '"+pm.RemoveSpecial(getProperty("a5e.stat.Race"))+"' && @.Subclass == '') && "]
	};{
		[h:subraceIgnoredFeaturesPath = ""]
	}]
};{
	[h:subraceIgnoredFeaturesPath = ""]
}]
[h:lu.NewClassIDPath = "(@.Class == '"+lu.Class+"' && (@.Subclass == null || @.Subclass == '' || @.Subclass == '"+pm.RemoveSpecial(json.get(getProperty("a5e.stat.Subclasses"),lu.Class))+"'))"]
[h:lu.RaceIDPath = subraceIgnoredFeaturesPath+"(@.Class=='"+pm.RemoveSpecial(getProperty("a5e.stat.Race"))+"' && (@.Subclass=='"+pm.RemoveSpecial(getProperty("a5e.stat.Subrace"))+"' || @.Subclass==''))"]
[h:lu.RaceIDPathOld = "(@.Class=='"+pm.RemoveSpecial(getProperty("a5e.stat.Race"))+"' && (@.Subclass=='"+pm.RemoveSpecial(getProperty("a5e.stat.Subrace"))+"' || @.Subclass==''))"]

[h:"<!-- Adds abilities based on class, race, and background that are gained on level up, separately since race and background go off of total level -->"]
[h:tempNewAbilities = json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"\$[*][?("+lu.RaceIDPath+" && @.Level=="+(getProperty("a5e.stat.Level")+1)+" && @.GainOnLevel==1)]")]

[h:tempNewAbilities = json.merge(tempNewAbilities,json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"\$[*][?(@.Class=='Background' && @.Subclass=='"+pm.RemoveSpecial(getProperty("a5e.stat.Background"))+"' && @.Level=="+(getProperty("a5e.stat.Level")+1)+" && @.GainOnLevel==1)]"))]

[h:tempNewAbilities = json.merge(tempNewAbilities,json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"\$[*][?("+lu.NewClassIDPath+" && @.Level=="+lu.NewLevel+" && @.GainOnLevel==1)]"))]

[h:tempNewAbilitiesWithPrereqs = json.path.read(tempNewAbilities,"\$[*][?(@.Prereqs!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(feature,tempNewAbilitiesWithPrereqs),CODE:{
	[h:pm.a5e.CheckFeaturePrereqs(json.set("",json.get(feature,"Prereqs"),"ParentToken",ParentToken))]
	[h,if(!macro.return): tempNewAbilities = json.path.delete(tempNewAbilities,"\$[*][?(@.Name=='"+json.get(feature,"Name")+"' && @.Class=='"+json.get(feature,"Class")+"' && @.Subclass=='"+json.get(feature,"Subclass")+"')]")]
}]

[h:lu.NewAbilities = json.merge(lu.NewAbilities,tempNewAbilities)]

[h:lu.FightingStyleTest = !json.isEmpty(json.path.read(lu.NewAbilities,"\$[*][?(@.FightingStyleList!=null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
[h,if(lu.FightingStyleTest),CODE:{
	[h:ButtonColorData = pm.a5e.BorderColors("FightingStyle","",ParentToken)]
	[h:needsMacroTest = !json.contains(getMacros("json"),"Manage Fighting Styles")]
	[h,if(needsMacroTest): createMacro(json.set("","label","Manage Fighting Styles","command",'[MACRO("ManageFightingStyles@Lib:pm.a5e.Core"): json.set("","LevelUp",0,"Class","'+lu.Class+'","ParentToken",currentToken())]',"group"," New Macros","color",json.get(ButtonColorData,"Border"),"fontColor",json.get(ButtonColorData,"Title"),"applyToSelected",1,"playerEditable",0,"minWidth",89))]
};{}]

[h,MACRO("NewAbilityProcessing@Lib:pm.a5e.Core"): json.set("","Abilities",lu.NewAbilities,"ParentToken",ParentToken)]
[h:lu.NewAbilities = json.get(macro.return,"Abilities")]
[h:lu.NewButtons = json.get(macro.return,"Buttons")]
[h:lu.NewSpells = json.get(macro.return,"Spells")]
[h,if(json.isEmpty(lu.NewSpells)): lu.NewSpells = "[]"]

[h:"<!-- Looks up the current amount of max resources for each ability. After all abilities are added and updated, this will be checked again. If there is increase in the in the amount of max resource, the current amount of resource is increased for that amount. This is done instead of just giving the players a long rest in case anyone wants to run a game where leveling can occur without regaining all resources. -->"]
[h:noFeaturesTest = json.isEmpty(getProperty("a5e.stat.AllFeatures"))]
[h,if(noFeaturesTest): lu.OldResources = ""; lu.OldResources = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.ResourceData != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:lu.OldResourcesMax = ""]
[h,foreach(ability,lu.OldResources),CODE:{
	[h:thisFeatureResource = js.a5e.GetMaximumResources(ability,ParentToken)]
	[h:lu.OldResourcesMax = json.set(lu.OldResourcesMax,json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass"),thisFeatureResource)]
}]

[h:"<!-- Checks to see if there is already a spellcasting ability associated with this class, so that spells will be added later even if it is not the 'correct' level for it by the calculation ceiling(Level*(1/2)*(1/CastingType)). Also needed for cantrips. -->"]
[h,if(noFeaturesTest): lu.HadSpellcastingTest = 0; lu.HadSpellcastingTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?((@.Name == 'Spellcasting' || @.Name == 'PactMagic') && @.Class=='"+lu.Class+"' && (@.Subclass=='"+json.get(getProperty("a5e.stat.Subclasses"),lu.Class)+"' || @.Subclass == ''))]","DEFAULT_PATH_LEAF_TO_NULL"))]

[h:"<!-- TODO: Refactoring - eventually completely replace AbilityUpdates method with FeatureUpdates method (on Lib vs. on feature JSON) -->"]
[h:"<!-- Searches AbilityUpdates for any updates to the leveled class/race, plus subclass/race combo. The object keys of any updates found replace the current corresponding object keys for that ability. -->"]
[h:lu.AbilityUpdates = json.path.read(data.getData("addon:","pm.a5e.core","sb.AbilityUpdates"),"\$[*][?(("+lu.NewClassIDPath+" && @."+lu.NewLevel+" != null) || ("+lu.RaceIDPath+" && @."+(getProperty("a5e.stat.Level")+1)+" != null))]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(noFeaturesTest): lu.AbilityUpdatesNewVersion = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.FeatureUpdates != null && (("+lu.NewClassIDPath+" && @.FeatureUpdates."+lu.NewLevel+" != null) || ("+lu.RaceIDPath+" && @.FeatureUpdates."+(getProperty("a5e.stat.Level")+1)+" != null)))]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.AbilityUpdates),CODE:{
	[h,if(json.get(ability,"FeatureUpdates") == ""):
		featureUpdateData = json.get(ability,lu.NewLevel);
		featureUpdateData = json.get(ability,"FeatureUpdates")
	]
	[h:lu.TempUpdates = json.fields(featureUpdateData,"json")]

	[h,if(json.contains(lu.TempUpdates,"SpellsAlwaysActive")),CODE:{
		[h:lu.UpdateSpells = json.get(featureUpdateData,"SpellsAlwaysActive")]
		[h,if(noFeaturesTest):
			lu.OldSpells = "[]";
			lu.OldSpells = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]['SpellsAlwaysActive']")
		]
		[h,if(!json.isEmpty(lu.OldSpells)): lu.OldSpells = json.get(lu.OldSpells,0)]
		[h:lu.NewSpells = json.merge(lu.NewSpells,json.difference(lu.UpdateSpells,lu.OldSpells))]
	}]
	[h,foreach(updateKey,lu.TempUpdates),CODE:{
		[h:lu.ValidKeyTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]['"+updateKey+"']"))]

		[h,if(updateKey == "ButtonInfo"):
			thisFeaturePriorButtons = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class  == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"' && @.Name == '"+json.get(ability,"Name")+"')]['"+updateKey+"']");
			thisFeaturePriorButtons = "[]"
		]

		[h,if(!json.isEmpty(thisFeaturePriorButtons)): thisFeaturePriorButtons = json.get(thisFeaturePriorButtons,0)]
		[h,if(!json.isEmpty(thisFeaturePriorButtons)):
			thisFeatureNewButtons = json.difference(json.get(featureUpdateData,updateKey),thisFeaturePriorButtons);
			thisFeatureNewButtons = "[]"
		]
		[h:lu.NewButtons = json.merge(lu.NewButtons,thisFeatureNewButtons)]

		[h,if(lu.ValidKeyTest):
			setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]['"+updateKey+"']",json.get(featureUpdateData,updateKey)));
			setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class  == '"+json.get(ability,"Class")+"' && (@.Subclass == '' || @.Subclass == '"+json.get(ability,"Subclass")+"') && @.Name == '"+json.get(ability,"Name")+"')]",updateKey,json.get(featureUpdateData,updateKey)))
		]
	}]
}]

[h:"<!-- Make setting everything happen last, so that cancelling level up returns to the state prior to starting the macro and not halfway. -->"]
[h:setProperty("a5e.stat.ClassLevels",json.set(getProperty("a5e.stat.ClassLevels"),lu.Class,lu.NewLevel))]

[h:abilityTable=""]
[h,foreach(ClassTemp,lu.ClassArray),CODE:{
	[h:TempClassLevel = if(json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name"))=="",0,json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name")))]
	[h:abilityTable = if(TempClassLevel>0,json.append(abilityTable,json.set("","ShowIfCondensed",1,"Header",json.get(ClassTemp,"Name")+" Level","FalseHeader","","FullContents","","RulesContents",json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name")),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",json.get(getProperty("a5e.stat.ClassLevels"),json.get(ClassTemp,"Name")),"Units","")),abilityTable)]
}]

[h:lu.DisplayNewAbilities = ""]
[h,foreach(ability,lu.NewAbilities),CODE:{
	[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),json.set(ability,"IsDisplayed",1,"IsActive",1)))]
	[h:lu.DisplayNewAbilities = listAppend(lu.DisplayNewAbilities,json.get(ability,"DisplayName"),"<br>")]
}]
[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Class=='"+lu.Class+"' || @.Race == '"+pm.RemoveSpecial(getProperty("a5e.stat.Race"))+"')]['Level']",lu.NewLevel))]
[h:"<!-- Adds newly gained resources to the abilities array, see above. If resource existed previously, added resource amount = New difference - old difference. If resource did not exist previously, just sets resource = maxresource. -->"]
[h:noFeaturesTest = json.isEmpty(getProperty("a5e.stat.AllFeatures"))]
[h,if(noFeaturesTest): lu.NewResources = ""; lu.NewResources = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.ResourceData != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:lu.NewResourcesMax = ""]
[h,foreach(ability,lu.NewResources),CODE:{
	[h:lu.CurrentResource = json.get(ability,"Resource")]
	[h:noPriorResource = json.type(lu.CurrentResource) == "UNKNOWN"]
	[h,if(noPriorResource): lu.CurrentResource = "{}"]
	[h:lu.CurrentMax = js.a5e.CalculateResourceData(ability,ParentToken)]
	[h:thisFeatureAllOldResources = json.get(lu.OldResourcesMax,json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass"))]

	[h:lu.MultiResourceList = json.fields(lu.CurrentResource,"json")]
	[h:TempNewResources = ""]
	[h,foreach(resource,lu.MultiResourceList),CODE:{
		[h:oldMaxResource = number(json.get(thisFeatureAllOldResources,resource))]
		[h:newMaxResource = json.get(json.get(lu.CurrentMax,resource),"MaxResource")]
		[h:resourceGained = newMaxResource - oldMaxResource]
		[h:TempNewResources = json.set(TempNewResources,resource,json.get(lu.CurrentResource,resource)+resourceGained)]
	}]

	[h,if(noPriorResource):
		setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]","Resource",TempNewResources));
		setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Resource']",TempNewResources))
	]
}]

[h,if(lu.DisplayNewAbilities != ""): abilityTable = json.append(abilityTable,json.set("","ShowIfCondensed",1,"Header","Abilities Gained","FalseHeader","","FullContents","","RulesContents",lu.DisplayNewAbilities,"RollContents","","DisplayOrder","['Rules','Roll','Full']"))]
[h:js.a5e.CreateFeatureMacros(lu.NewButtons,ParentToken)]

[h:"<!-- Addition of general resources: Happens last because the addition of abilities may change things (e.g. getting more health from a Con increase) -->"]

[h:lu.NewConMod = json.get(getProperty("a5e.stat.AtrMods"),"Constitution")]
[h:setProperty("a5e.stat.MaxHitDice",json.set(getProperty("a5e.stat.MaxHitDice"),lu.HitDieSize,number(json.get(getProperty("a5e.stat.MaxHitDice"),lu.HitDieSize))+1))]
[h:setProperty("a5e.stat.HitDice",json.set(getProperty("a5e.stat.HitDice"),lu.HitDieSize,number(json.get(getProperty("a5e.stat.HitDice"),lu.HitDieSize))+1))]
[h:setProperty("a5e.stat.RolledMaxHP",getProperty("a5e.stat.RolledMaxHP")+lu.HPIncrease)]
[h:HPCalc = getProperty("a5e.stat.HP")+lu.HPIncrease+json.get(getProperty("a5e.stat.AtrMods"),"Constitution")+((lu.NewConMod - lu.OldConMod)*(getProperty("a5e.stat.Level")-1))]
[h:setProperty("a5e.stat.HP",HPCalc)]

[h:MaxSpellSlotsOld = getProperty("a5e.stat.MaxSpellSlots")]
[h:setProperty("a5e.stat.MaxSpellSlots",table("Spell Slots",a5e.CastingLevel()))]
[h:SpellAdd = 0]
[h,count(10),CODE:{
	[h:SpellAdd = number(json.get(getProperty("a5e.stat.MaxSpellSlots"),roll.count))-number(json.get(MaxSpellSlotsOld,roll.count))]
	[h:setProperty("a5e.stat.SpellSlots",json.set(getProperty("a5e.stat.SpellSlots"),roll.count,(number(json.get(getProperty("a5e.stat.SpellSlots"),roll.count))+SpellAdd)))]
}]

[h:ChangedSlotAmountTest = !json.equals(MaxSpellSlotsOld,getProperty("a5e.stat.MaxSpellSlots"))]
[h,if(ChangedSlotAmountTest),CODE:{
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

[h:newProfBonusTest = ceiling(getProperty("a5e.stat.Level")/4)+1 != ceiling((getProperty("a5e.stat.Level")-1)/4)+1]
[h,if(newProfBonusTest):
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Proficiency",
		"FalseHeader","",
		"FullContents","",
		"RulesContents","Your proficiency bonus is now "+getProperty("a5e.stat.Proficiency")+".",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h:"<!-- Checks to see if the token should have a Spell Preparation macro, then adds it if not present. May want to add a notification that new spells can be prepped. -->"]
[h:CanPrepSpells = !json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.SpellOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
[h,if(CanPrepSpells && !hasMacro("Spell Preparation")),CODE:{
	[h:SpellPrepMacroProps = json.set("",
		"applyToSelected",0,
		"autoExecute",1,
		"color","cyan",
		"command",'[h,MACRO("SpellPreparation@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken())]',
		"fontColor","black",
		"fontSize","1.00em",
		"includeLabel",0,
		"group","02. Spells",
		"sortBy",0,
		"label","Spell Preparation",
		"maxWidth","",
		"minWidth",89,
		"playerEditable",0,
		"tooltip","",
		"delim","json"
	)]
	[h:createMacro(SpellPrepMacroProps)]
};{}]

[h:"<!-- Adds newly gained spell macros from outside of the regular spell list, e.g. Cleric domain spells, feats, etc. -->"]
[h,if(!json.isEmpty(lu.NewSpells)),CODE:{
	[h,MACRO("RefreshSpellMacroButtons@Lib:pm.a5e.Core"): json.set("","Add",lu.NewSpells,"ParentToken",ParentToken)]
}]

[h:"<!-- Start of output creation -->"]
[h:outputTargets = if(getProperty("a5e.stat.Allegiance")=="PC","not-gm","none")]
[h:BorderData = json.set("",
	"Name","LevelUp",
	"DisplayName","Level Up!",
	"FalseName","",
	"DisplayClass",lu.Class,
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",if(getProperty("a5e.stat.Allegiance")=="PC",0,1),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","LevelUp",lu.Class,"Class"),
	"OutputTargets",outputTargets
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]