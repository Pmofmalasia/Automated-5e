[h:attunedItemID = arg(0)]
[h:whichSlot = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]

[h:allAttunedItems = getProperty("a5e.stat.AttunedItems")]
[h:currentSlot = json.indexOf(allAttunedItems,attunedItemID)]
[h,if(currentSlot != whichSlot || currentSlot == -1): return(0,json.set("","Success",0))]

[h:allAttunedItems = json.set(allAttunedItems,whichSlot,"")]
[h:allAttunedItems = getProperty("a5e.stat.AttunedItems")]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:attunedItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+attunedItemID+"')]"),0)]
[h:attunedItemData = json.set(attunedItemData,"IsActive",0)]
[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+attunedItemID+"')]",attunedItemData)]
[h:setProperty("a5e.stat.Inventory",inventory)]

[h:attunedItemDisplayName = json.get(attunedItemData,"DisplayName")]

[h:attuneItemTableLine = json.set("",
	"ShowIfCondensed",1,
	"Header","Unattuned Item",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",attunedItemDisplayName,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h:return(0,json.set("",
	"Success",1,
	"Table",json.append("",attuneItemTableLine),
	"Inventory",inventory,
	"AttunedItems",allAttunedItems,
	"ItemDisplayName",attunedItemDisplayName
))]