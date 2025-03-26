[h:DropHeldData = macro.args]
[h:ParentToken = json.get(DropHeldData,"ParentToken")]

[h:thisTokenHeldItems = getProperty("a5e.stat.HeldItems",ParentToken)]
[h:baseDropdata = json.set("",
	"ParentToken",ParentToken,
	"Number",1,
	"Location",json.set("","Token",ParentToken),
	"LeaveToken",1
)]

[h:DroppedItems = "[]"]
[h,foreach(item,thisTokenHeldItems),if(item != ""),CODE:{
	[h:thisItemData = json.path.read(getProperty("a5e.stat.Inventory",ParentToken),"\$[*][?(@.ItemID == '"+item+"')]['DropTime']")]
	[h,if(!json.isEmpty(thisItemData)):
		isDropped = json.get(json.get(thisItemData,0),"Units") == "free";
		isDropped = 0
	]

	[h,if(isDropped),CODE:{
		[h,MACRO("DropItem@Lib:pm.a5e.Core"): json.set(baseDropData,"ItemID",item)]
		[h:DropReturnData = macro.return]

		[h:DroppedItems = json.append(DroppedItems,json.get(DropReturnData,"Item"))]
	};{}]
}]

[h,if(json.isEmpty(DroppedItems)): return(0,json.set("","Table","[]","Items","[]"))]

[h:DroppedItemDisplay = pm.a5e.CreateDisplayList(json.path.read(DroppedItems,"\$[*]['DisplayName']"),"and")]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Dropped Items",
	"FalseHeader","",
	"FullContents",DroppedItemDisplay,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:return(0,json.set("","Table",abilityTable,"Items",DroppedItems))]