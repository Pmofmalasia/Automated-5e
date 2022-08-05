[h:cn.Input = " junkVar | ------------------- Manage Active Conditions ------------------- |  | LABEL | SPAN=TRUE ## ClearAllTest |  | Remove all active conditions | CHECK "]

[h,foreach(condGroup,ConditionGroups),CODE:{
	[h:condDisplayNames = json.path.read(ConditionList,"[*][?(@.ConditionID=="+json.get(condGroup,"GroupID")+")]['DisplayName']")]
	[h:cn.Input = listAppend(cn.Input," choice"+json.get(condGroup,"GroupID")+" |  | Remove "+json.toList(condDisplayNames,", ")+" | CHECK ","##")]
}]

[h:abort(input(cn.Input))]

[h:cn.RemovedList = "[]"]

[h,foreach(condGroup,ConditionGroups),CODE:{
	[h:cn.RemovalTest = or(ClearAllTest,eval("choice"+json.get(condGroup,"GroupID")))]
	[h,if(cn.RemovalTest),CODE:{
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.get(condGroup,"GroupID")]
		[h:cn.RemovedList = json.merge(cn.RemovedList,json.path.read(macro.return,"['Removed'][*]['DisplayName']"))]
	};{}]
}]

[h:abilityTable = "[]"]
[h:abilityEffect = json.toList(cn.RemovedList,", ")+" deactivated."]

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

[h:output.PC = output.PC + json.get(macro.return,"Player")+abilityEffect+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+abilityEffect+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]