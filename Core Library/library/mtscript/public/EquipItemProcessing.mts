[h:EquipItemData = macro.args]
[h:EquipItemData = pm.a5e.KeyStringsToNumbers(EquipItemData)]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(EquipItemData,"ItemChoice")]

[h:ArmorChoice = json.get(EquipItemData,"ArmorChoice")]
[h:setProperty("a5e.stat.EquippedArmor",ArmorChoice)]

[h:LimbNumber = json.get(EquipItemData,"LimbNumber")]
[h:NewHeldItems = "[]"]
[h,count(LimbNumber): NewHeldItems = json.append(NewHeldItems,json.get(EquipItemData,"Limb"+roll.count+"Choice"))]
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

[h:AttunementNumber = json.get(EquipItemData,"AttunementNumber")]
[h:NewAttunedItems = "[]"]
[h,count(AttunementNumber): NewAttunedItems = json.append(NewAttunedItems,json.get(EquipItemData,"AttunementChoice"+roll.count))]
[h:setProperty("a5e.stat.AttunedItems",NewAttunedItems)]