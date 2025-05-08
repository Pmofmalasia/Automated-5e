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

[h:heldItems = getProperty("a5e.stat.HeldItems")]
[h:attunedItems = getProperty("a5e.stat.AttunedItems")]

[h:activeTest = 1]
[h,if(json.get(itemData,"isWearable") == 1 && json.get(itemData,"isWorn") == 0): activeTest = 0]
[h,if(json.get(itemData,"mustHold") == 1 && !json.contains(heldItems,itemID)): activeTest = 0]
[h,if(json.get(itemData,"isAttunement") == 1 && !json.contains(attunedItems,itemID)): activeTest = 0]

[h:return(0,activeTest)]