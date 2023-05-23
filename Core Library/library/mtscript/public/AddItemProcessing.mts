[h:AddItemData = macro.args]
[h:AddItemData = pm.a5e.KeyStringsToNumbers(AddItemData)]
[h:ParentToken = json.get(AddItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(AddItemData,"ItemChoice")]
[h:PriorInventory = getProperty("a5e.stat.Inventory")]

[h,if(ItemChoiceID=="@@ImpromptuItem"),CODE:{
	[h:ChosenItem = "<!-- To implement later -->"]
};{
	[h:ChosenItem = json.get(json.path.read(getLibProperty("sb.Objects","Lib:pm.a5e.Core"),"[*][?(@.ObjectID == '"+ItemChoiceID+"')]"),0)]
	[h,if(json.get(AddItemData,"DisplayName")!=""): ChosenItem = json.set(ChosenItem,"DisplayName",json.get(AddItemData,"DisplayName"))]
	[h,if(json.get(AddItemData,"FalseName")!=""): ChosenItem = json.set(ChosenItem,"FalseName",json.get(AddItemData,"FalseName"))]
	[h,if(json.get(AddItemData,"isWearable")==1): ChosenItem = json.set(ChosenItem,"isWorn",0)]
}]

[h:WeaponProperties = json.get(ChosenItem,"WeaponProperties")]
[h:WeaponPropsTest = WeaponProperties != ""]
[h,if(WeaponPropsTest),CODE:{
	[h,if(json.contains(WeaponProperties,"Ammunition")): ChosenItem = json.set(ChosenItem,"AmmunitionID","")]
};{}]

[h,if(json.contains(AddItemData,"isAttunement")): ChosenItem = json.set(ChosenItem,"AttunedTo","")]

[h:newEntryTest = 1]
[h:StackingTest = json.get(ChosenItem,"isStackable")]
[h,if(StackingTest),CODE:{
	[h:SameItemPriorEntry = json.path.read(PriorInventory,"[*][?(@.ObjectID == '"+ItemChoiceID+"')]")]
	[h:newEntryTest = json.isEmpty(SameItemPriorEntry)]
};{}]

[h,if(newEntryTest),CODE:{
	[h,if(StackingTest),CODE:{
		[h:ChosenItem = json.set(ChosenItem,
			"ItemID",eval("1d1000000") + json.get(getInfo("client"),"timeInMs"),
			"Number",json.get(AddItemData,"NumberAdded")
		)]

		[h:setProperty("a5e.stat.Inventory",json.append(PriorInventory,ChosenItem))]
	};{
		[h,count(json.get(AddItemData,"NumberAdded")): setProperty("a5e.stat.Inventory",json.append(PriorInventory,json.set(ChosenItem,
			"ItemID",eval("1d1000000") + json.get(getInfo("client"),"timeInMs"),
			"Number",1
		)))]
	}]
};{
	[h:OldEntryData = json.get(SameItemPriorEntry,0)]
	[h:NewNumber = json.get(OldEntryData,"Number") + json.get(AddItemData,"NumberAdded")]
	[h:NewInventory = json.path.set(PriorInventory,"[*][?(@.ObjectID == '"+ItemChoiceID+"')]['Number']",NewNumber)]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]
}]

[h:closeDialog("AddItem")]