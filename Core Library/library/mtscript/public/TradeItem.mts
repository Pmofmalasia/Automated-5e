[h:TradedItemsData = macro.args]
[h:TradedItemID = json.get(TradedItemsData,"Item")]
[h:NumberTraded = json.get(TradedItemsData,"Number")]
[h:ItemGivenTo = json.get(TradedItemsData,"GiveTo")]
[h:ItemTakenFrom = json.get(TradedItemsData,"TakeFrom")]

[h:TradedItem = json.get(json.path.read(getProperty("a5e.stat.Inventory",ItemTakenFrom),"[*][?(@.ItemID == "+TradedItemID+")]"),0)]
[h:switchToken(ItemGivenTo)]
[h:PriorInventory = getProperty("a5e.stat.Inventory")]

[h:TradedItem = json.set(TradedItem,"Number",NumberTraded)]
[h,if(json.get(TradedItem,"isWearable") == 1),CODE:{
	[h:TradedItem = json.set(TradedItem,"IsActive",0)]
};{
	[h,if(json.get(TradedItem,"isAttunement")): TradedItem = json.set(TradedItem,"IsActive",(json.get(TradedItem,"AttunedTo") == ItemGivenTo))]
}]

[h:newEntryTest = 1]
[h:StackingTest = json.get(TradedItem,"isStackable")]
[h,if(StackingTest),CODE:{
	[h:SameItemPriorEntry = json.path.read(PriorInventory,"[*][?(@.ObjectID == '"+TradedItemID+"')]")]
	[h:newEntryTest = json.isEmpty(SameItemPriorEntry)]
};{}]

[h,if(newEntryTest),CODE:{
	[h,if(StackingTest),CODE:{
		[h:NumberAdded = NumberTraded]
		[h:NumberOfEntries = 1]
	};{
		[h:NumberAdded = 1]
		[h:NumberOfEntries = NumberTraded]
	}]

	[h,count(NumberOfEntries),CODE:{
		[h:TempTradedItem = json.set(TradedItem,"Number",NumberAdded)]
		[h:PriorInventory = json.append(PriorInventory,TempTradedItem)]
	}]

	[h:setProperty("a5e.stat.Inventory",PriorInventory)]
};{
	[h:OldEntryData = json.get(SameItemPriorEntry,0)]
	[h:NewNumber = json.get(OldEntryData,"Number") + json.get(AddItemData,"NumberAdded")]
	[h:NewInventory = json.path.setcarefully(PriorInventory,"[*][?(@.ObjectID == '"+TradedItemID+"')]['Number']",NewNumber)]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]
}]

[h,if(ItemTakenFrom != ""),CODE:{
	[h:switchToken(ItemTakenFrom)]

	[h:DropItemData = json.set("",
		"ParentToken",ItemTakenFrom,
		"ItemID",TradedItemID,
		"Number",NumberTraded,
		"LeaveToken",0
	)]
	[h,MACRO("DropItem@Lib:pm.a5e.Core"): DropItemData]
	[h:DroppedItemReturnData = macro.return]

	[h:RemoveObjectOnMapTest = and(json.get(DroppedItemReturnData,"ItemRemaining") == 0,getPropertyType() == "A5EObject",getProperty("a5e.stat.ItemID") == TradedItemID)]
	[h,if(RemoveObjectOnMapTest): removeToken(ItemTakenFrom)]

	[h:switchToken(ItemGivenTo)]
};{}]