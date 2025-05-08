[h:attunedItemID = arg(0)]
[h:whichSlot = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: Equipment: Need check for meeting prereqs of attunement. Also, will likely need to adjust attunement data storage to track which token is holding the attuned item, allowing for unattunement of that item while not in the inventory. -->"]
[h:allAttunedItems = getProperty("a5e.stat.AttunedItems")]
[h:currentSlot = json.indexOf(allAttunedItems,attunedItemID)]

[h,if(currentSlot == whichSlot): return(0,json.set("","Success",0))]
[h,if(currentSlot > -1): allAttunedItems = json.set(allAttunedItems,currentSlot,"")]
[h:setProperty("a5e.stat.AttunedItems",allAttunedItems)]

[h,if(json.length(allAttunedItems) <= whichSlot):
	itemToUnattuneID = "";
	itemToUnattuneID = json.get(allAttunedItems,whichSlot)
]
[h,if(itemToUnattuneID != ""):
	unattunedItemData = pm.a5e.UnattuneItem(itemToUnattuneID,whichSlot,ParentToken);
	unattunedItemData = "{}"	
]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:totalAttuned = json.length(allAttunedItems)]
[h,if(whichSlot >= totalAttuned):
	allAttunedItems = json.append(allAttunedItems,attunedItemID);
	allAttunedItems = json.set(allAttunedItems,whichSlot,attunedItemID)
]
[h:setProperty("a5e.stat.AttunedItems",allAttunedItems)]

[h:attunedItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+attunedItemID+"')]"),0)]
[h:attunedItemData = json.set(attunedItemData,"IsActive",pm.a5e.EvalItemActive(attunedItemData,ParentToken))]
[h:attunedItemData = json.set(attunedItemData,"AttunedTo",ParentToken)]
[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+attunedItemID+"')]",attunedItemData)]
[h:setProperty("a5e.stat.Inventory",inventory)]

[h:attunedItemDisplayName = json.get(attunedItemData,"DisplayName")]
[h:unattunedItemDisplayName = json.get(unattunedItemData,"ItemDisplayName")]
[h,if(unattunedItemDisplayName == ""):
	tableLineDisplay = attunedItemDisplayName;
	tableLineDisplay = attunedItemDisplayName+" replaced "+unattunedItemDisplayName
]

[h:attunedItemDisplayName = json.get(attunedItemData,"DisplayName")]
[h:holdItemTableLine = json.set("",
	"ShowIfCondensed",1,
	"Header","Attuned Item",
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
	"AttunedItems",allAttunedItems,
	"ItemDisplayName",attunedItemDisplayName,
	"UnattunedItemDisplayName",unattunedItemDisplayName
))]