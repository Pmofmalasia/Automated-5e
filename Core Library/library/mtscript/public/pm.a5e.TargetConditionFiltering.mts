[h:pm.TargetCreatures = arg(0)]
[h:pm.TargetConditionType = json.get(arg(1),"Type")]
[h:pm.TargetConditionName = json.get(arg(1),"Name")]
[h:pm.RemoveFullEffect = json.get(arg(1),"FullEffect")]
[h:pm.ConditionChoiceNum = json.get(arg(1),"Number")]

[h:conditionsSelected = ""]
[h,foreach(creature,pm.TargetCreatures),CODE:{
	[h:cn.Input = "junkVar | Select Condition"+if(pm.ConditionChoiceNum==1,"","s")+" Affecting "+getName(creature)+" | "+getTokenImage("",creature)+" | LABEL | ICON=TRUE "]
	
	[h:validConditionGroups = ""]
	[h:"<!-- Add json.path.read to filter condition groups, then replace the ConditionGroups calls later with that -->"]
		
	[h,foreach(condGroup,getProperty("a5e.stat.ConditionGroups")),CODE:{
		[h:condOptions = ""]
		[h:condDisplayNames = json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.ConditionID=="+json.get(condGroup,"GroupID")+")]['DisplayName']")]
		[h,if(pm.ConditionChoiceNum==1):
			condOptions = json.append(condOptions,json.toList(condDisplayNames,", "));
			cn.Input = listAppend(cn.Input," choice"+json.get(condGroup,"GroupID")+" |  | "+json.toList(condDisplayNames,", ")+" | CHECK ","##")
		]
	}]

	[h,if(pm.ConditionChoiceNum==1): cn.Input = listAppend(cn.Input," choiceCondition |  | "+condOptions+" | RADIO | DELIMITER=JSON","##")]
	
	[h:abort(input(cn.Input))]
	
	[h:tempConditionsSelected = ""]
	[h,if(pm.ConditionChoiceNum==1),CODE:{
		[h:tempConditionsSelected = json.append(tempConditionsSelectedjson.get(json.get(getProperty("a5e.stat.ConditionGroups"),choiceCondition),"GroupID"))]
	};{
		[h,foreach(condGroup,getProperty("a5e.stat.ConditionGroups")): tempConditionsSelected = if(eval("choice"+json.get(condGroup,"GroupID")),json.apppend(tempConditionsSelected,json.get(condGroup,"GroupID")),tempConditionsSelected)]
	}]
	
	[h:conditionsSelected = json.set(conditionsSelected,creature,tempConditionsSelected)]
}]

[h:macro.return = ConditionsSelected]