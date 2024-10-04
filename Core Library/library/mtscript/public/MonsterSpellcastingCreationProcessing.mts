[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:ParentToken = json.get(MonsterData,"ParentToken")]
[h:switchToken(ParentToken)]

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
        "CasterType",(1/json.get(MonsterData,"CasterType")),
        "SharedSpellSlots",1,
        "IsActive",1
    )]
    
    [h,if(json.get(MonsterData,"SlotClass")!=""): json.set(SlotMonsterCast,"ClassCountsAs",json.get(MonsterData,"SlotClass"))]

    [h:SlotSpellList = "[]"]
    [h,count(json.get(MonsterData,"SlotSpellNumber")+1),CODE:{
        [h:thisSpellSelected = json.get(MonsterData,"SlotSpell"+roll.count)]
        [h:SlotSpellList = json.append(SlotSpellList,thisSpellSelected)]
    }]

    [h:SlotMonsterCast = json.set(SlotMonsterCast,
        "SpellsAlwaysActive",SlotSpellList
    )]

    [h,MACRO("RefreshSpellMacroButtons@Lib:pm.a5e.Core"): json.set("","Add",SlotSpellList,"Source","Arcane","ParentToken",ParentToken)]
    
    [h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),SlotMonsterCast))]
    [h:setProperty("a5e.stat.MaxSpellSlots",table("Spell Slots",a5e.CastingLevel()))]
    [h:setProperty("a5e.stat.SpellSlots",getProperty("a5e.stat.MaxSpellSlots"))]
};{}]

[h,if(!json.contains(MonsterData,"isInnateSpellcasting")),CODE:{
	[h:closeDialog("MonsterSpellcastingCreation")]
	[h:return(0)]
};{}]

[h:InnateMonsterCast = json.set("",
	"Name","InnateSpellcasting",
	"DisplayName","Innate Spellcasting",
	"Class","Monster",
	"Subclass","",
	"Library","SRD",
	"Level",1,
	"PrimeStat",json.get(MonsterData,"InnateStat"),
	"MagicSource","Arcane",
	"IsActive",1,
	"CallSpellClass",1
)]

[h:MaxResource = ""]
[h:ResourceData = ""]
[h:ShortRestRestoreResources = ""]
[h:LongRestRestoreResources = ""]
[h:hasResource = ""]
[h:InnateSpellList = "[]"]

[h:SafeCounter = 0]
[h:"<!-- Hardcoded: Resource -->"]
[h:broadcast("Num: "+json.get(MonsterData,"InnateSpellNumber"))]
[h,count(json.get(MonsterData,"InnateSpellNumber")),CODE:{
	[h:thisSpellName = json.get(MonsterData,"InnateSpell"+SafeCounter)]
	[h:SpellData = pm.a5e.GetSpecificSpell(thisSpellName)]
	[h:thisSpellDisplayName = json.get(SpellData,"DisplayName")]
	[h:broadcast(thisSpellDisplayName)]

	[h:RestorationType = json.get(MonsterData,"InnateSpellRestoration"+SafeCounter)]
	[h:isAtWill = RestorationType == "AtWill"]
	[h,if(isAtWill),CODE:{
		[h:AtWillSetting = ',"isAtWill",1']
	};{
		[h:AtWillSetting = ',"isAtWill",0']
		[h,if(RestorationType == "Short"): ShortRestRestoreResources = json.append(ShortRestRestoreResources,thisSpellName)]
		[h:LongRestRestoreResources = json.append(LongRestRestoreResources,thisSpellName)]
		[h:thisResourceAmount = json.get(MonsterData,"InnateSpellResource"+SafeCounter)]
		[h:MaxResource = json.set(MaxResource,thisSpellName,thisResourceAmount)]
		[h:thisResourceData = json.set("",
			"Name",thisSpellName,
			"DisplayName",thisSpellDisplayName,
			"Base",thisResourceAmount
		)]
		[h:ResourceData = json.set(ResourceData,thisSpellName,thisResourceData)]
		[h:InnateSpellList = json.append(InnateSpellList,thisSpellName)]
		[h:hasResource = json.append(hasResource,thisSpellName)]
	}]

	[h,MACRO("CreateSpellMacroLabel@Lib:pm.a5e.Core"): thisSpellName]
	[h:SpellMacroLabel = macro.return]
	[h:DefaultDisplayData = pm.a5e.BorderColors("zzSpell",json.set("","Level",string(json.get(SpellData,"Level")),"Source","Arcane"),ParentToken)]
	[h:BorderColor = json.get(DefaultDisplayData,"Border")]
	[h:TextColor = json.get(DefaultDisplayData,"Title")]
	[h:CastAtLevel = json.get(MonsterData,"InnateSpellLevel"+SafeCounter)]
	[h:SpellMacroCommand = '[h,MACRO("InnateSpellcasting ### Monster@Lib:SRD"): json.set("","ParentToken",currentToken(),"IsTooltip",0,"Spell","'+thisSpellName+'","Level","'+CastAtLevel+'"'+AtWillSetting+')]']
	[h:SpellMacroTooltip = '[h,MACRO("InnateSpellcasting ### Monster@Lib:SRD"): json.set("","ParentToken",currentToken(),"IsTooltip",1,"Spell","'+thisSpellName+'","Level","'+CastAtLevel+'"'+AtWillSetting+')]']

	[h:SpellMacroProps = json.set("",
		"applyToSelected",0,
		"autoExecute",1,
		"color",BorderColor,
		"command",SpellMacroCommand,
		"fontColor",TextColor,
		"fontSize","1.00em",
		"includeLabel",0,
		"group","Current Spells",
		"sortBy",json.get(SpellData,"Level"),
		"label",SpellMacroLabel,
		"maxWidth","",
		"minWidth",89,
		"playerEditable",0,
		"tooltip",SpellMacroTooltip,
		"delim","json"
	)]
	[h:createMacro(SpellMacroProps)]
	[h:SafeCounter = SafeCounter + 1]
}]

[h,if(!json.isEmpty(hasResource)),CODE:{
	[h:RestorationData = ""]
	[h:baseRestorationData = json.set("",
		"Method","Full"
	)]
	[h,if(!json.isEmpty(ShortRestRestoreResources)),CODE:{
		[h,if(json.equals(hasResource,ShortRestRestoreResources)):
			shortRestInstance = baseRestorationData;
			shortRestInstance = json.set(baseRestorationData,"Name",ShortRestRestoreResources)
		]

		[h:RestorationData = json.set(RestorationData,"ShortRest",shortRestInstance)]	
	};{}]

	
	[h,if(json.equals(hasResource,LongRestRestoreResources)):
		longRestInstance = baseRestorationData;
		longRestInstance = json.set(baseRestorationData,"Name",LongRestRestoreResources)
	]
	[h:RestorationData = json.set(RestorationData,"LongRest",longRestInstance)]

	[h:FinalResourceData = json.set("",
		"Resources",ResourceData,
		"Restoration",RestorationData
	)]
	[h:InnateMonsterCast = json.set(InnateMonsterCast,
		"Resource",MaxResource,
		"ResourceData",FinalResourceData
	)]	
}]

[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),InnateMonsterCast))]

[h:closeDialog("MonsterSpellcastingCreation")]