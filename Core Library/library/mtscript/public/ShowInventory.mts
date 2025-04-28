[h:ShowInventoryData = macro.args]
[h:ParentToken = json.get(ShowInventoryData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:"<!-- TODO: Equipment: Include actual calcuation of number of attuned items when possible -->"]
[h:SentInventoryData = json.set("",
	"ParentToken",ParentToken,
	"Inventory",CurrentInventory,
	"TokenName",getName(ParentToken),
	"Limbs",pm.a5e.Limbs(ParentToken),
	"HeldItems",getProperty("a5e.stat.HeldItems"),
	"EquippedArmor",getProperty("a5e.stat.EquippedArmor"),
	"AttunedItems",getProperty("a5e.stat.AttunedItems"),
	"AttunementSlots",3
)]

[h:html.frame5("Inventory"+ParentToken,"lib://pm.a5e.core/ShowInventory.html?cachelib=false","value="+base64.encode(SentInventoryData)+"; closebutton=0; height=300")]