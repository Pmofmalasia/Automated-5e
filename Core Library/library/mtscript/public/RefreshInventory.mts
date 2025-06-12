[h:refreshData = macro.args]
[h:ParentToken = json.get(refreshData,"ParentToken")]
[h:allTokens = getTokens("json")]
[h,if(!json.contains(allTokens,ParentToken)): return(0)]
[h:switchToken(ParentToken)]

[h:frameName = "Inventory"+ParentToken]
[h:frameData = getFrameProperties(frameName)]
[h,if(frameData == ""): return(0)]

[h:updateTest = 1]
[h:"<!-- TODO: Equipment: Include actual calcuation of number of attuned items when possible -->"]
[h:SentInventoryData = json.set("",
	"ParentToken",ParentToken,
	"Inventory",getProperty("a5e.stat.Inventory"),
	"TokenName",getName(ParentToken),
	"Limbs",pm.a5e.Limbs(ParentToken),
	"HeldItems",getProperty("a5e.stat.HeldItems"),
	"EquippedArmor",getProperty("a5e.stat.EquippedArmor"),
	"AttunedItems",getProperty("a5e.stat.AttunedItems"),
	"AttunementSlots",3
)]
[h:runJsFunction(frameName,"frame","refreshInventory","null",json.append("",SentInventoryData))]