[h:throwItemData = arg(0)]
[h:ParentToken = json.get(throwItemData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:thrownItemHand = json.get(throwItemData,"Hand")]
[h:thrownItemID = json.get(throwItemData,"ItemID")]

[h:heldItems = getProperty("a5e.stat.HeldItems")]
[h,if(thrownItemID != ""),CODE:{
	[h:itemPosition = json.indexOf(heldItems,thrownItemID)]
	[h:"<!-- Note: Currently, mechanically the correct hand doesn't matter. Could matter in the future, in which case this would need to be changed. -->"]
	[h,if(itemPosition > -1 && itemPosition != thrownItemHand): thrownItemHand = itemPosition]

	[h,if(itemPosition == -1 && thrownItemHand != ""),CODE:{
		[h:heldItemData = pm.a5e.HoldItem(thrownItemID,thrownItemHand,ParentToken)]
		[h:heldItems = getProperty("a5e.stat.HeldItems")]
		[h:thrownItemHand = json.indexOf(heldItems,thrownItemID)]
		[h:itemPosition = thrownItemHand]
	};{}]

	[h,if(itemPosition == -1),CODE:{
		[h:"<!-- Note: This is effectively if(itemPosition == -1 && thrownItemHand == '') due to above block. -->"]
		[h:thrownItemHand = pm.a5e.ChooseThrowHand(ParentToken,thrownItemID)]
	}]
};{
	[h,if(thrownItemHand == ""),CODE:{
		[h:thrownItemHand = pm.a5e.ChooseThrowHand(ParentToken,thrownItemID)]
	};{
		[h:"<!-- No input or data massaging needed here - just throw the item in the specified hand. -->"]
	}]
}]

[macro("SingleAttack@Lib:pm.a5e.Core"): json.set("","Hand",thrownItemHand,"ParentToken",currentToken(),"Throw",1)]