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
[h:RaceData = json.remove(RaceData,"Lifespan")]

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

[h:RaceData = ct.a5e.LanguageOptionProcessing(RaceData)]

[h:VisionData = ct.a5e.VisionProcessing(RaceData)]
[h:RaceData = json.get(VisionData,"Data")]
[h:LibMacroCommand = LibMacroCommand + json.get(VisionData,"FullCommand")]

[h,if(json.contains(RaceData,"isVision")),CODE:{
	[h:RaceData = json.remove(RaceData,"isVision")]

	[h:LibMacroCommand = LibMacroCommand + '

[h,if(pass.Context=="Vision"),CODE:{
	[h:pass.a5e.VisionBonus(pass.abilityInfo,json.set(""']

	[h:VisionUDFObject = ""]
	[h:allVisionTypes = pm.a5e.GetCoreData("sb.VisionTypes","Name","json")]
	[h,foreach(visionType,allVisionTypes),CODE:{
		[h:IsUnlimitedTest = json.contains(RaceData,"isVision"+visionType+"Unlimited")]
		[h:HasVisionTest = or(json.get(RaceData,"Vision"+visionType+"Distance") != 0,IsUnlimitedTest)]
		[h,if(HasVisionTest): LibMacroCommand = LibMacroCommand + ',"'+visionType+'",json.set("",' + if(IsUnlimitedTest,'"Unlimited",1','"Distance",'+json.get(RaceData,"Vision"+visionType+"Distance")) + ')']

		[h:RaceData = json.remove(RaceData,"isVision"+visionType+"Unlimited")]
		[h:RaceData = json.remove(RaceData,"Vision"+visionType+"Distance")]
	}]

	[h:LibMacroCommand = LibMacroCommand + '))]
}]']
};{
	[h:LibMacroCommand = LibMacroCommand + '

[h,if(pass.Context=="Vision"),CODE:{
	[h:pass.a5e.VisionBonus(pass.abilityInfo,json.set("","NormalSight",json.set("","Unlimited",1)))]
}]']
}]

[h:RaceTraitsFeature = json.set(RaceData,
	"Name",RaceName+"Traits",
	"DisplayName",RaceDisplayName+" Traits",
	"Class",RaceName,
	"Subclass","",
	"Level",1,
	"CallLanguages",1,
	"CallSpeed",1,
	"CallVision",1,
	"CallLifespan",1
)]

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