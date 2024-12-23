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
[h:ChosenItemData = macro.return]
[h:ChosenItem = json.get(ChosenItemData,"Item")]
[h:abilityTable = json.get(ChosenItemData,"Table")]

[h,MACRO("AddItemToken@Lib:pm.a5e.Core"): json.set(AddItemData,"Item",ChosenItem)]

[h:closeDialog("AddItem")]

[h:"<!-- TODO: OutputTargets - May need adjusting of output targets options -->"]
[h:outputTargets = if(getProperty("a5e.stat.WhichTeam",ParentToken) == 1,"not-gm","none")]

[h:AddItemDescription = json.get(AddItemData,"NumberAdded")+" "+json.get(ChosenItem,"DisplayName")+" added to the inventory of "+getName(ParentToken)]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","Item",
	"DisplayName","New Item",
	"Type","Equipment",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:BorderData = json.set("",
	"Name","NewItem",
	"DisplayName","New Item",
	"FalseName","",
	"DisplayClass","Item",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Equipment","Item"),
	"OutputTargets",outputTargets,
	"Description",AddItemDescription,
	"AbridgedDescription",AddItemDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]