[h:droppedItemData = macro.args]
[h:DroppedItemList = json.get(droppedItemData,"Items")]

[h:droppedItems = ""]
[h:droppedItemsDisplay = ""]
[h:baseDropItemData = json.remove(droppedItemData,"Items")]
[h:baseDropItemData = json.set(baseDropItemData,"SuppressOutput",1)]
[h,foreach(item,DroppedItemList),CODE:{
	[h:thisDropItemData = json.set(baseDropItemData,
		"ItemID",json.get(item,"ItemID"),
		"Number",json.get(item,"Number")
	)]

	[h,MACRO("DropItem@Lib:pm.a5e.Core"): thisDropItemData]
	[h:dropItemReturnData = macro.return]

	[h:thisItem = json.get(dropItemReturnData,"Item")]
	[h:droppedItems = json.append(droppedItems,thisItem)]

	[h:thisItemDisplay = if(json.get(thisItem,"Number") > 1,json.get(thisItem,"Number")+" ","")+json.get(thisItem,"DisplayName")+if(json.isEmpty(json.get(thisItem,"Contents")),""," and its contents")]
	[h:droppedItemsDisplay = json.append(droppedItemsDisplay,thisItemDisplay)]
}]

[h:"<!-- TODO: BUGFIX: need to bring suppressed output for dropped items (without token left behind) back here to be output in this output. May then also need function for trading multiple items - current one only works for multiple if it's container w/ items in it, but as is number argument can only apply to the first item (intended to be the container). Will need refactoring to make work (ew). Low priority as the only way to use DropMultipleItems currently doesn't allow for no tokens anyway. -->"]

[h:finalDroppedItemDisplay = pm.a5e.CreateDisplayList(droppedItemsDisplay,"",json.set("","isVariableDelimiter",1))]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Dropped Items",
	"FalseHeader","",
	"FullContents",finalDroppedItemDisplay,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:return(0,json.set("","Table",abilityTable))]