[h:GiveItemData = macro.args]
[h:GiveItemData = pm.a5e.KeyStringsToNumbers(GiveItemData)]
[h:ParentToken = json.get(GiveItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(GiveItemData,"ItemChoice")]
[h:NumberGiven = json.get(GiveItemData,"NumberGiven")]
[h:GiveTo = json.get(GiveItemData,"GiveToChoice")]

[h:ItemName = json.get(json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID=='"+ItemChoiceID+"')]['DisplayName']"),0)]
[h,if(GiveTo == ""),CODE:{
	[h:DropItemData = json.set("",
		"ParentToken",ParentToken,
		"ItemID",ItemChoiceID,
		"Number",NumberGiven,
		"Location",json.set("","Token",ParentToken),
		"LeaveToken",json.contains(GiveItemData,"isLeaveBehind")
	)]
	[h,MACRO("DropItem@Lib:pm.a5e.Core"): DropItemData]	
};{
	[h:TradeItemData = json.set("",
		"Item",ItemChoiceID,
		"Number",NumberGiven,
		"GiveTo",GiveTo,
		"TakeFrom",ParentToken
	)]
	[h,MACRO("TradeItem@Lib:pm.a5e.Core"): TradeItemData]	
}]

[h:closeDialog("GiveItemInput")]
[h:broadcast(if(NumberGiven>1,NumberGiven+" ","")+ItemName+" "+if(GiveTo == "","dropped.","given to "+getName(GiveTo)+"."))]