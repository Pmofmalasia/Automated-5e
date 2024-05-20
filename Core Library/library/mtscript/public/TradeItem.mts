[h:TradedItemsData = macro.args]
[h:TradedItemID = json.get(TradedItemsData,"Item")]
[h:NumberTraded = json.get(TradedItemsData,"Number")]
[h:ItemGivenTo = json.get(TradedItemsData,"GiveTo")]
[h:ItemTakenFrom = json.get(TradedItemsData,"TakeFrom")]

[h,switch(json.type(TradedItemID)),CODE:
	case "OBJECT":{
		[h:TakenFromInventory = getProperty("a5e.stat.Inventory",ItemTakenFrom)]
		[h:TradedItem = TradedItemID]
		[h:TradedItemID = json.get(TradedItem,"ItemID")]
	};
	case "ARRAY":{
		[h:TakenFromInventory = TradedItemID]
		[h:TradedItem = json.get(TradedItemID,0)]
		[h:TradedItemID = json.get(TradedItem,"ItemID")]
	};
	case "UNKNOWN":{
		[h:TakenFromInventory = getProperty("a5e.stat.Inventory",ItemTakenFrom)]
		[h:TradedItem = json.get(json.path.read(TakenFromInventory,"\$[*][?(@.ItemID == '"+TradedItemID+"')]"),0)]
	}
]
[h:switchToken(ItemGivenTo)]

[h:TradedItem = json.remove(TradedItem,"StoredIn")]
[h:TradedItem = json.set(TradedItem,"Number",NumberTraded)]

[h:TradedItemContents = json.get(TradedItem,"Contents")]
[h:allTradedItems = json.append("",TradedItem)]
[h,if(!json.isEmpty(TradedItemContents)),CODE:{
	[h:containedTradedItemData = pm.a5e.GetContainerContents(TradedItem,TakenFromInventory)]
	[h:containedItems = json.get(containedTradedItemData,"Items")]
	[h:allTradedItems = json.merge(allTradedItems,containedItems)]
};{}]

[h,foreach(item,allTradedItems),CODE:{
	[h:thisItem = pm.a5e.TransferItemAdjustments(item,ItemGivenTo,ItemTakenFrom)]
	[h,if(roll.count > 0): NumberTraded = json.get(item,"Number")]
	[h:addItemData = json.set("",
		"Item",thisItem,
		"ParentToken",ItemGivenTo,
		"NumberAdded",NumberTraded
	)]
	[h,MACRO("AddItemToken@Lib:pm.a5e.Core"): addItemData]
}]

[h,if(ItemTakenFrom != ""),CODE:{
	[h:switchToken(ItemTakenFrom)]

	[h:isFromObjectToken = and(getPropertyType() == "A5EObject",getProperty("a5e.stat.ItemID") == TradedItemID)]
	[h:DropItemData = json.set("",
		"ParentToken",ItemTakenFrom,
		"ItemID",TradedItemID,
		"Number",NumberTraded,
		"LeaveToken",0
	)]
	[h,MACRO("DropItem@Lib:pm.a5e.Core"): DropItemData]

	[h:switchToken(ItemGivenTo)]
};{}]