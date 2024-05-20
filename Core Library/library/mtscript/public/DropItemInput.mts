[h:DropItemInputData = macro.args]
[h:ParentToken = json.get(DropItemInputData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:ItemDropOptions = "[]"]
[h,foreach(item,getProperty("a5e.stat.Inventory")): ItemDropOptions = json.append(ItemDropOptions,json.get(item,"DisplayName"))]
[h:assert(json.length(ItemDropOptions) > 0,"You have no items to drop!")]
[h:abort(input(
	" dropChoice | "+ItemDropOptions+" | Item to Drop | LIST | DELIMITER=JSON ",
	" dropNumber | 1 | Number to Drop ",
	" isLeaveToken | 1 | Leave Behind Token | CHECK "
))]
[h:assert(isNumber(dropNumber),"You need to input a number!")]

[h:dropChoiceID = json.get(json.get(getProperty("a5e.stat.Inventory"),dropChoice),"ItemID")]

[h:DropItemData = json.set("",
	"ParentToken",ParentToken,
	"ItemID",dropChoiceID,
	"Number",number(dropNumber),
	"Location",json.set("","Token",ParentToken),
	"LeaveToken",isLeaveToken
)]

[h,MACRO("DropItem@Lib:pm.a5e.Core"): DropItemData]
[h:ReturnData = macro.return]

[h:assert(ReturnData != "","That item is no longer found in your inventory!")]

[h:DroppedItem = json.get(ReturnData,"Item")]

[h:hasContents = !json.isEmpty(json.get(DroppedItem,"Contents"))]
[h:droppedItemDisplayName = json.get(DroppedItem,"DisplayName")]

[h:broadcast(droppedItemDisplayName+if(hasContents," and its contents ","")+" dropped by "+getName(ParentToken)+".")]