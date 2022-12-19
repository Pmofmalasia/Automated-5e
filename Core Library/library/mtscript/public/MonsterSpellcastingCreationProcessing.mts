[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:ParentToken = json.get(MonsterData,"ParentToken")]
[h:switchToken(ParentToken)]

[h,if(json.contains(MonsterData,"isInnateSpellcasting")),CODE:{
    [h:InnateMonsterCast = json.set("",
        "Name","InnateSpellcasting",
        "DisplayName","Innate Spellcasting",
        "Class","Monster",
        "Subclass","",
        "Library","SRD",
        "Level",1,
        "PrimeStat",json.get(MonsterData,"InnateStat"),
        "MagicSource","Arcane",
        "CallSpellClass",1,
        "RestoreLongRest",1
    )]

    [h:ResourceData = "[r:json.set(''"]
    [h:ResourceDisplayData = "{}"]
    [h:InnateSpellList = "[]"]
    [h:ShortRestRestoreTest = 0]
    [h,count(json.get(MonsterData,"InnateSpellNumber")+1),CODE:{
        [h:thisSpellName = json.get(MonsterData,"InnateSpell"+roll.count)]
        [h:SpellData = pm.a5e.GetSpecificSpell(thisSpellName)]
        [h:MainSpellData = json.get(SpellData,0)]
        [h:thisSpellDisplayName = json.get(MainSpellData,"DisplayName")]

        [h:ResourceData = ResourceData + ",'thisSpellName','"+json.get(MonsterData,"InnateSpell"+roll.count+"Resource")+"'"]
        [h:ResourceDisplayData = json.set(ResourceDisplayData,thisSpellName,thisSpellDisplayName)]
        [h:InnateSpellList = json.append(InnateSpellList,thisSpellName)]
        [h,if(json.get(MonsterData,"InnateSpell"+roll.count+"Restoration")=="Short"): ShortRestRestoreTest = 1]

        [h,MACRO("CreateSpellMacroLabel@Lib:pm.a5e.Core"): thisSpellName]
        [h:SpellMacroLabel = macro.return]
        [h:DefaultDisplayData = pm.SpellColors(json.set("","Level",string(json.get(MainSpellData,"Level")),"Source","Arcane"))]
        [h:BorderColor = json.get(DefaultDisplayData,"Border")]
        [h:TextColor = json.get(DefaultDisplayData,"Title")]

        [h:SpellMacroCommand = '[h,MACRO("'+thisSpellName+' ### Monster@this"): json.set("","ParentToken",currentToken(),"IsTooltip",0)]']
        [h:SpellMacroTooltip = '[h,MACRO("'+thisSpellName+' ### Monster@this"): json.set("","ParentToken",currentToken(),"IsTooltip",1)]']

        [h:SpellMacroProps = json.set("",
            "applyToSelected",0,
            "autoExecute",1,
            "color",BorderColor,
            "command",SpellMacroCommand,
            "fontColor",TextColor,
            "fontSize","1.00em",
            "includeLabel",0,
            "group","Current Spells",
            "sortBy",json.get(MainSpellData,"Level"),
            "label",SpellMacroLabel,
            "maxWidth","",
            "minWidth",89,
            "playerEditable",0,
            "tooltip",SpellMacroTooltip,
            "delim","json"
        )]
        [h:createMacro(SpellMacroProps)]

        [h:InnateFeatureCommand = '[h:SpellData = macro.args]
[h:abilityName = "Innate Spellcasting"]
[h:abilityDisplayName = "'+thisSpellDisplayName+'"]
[h:abilityClass = "Monster"]
[h:abilitySubclass = ""]
[h:abilityFalseName = "Class Feature"]
[h:abilityFullEffect = ""]
[h:abilityAbridgedEffect = ""]
[h:pm.a5e.FeatureStdVars(SpellData)]

[h:SpellData = json.set("","Spell","'+thisSpellName+'","FreeCasting",1,"InnateCast",1,"ForcedLevel",'+json.get(MonsterData,"InnateSpell"+roll.count+"Level")+',"DMOnly",DMOnly)]
[h:pm.a5e.FeatureSpell(abilityInfo,SpellData,abilityEffect)]

[h:pm.a5e.FeatureResources(abilityInfo,json.set("","Feature",json.set("","Resource",abilityInfo,"ResourceUsed",1)))]

[h:pm.a5e.StdFeatureEnd()]

[r,if(IsTooltip),CODE:{
    [r:pm.a5e.FeatureTooltipCall()]
};{
    [h:pm.a5e.FeatureFormatCall()]
}]']

        [h:InnateFeatureProps = json.set(SpellMacroProps,
            "command",InnateFeatureCommand,
            "group","zzzzProgramFunctions",
            "label",thisSpellName+" ### Monster",
            "minWidth",2,
            "tooltip",""
        )]
        [h:createMacro(InnateFeatureProps)]
    }]

    [h,if(ShortRestRestoreTest): InnateMonsterCast = json.set(InnateMonsterCast,"RestoreShortRest",1)]

    [h:ResourceData = ResourceData + ")]"]
    [h:InnateMonsterCast = json.set(InnateMonsterCast,
        "MaxResource",ResourceData,
        "ResourceDisplayName",ResourceDisplayData
    )]
    
    [h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),InnateMonsterCast))]
};{}]

[h,if(json.contains(MonsterData,"isSlotSpellcasting")),CODE:{
    [h:SlotMonsterCast = json.set("",
        "Name","Spellcasting",
        "DisplayName","Spellcasting",
        "Class","Monster",
        "Subclass","",
        "Library","SRD",
        "Level",json.get(MonsterData,"SlotLevel"),
        "PrimeStat",json.get(MonsterData,"SlotStat"),
        "MagicSource","Arcane",
        "CallSpellClass",1,
        "CasterType",(1/json.get(MonsterData,"CasterType"))
    )]

    [h,if(json.get(MonsterData,"SlotClass")!=""): json.set(SlotMonsterCast,"ClassCountsAs",json.get(MonsterData,"SlotClass"))]

    [h:SlotSpellList = "[]"]
    [h,count(json.get(MonsterData,"SlotSpellNumber")+1),CODE:{
        [h:thisSpellSelected = json.get(MonsterData,"SlotSpell"+roll.count)]
        [h:SlotSpellList = json.append(SlotSpellList,json.get(thisSpellSelected,"Name"))]
    }]

    [h:SlotMonsterCast = json.set(SlotMonsterCast,
        "SpellsAlwaysActive",SlotSpellList
    )]

    [h,MACRO("RefreshSpellMacroButtons@Lib:pm.a5e.Core"): json.set("","Add",SlotSpellList,"Source","Arcane","ParentToken",ParentToken)]
    
    [h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),SlotMonsterCast))]
    [h:setProperty("a5e.stat.MaxSpellSlots",table("Spell Slots",a5e.CastingLevel()))]
    [h:setProperty("a5e.stat.SpellSlots",getProperty("a5e.stat.MaxSpellSlots"))]
};{}]

[h:closeDialog("MonsterSpellcastingCreation")]