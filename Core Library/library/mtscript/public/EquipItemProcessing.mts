[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:NewInventory = json.path.set(CurrentInventory,"[*][?(@.isWearable == 1)]['isWorn']",0)]
[h:NewInventory = json.path.set(NewInventory,"[*][?(@.isAttunement == 1)]['AttunedTo']","")]

[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:setProperty("a5e.stat.EquippedArmor",ArmorChoice)]
[h,if(ArmorChoice!=""): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+ArmorChoice+")]['isWorn']",1)]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:NewHeldItems = "[]"]
[h,count(LimbNumber),CODE:{
	[h:thisLimbChoice = json.get(EquipItemData,"Limb"+roll.count+"Choice")]
	[h:NewHeldItems = json.append(NewHeldItems,thisLimbChoice)]
	[h,if(thisLimbChoice != ""): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisLimbChoice+")]['isWorn']",1)]
}]
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

[h:AttunementNumber = json.get(EquipItemData,"AttunementNumber")]
[h:NewAttunedItems = "[]"]
[h,count(AttunementNumber),CODE:{
	[h:thisAttunementChoice = json.get(EquipItemData,"AttunementChoice"+roll.count)]
	[h:NewAttunedItems = json.append(NewAttunedItems,thisAttunementChoice)]
	[h,if(thisAttunementChoice != ""): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisAttunementChoice+")]['AttunedTo']",ParentToken)]
}]
[h:setProperty("a5e.stat.AttunedItems",NewAttunedItems)]

[h:AllWearables = json.path.read(NewInventory,"[*][?(@.isWearable == 1 && @.Type != 'Armor')]")]
[h,foreach(wearableItem,AllWearables),CODE:{
	[h:thisItemID = json.get(wearableItem,"ItemID")]
	[h,if(json.contains(EquipItemData,"WearableChoice"+thisItemID)): NewInventory = json.path.set(NewInventory,"[*][?(@.ItemID == "+thisItemID+")]['isWorn']",1)]
}]

[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:closeDialog("Equipment")]