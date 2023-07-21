[h:ItemsWithConditions = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemConditions != null && @.ItemConditions != '')]","DEFAULT_PATH_LEAF_TO_NULL")]

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

[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",currentToken(),
	"DMOnly",0,
	"Class","zzChecksAndSaves",
	"Name","Condition Management",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+FeatureDescription]
[h:output.GM = output.GM + json.get(macro.return,"GM")+FeatureDescription]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]