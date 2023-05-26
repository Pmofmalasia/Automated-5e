[h:ItemActivationData = macro.args]
[h:ActivatedItemID = json.get(ItemActivationData,"Item")]
[h:ActivateItem = json.get(ItemActivationData,"Activate")]
[h:ParentToken = json.get(ItemActivationData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:ActivatedItemInventory = json.path.set(getProperty("a5e.stat.Inventory"),"$.[*][?(@.ItemID=="+ActivatedItemID+")]['IsActive']",ActivateItem)]
[h:setProperty("a5e.stat.Inventory",ActivatedItemInventory)]

[h,MACRO("ShowInventory@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken)]