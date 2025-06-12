[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:abilityTable = "[]"]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:AttunementNumber = json.get(EquipItemData,"AttunementNumber")]
[h:needsAttuneOutput = 0]
[h:needsUnattuneOutput = 0]
[h:AttunedItemDisplayNames = "[]"]
[h:UnattunedItemDisplayNames = "[]"]
[h:safeCount = 0]
[h,count(AttunementNumber),CODE:{
	[h:OldAttunedItems = getProperty("a5e.stat.AttunedItems")]
	[h:thisAttunementChoice = json.get(EquipItemData,"AttunementChoice"+safeCount)]
	[h,if(safeCount < json.length(OldAttunedItems)): 
		oldAttunementChoice = json.get(OldAttunedItems,safeCount);
		oldAttunementChoice = ""
	]

	[h,if(thisAttunementChoice != "" && thisAttunementChoice != oldAttunementChoice),CODE:{
		[h:attuneData = pm.a5e.AttuneItem(thisAttunementChoice,safeCount,ParentToken)]
		[h:needsAttuneOutput = 1]
		[h:unattunedItemDisplayName = json.get(attuneData,"UnattunedItemDisplayName")]
		[h,if(unattunedItemDisplayName != ""): UnattunedItemDisplayNames = json.append(UnattunedItemDisplayNames,unattunedItemDisplayName)]
		[h,if(unattunedItemDisplayName != ""): needsUnattuneOutput = 1]
	}]

	[h,if(thisAttunementChoice == "" && oldAttunementChoice != ""),CODE:{
		[h:unattuneData = pm.a5e.UnattuneItem(oldAttunementChoice,safeCount,ParentToken)]
		[h:needsUnattuneOutput = 1]
		[h:unattunedItemDisplayName = json.get(unattuneData,"ItemDisplayName")]
		[h:UnattunedItemDisplayNames = json.append(UnattunedItemDisplayNames,unattunedItemDisplayName)]
	}]
	
	[h:safeCount = safeCount + 1]
}]

[h,if(needsAttuneOutput): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Attuned Items",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(AttunedItemDisplayNames,"and"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(needsUnattuneOutput): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Unattuned Items",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(UnattunedItemDisplayNames,"and"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:EquipArmorData = pm.a5e.EquipArmor(ArmorChoice,ParentToken)]
[h:abilityTable = json.merge(abilityTable,json.get(EquipArmorData,"Table"))]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:LimbInfo = pm.a5e.Limbs(ParentToken)]
[h:drawStowTableLines = "[]"]
[h:heldItemNames = "[]"]
[h:stowedItemNames = "[]"]
[h:multipleLimbsChangedTest = 0]
[h:safeCount = 0]
[h,count(LimbNumber),CODE:{
	[h:HeldItems = getProperty("a5e.stat.HeldItems")]
	[h:oldLimbChoice = json.get(HeldItems,safeCount)]
	[h:thisLimbChoice = json.get(EquipItemData,"Limb"+safeCount+"Choice")]
	[h,if(thisLimbChoice != oldLimbChoice && thisLimbChoice != ""),CODE:{
		[h:thisLimbHeldItemData = pm.a5e.HoldItem(thisLimbChoice,safeCount,ParentToken)]
		[h:drawStowTableLines = json.get(thisLimbHeldItemData,"Table")]
		[h:heldItemNames = json.append(heldItemNames,json.get(thisLimbHeldItemData,"ItemDisplayName"))]
		[h:stowedItem = json.get(thisLimbHeldItemData,"StowedItemDisplayName")]
		[h,if(stowedItem != ""): stowedItemNames = json.append(stowedItemNames,stowedItem)]
		[h:multipleLimbsChangedTest = multipleLimbsChangedTest + 1]
	};{}]

	[h,if(thisLimbChoice != oldLimbChoice && thisLimbChoice == ""),CODE:{
		[h:thisLimbHeldItemData = pm.a5e.StowItem(oldLimbChoice,safeCount,ParentToken)]
		[h:drawStowTableLines = json.get(thisLimbHeldItemData,"Table")]
		[h:stowedItemNames = json.append(stowedItemNames,json.get(thisLimbHeldItemData,"ItemDisplayName"))]
		[h:multipleLimbsChangedTest = multipleLimbsChangedTest + 1]
	};{}]

	[h:ammoTest = json.contains(EquipItemData,"AmmunitionChoiceLimb"+safeCount)]
	[h:"<!-- Temporarily deactivated while in progress -->"]
	[h,if(0),CODE:{
		[h:OldAmmunitionChoiceID = json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['AmmunitionID']")]
		[h,if(json.isEmpty(OldAmmunitionChoiceID)):
			OldAmmunitionChoiceID = "";
			OldAmmunitionChoiceID = json.get(OldAmmunitionChoiceID,0)
		]
		[h:AmmunitionChoiceID = json.get(EquipItemData,"AmmunitionChoiceLimb"+safeCount)]
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['AmmunitionID']",AmmunitionChoiceID)]
		[h:EquipItemData = json.remove(EquipItemData,"AmmunitionChoiceLimb"+safeCount)]

		[h,if(AmmunitionChoiceID != ""):
			AmmunitionName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+AmmunitionChoiceID+"')]['DisplayName']"),0);
			AmmunitionName = "";
		]
		[h,if(AmmunitionChoiceID != ""): thisLimbTableLine = json.set(thisLimbTableLine,"Rules",json.get(thisLimbTableLine,"Rules") + " using " + AmmunitionName)]
		[h,if(AmmunitionChoiceID != OldAmmunitionChoiceID): thisLimbTableLine = json.set(thisLimbTableLine,"ShowIfCondensed",1)]
		[h:abilityTable = json.append(abilityTable,thisLimbTableLine)]
	};{}]
	[h:safeCount = safeCount + 1]
}]

[h,switch(multipleLimbsChangedTest),CODE:
	case 0:{};
	case 1:{
		[h:abilityTable = json.merge(abilityTable,drawStowTableLines)]
	};
	default:{
		[h,if(!json.isEmpty(heldItemNames)): abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Held Items",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.a5e.CreateDisplayList(heldItemNames,"and"),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]

		[h,if(!json.isEmpty(stowedItemNames)): abilityTable = json.append(abilityTablejson.set("",
			"ShowIfCondensed",1,
			"Header","Stowed Items",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.a5e.CreateDisplayList(stowedItemNames,"and"),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}
]

[h,if(json.contains(EquipItemData,"DefaultNaturalWeapon")),CODE:{
	[h:CurrentNaturalWeapons = getProperty("a5e.stat.NaturalWeapons")]
	[h:chosenNaturalWeapon = json.path.read(CurrentNaturalWeapons,"\$[*][?(@.ItemID == '"+json.get(EquipItemData,"DefaultNaturalWeapon")+"')]")]
	[h:CurrentNaturalWeapons = json.path.delete(CurrentNaturalWeapons,"\$[*][?(@.ItemID == '"+json.get(EquipItemData,"DefaultNaturalWeapon")+"')]")]
	[h:FinalNaturalWeapons = json.merge(chosenNaturalWeapon,CurrentNaturalWeapons)]
	[h:setProperty("a5e.stat.NaturalWeapons",FinalNaturalWeapons)]
}]

[h:AllWearables = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.isWearable == 1)]")]
[h:WornItemNames = "[]"]
[h:UnwornItemNames = "[]"]
[h,foreach(wearableItem,AllWearables),CODE:{
	[h:thisItemID = json.get(wearableItem,"ItemID")]
	[h:thisWearChoice = json.contains(EquipItemData,"WearableChoice"+thisItemID)]
	[h:itemisWorn = number(json.get(wearableItem,"isWorn"))]
	[h,switch((itemisWorn == thisWearChoice)+""+(thisWearChoice)),CODE:
		case "01":{
			[h:thisWearData = pm.a5e.WearItem(thisItemID,ParentToken)]
			[h:WornItemNames = json.append(WornItemNames,json.get(wearableItem,"DisplayName"))]
		};
		case "00":{
			[h:thisWearData = pm.a5e.UnwearItem(thisItemID,ParentToken)]
			[h:UnwornItemNames = json.append(UnwornItemNames,json.get(wearableItem,"DisplayName"))]
		};
		default:{};
	]
}]

[h,if(!json.isEmpty(WornItemNames)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Worn Items",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(WornItemNames,"and"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(!json.isEmpty(UnwornItemNames)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Items No Longer Worn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(UnwornItemNames,"and"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:closeDialog("Equipment")]

[h,if(json.isEmpty(abilityTable)):
	EquipmentDescription = "Equipment is unchanged.";
	EquipmentDescription = ""
]

[h:EquipItemData = macro.args]
[h:Flavor = json.get(EquipItemData,"Flavor")]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:pm.a5e.EffectData = "[]"]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","Item",
	"DisplayName","Equipment",
	"Type","Equipment",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:outputTargets = "not-gm"]
[h:"<!-- TODO: Settings: May want to have the option to restrict equipment changes to only the user + GM -->"]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Equipment",
	"DisplayName","Equipment",
	"FalseName","",
	"DisplayClass","Item",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Equipment","Item"),
	"OutputTargets","",
	"Description",EquipmentDescription,
	"AbridgedDescription",EquipmentDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]