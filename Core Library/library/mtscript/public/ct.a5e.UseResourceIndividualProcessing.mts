[h:inputData = arg(0)]
[h:i = arg(1)]
[h:j = arg(2)]
[h:thisResourceData = ""]

[h:resourceType = json.get(inputData,"UseResourceType"+i+j)]
[h:inputData = json.remove(inputData,"UseResourceType"+i+j)]
[h,switch(resourceType),CODE:
	case "SpellSlot":{
		[h:"<!-- TODO: Resource - May need to add ability to spend multiple spell slots at once later -->"]

		[h:thisResourceData = json.set(thisResourceData,
			"Type","SpellSlot",
			"ResourceUsed",1,
			"SpellLevelMin",json.get(inputData,"UseSpellSlotMinimum"+i+j)
		)]
		[h:inputData = json.remove(inputData,"UseSpellSlotMinimum"+i+j)]

		[h,if(!json.contains(inputData,"isNoSpellSlotUseLimit"+i+j)): thisResourceData = json.set(thisResourceData,"UseSpellSlotMaximum",json.get(inputData,"UseSpellSlotMaximum"+i+j))]
		[h:inputData = json.remove(inputData,"UseSpellSlotMaximum"+i+j)]
		[h:inputData = json.remove(inputData,"isNoSpellSlotUseLimit"+i+j)]
	};
	case "HitDice":{
		[h:thisResourceData = json.set(thisResourceData,
			"Type","HitDice",
			"ResourceUsed",json.get(inputData,"UseHitDiceMinimum"+i+j),
			"Increment",json.get(inputData,"UseHitDiceIncrements"+i+j)
		)]
		[h:inputData = json.remove(inputData,"UseHitDiceMinimum"+i+j)]
		[h:inputData = json.remove(inputData,"UseHitDiceIncrements"+i+j)]

		[h,if(!json.contains(inputData,"isNoHitDiceUseLimit"+i+j)): thisResourceData = json.set(thisResourceData,"ResourceUsedMax",json.get(inputData,"UseHitDiceMaximum"+i+j))]
		[h:inputData = json.remove(inputData,"UseHitDiceMaximum"+i+j)]
		[h:inputData = json.remove(inputData,"isNoHitDiceUseLimit"+i+j)]
	};
	default:{
		[h:thisResourceData = json.set(thisResourceData,
			"Type","Feature",
			"ResourceUsed",json.get(inputData,"UseFeatureResourceMinimum"+i+j),
			"Increment",json.get(inputData,"UseFeatureResourceIncrements"+i+j)
		)]
		[h:inputData = json.remove(inputData,"UseFeatureResourceMinimum"+i+j)]
		[h:inputData = json.remove(inputData,"UseFeatureResourceIncrements"+i+j)]

		[h,if(!json.contains(inputData,"isNoFeatureResourceUseLimit"+i+j)): thisResourceData = json.set(thisResourceData,"ResourceUsedMax",json.get(inputData,"UseFeatureResourceMaximum"+i+j))]
		[h:inputData = json.remove(inputData,"UseFeatureResourceMaximum"+i+j)]
		[h:inputData = json.remove(inputData,"isNoFeatureResourceUseLimit"+i+j)]

		[h,if(resourceType == "ThisFeature"),CODE:{
			[h:resourceName = json.get(inputData,"UseFeatureResource"+i+j)]
			[h:inputData = json.remove(inputData,"UseFeatureResource"+i+j)]

			[h:resourceIdentifier = json.set("",
				"Resource",resourceName,
				"Name",json.get(inputData,"Name"),
				"Class",json.get(inputData,"Class"),
				"Subclass",json.get(inputData,"Subclass")
			)]

			[h:"<!-- TODO: Resource - Change ItemID to 'this' when functionality exists -->"]
			[h,if(json.get(inputData,"Class") == "Item"): resourceIdentifier = json.set(resourceIdentifier,"ItemID","")]
		};{
			[h:resourceName = js.a5e.RemoveSpecial(json.get(inputData,"UseFeatureResourceDisplayName"+i+j))]
			[h:inputData = json.remove(inputData,"UseFeatureResourceDisplayName"+i+j)]

			[h:chosenResourceData = ct.a5e.AutocompletedFeatureProcessing(inputData,"UseFeatureResourceDisplayName"+i+j)]
			[h:inputData = json.get(chosenResourceData,"InputData")]
			[h:resourceIdentifier = json.set(json.get(chosenResourceData,"Feature"),"Resource",resourceName)]
			[h,if(json.get(inputData,"Class") == "Item"): resourceIdentifier = json.set(resourceIdentifier,"ItemID","")]
		}]

		[h:thisResourceData = json.set(thisResourceData,"Identifier",resourceIdentifier)]
		[h:"<!-- NOTE: Item resources do not set their ItemIDs in the identifier because they don't exist until the item is added. This will occur in AddItemProcessing or similar functions. -->"]
	}
]

[h:return(0,json.set("","InputData",inputData,"Resource",thisResourceData))]