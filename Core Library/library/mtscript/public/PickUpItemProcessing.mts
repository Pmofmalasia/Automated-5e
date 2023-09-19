[h:PickUpItemData = macro.args]
[h:PickUpItemData = pm.a5e.KeyStringsToNumbers(PickUpItemData)]
[h:ParentToken = json.get(PickUpItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(PickUpItemData,"ItemChoice")]
[h:NumberTaken = json.get(PickUpItemData,"NumberTaken")]
[h:TakeFrom = json.get(PickUpItemData,"TakeFromChoice")]

[h:TradeItemData = json.set("",
	"Item",ItemChoiceID,
	"Number",NumberTaken,
	"GiveTo",ParentToken,
	"TakeFrom",TakeFrom
)]
[h:ItemName = json.get(json.path.read(getProperty("a5e.stat.Inventory",TakeFrom),"\$[*][?(@.ItemID=='"+ItemChoiceID+"')]['DisplayName']"),0)]

[h,MACRO("TradeItem@Lib:pm.a5e.Core"): TradeItemData]
[h:closeDialog("PickUpItem")]
[h:broadcast(if(NumberTaken>1,NumberTaken+" ","")+ItemName+" taken by "+getName(ParentToken)+".")]