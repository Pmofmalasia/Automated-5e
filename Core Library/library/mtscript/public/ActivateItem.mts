[h:ItemActivationData = macro.args]
[h:ActivatedItemID = json.get(ItemActivationData,"Item")]
[h:ActivateItem = json.get(ItemActivationData,"Activate")]
[h:ParentToken = json.get(ItemActivationData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: Items - Will eventually add validation to if you're allowed to activate the item - e.g. requiring a command word but silenced -->"]
[h:isActivationSuccessful = 1]
[h:return(isActivationSuccessful,"")]

[h,if(ActivateItem),CODE:{











	[h:"<!-- Need to execute activation effects here - will be used for picking a resource to use on activation (including activating a time resource) -->"]

	[h:"<!-- Next to do: Differential effect execution based on activation status of used item. -->"]






























};{

}]

[h:ActivatedItemInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID=='"+ActivatedItemID+"')]['IsActive']",ActivateItem)]
[h:setProperty("a5e.stat.Inventory",ActivatedItemInventory)]

[h:return(0,ActivateItem)]