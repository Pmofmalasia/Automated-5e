[h:ShowInventoryData = macro.args]
[h:ParentToken = json.get(ShowInventoryData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]
[h:SentInventoryData = json.set("",
	"ParentToken",ParentToken,
	"Inventory",CurrentInventory,
	"TokenName",getName(ParentToken)
)]

[h:html.frame5("Inventory"+ParentToken,"lib://pm.a5e.core/ShowInventory.html?cachelib=false","value="+base64.encode(SentInventoryData)+"; closebutton=0; height=300")]