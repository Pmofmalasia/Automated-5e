[h:TradedItemsData = macro.args]
[h:TradedItem = json.get(TradedItemsData,"Item")]
[h:NumberTraded = json.get(TradedItemsData,"Number")]
[h:ItemGivenTo = json.get(TradedItemsData,"GiveTo")]
[h:ItemTakenFrom = json.get(TradedItemsData,"TakeFrom")]
[h:TradedItemID = json.get(TradedItem,"ItemID")]
[h:switchToken(ItemGivenTo)]

[h:PriorInventory = getProperty("a5e.stat.Inventory")]

[h:TradedItem = json.set(TradedItem,"Number",NumberTraded)]
[h,if(json.get(TradedItem,"isWearable") == 1),CODE:{
	[h:TradedItem = json.set(TradedItem,"IsActive",0)]
};{
	[h,if(json.get(TradedItem,"isAttunement")): TradedItem = json.set(TradedItem,"IsActive",(json.get(TradedItem,"AttunedTo") == ItemGivenTo))]
}]

[h:newEntryTest = 1]
[h:StackingTest = json.get(ChosenItem,"isStackable")]
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
		[h:TempChosenItem = json.set(ChosenItem,"Number",NumberAdded)]
		[h:PriorInventory = json.append(PriorInventory,TempChosenItem)]
	}]

	[h:setProperty("a5e.stat.Inventory",PriorInventory)]
};{
	[h:OldEntryData = json.get(SameItemPriorEntry,0)]
	[h:NewNumber = json.get(OldEntryData,"Number") + json.get(AddItemData,"NumberAdded")]
	[h:NewInventory = json.path.set(PriorInventory,"[*][?(@.ObjectID == '"+TradedItemID+"')]['Number']",NewNumber)]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]
}]

[h,if(ItemTakenFrom != ""),CODE:{
	[h:switchToken(ItemTakenFrom)]
	[h:TakenFromInventory = getProperty("a5e.stat.Inventory")]
	[h:TakenFromItemData = json.get(json.path.read(TakenFromInventory,"[*][?(@.ItemID == '"+TradedItemID+"')]"),0)]
	[h:OldTakenFromNumber = json.get(TakenFromItemData,"Number")]
	[h:NewNumber = OldTakenFromNumber - NumberTraded]
	[h,if(NewNumber == 0):
		TakenFromInventory = json.path.delete(TakenFromInventory,"[*][?(@.ItemID == '"+TradedItemID+"')]");
		TakenFromInventory = json.path.set(TakenFromInventory,"[*][?(@.ItemID == '"+TradedItemID+"')]['Number']",NewNumber)
	]

	[h:RemoveObjectOnMapTest = and(NewNumber == 0,getPropertyType() == "A5EObject",getProperty("a5e.stat.ItemID") == TradedItemID)]
	[h,if(RemoveObjectOnMapTest): 
		removeToken(ItemTakenFrom);
		setProperty("a5e.stat.Inventory",TakenFromInventory)
	]

	[h:switchToken(ItemGivenTo)]
};{}]