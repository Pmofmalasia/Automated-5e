[h:EquipItemData = macro.args]
[h:ParentToken = json.get(EquipItemData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]
[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]

[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:UsableLimbs = pm.a5e.Limbs(ParentToken)]

[h:AttunementSlots = 3]
[h:pm.PassiveFunction("AttunementSlots")]

[h:EquipItemFormData = json.set("",
	"ParentToken",ParentToken,
	"Inventory",CurrentInventory,
	"HeldItems",CurrentHeldItems,
	"Limbs",UsableLimbs,
	"EquippedArmor",getProperty("a5e.stat.EquippedArmor"),
	"AttunementSlots",AttunementSlots
)]

[h:html.dialog5("Equipment","lib://pm.a5e.core/EquipItem.html?cachelib=false","value="+base64.encode(EquipItemFormData)+"; width=500; height=400; closebutton=0")]