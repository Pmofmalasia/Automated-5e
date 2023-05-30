[h:DropItemData = macro.args]
[h:ParentToken = json.get(DropItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:DroppedItem = json.get(DropItemData,"ItemID")]
[h:DroppedNumber = number(json.get(DropItemData,"Number"))]
[h:DropLocation = json.get(DropItemData,"Location")]

[h:ItemData = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+DroppedItem+")]")]
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
	NewInventory = json.path.delete(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+DroppedItem+")]");
	NewInventory = json.path.set(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+DroppedItem+")]['Number']",NewInventoryNumber)
]
[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:ItemData = json.set(ItemData,"Number",FinalDroppedNumber)]

[h,MACRO("GenerateObjectToken@Lib:pm.a5e.Core"): json.set(ItemData,"Location",DropLocation)]

[h:macro.return = json.set("","ItemID",DroppedItem,"ItemRemaining",NewInventoryNumber)]