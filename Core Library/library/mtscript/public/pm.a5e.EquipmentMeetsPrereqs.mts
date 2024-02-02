[h:TokenToCheck = arg(0)]
[h:EquipmentPrereqs = arg(1)]

[h:switchToken(TokenToCheck)]
[h,if(json.type(EquipmentPrereqs) == "OBJECT"): EquipmentPrereqs = json.append("",EquipmentPrereqs)]

[h:HeldItems = getProperty("a5e.stat.HeldItems")]
[h:HeldItemData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID in "+HeldItems+")]")]
[h:FreeHands = json.length(HeldItems) - json.length(json.difference(HeldItems,json.append("","")))]

[h:EquippedArmorID = getProperty("a5e.stat.EquippedArmor")]
[h,if(EquippedArmorID == ""):
	EquippedArmorData = "{}";
	EquippedArmorData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+EquippedArmorID+"')]")
]

[h:AttunedItems = getProperty("a5e.stat.AttunedItems")]
[h:AttunedItemData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID in "+AttunedItems+")]")]

[h:MeetsPrereqTest = 1]

[h,if(json.contains(EquipmentPrereqs,"FreeHands")),CODE:{
	[h:FreeHandsData = json.get(EquipmentPrereqs,"FreeHands")]
	[h:FreeHandsTarget = json.get(FreeHandsData,"Target")]
	[h:FreeHandsComparitor = json.get(FreeHandsData,"Comparitor")]
	[h:MeetsPrereqTest = eval(FreeHands + FreeHandsComparitor + FreeHandsTarget)]
};{}]

[h,if(json.contains(EquipmentPrereqs,"HeldItemTypeInclusive")),CODE:{
	[h:HeldItemTypeInclusiveData = json.get(EquipmentPrereqs,"HeldItemTypeInclusive")]

	[h:HeldItemTypesInclusive = json.get(HeldItemTypeInclusiveData,"Types")]
	[h,if(json.type(HeldItemTypesInclusive) == "UNKNOWN"): HeldItemTypesInclusive = json.append("",HeldItemTypesInclusive)]

	[h:AmountItemTypesRequired = json.get(HeldItemTypesInclusiveData,"Required")]

	[h:MatchingItems = json.path.read(HeldItemData,"\$[*][?(@.Type in "+HeldItemTypesInclusive+")]")]
	[h,switch(AmountItemTypesRequired),CODE:
		case "All":{
			[h:MeetsPrereqTest = json.equals(MatchingItems,HeldItemData)]
		};
		case "":{
			[h:MeetsPrereqTest = !json.isEmpty(MatchingItems)]
		};
		default:{
			[h:MeetsPrereqTest = json.length(MatchingItems) > AmountItemTypesRequired]
		}
	]
};{}]

[h,if(json.contains(EquipmentPrereqs,"HeldItemTypeExclusive")),CODE:{
	[h:HeldItemTypeExclusiveData = json.get(EquipmentPrereqs,"HeldItemTypeExclusive")]
	[h,if(json.type(HeldItemTypeExclusiveData) == "UNKNOWN"): HeldItemTypeExclusiveData = json.append("",HeldItemTypeExclusiveData)]
	[h:MeetsPrereqTest = json.isEmpty(json.path.read(HeldItemData,"\$[*][?(@.Type in "+HeldItemTypeExclusiveData+")]"))]
};{}]


[h:"<!-- TODO: Repeat the following for things like weapon properties, damage dealt, etc. -->"]
[h,if(json.contains(EquipmentPrereqs,"HeldItemTypeInclusive")),CODE:{
	[h:HeldItemTypeInclusiveData = json.get(EquipmentPrereqs,"HeldItemTypeInclusive")]

	[h:HeldItemTypesInclusive = json.get(HeldItemTypeInclusiveData,"Types")]
	[h,if(json.type(HeldItemTypesInclusive) == "UNKNOWN"): HeldItemTypesInclusive = json.append("",HeldItemTypesInclusive)]

	[h:AmountItemTypesRequired = json.get(HeldItemTypesInclusiveData,"Required")]

	[h:MatchingItems = json.path.read(HeldItemData,"\$[*][?(@.Type in "+HeldItemTypesInclusive+")]")]
	[h,switch(AmountItemTypesRequired),CODE:
		case "All":{
			[h:MeetsPrereqTest = json.equals(MatchingItems,HeldItemData)]
		};
		case "":{
			[h:MeetsPrereqTest = !json.isEmpty(MatchingItems)]
		};
		default:{
			[h:MeetsPrereqTest = json.length(MatchingItems) > AmountItemTypesRequired]
		}
	]
};{}]

[h,if(json.contains(EquipmentPrereqs,"HeldItemTypeExclusive")),CODE:{
	[h:HeldItemTypeExclusiveData = json.get(EquipmentPrereqs,"HeldItemTypeExclusive")]
	[h,if(json.type(HeldItemTypeExclusiveData) == "UNKNOWN"): HeldItemTypeExclusiveData = json.append("",HeldItemTypeExclusiveData)]
	[h:MeetsPrereqTest = json.isEmpty(json.path.read(HeldItemData,"\$[*][?(@.Type in "+HeldItemTypeExclusiveData+")]"))]
};{}]