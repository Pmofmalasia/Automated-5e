[h:stowedItemID = arg(0)]
[h:whichHand = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]

[h:allHeldItems = getProperty("a5e.stat.HeldItems")]
[h:currentHand = json.indexOf(allHeldItems,stowedItemID)]
[h,if(currentHand != whichHand || currentHand == -1): return(0,json.set("","Success",0))]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:allHeldItems = json.set(allHeldItems,whichHand,stowedItemID)]
[h:stowedItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+stowedItemID+"')]"),0)]
[h,if(json.get(stowedItemData,"isHeld") == 1),CODE:{
	[h:stowedItemData = json.set(stowedItemData,"IsActive",0)]
	[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+stowedItemID+"')]",stowedItemData)]
};{}]
[h:setProperty("a5e.stat.Inventory",inventory)]

[h:stowedItemDisplayName = json.get(stowedItemData,"DisplayName")]

[h:stowItemTableLine = json.set("",
	"ShowIfCondensed",1,
	"Header","Stowed Item",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",stowedItemDisplayName,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h:return(0,json.set("",
	"Success",1,
	"Table",json.append("",stowItemTableLine),
	"Inventory",inventory,
	"HeldItems",allHeldItems,
	"ItemDisplayName",stowedItemDisplayName
))]