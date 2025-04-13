[h:heldItemID = arg(0)]
[h:whichHand = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]

[h:allHeldItems = getProperty("a5e.stat.HeldItems")]
[h:currentHand = json.indexOf(allHeldItems,heldItemID)]

[h,if(currentHand == whichHand): return(0,json.set("","Success",0))]
[h,if(currentHand > -1): allHeldItems = json.set(allHeldItems,currentHand,"")]
[h:setProperty("a5e.stat.HeldItems",allHeldItems)]

[h:"<!-- TODO: Equipment: Create a check for dropping vs. stowing already held item"]
[h:itemToStowID = json.get(allHeldItems,whichHand)]
[h,if(itemToStowID != ""):
	stowedItemData = pm.a5e.StowItem(itemToStowID,whichHand,ParentToken);
	stowedItemData = "{}"	
]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:allHeldItems = json.set(allHeldItems,whichHand,heldItemID)]
[h:heldItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+heldItemID+"')]"),0)]
[h,if(json.get(heldItemData,"isHeld") == 1),CODE:{
	[h:AttunementTest = pm.a5e.CheckAttunement(heldItemData,ParentToken)]
	[h,if(AttunementTest): heldItemData = json.set(heldItemData,"IsActive",1)]
	[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+heldItemID+"')]",heldItemData)]
};{}]
[h:heldItemDisplayName = json.get(heldItemData,"DisplayName")]
[h:setProperty("a5e.stat.Inventory",inventory)]

[h:stowedItemDisplayName = json.get(stowedItemData,"ItemDisplayName")]
[h,if(stowedItemDisplayName == ""):
	tableLineDisplay = heldItemDisplayName;
	tableLineDisplay = heldItemDisplayName+" replaced "+stowedItemDisplayName
]

[h:heldItemDisplayName = json.get(heldItemData,"DisplayName")]
[h:holdItemTableLine = json.set("",
	"ShowIfCondensed",1,
	"Header","Held Item",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",tableLineDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h:return(0,json.set("",
	"Success",1,
	"Table",json.append("",holdItemTableLine),
	"Inventory",inventory,
	"HeldItems",allHeldItems,
	"ItemDisplayName",heldItemDisplayName,
	"StowedItemDisplayName",stowedItemDisplayName
))]