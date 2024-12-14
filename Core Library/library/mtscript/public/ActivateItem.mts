[h:ItemActivationData = macro.args]
[h:ActivatedItemID = json.get(ItemActivationData,"Item")]
[h:ActivateItem = json.get(ItemActivationData,"Activate")]
[h:ParentToken = json.get(ItemActivationData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: Items - Will eventually add validation to if you're allowed to activate the item - e.g. requiring a command word but silenced -->"]
[h:isActivationSuccessful = 1]
[h:return(isActivationSuccessful,"")]

[h,if(0),CODE:{
	[h:ActivatedItemInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID=='"+ActivatedItemID+"')]['IsActive']",ActivateItem)]
	[h:setProperty("a5e.stat.Inventory",ActivatedItemInventory)]
};{}]

[h:ItemData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+ActivatedItemID+"')]")]
[h:assert(!json.isEmpty(ItemData),"This item is no longer in your inventory!")]
[h:ItemData = json.get(ItemData,0)]

[h:SelectedEffectData = pm.a5e.SelectEffect(ParentToken,ItemData,"Activation")]
[h:selectedEffect = json.get(SelectedEffectData,"Effect")]
[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set(ItemData,"Effect",selectedEffect,"IsTooltip",0,"ParentToken",ParentToken)]
[h:broadcast("out")]

[h:return(0,ActivateItem)]