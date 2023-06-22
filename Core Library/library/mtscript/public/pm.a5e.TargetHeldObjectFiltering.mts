[h:TargetCreatures = arg(0)]
[h:ObjectFilterData = arg(1)]

[h,if(json.isEmpty(ObjectFilterData)),CODE:{
	[h:objectCarriedFilter = ""]
	[h:objectFlammableFilter = ""]
	[h:objectMagicalFilter = ""]
	[h:objectMagneticFilter = ""]
	[h:objectMaxSize = ""]
	[h:objectMinSize = ""]
	[h:objectMaxWeight = ""]
	[h:objectMinWeight = ""]
	[h:objectTagsInclusive = ""]
	[h:objectTagsExclusive = ""]
};{
	[h,switch(json.get(ObjectFilterData,"Carried")):
		case "": objectCarriedFilter = "";
		case "NotWorn": return(0,"{}");
		case "Worn": objectCarriedFilter = "";
		default: objectCarriedFilter = "Ally"
	]

	[h:objectFlammableFilter = json.get(ObjectFilterData,"Flammable")]
	[h:objectMagicalFilter = json.get(ObjectFilterData,"Magical")]
	[h:objectMagneticFilter = json.get(ObjectFilterData,"Magnetic")]

	[h:objectMaxSize = json.get(ObjectFilterData,"SizeMaximum")]
	[h:objectMinSize = json.get(ObjectFilterData,"SizeMinimum")]

	[h:objectMaxWeight = json.get(ObjectFilterData,"WeightMaximum")]
	[h:objectMinWeight = json.get(ObjectFilterData,"WeightMinimum")]

	[h:objectTagsInclusive = json.get(ObjectFilterData,"TagsInclusive")]
	[h:objectTagsExclusive = json.get(ObjectFilterData,"TagsExclusive")]
}]

[h:allValidItemsByCreature = "{}"]
[h,foreach(creature,TargetCreatures),CODE:{
	[h:thisCreatureValidObjects = getProperty("a5e.stat.Inventory",creature)]

	[h,if(objectCarriedFilter == "Ally"),CODE:{
		[h,if(getProperty("a5e.stat.WhichTeam") != getProperty("a5e.stat.WhichTeam")): thisCreatureValidObjects = "[]"]
	};{}]

	[h,if(objectFlammableFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isFlammable == "+objectFlammableFilter+")]")]
	[h,if(objectMagicalFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isMagical == "+objectMagicalFilter+")]")]
	[h,if(objectMagneticFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isMagnetic == "+objectMagneticFilter+")]")]

	[h,if(objectMaxWeight != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.Weight <= "+objectMaxWeight+")]")]
	[h,if(objectMinWeight != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.Weight >= "+objectMinWeight+")]")]

	[h,if(objectTagsExclusive != ""),CODE:{
		[h:thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.MaterialTags noneof "+validConditionTypesExclusive+" && @.MainMaterial nin "+validConditionTypesExclusive+")]")]
	};{}]

	[h,if(objectTagsInclusive != ""),CODE:{
		[h:thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.MaterialTags anyof "+validConditionTypesInclusive+" && @.MainMaterial in "+validConditionTypesInclusive+")]")]
	};{}]

	[h:needsSizeComparison = (objectMaxSize != "" && objectMinSize != "")]
	[h,if(needsSizeComparison): 
		thisCreatureFinalValidObjects = "[]";
		thisCreatureFinalValidObjects = thisCreatureValidObjects
	]
	[h,if(needsSizeComparison),foreach(tempItem,thisCreatureValidObjects),CODE:{
		[h:validSizeTest = 1]
		[h,if(objectMaxSize != ""): validSizeTest = pm.a5e.CompareSizes(json.get(tempItem,"Size"),objectMaxSize) <= 0]
		[h,if(objectMinSize != ""): validSizeTest = pm.a5e.CompareSizes(json.get(tempItem,"Size"),objectMinSize) >= 0]
		[h,if(validSizeTest): thisCreatureFinalValidObjects = json.append(thisCreatureFinalValidObjects,tempItem)]
	}]

	[h:allValidItemsByCreature = json.set(allValidItemsByCreature,creature,thisCreatureFinalValidObjects)]
}]

[h:macro.return = allValidItemsByCreature]