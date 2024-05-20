[h:AddedItemData = macro.args]
[h:AddedItem = json.get(AddedItemData,"Item")]
[h:ParentToken = json.get(AddedItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:PriorInventory = getProperty("a5e.stat.Inventory")]

[h,if(json.get(AddedItem,"StoredIn") != ""): 
	movedWithContainerTest = !json.isEmpty(json.path.read(PriorInventory,"\$[*][?(@.ItemID == '"+json.get(AddedItem,"StoredIn")+"')]"));
	movedWithContainerTest = 0
]
[h:StackingTest = json.get(AddedItem,"isStackable")]
[h,if(StackingTest && !movedWithContainerTest):
	equivalentItem = pm.a5e.GetEquivalentItem(AddedItem,PriorInventory);
	equivalentItem = "{}"
]
[h:newEntryTest = json.isEmpty(equivalentItem)]

[h,if(newEntryTest),CODE:{
	[h,if(StackingTest),CODE:{
		[h:NumberAdded = json.get(AddedItemData,"NumberAdded")]
		[h:NumberOfEntries = 1]
	};{
		[h:NumberAdded = 1]
		[h:NumberOfEntries = json.get(AddedItemData,"NumberAdded")]
	}]

	[h,count(NumberOfEntries),CODE:{
		[h:TempAddedItem = json.set(AddedItem,"Number",NumberAdded)]
		[h,MACRO("ChangeItemID@Lib:pm.a5e.Core"): TempAddedItem]
		[h:TempAddedItem = macro.return]

		[h:PriorInventory = json.append(PriorInventory,TempAddedItem)]
	}]

	[h:NewInventory = PriorInventory]
};{
	[h:OldEntryID = json.get(equivalentItem,"ItemID")]

	[h:NewNumber = json.get(equivalentItem,"Number") + json.get(AddedItemData,"NumberAdded")]
	
	[h:NewInventory = json.path.set(PriorInventory,"\$[*][?(@.ItemID == '"+OldEntryID+"')]['Number']",NewNumber)]
}]

[h:setProperty("a5e.stat.Inventory",NewInventory)]
[h:return(0,NewInventory)]