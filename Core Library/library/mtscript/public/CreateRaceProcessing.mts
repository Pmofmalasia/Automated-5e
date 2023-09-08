[h:RaceData = macro.args]
[h:RaceData = pm.a5e.KeyStringsToNumbers(RaceData)]
[h:RaceDisplayName = json.get(RaceData,"DisplayName")]
[h:RaceName = pm.RemoveSpecial(RaceDisplayName)]

[h:LibMacroLabel = RaceName+"Traits ### "+RaceName+" ### Passive"]
[h:LibMacroCommand = '[h:pass.abilityName = "'+RaceName+'Traits"]
[h:pass.abilityDisplayName = "'+RaceDisplayName+' Traits"]
[h:pass.abilityClass = "'+RaceName+'"]
[h:pass.abilitySubclass = ""]
[h:pass.abilityFalseName = "Racial Feature"]
[h:pass.FeatureFullDescription = ""]
[h:pass.FeatureAbridgedDescription = ""]
[h:pm.a5e.FeaturePassiveStdVars(arg(0))]

']

[h:SpeedTypeArray = json.append("","","Burrow","Climb","Fly","Swim")]
[h:SpeedBonusString = ""]
[h:allSpeedsArray = ""]
[h,foreach(speedType,SpeedTypeArray),CODE:{
	[h:thisSpeedBonus = json.get(RaceData,"Base"+speedType+"Speed")]
	[h,if(thisSpeedBonus != 0): SpeedBonusString = SpeedBonusString + ','+if(speedType == "",'"Speed"','"'+speedType+'"')+',json.set("","Base",'+thisSpeedBonus+')']
	[h:allSpeedsArray = json.append(allSpeedsArray,thisSpeedBonus)]
}]

[h:allSameSpeed = json.length(json.unique(allSpeedsArray)) == 1]
[h,if(allSameSpeed): SpeedBonusString = ',"All",json.set("","Base",'+json.get(allSpeedsArray,0)+')']

[h:LibMacroCommand = LibMacroCommand + '[h,if(pass.Context=="Speed"),CODE:{
	[h:pass.a5e.SpeedBonus(pass.abilityInfo,json.set(""'+SpeedBonusString+'))]
}]']

[h:LibMacroCommand = LibMacroCommand + '

[h,if(pass.Context=="Lifespan"),CODE:{
	[h:pass.a5e.LifespanBonus(pass.abilityInfo,json.set("","Base",'+json.get(RaceData,"Lifespan")+'))]
}]']

[h:RaceData = json.set(RaceData,"Name",RaceName)]

[h:BaseRaceData = json.set("",
	"Name",RaceName,
	"DisplayName",RaceDisplayName,
	"CreatureType",json.get(RaceData,"CreatureType")
)]

[h:RaceData = json.remove(RaceData,"CreatureType")]
[h:RaceData = json.remove(RaceData,"BaseSpeed")]
[h:RaceData = json.remove(RaceData,"BaseBurrowSpeed")]
[h:RaceData = json.remove(RaceData,"BaseClimbSpeed")]
[h:RaceData = json.remove(RaceData,"BaseFlySpeed")]
[h:RaceData = json.remove(RaceData,"BaseSwimSpeed")]

[h,if(json.get(RaceData,"RaceCountsAs") == ""): RaceData = json.remove(RaceData,"RaceCountsAs")]

[h,if(json.get(RaceData,"Size") == "Choose"),CODE:{
	[h:RaceData = json.remove(RaceData,"Size")]
	[h:ValidSizeOptions = "[]"]
	[h:SizeOptions = json.append("","Tiny","Small","Medium","Large","Huge")]
	[h,foreach(size,SizeOptions),CODE:{
		[h,if(json.contains(RaceData,"Size"+size)): ValidSizeOptions = json.append(ValidSizeOptions,size)]
		[h:RaceData = json.remove(RaceData,"Size"+size)]
	}]

	[h:RaceData = json.set(RaceData,"SizeOptions",ValidSizeOptions)]
};{}]

[h:AttributeArray = pm.GetAttributes("Name","json")]
[h:AttributeAllocationMethod = json.get(RaceData,"AttributeAllocationMethod")]
[h:RaceData = json.remove(RaceData,"AttributeAllocationMethod")]
[h,switch(AttributeAllocationMethod),CODE:
	case "Choice":{
		[h:RaceData = json.set(RaceData,"AttributeOptions","FlexibleChoice")]
	};
	case "Mixed":{
		[h:AttributeChoiceNumber = json.get(RaceData,"AttributeChoiceNumber")]
		[h:RaceData = json.remove(RaceData,"AttributeChoiceNumber")]
		[h:AllAttributeChoices = ""]
		[h,count(AttributeChoiceNumber+1),CODE:{
			[h:tempRaceData = ct.a5e.AttributeOptionProcessing(RaceData,roll.count)]
			[h:RaceData = json.get(tempRaceData,"MainData")]
			[h:AllAttributeChoices = json.append(AllAttributeChoices,json.get(tempRaceData,"Choices"))]
		}]
	};
	default :{}
]

[h,if(AttributeAllocationMethod == "Preset" || AttributeAllocationMethod == "Mixed"),CODE:{
	[h:PresetAttributeBonuses = ""]
	[h,if(json.get(RaceData,"PresetAttributesAll") != 0): PresetAttributeBonuses = json.set(PresetAttributeBonuses,"All",json.get(PresetAttributeBonuses,"PresetAttributesAll"))]
	[h:RaceData = json.remove(RaceData,"PresetAttributesAll")]

	[h,foreach(attribute,AttributeArray),CODE:{
		[h,if(json.get(RaceData,"PresetAttributes"+attribute) != 0): PresetAttributeBonuses = json.set(PresetAttributeBonuses,attribute,json.get(RaceData,"PresetAttributes"+attribute))]
		[h:RaceData = json.remove(RaceData,"PresetAttributes"+attribute)]
	}]

	[h:RaceData = json.set(RaceData,"Attributes",PresetAttributeBonuses)]
};{}]

[h,if(json.get(RaceData,"LanguageOptions") == 0): RaceData = json.remove(RaceData,"LanguageOptions")]
[h:LanguageKnownNumber = json.get(RaceData,"LanguageKnownNumber")]
[h:RaceData = json.remove(RaceData,"LanguageKnownNumber")]
[h:LanguagesKnown = ""]
[h,count(LanguageKnownNumber + 1),CODE:{
	[h:thisLanguage = json.get(RaceData,"LanguageKnown"+roll.count)]
	[h:LanguagesKnown = json.set(LanguagesKnown,thisLanguage,1)]
	[h:RaceData = json.remove(RaceData,"LanguageKnown"+roll.count)]
}]
[h,if(LanguagesKnown != ""): RaceData = json.set(RaceData,"Languages",LanguagesKnown)]

[h:RaceTraitsFeature = json.set(RaceData,
	"Name",RaceName+"Traits",
	"DisplayName",RaceDisplayName+"Traits",
	"Class",RaceName,
	"Subclass","",
	"Level",1,
	"CallLanguages",1,
	"CallSpeed",1
)]

[h,if(json.contains(RaceData,"isVision")),CODE:{
	[h:RaceTraitsFeature = json.remove(RaceTraitsFeature,"isVision")]
	[h:RaceTraitsFeature = json.set(RaceTraitsFeature,"CallSenses",1)]

	[h:"<!-- Insert macro creation of vision stuff here -->"]
};{}]

[h:BaseRaceData = json.set(BaseRaceData,"Traits",RaceTraitsFeature)]
[h:closeDialog("Race Creation")]

[h:LibMacroProperties = json.set("",
	"autoExecute",1,
	"color","#2F1266",
	"command",LibMacroCommand,
	"fontColor","white",
	"group","Racial Passive Features",
	"sortBy",1,
	"label",LibMacroLabel,
	"minWidth",90
)]
[h:Library = json.get(RaceTraitsFeature,"Library")]
[h:LibraryID = findToken("Lib:"+Library,"z.0 Library")]
[h:createMacro(LibMacroProperties,LibraryID,"z.0 Library")]
[h:setLibProperty("sb.Races",json.append(getLibProperty("sb.Races","Lib:"+Library),BaseRaceData),"Lib:"+Library)]

[h:SourcebookName = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Library=='"+Library+"')]['DisplayName']"),0)]
[r:RaceDisplayName+" race from the sourcebook "+SourcebookName+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]