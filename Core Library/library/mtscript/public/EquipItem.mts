[h:EquipItemData = macro.args]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:StandardLimb = json.set("","Length",5,"Limits","{}")]
[h:UsableLimbs = json.append("",
	json.set(StandardLimb,
		"Name","MainHand",
		"DisplayName","Main Hand"),
	json.set(StandardLimb,
		"Name","OffHand",
		"DisplayName","Off Hand")
)]
[h:pm.PassiveFunction("Limbs")]

[h:AttunementSlots = 3]
[h:pm.PassiveFunction("AttunementSlots")]

[h:AllArmor = json.path.read(CurrentInventory,"[*][?(@.Type == 'Armor')]")]
[h:AllWeapons = json.path.read(CurrentInventory,"[*][?(@.Type == 'Weapon')]")]
[h:AllShields = json.path.read(CurrentInventory,"[*][?(@.Type == 'Shield')]")]
[h:AllFoci = json.path.read(CurrentInventory,"[*][?(@.Type == 'CastingFocus')]")]
[h:AllTools = json.path.read(CurrentInventory,"[*][?(@.Type == 'Tool')]")]
[h:AllWearables = json.path.read(CurrentInventory,"[*][?(@.isWearable == 1 && @.Type != 'Armor' && @.Type != 'Weapon')]")]

[h:"<!-- Will need to add a check for if it should use false name or not -->"]
[h:ArmorSelection = "<option value=''>None</option>"]
[h,foreach(armor,AllArmor): ArmorSelection = ArmorSelection + "<option value='"+json.get(armor,"ItemID")+"'>"+json.get(armor,"DisplayName")+"</option>"]

[h:WeaponSelection = ""]
[h,foreach(weapon,AllWeapons): WeaponSelection = WeaponSelection + "<option value='"+json.get(weapon,"ItemID")+"'>"+json.get(weapon,"DisplayName")+"</option>"]

[h:ShieldSelection = ""]
[h,foreach(shield,AllShields): ShieldSelection = ShieldSelection + "<option value='"+json.get(shield,"ItemID")+"'>"+json.get(shield,"DisplayName")+"</option>"]

[h:FociSelection = ""]
[h,foreach(focus,AllFoci): FociSelection = FociSelection + "<option value='"+json.get(focus,"ItemID")+"'>"+json.get(focus,"DisplayName")+"</option>"]

[h:ToolSelection = ""]
[h,foreach(tool,AllTools): ToolSelection = ToolSelection + "<option value='"+json.get(tool,"ItemID")+"'>"+json.get(tool,"DisplayName")+"</option>"]

[h:EquipItemHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'><input type='hidden' name='LimbNumber' id='LimbNumber' value='"+json.length(UsableLimbs)+"'>

<tr id='rowArmorChoice'><th>Armor:</th><td><select id='ArmorChoice' name='ArmorChoice' value='"+getProperty("a5e.stat.EquippedArmor")+"'>"+ArmorSelection+"</select></td></tr>"]

[h:AllHeldItemOptions = "<option value=''>Empty</option>" + WeaponSelection + ShieldSelection + FociSelection + ToolSelection]
[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
[h,foreach(limb,UsableLimbs),CODE:{
	[h:thisLimbHeldItem = ""]
	[h,if(roll.count < json.length(CurrentHeldItems)): thisLimbHeldItem = json.get(CurrentHeldItems,roll.count)]
	[h:EquipItemHTML = EquipItemHTML + "<tr id='rowLimb"+roll.count+"Choice'><th>"+json.get(limb,"DisplayName")+":</th><td><select id='Limb"+roll.count+"Choice' name='Limb"+roll.count+"Choice' value='"+thisLimbHeldItem+"'>"+AllHeldItemOptions+"</select></td></tr>"]
}]

[h:AllAttunement = json.path.read(CurrentInventory,"[*][?(@.isAttunement == 1)]")]
[h:AttunementSelection = "<option value=''>None</option>"]
[h,foreach(magicItem,AllAttunement): AttunementSelection = AttunementSelection + "<option value='"+json.get(magicItem,"ItemID")+"'>"+json.get(magicItem,"DisplayName")+"</option>"]

[h:EquipItemHTML = EquipItemHTML + "<tr id='rowMagicItemHeader name='rowMagicItemHeader'><th text-align='center' colspan='2'>Magic Item Attunement</th></tr><input type='hidden' name='AttunementNumber' id='AttunementNumber' value='"+AttunementSlots+"'>"]

[h,count(AttunementSlots): EquipItemHTML = EquipItemHTML + "<tr id='rowAttunementChoice"+roll.count+"'><th>Attunement Slot #"+(roll.count+1)+":</th><td><select id='AttunementChoice"+roll.count+"' name='AttunementChoice"+roll.count+"'>"+AttunementSelection+"</select></td></tr>"]

[h:"<!-- Add input for worn items here -->"]

[h,if(!json.isEmpty(AllWearables)): EquipItemHTML = EquipItemHTML + "<tr id='rowWornItemsHeader name='rowWornItemsHeader'><th text-align='center' colspan='2'>Other Worn Items</th></tr>"]

[h,foreach(wearableItem,AllWearables): EquipItemHTML = EquipItemHTML + "<tr id='rowWearableChoice"+json.get(wearableItem,"ItemID")+"'><th>Wear "+json.get(wearableItem,"DisplayName")+":</th><td><input type='checkbox' name='WearableChoice"+json.get(wearableItem,"ItemID")+" id='WearableChoice"+json.get(wearableItem,"ItemID")+"'"+if(json.get(wearableItem,"isWorn")==1," checked","")+"></td></tr>"]

[h:EquipItemHTML = EquipItemHTML + "<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Change Equipment'></th></tr>"]

[h:html.dialog5("Equipment","lib://pm.a5e.core/EquipItem.html?cachelib=false","value="+base64.encode(EquipItemHTML)+"; width=500; height=400; closebutton=0")]