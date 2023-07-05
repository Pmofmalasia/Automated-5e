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
		case "NotWorn": return(0,"[]");
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

[h:allValidItems = "[]"]
[h,foreach(creature,TargetCreatures),CODE:{
	[h,if(objectCarriedFilter == "Ally"),CODE:{
		[h,if(getProperty("a5e.stat.WhichTeam") == getProperty("a5e.stat.WhichTeam",creature)): 
			thisCreatureValidObjects = getProperty("a5e.stat.Inventory",creature);
			thisCreatureValidObjects = "[]"
		]
	};{
		[h:thisCreatureWornItems = getProperty("a5e.stat.HeldItems",creature)]
		[h:thisCreatureWornItems = json.difference(thisCreatureWornItems,json.append("",""))]
		[h:thisCreatureWornItems = json.append(thisCreatureWornItems,getProperty("a5e.stat.EquippedArmor",creature))]
		[h,if(getProperty("a5e.stat.WhichTeam") == getProperty("a5e.stat.WhichTeam",creature)): 
			thisCreatureValidObjects = getProperty("a5e.stat.Inventory",creature);
			thisCreatureValidObjects = json.path.read(getProperty("a5e.stat.Inventory",creature),"[*][?(@.ItemID in "+thisCreatureWornItems+")]")
		]
	}]

	[h,if(objectFlammableFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isFlammable == "+objectFlammableFilter+")]")]
	[h,if(objectMagicalFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isMagical == "+objectMagicalFilter+")]")]
	[h,if(objectMagneticFilter != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.isMagnetic == "+objectMagneticFilter+")]")]

	[h,if(objectMaxWeight != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.Weight <= "+objectMaxWeight+")]")]
	[h,if(objectMinWeight != ""): thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.Weight >= "+objectMinWeight+")]")]

	[h,if(objectTagsExclusive != ""),CODE:{
		[h:thisCreatureValidObjects = js.eval("
			let ValidObjects = [];
			let TagFilter = args[1];
			for(let tempObject of args[0]){
				let thisObjectValidTest = true;
				for(let tempObjectTag of tempObject.ObjectTags){
					for(let tempFilter of TagFilter){
						if(tempFilter === tempObjectTag){
							thisObjectValidTest = false;
						}
					}
				}

				if(thisObjectValidTest){
					ValidObjects.push(tempObject);
				}
			}

			return ValidObjects;
		",thisCreatureValidObjects,objectTagsExclusive)]

		[h,if(0):thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.MaterialTags noneof "+objectTagsExclusive+" && @.MainMaterial nin "+objectTagsExclusive+")]")]
	};{}]

	[h,if(objectTagsInclusive != ""),CODE:{
		[h:thisCreatureValidObjects = js.eval("
			let ValidObjects = [];
			let TagFilter = args[1];

			for(let tempObject of args[0]){
				let thisObjectNumberFound = 0;
				for(let tempObjectTag of tempObject.ObjectTags){
					for(let tempFilter of TagFilter){
						if(tempFilter === tempObjectTag){
							thisObjectNumberFound++;
						}
					}
				}

				if(args[2] == 'All'){
					if(thisObjectNumberFound === TagFilter.length){
						ValidObjects.push(tempObject);
					}
				}
				else{
					if(thisObjectNumberFound >= args[2]){
						ValidObjects.push(tempObject);
					}
				}

			}

			return ValidObjects;
		",thisCreatureValidObjects,objectTagsInclusive,"All")]
		[h:broadcast(thisCreatureValidObjects)]

		[h,if(0):thisCreatureValidObjects = json.path.read(thisCreatureValidObjects,"[*][?(@.MaterialTags anyof "+objectTagsInclusive+" && @.MainMaterial in "+objectTagsInclusive+")]")]
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

	[h:allValidItems = json.merge(allValidItems,json.path.put(thisCreatureFinalValidObjects,"[*]","HeldBy",creature))]
}]

[h:macro.return = allValidItems]