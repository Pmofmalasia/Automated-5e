[h:ItemActivationData = macro.args]
[h:ActivatedItemID = json.get(ItemActivationData,"Item")]
[h:ActivateItem = json.get(ItemActivationData,"Activate")]
[h:ParentToken = json.get(ItemActivationData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: Will eventually add validation to if you're allowed to activate the item - e.g. requiring a command word but silenced -->"]
[h:isActivated = ActivateItem]

[h:ActivatedItemInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID=='"+ActivatedItemID+"')]['IsActive']",isActivated)]
[h:setProperty("a5e.stat.Inventory",ActivatedItemInventory)]

[h:return(0,isActivated)]