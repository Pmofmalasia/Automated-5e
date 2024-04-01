[h:DropItemData = macro.args]
[h:ParentToken = json.get(DropItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:DroppedItem = json.get(DropItemData,"ItemID")]
[h:DroppedNumber = number(json.get(DropItemData,"Number"))]
[h:DropLocation = json.get(DropItemData,"Location")]
[h:isLeaveToken = json.get(DropItemData,"LeaveToken")]

[h:ItemData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+DroppedItem+"')]")]
[h,if(json.isEmpty(ItemData)):
	return(0);
	ItemData = json.get(ItemData,0)
]

[h:CurrentItemNumber = json.get(ItemData,"Number")]
[h,if(DroppedNumber > CurrentItemNumber):
	FinalDroppedNumber = CurrentItemNumber;
	FinalDroppedNumber = DroppedNumber
]
[h:NewInventoryNumber = CurrentItemNumber - FinalDroppedNumber]
[h,if(NewInventoryNumber == 0):
	NewInventory = json.path.delete(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+DroppedItem+"')]");
	NewInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+DroppedItem+"')]['Number']",NewInventoryNumber)
]

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

[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:ItemData = json.set(ItemData,"Number",FinalDroppedNumber)]

[h,if(getProperty("a5e.stat.EquippedArmor") == DroppedItem): setProperty("a5e.stat.EquippedArmor","")]
[h:NewHeldItems = getProperty("a5e.stat.HeldItems")]
[h,foreach(heldItem,getProperty("a5e.stat.HeldItems")),CODE:{
	[h,if(heldItem == DroppedItem): NewHeldItems = json.set(NewHeldItems,roll.count,"")]
}]
[h:setProperty("a5e.stat.HeldItems",NewHeldItems)]

[h,if(isLeaveToken),CODE:{
	[h,MACRO("GenerateObjectToken@Lib:pm.a5e.Core"): json.set(ItemData,"Location",DropLocation)]
};{
	[h:RestorationData = json.set("",
		"ItemChoice",ItemData,
		"NumberAdded",json.get(ItemData,"Number"),
		"ParentToken",ParentToken
	)]

	[h:restoreItemLink = macroLinkText("AddItemProcessing@Lib:pm.a5e.Core","gm",RestorationData,ParentToken)]
	[h:broadcast("<a href='"+restoreItemLink+"'>Return Item to "+getName(ParentToken)+"?</a>","gm")]
}]

[h:macro.return = json.set("","ItemID",DroppedItem,"ItemRemaining",NewInventoryNumber)]