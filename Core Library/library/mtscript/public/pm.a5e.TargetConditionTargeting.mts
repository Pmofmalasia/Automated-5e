[h:TargetableConditionGroups = arg(0)]
[h:NumberAllowed = arg(1)]

[h:conditionTargetingInput = ""]
[h,foreach(target,json.fields(TargetableConditionGroups)),CODE:{
	[h:conditionTargetingInput = "junkVar | "+getTokenImage("",target)+" | Select "+if(NumberAllowed==1,"a ","")+"Condition"+if(NumberAllowed==1,"","s")+" Affecting "+getName(target)+" | LABEL | ICON=TRUE "]

	[h:thisTokenTargetableConditionGroups = json.get(TargetableConditionGroups,target)]	

	[h:condOptions = json.append("","None")]
	[h,foreach(condGroup,thisTokenTargetableConditionGroups),CODE:{
		[h:condDisplayNames = json.path.read(getProperty("a5e.stat.ConditionList",target),"[*][?(@.GroupID=='"+condGroup+"')]['DisplayName']")]
		[h,if(NumberAllowed==1):
			condOptions = json.append(condOptions,pm.a5e.CreateDisplayList(condDisplayNames,"and"));
			conditionTargetingInput = listAppend(conditionTargetingInput," choice"+target+condGroup+" |  | "+pm.a5e.CreateDisplayList(condDisplayNames,"and")+" | CHECK ","##")
		]
	}]

	[h,if(NumberAllowed==1): conditionTargetingInput = listAppend(conditionTargetingInput," choiceCondition"+target+" | "+condOptions+" | Choose a Condition | RADIO | DELIMITER=JSON","##")]
}]

[h:abort(input(conditionTargetingInput))]

[h:conditionsSelected = "{}"]
[h,foreach(target,json.fields(TargetableConditionGroups)),CODE:{
	[h:thisTokenTargetableConditionGroups = json.get(TargetableConditionGroups,target)]	
	[h:tempConditionsSelected = ""]
	[h,if(NumberAllowed==1),CODE:{
		[h,if(eval("choiceCondition"+target)!=0): tempConditionsSelected = json.append(tempConditionsSelected,json.get(thisTokenTargetableConditionGroups,eval("choiceCondition"+target)-1))]
	};{
		[h,foreach(condGroup,thisTokenTargetableConditionGroups): tempConditionsSelected = if(eval("choice"+target+condGroup),json.append(tempConditionsSelected,condGroup),tempConditionsSelected)]
	}]

	[h:conditionsSelected = json.set(conditionsSelected,target,tempConditionsSelected)]
}]

[h:macro.return = conditionsSelected]