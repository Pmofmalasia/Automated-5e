[h:RaceData = macro.args]
[h:RaceData = pm.a5e.KeyStringsToNumbers(RaceData)]
[h:RaceDisplayName = json.get(RaceData,"DisplayName")]
[h:RaceName = pm.RemoveSpecial(RaceDisplayName)]
[h,if(json.contains(RaceData,"Race")):
	RaceOrSubrace = "Subrace";
	RaceOrSubrace = "Race"
]
[h,if(RaceOrSubrace == "Subrace"):
	associatedRace = json.get(RaceData,"Race");
	associatedRace = ""
]
[h:RaceData = json.remove(RaceData,"Race")]

[h:SpeedTypeArray = json.append("","","Burrow","Climb","Fly","Swim")]
[h:SpeedBonuses = ""]
[h:allSpeedsArray = ""]
[h,foreach(speedType,SpeedTypeArray),CODE:{
	[h:thisSpeedBonus = json.get(RaceData,"Base"+speedType+"Speed")]
	[h,if(thisSpeedBonus != 0): SpeedBonuses = json.set(SpeedBonuses,if(speedType == "","Speed",speedType),json.set("","Base",thisSpeedBonus))]
	[h:allSpeedsArray = json.append(allSpeedsArray,thisSpeedBonus)]
}]

[h:allSameSpeed = json.length(json.unique(allSpeedsArray)) == 1]
[h,if(allSameSpeed): SpeedBonuses = json.set("","All",json.set("","Base",json.get(allSpeedsArray,0)))]

[h:LifespanData = json.set("","Base",json.get(RaceData,"Lifespan"))]
[h:RaceData = json.remove(RaceData,"Lifespan")]

[h:RaceData = json.set(RaceData,"Name",RaceName)]

[h:BaseRaceData = json.set("",
	"Name",RaceName,
	"DisplayName",RaceDisplayName,
	"CreatureType",json.get(RaceData,"CreatureType")
)]
[h,if(RaceOrSubrace == "Race"): BaseRaceData = json.set(BaseRaceData,"hasSubrace",json.contains(RaceData,"hasSubrace"))]
[h,if(RaceOrSubrace == "Subrace"),CODE:{
	[h:BaseRaceData = json.set(BaseRaceData,"Race",associatedRace)]
	[h:allGeneralRaceFeatures = json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"\$[*][?(@.Class == '"+associatedRace+"' && @.Subclass == '')]")]
	[h:allIgnoredFeatures = "[]"]
	[h,foreach(feature,allGeneralRaceFeatures),CODE:{
		[h:ignoredTest = json.contains(RaceData,"IgnoredBaseFeature"+json.get(feature,"Name"))]
		[h,if(ignoredTest): allIgnoredFeatures = json.append(allIgnoredFeatures,json.get(feature,"Name"))]	
		[h:RaceData = json.remove(RaceData,"IgnoredBaseFeature"+json.get(feature,"Name"))]
	}]
	[h,if(!json.isEmpty(allIgnoredFeatures)): BaseRaceData = json.set(BaseRaceData,"IgnoredFeatures",allIgnoredFeatures)]
};{}]

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
[h,if(AttributeAllocationMethod == "FlexibleChoice"): RaceData = json.set(RaceData,"AttributeOptions","FlexibleChoice")]

[h,if(AttributeAllocationMethod == "Choice" || AttributeAllocationMethod == "Mixed"),CODE:{
	[h:AttributeChoiceNumber = json.get(RaceData,"AttributeChoiceNumber")]
	[h:RaceData = json.remove(RaceData,"AttributeChoiceNumber")]
	[h:AllAttributeChoices = ""]
	[h,count(AttributeChoiceNumber+1),CODE:{
		[h:tempRaceData = ct.a5e.AttributeOptionProcessing(RaceData,roll.count)]
		[h:RaceData = json.get(tempRaceData,"MainData")]
		[h:AllAttributeChoices = json.append(AllAttributeChoices,json.get(tempRaceData,"Choices"))]
	}]
	[h:RaceData = json.set(RaceData,"AttributeOptions",AllAttributeChoices)]
};{}]

[h,if(AttributeAllocationMethod == "Preset" || AttributeAllocationMethod == "Mixed"),CODE:{
	[h:PresetAttributeBonuses = ""]
	[h,if(json.get(RaceData,"PresetAttributesAll") != 0): PresetAttributeBonuses = json.set(PresetAttributeBonuses,"All",json.get(RaceData,"PresetAttributesAll"))]
	[h:RaceData = json.remove(RaceData,"PresetAttributesAll")]

	[h,foreach(attribute,AttributeArray),CODE:{
		[h,if(json.get(RaceData,"PresetAttributes"+attribute) != 0): PresetAttributeBonuses = json.set(PresetAttributeBonuses,attribute,json.get(RaceData,"PresetAttributes"+attribute))]
		[h:RaceData = json.remove(RaceData,"PresetAttributes"+attribute)]
	}]

	[h:RaceData = json.set(RaceData,"Attributes",PresetAttributeBonuses)]
};{}]

[h:RaceData = ct.a5e.LanguageOptionProcessing(RaceData)]

[h:RaceData = ct.a5e.VisionProcessing(RaceData)]

[h:RaceTraitsFeature = json.set("",
	"Name",RaceName+"Traits",
	"DisplayName",RaceDisplayName+" Traits",
	"Class",if(RaceOrSubrace == "Race",RaceName,associatedRace),
	"Subclass",if(RaceOrSubrace == "Race","",RaceName),
	"Level",1,
	"Library",json.get(RaceData,"Library"),
	"CallSpeed",SpeedBonuses,
	"CallLifespan",LifespanData,
	"CallLanguages",1
)]
[h:RaceTraitsFeature = json.merge(RaceTraitsFeature,RaceData)]
[h:"<!-- Note: Done via merging solely for nice visual organization of the resulting JSON. -->"]

[h:BaseRaceData = json.set(BaseRaceData,"Traits",RaceTraitsFeature)]
[h:closeDialog("RaceCreation")]

[h:Library = json.get(RaceTraitsFeature,"Library")]
[h:sourceProperty = if(RaceOrSubrace == "Race","sb.Races","sb.Subraces")]
[h:setLibProperty(sourceProperty,json.append(getLibProperty(sourceProperty,"Lib:"+Library),BaseRaceData),"Lib:"+Library)]

[h:SourcebookName = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[*][?(@.Library=='"+Library+"')]['DisplayName']"),0)]
[h:broadcast(RaceDisplayName+" "+lower(RaceOrSubrace)+" from the sourcebook "+SourcebookName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]