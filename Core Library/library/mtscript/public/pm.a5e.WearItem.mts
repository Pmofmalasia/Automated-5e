[h:wornItemID = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:inventory = getProperty("a5e.stat.Inventory")]
[h:wornItemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+wornItemID+"')]"),0)]
[h:AttunementTest = pm.a5e.CheckAttunement(wornItemData,ParentToken)]
[h,if(AttunementTest): wornItemData = json.set(wornItemData,"IsActive",1)]
[h:wornItemData = json.set(wornItemData,"CurrentlyWorn",1)]
[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+wornItemID+"')]",wornItemData)]
[h:setProperty("a5e.stat.Inventory",inventory)]

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