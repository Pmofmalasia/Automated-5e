[h:DroppedContainer = arg(0)]
[h:currentIndex = arg(1)]
[h:OldInventory = arg(2)]
[h:NewInventory = OldInventory]
[h:DroppedItems = "[]"]

[h:thisContainerContents = json.get(DroppedContainer,"Contents")]
[h:contentsNum = json.length(thisContainerContents)]
[h,count(contentsNum),CODE:{
	[h:thisItem = json.get(NewInventory,currentIndex)]
	[h:DroppedItems = json.append(DroppedItems,thisItem)]
	[h:NewInventory = json.path.delete(NewInventory,"\$[*][?(@.ItemID == '"+json.get(thisItem,"ItemID")+"')]")]

	[h:hasContents = !json.isEmpty(json.get(thisItem,"Contents"))]
	[h,if(hasContents),CODE:{
		[h:DroppedContainerData = pm.a5e.DropContainerContents(thisItem,currentIndex,NewInventory)]
		[h:NewInventory = json.get(DroppedContainerData,"NewInventory")]
		[h:DroppedItems = json.merge(DroppedItems,json.get(DroppedContainerData,"DroppedItems"))]
	}]
}]

[h:returnData = json.set("",
	"DroppedItems",DroppedItems,
	"NewInventory",NewInventory
)]
[h:return(0,returnData)]