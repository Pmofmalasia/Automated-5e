[h:DropItemData = macro.args]
[h:ParentToken = json.get(DropItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:DroppedItem = json.get(DropItemData,"ItemID")]
[h:DroppedNumber = number(json.get(DropItemData,"Number"))]
[h:DropLocation = json.get(DropItemData,"Location")]
[h:isLeaveToken = json.get(DropItemData,"LeaveToken")]

[h:NewInventory = getProperty("a5e.stat.Inventory")]
[h:ItemData = json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+DroppedItem+"')]")]
[h,if(json.isEmpty(ItemData)):
	return(0);
	ItemData = json.get(ItemData,0)
]

[h:OldItemData = ItemData]
[h:CurrentItemNumber = json.get(ItemData,"Number")]
[h,if(DroppedNumber > CurrentItemNumber):
	FinalDroppedNumber = CurrentItemNumber;
	FinalDroppedNumber = DroppedNumber
]
[h:ItemData = json.set(ItemData,"Number",FinalDroppedNumber)]

[h:ContainerID = json.get(ItemData,"StoredIn")]
[h,if(ContainerID != ""),CODE:{
	[h:ContainerData = json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+ContainerID+"')]")]
	[h,if(!json.isEmpty(ContainerData)),CODE:{
		[h:ContainerData = json.get(ContainerData,0)]
		[h:ContainerContents = json.get(ContainerData,"Contents")]
		[h,if(ContainerContents != ""): 
			droppedItemContainerIndex = json.indexOf(ContainerContents,DroppedItem);
			droppedItemContainerIndex = -1
		]
		[h,if(droppedItemContainerIndex != -1): ContainerContents = json.remove(droppedItemContainerIndex)]
		[h:NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+ContainerID+"')]['Contents']",ContainerContents)]
	};{}]
};{}]

[h:thisContainerContents = json.get(ItemData,"Contents")]
[h:allDroppedItems = json.append("",ItemData)]
[h:allDroppedItemIDs = "[]"]
[h,if(!json.isEmpty(thisContainerContents)),CODE:{
	[h:DroppedContainerData = pm.a5e.GetContainerContents(OldItemData,NewInventory)]
	[h:allDroppedItems = json.merge(allDroppedItems,json.get(DroppedContainerData,"Items"))]
	[h:allDroppedItemIDs = json.merge(allDroppedItemIDs,json.get(DroppedContainerData,"ItemIDs"))]
};{}]

[h:NewInventoryNumber = CurrentItemNumber - FinalDroppedNumber]
[h,if(NewInventoryNumber == 0):
	NewInventory = json.path.delete(NewInventory,"\$[*][?(@.ItemID == '"+DroppedItem+"')]");
	NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+DroppedItem+"')]['Number']",NewInventoryNumber)
]
[h:NewInventory = json.path.delete(NewInventory,"\$[*][?(@.ItemID in "+allDroppedItemIDs+")]")]
[h:setProperty("a5e.stat.Inventory",NewInventory)]

[h,if(getProperty("a5e.stat.EquippedArmor") == DroppedItem): setProperty("a5e.stat.EquippedArmor","")]
[h:NewHeldItems = getProperty("a5e.stat.HeldItems")]
[h,foreach(heldItem,getProperty("a5e.stat.HeldItems")),CODE:{
	[h,if(heldItem == DroppedItem): NewHeldItems = json.set(NewHeldItems,roll.count,"")]
}]
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

[h,if(isLeaveToken),CODE:{
	[h,MACRO("GenerateObjectToken@Lib:pm.a5e.Core"): json.set("","Items",allDroppedItems,"Location",DropLocation)]
};{
	[h:isFromObjectToken = and(getPropertyType() == "A5EObject",getProperty("a5e.stat.ItemID") == DroppedItem)]
	[h,if(isFromObjectToken),CODE:{
		[h:RemoveObjectOnMapTest = and(NewInventoryNumber == 0,isFromObjectToken)]
		[h,if(RemoveObjectOnMapTest): removeToken(ParentToken)]
	};{
		[h:RestorationData = json.set("",
			"Item",allDroppedItems,
			"Number",json.get(ItemData,"Number"),
			"GiveTo",ParentToken
		)]
		[h:restoreItemLink = macroLinkText("TradeItem@Lib:pm.a5e.Core","gm",RestorationData,ParentToken)]
		[h:broadcast("<a href='"+restoreItemLink+"'>Return Item to "+getName(ParentToken)+"?</a>","gm")]		
	}]
}]

[h:return(0,json.set("","Item",ItemData,"ItemRemaining",NewInventoryNumber))]