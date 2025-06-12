[h:wornItemID = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:wornItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+wornItemID+"')]"),0)]
[h:wornItemData = json.set(wornItemData,"isWorn",1)]
[h:wornItemData = json.set(wornItemData,"IsActive",pm.a5e.EvalItemActive(wornItemData,ParentToken))]
[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+wornItemID+"')]",wornItemData)]
[h:setProperty("a5e.stat.Inventory",inventory)]
[h:pm.a5e.UpdateOtherInventories(ParentToken,"all")]

[h:wornItemDisplayName = json.get(wornItemData,"DisplayName")]
[h:wearItemTableLine = json.set("",
	"ShowIfCondensed",1,
	"Header","Worn Item",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",wornItemDisplayName,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h:return(0,json.set("",
	"Success",1,
	"Table",json.append("",wearItemTableLine),
	"Inventory",inventory,
	"ItemDisplayName",wornItemDisplayName
))]