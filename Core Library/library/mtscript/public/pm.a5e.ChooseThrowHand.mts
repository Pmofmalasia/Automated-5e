[h:ParentToken = arg(0)]
[h:thrownItemID = arg(1)]

[h:switchToken(ParentToken)]
[h:inventory = getProperty("a5e.stat.Inventory")]
[h:chooseByHand = thrownItemID == ""]

[h:itemOptions = "[]"]
[h:itemOptionsDisplay = "[]"]
[h:heldItems = json.difference(getProperty("a5e.stat.HeldItems"),json.append("",""))]
[h,foreach(item,heldItems),CODE:{
	[h:itemOptions = json.append(itemOptions,item)]
	[h:itemData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+item+"')]"),0)]
	[h:itemOptionsDisplay = json.append(itemOptionsDisplay,if(chooseByHand,"","Hand Holding ")+json.get(itemData,"DisplayName"))]
}]

[h,if(chooseByHand),CODE:{
	[h:abort(input(
		" thrownItemChoice | "+itemOptionsDisplay+" | Choose Item to Throw | LIST | DELIMITER = JSON "
	))]
};{
	[h:"<!-- TODO: Equipment: Have options to (a) use this input if there's an empty hand and not just throw from the empty one (b) check for capability of the item to be dropped instantly (e.g. shields not allowed) -->"]
	[h:emptyHandTest = json.indexOf(getProperty("a5e.stat.HeldItems"),"") > -1]
	[h,if(emptyHandTest),CODE:{
		[h:"<!-- Below is unused currently, for if options in above note are implemented -->"]
		[h:itemOptions = json.merge('[""]',itemOptions)]
		[h:itemOptionsDisplay = json.merge('["Empty Hand"]',itemOptions)]
		
		[h:"<!-- These actually do something -->"]
		[h:thrownItemChoice = 0]
		[h:itemOptions = json.append("","")]
	};{
		[h:abort(input(
			" thrownItemChoice | "+itemOptionsDisplay+" | Throw Item from Which Hand | LIST | DELIMITER = JSON "
		))]		
	}]
}]

[h:handItemID = json.get(itemOptions,thrownItemChoice)]
[h:thrownItemHand = json.indexOf(getProperty("a5e.stat.HeldItems"),handItemID)]

[h,if(!chooseByHand),CODE:{
	[h:holdingData = pm.a5e.HoldItem(thrownItemID,thrownItemHand,ParentToken)]
};{}]

[h:return(0,thrownItemHand)]