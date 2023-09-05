[h:RaceData = macro.args]
[h:RaceData = pm.a5e.KeyStringsToNumbers(RaceData)]

[h:RaceData = json.set(RaceData,"Name",pm.RemoveSpecial(json.get(RaceData,"DisplayName")))]

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
		[h,if(json.get(RaceData,"PresetAttributes"+attribute) != 0): PresetAttributeBonuses = json.set(PresetAttributeBonuses,attribute,json.get(PresetAttributeBonuses,"PresetAttributes"+attribute))]
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

[h:BaseRaceData = json.set("",
	"Name",json.get(RaceData,"Name"),
	"DisplayName",json.get(RaceData,"DisplayName"),
	"CreatureType",json.get(RaceData,"CreatureType"),
	"BaseSpeed",json.get(RaceData,"BaseSpeed"),
	"BaseBurrowSpeed",json.get(RaceData,"BaseBurrowSpeed"),
	"BaseClimbSpeed",json.get(RaceData,"BaseClimbSpeed"),
	"BaseFlySpeed",json.get(RaceData,"BaseFlySpeed"),
	"BaseSwimSpeed",json.get(RaceData,"BaseSwimSpeed")
)]

[h:RaceData = json.remove(RaceData,"BaseSpeed")]
[h:RaceData = json.remove(RaceData,"BaseBurrowSpeed")]
[h:RaceData = json.remove(RaceData,"BaseClimbSpeed")]
[h:RaceData = json.remove(RaceData,"BaseFlySpeed")]
[h:RaceData = json.remove(RaceData,"BaseSwimSpeed")]

[h:RaceTraitsFeature = json.set(RaceData,
	"Name",json.get(RaceData,"Name")+"Traits",
	"DisplayName",json.get(RaceData,"DisplayName")+"Traits",
	"Class",json.get(RaceData,"Name"),
	"Subclass","",
	"Level",1,
	"CallLanguages",1
)]

[h:BaseRaceData = json.set(BaseRaceData,"Traits",RaceTraitsFeature)]
[h:closeDialog("Race Creation")]

[h:Library = json.get(RaceTraitsFeature,"Library")]
[h:setLibProperty("sb.Races",json.append(getLibProperty("sb.Races","Lib:"+Library),BaseRaceData),"Lib:"+Library)]

[h:SourcebookName = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Library=='"+Library+"')]['DisplayName']"),0)]
[r:json.get(RaceData,"DisplayName")+" race from the sourcebook "+SourcebookName+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]