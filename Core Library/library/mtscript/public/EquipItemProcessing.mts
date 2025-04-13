[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:abilityTable = "[]"]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:NewInventory = json.path.set(CurrentInventory,"\$[*][?(@.isWorn == 1 || @.isHeld == 1 || @.isAttunement == 1)]['IsActive']",0)]
[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.isAttunement == 1)]['AttunedTo']","")]

[h:AttunementNumber = json.get(EquipItemData,"AttunementNumber")]
[h:NewAttunedItems = "[]"]
[h,count(AttunementNumber),CODE:{
	[h:thisAttunementChoice = json.get(EquipItemData,"AttunementChoice"+roll.count)]
	[h,if(thisAttunementChoice != ""),CODE:{
		[h:NewAttunedItems = json.append(NewAttunedItems,thisAttunementChoice)]
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisAttunementChoice+"')]['AttunedTo']",ParentToken)]
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisAttunementChoice+"')]['IsActive']",1)]

		[h:thisAttunedItemName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisAttunementChoice+"')]['DisplayName']"),0)]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Attunement Slot #"+(roll.count+1),
			"FalseHeader","",
			"FullContents","",
			"RulesContents",thisAttunedItemName,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
}]

[h:setProperty("a5e.stat.AttunedItems",NewAttunedItems)]
[h:"<!-- Note: This property should be used instead of just json.path.reading the inventory because attuned items may be dropped or given to other tokens despite still being attuned. -->"]
[h:"<!-- TODO: Equipment: Allow aforementioned attuned items that are used by other tokens to be selected to continue attunement (in equipment input). -->"]
[h:setProperty("a5e.stat.Inventory",NewInventory)]

[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:EquipArmorData = pm.a5e.EquipArmor(ArmorChoice,ParentToken)]
[h:abilityTable = json.merge(abilityTable,json.get(EquipArmorData,"Table"))]
[h:NewInventory = getProperty("a5e.stat.Inventory")]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:LimbInfo = pm.a5e.Limbs(ParentToken)]
[h:drawStowTableLines = "[]"]
[h:heldItemNames = "[]"]
[h:stowedItemNames = "[]"]
[h:multipleLimbsChangedTest = 0]
[h,count(LimbNumber),CODE:{
	[h:HeldItems = getProperty("a5e.stat.HeldItems")]
	[h:oldLimbChoice = json.get(HeldItems,roll.count)]
	[h:thisLimbChoice = json.get(EquipItemData,"Limb"+roll.count+"Choice")]
	[h,if(thisLimbChoice != oldLimbChoice && thisLimbChoice != ""),CODE:{
		[h:thisLimbHeldItemData = pm.a5e.HoldItem(thisLimbChoice,roll.count,ParentToken)]
		[h:drawStowTableLines = json.get(thisLimbHeldItemData,"Table")]
		[h:heldItemNames = json.append(heldItemNames,json.get(thisLimbHeldItemData,"ItemDisplayName"))]
		[h:stowedItem = json.get(thisLimbHeldItemData,"StowedItemDisplayName")]
		[h,if(stowedItem != ""): stowedItemNames = json.append(stowedItemNames,stowedItem)]
		[h:multipleLimbsChangedTest = multipleLimbsChangedTest + 1]
	};{}]

	[h,if(thisLimbChoice != oldLimbChoice && thisLimbChoice == ""),CODE:{
		[h:thisLimbHeldItemData = pm.a5e.StowItem(oldLimbChoice,roll.count,ParentToken)]
		[h:drawStowTableLines = json.get(thisLimbHeldItemData,"Table")]
		[h:stowedItemNames = json.append(stowedItemNames,json.get(thisLimbHeldItemData,"ItemDisplayName"))]
		[h:multipleLimbsChangedTest = multipleLimbsChangedTest + 1]
	};{}]

	[h,if(json.contains(EquipItemData,"AmmunitionChoiceLimb"+roll.count)),CODE:{
		[h:OldAmmunitionChoiceID = json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['AmmunitionID']")]
		[h,if(json.isEmpty(OldAmmunitionChoiceID)):
			OldAmmunitionChoiceID = "";
			OldAmmunitionChoiceID = json.get(OldAmmunitionChoiceID,0)
		]
		[h:AmmunitionChoiceID = json.get(EquipItemData,"AmmunitionChoiceLimb"+roll.count)]
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['AmmunitionID']",AmmunitionChoiceID)]
		[h:EquipItemData = json.remove(EquipItemData,"AmmunitionChoiceLimb"+roll.count)]

		[h,if(AmmunitionChoiceID != ""):
			AmmunitionName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+AmmunitionChoiceID+"')]['DisplayName']"),0);
			AmmunitionName = "";
		]
		[h,if(AmmunitionChoiceID != ""): thisLimbTableLine = json.set(thisLimbTableLine,"Rules",json.get(thisLimbTableLine,"Rules") + " using " + AmmunitionName)]
		[h,if(AmmunitionChoiceID != OldAmmunitionChoiceID): thisLimbTableLine = json.set(thisLimbTableLine,"ShowIfCondensed",1)]
	};{}]

	[h:abilityTable = json.append(abilityTable,thisLimbTableLine)]
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

[h:setProperty("a5e.stat.Inventory",NewInventory)]

[h:AllWearables = json.path.read(NewInventory,"\$[*][?(@.isWorn == 1)]")]
[h:WornItemNames = "[]"]
[h:UnwornItemNames = "[]"]
[h,foreach(wearableItem,AllWearables),CODE:{
	[h:thisItemID = json.get(wearableItem,"ItemID")]
	[h:thisWearChoice = json.contains(EquipItemData,"WearableChoice"+thisItemID)]
	[h:itemCurrentlyWorn = number(json.get(wearableItem,"CurrentlyWorn"))]
	[h,switch((itemCurrentlyWorn == thisWearChoice)+""+(thisWearChoice)),CODE:
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