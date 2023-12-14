[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:abilityTable = "[]"]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:NewInventory = json.path.set(CurrentInventory,"\$[*][?(@.isWearable == 1 || @.isAttunement == 1)]['IsActive']",0)]
[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.isAttunement == 1)]['AttunedTo']","")]

[h:OldArmorChoice = getProperty("a5e.stat.EquippedArmor")]
[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:setProperty("a5e.stat.EquippedArmor",ArmorChoice)]
[h,if(ArmorChoice!=""): NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+ArmorChoice+"')]['IsActive']",1)]

[h:ArmorTableLine = json.set("",
	"ShowIfCondensed",0,
	"Header","Armor",
	"FalseHeader","",
	"FullContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h,switch((OldArmorChoice == "")+""+(ArmorChoice == "")),CODE:
	case "01":{
		[h:OldArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+OldArmorChoice+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",OldArmorName+" Unequipped",
			"ShowIfCondensed",1
		)]
	};
	case "10":{
		[h:ArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+ArmorChoice+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",ArmorName+" Equipped",
			"ShowIfCondensed",1
		)]
	};
	case "11":{
		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents","Unarmored",
			"ShowIfCondensed",0
		)]
	};
	case "00":{
		[h:ArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+ArmorChoice+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",ArmorName+" Equipped",
			"ShowIfCondensed",(OldArmorChoice != ArmorChoice)
		)]
	}
]

[h:abilityTable = json.append(abilityTable,ArmorTableLine)]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:LimbInfo = pm.a5e.Limbs(ParentToken)]
[h:OldHeldItems = getProperty("a5e.stat.HeldItems")]
[h:NewHeldItems = "[]"]
[h,count(LimbNumber),CODE:{
	[h:oldLimbChoice = json.get(OldHeldItems,roll.count)]
	[h:thisLimbChoice = json.get(EquipItemData,"Limb"+roll.count+"Choice")]
	[h:NewHeldItems = json.append(NewHeldItems,thisLimbChoice)]
	[h,if(thisLimbChoice != ""): NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['IsActive']",1)]

	[h:thisLimbTableLine = json.set("",
		"ShowIfCondensed",0,
		"Header",json.path.read(LimbInfo,"\$.["+roll.count+"].DisplayName"),
		"FalseHeader","",
		"FullContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	)]

	[h,switch((oldLimbChoice == "")+""+(thisLimbChoice == "")),CODE:
		case "01":{
			[h:oldLimbName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+oldLimbChoice+"')]['DisplayName']"),0)]

			[h:thisLimbTableLine = json.set(thisLimbTableLine,
				"RulesContents",oldLimbName+" Unequipped",
				"ShowIfCondensed",1
			)]
		};
		case "10":{
			[h:thisLimbName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['DisplayName']"),0)]

			[h:thisLimbTableLine = json.set(thisLimbTableLine,
				"RulesContents",thisLimbName+" Equipped",
				"ShowIfCondensed",1
			)]
		};
		case "11":{
			[h:thisLimbTableLine = json.set(thisLimbTableLine,
				"RulesContents","Free Hand",
				"ShowIfCondensed",0
			)]
		};
		case "00":{
			[h:thisLimbName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisLimbChoice+"')]['DisplayName']"),0)]
			[h:oldLimbName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+oldLimbChoice+"')]['DisplayName']"),0)]

			[h,if(oldLimbChoice == thisLimbChoice):
				thisLimbTableLine = json.set(thisLimbTableLine,
					"RulesContents",thisLimbName,
					"ShowIfCondensed",0);
				thisLimbTableLine = json.set(thisLimbTableLine,
					"RulesContents",thisLimbName+" replaces "+oldLimbName,
					"ShowIfCondensed",1)
			]
		}
	]

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
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

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
[h:"<!-- TODO: Allow aforementioned attuned items that are used by other tokens to be selected to continue attunement (in equipment input). -->"]

[h,if(json.contains(EquipItemData,"DefaultNaturalWeapon")),CODE:{
	[h:CurrentNaturalWeapons = getProperty("a5e.stat.NaturalWeapons")]
	[h:chosenNaturalWeapon = json.path.read(CurrentNaturalWeapons,"\$[*][?(@.ItemID == '"+json.get(EquipItemData,"DefaultNaturalWeapon")+"')]")]
	[h:CurrentNaturalWeapons = json.path.delete(CurrentNaturalWeapons,"\$[*][?(@.ItemID == '"+json.get(EquipItemData,"DefaultNaturalWeapon")+"')]")]
	[h:FinalNaturalWeapons = json.merge(chosenNaturalWeapon,CurrentNaturalWeapons)]
	[h:setProperty("a5e.stat.NaturalWeapons",FinalNaturalWeapons)]
}]

[h:AllWearables = json.path.read(NewInventory,"\$[*][?(@.isWearable == 1)]")]
[h:WornItemNames = "[]"]
[h,foreach(wearableItem,AllWearables),CODE:{
	[h:thisItemID = json.get(wearableItem,"ItemID")]
	[h,if(json.contains(EquipItemData,"WearableChoice"+thisItemID)),CODE:{
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+thisItemID+"')]['IsActive']",1)]
		[h:WornItemNames = json.merge(WornItemNames,json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+thisItemID+"')]['DisplayName']"))]
	};{}]
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

[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:closeDialog("Equipment")]

[h,if(json.isEmpty(abilityTable)):
	EquipmentDescription = "Equipment is unchanged.";
	EquipmentDescription = ""
]

[h:EquipItemData = macro.args]
[h:Flavor = json.get(EquipItemData,"Flavor")]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:outputTargets = "not-gm"]
[h:pm.a5e.EffectData = "[]"]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"Class","Item",
	"Name","Equipment",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","Item",
	"DisplayName","Equipment",
	"Type","Equipment",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,0)]

[h:output.PC = output.PC + json.get(macro.return,"Player") + EquipmentDescription + "</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM") + EquipmentDescription + "</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]