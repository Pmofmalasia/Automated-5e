[h:AddItemData = macro.args]
[h:AddItemData = pm.a5e.KeyStringsToNumbers(AddItemData)]
[h:ParentToken = json.get(AddItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(AddItemData,"ItemChoice")]

[h,if(json.type(ItemChoiceID) == "OBJECT"),CODE:{
	[h:ChosenItem = ItemChoiceID]
	[h:ItemChoiceID = json.get(ChosenItem,"ObjectID")]
};{
	[h,if(ItemChoiceID=="@@ImpromptuItem"),CODE:{
		[h:ChosenItem = "<!-- To implement later -->"]
	};{
		[h:ChosenItem = json.get(json.path.read(data.getData("addon:","pm.a5e.core","sb.Objects"),"\$[*][?(@.ObjectID == '"+ItemChoiceID+"')]"),0)]
		[h,if(json.get(AddItemData,"DisplayName")!=""): ChosenItem = json.set(ChosenItem,"DisplayName",json.get(AddItemData,"DisplayName"))]
		[h,if(json.get(AddItemData,"FalseName")!=""): ChosenItem = json.set(ChosenItem,"FalseName",json.get(AddItemData,"FalseName"))]
	}]
}]

[h,MACRO("InitializeItem@Lib:pm.a5e.Core"): json.set("","Item",ChosenItem,"ParentToken",ParentToken)]
[h:ChosenItem = macro.return]

[h,MACRO("AddItemToken@Lib:pm.a5e.Core"): json.set(AddItemData,"Item",ChosenItem)]

[h:broadcast(json.get(AddItemData,"NumberAdded")+" "+json.get(ChosenItem,"DisplayName")+" added to the inventory of "+getName(ParentToken))]

[h:closeDialog("AddItem")]