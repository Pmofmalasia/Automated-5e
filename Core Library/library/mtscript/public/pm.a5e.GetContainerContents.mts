[h:Container = arg(0)]
[h:Inventory = arg(1)]
[h:currentIndex = json.indexOf(Inventory,Container) + 1]
[h:ContainedItems = "[]"]
[h:ContainedItemIDs = "[]"]

[h:thisContainerContents = json.get(Container,"Contents")]
[h:contentsNum = json.length(thisContainerContents)]

[h,count(contentsNum),CODE:{
	[h:thisItem = json.get(Inventory,currentIndex)]
	[h:ContainedItems = json.append(ContainedItems,thisItem)]
	[h:ContainedItemIDs = json.append(ContainedItemIDs,json.get(thisItem,"ItemID"))]

	[h:hasContents = !json.isEmpty(json.get(thisItem,"Contents"))]
	[h,if(hasContents),CODE:{
		[h:ContainerData = pm.a5e.GetContainerContents(thisItem,Inventory)]
		[h:ContainedItems = json.merge(ContainedItems,json.get(ContainerData,"Items"))]
		[h:ContainedItemIDs = json.merge(ContainedItemIDs,json.get(ContainerData,"ItemIDs"))]
	}]

	[h:Inventory = json.remove(Inventory,currentIndex)]
}]

[h:returnData = json.set("",
	"Items",ContainedItems,
	"ItemIDs",ContainedItemIDs
)]
[h:return(0,returnData)]