[h:ItemsWithConditions = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemConditions != null && @.ItemConditions != '')]","DEFAULT_PATH_LEAF_TO_NULL")]

[h:cn.Input = " junkVar | -------------- Manage Active Conditions -------------- |  | LABEL | SPAN=TRUE ## ClearAllTest |  | Remove all active "+if(json.isEmpty(ItemsWithConditions),"","non-item ")+"conditions | CHECK "]

[h,foreach(condGroup,getProperty("a5e.stat.ConditionGroups")),CODE:{
	[h:condDisplayNames = json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.GroupID=="+json.get(condGroup,"GroupID")+")]['DisplayName']")]
	[h:cn.Input = listAppend(cn.Input," choice"+json.get(condGroup,"GroupID")+" |  | Remove "+json.toList(condDisplayNames,", ")+" | CHECK ","##")]
}]

[h:ItemsWithConditionsFormatted = "[]"]
[h,if(!json.isEmpty(ItemsWithConditions)): cn.Input = listAppend(cn.Input," junkVar | ------------- Manage Conditions on Items ------------- |  | LABEL | SPAN=TRUE ","##")]

[h:secureCounter = 0]
[h,foreach(item,ItemsWithConditions),CODE:{
	[h:tempBaseItemData = json.set("","ItemID",json.get(item,"ItemID"),"HeldBy",currentToken())]
	[h:tempItemDisplayName = json.get(item,"DisplayName")]
	[h,foreach(condition,json.get(item,"ItemConditions")),CODE:{
		[h:ItemsWithConditionsFormatted = json.append(ItemsWithConditionsFormatted,json.set(tempBaseItemData,"GroupID",json.get(condition,"GroupID")))]
		[h:cn.Input = listAppend(cn.Input," choice"+secureCounter+" |  | "+json.get(item,"DisplayName")+": "+json.get(condition,"DisplayName")+" | CHECK ","##")]
		[h:secureCounter = secureCounter + 1]
	}]
}]

[h:abort(input(cn.Input))]

[h:cn.RemovedList = "[]"]

[h,foreach(condGroup,getProperty("a5e.stat.ConditionGroups")),CODE:{
	[h:cn.RemovalTest = or(ClearAllTest,eval("choice"+json.get(condGroup,"GroupID")))]
	[h,if(cn.RemovalTest),CODE:{
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","Target",currentToken(),"GroupID",json.get(condGroup,"GroupID"))]
		[h:cn.RemovedList = json.merge(cn.RemovedList,json.path.read(macro.return,"['Removed'][*]['DisplayName']"))]
	};{}]
}]

[h,foreach(condition,ItemsWithConditionsFormatted),CODE:{
	[h,if(eval("choice"+roll.count)),CODE:{
		[h:EndConditionData = json.set("",
			"Target",json.remove(condition,"GroupID"),
			"GroupID",json.get(condition,"GroupID")
		)]
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): EndConditionData]
		[h:cn.RemovedList = json.merge(cn.RemovedList,json.path.read(macro.return,"['Removed'][*]['DisplayName']"))]
	};{}]
}]

[h:abilityTable = "[]"]
[h:FeatureDescription = pm.a5e.CreateDisplayList(cn.RemovedList,"and")+" deactivated by the GM."]

[h:BorderData = json.set("",
	"Flavor","",
	"Name","ConditionManagement",
	"DisplayName","Condition Management",
	"FalseName","",
	"DisplayClass","zzGeneral",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",currentToken(),
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Condition"),
	"OutputTargets","",
	"Description",FeatureDescription,
	"AbridgedDescription",FeatureDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]