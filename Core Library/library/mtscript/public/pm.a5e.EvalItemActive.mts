[h:itemArg = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h,if(json.type(itemArg) == "OBJECT"),CODE:{
	[h:itemData = itemArg]
	[h:itemID = json.get(itemData,"ItemID")]
};{
	[h:itemID = itemArg]
	[h:inventory = getProperty("a5e.stat.Inventory")]
	[h:itemData = json.path.read(inventory,"\$[*][?(@.ItemID == '"+itemID+"')]")]
	[h:return(!json.isEmpty(itemData),0)]
	[h:itemData = json.get(itemData,0)]
}]

[h:activeTest = pm.a5e.ItemCanBeActive(itemData,ParentToken)]
[h:return(activeTest,activeTest)]

[h,if(json.get(itemData,"isActivatable") == 1): activeTest = json.get(itemData,"IsActive")]
[h:return(0,activeTest)]