[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:NewInventory = json.path.set(CurrentInventory,"[*][?(@.isWearable == 1 || @.isAttunement == 1)]['IsActive']",0)]
[h:NewInventory = json.path.set(NewInventory,"[*][?(@.isAttunement == 1)]['AttunedTo']","")]

[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:setProperty("a5e.stat.EquippedArmor",ArmorChoice)]
[h,if(ArmorChoice!=""): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+ArmorChoice+")]['IsActive']",1)]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:NewHeldItems = "[]"]
[h,count(LimbNumber),CODE:{
	[h:thisLimbChoice = json.get(EquipItemData,"Limb"+roll.count+"Choice")]
	[h:NewHeldItems = json.append(NewHeldItems,thisLimbChoice)]
	[h,if(thisLimbChoice != ""): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisLimbChoice+")]['IsActive']",1)]

	[h,if(json.contains(EquipItemData,"AmmunitionChoiceLimb"+roll.count)),CODE:{
		[h:NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisLimbChoice+")]['AmmunitionID']",json.get(EquipItemData,"AmmunitionChoiceLimb"+roll.count))]
		[h:EquipItemData = json.remove(EquipItemData,"AmmunitionChoiceLimb"+roll.count)]
	};{}]
}]
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

[h:AttunementNumber = json.get(EquipItemData,"AttunementNumber")]
[h:NewAttunedItems = "[]"]
[h,count(AttunementNumber),CODE:{
	[h:thisAttunementChoice = json.get(EquipItemData,"AttunementChoice"+roll.count)]
	[h,if(thisAttunementChoice != ""),CODE:{
		[h:NewAttunedItems = json.append(NewAttunedItems,thisAttunementChoice)]
		[h:NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisAttunementChoice+")]['AttunedTo']",ParentToken)]
		[h:NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisAttunementChoice+")]['IsActive']",1)]
	}]
}]
[h:setProperty("a5e.stat.AttunedItems",NewAttunedItems)]
[h:"<!-- Note: This property should be used instead of just json.path.reading the inventory because attuned items may be dropped or given to other tokens despite still being attuned -->"]

[h:AllWearables = json.path.read(NewInventory,"[*][?(@.isWearable == 1)]")]
[h,foreach(wearableItem,AllWearables),CODE:{
	[h:thisItemID = json.get(wearableItem,"ItemID")]
	[h,if(json.contains(EquipItemData,"WearableChoice"+thisItemID)): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisItemID+")]['IsActive']",1)]
}]

[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:closeDialog("Equipment")]