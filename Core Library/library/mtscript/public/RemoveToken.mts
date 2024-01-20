[h:RemovedTokens = getSelected()]
[h:RemovedTokensDisplay = ""]
[h,foreach(tempToken,RemovedTokens): RemovedTokensDisplay = listAppend(RemovedTokensDisplay," junkVar | "+getImage(tempToken)+" | "+getName(tempToken)+" | LABEL | ICON=TRUE ","##")]
[h:abort(input(
	" junkVar | Click OK to confirm. | The following tokens will be deleted | LABEL ",
	RemovedTokensDisplay
))]

[h,foreach(tempToken,RemovedTokens),CODE:{
	[h:"<!-- Remove set conditions -->"]
	[h:"<!-- TODO: Remove set ItemConditions also -->"]
	[h:tempActiveConditions = getProperty("a5e.stat.ConditionGroups",tempToken)]
	[h:tempSetByList = json.path.read(tempActiveConditions,"\$[*]['SetBy']")]
	[h:tempSetByList = json.intersection(getTokens("json"),tempSetByList)]
	[h:tempSetByList = json.difference(tempSetByList,RemovedTokens)]
	[h,foreach(conditionSettingToken,tempSetByList),CODE:{
		[h:prunedConditionsSet = getProperty("a5e.stat.ConditionsSet",conditionSettingToken)]
		[h,foreach(setCondition,prunedConditionsSet): prunedConditionsSet = json.path.set(prunedConditionsSet,"\$["+roll.count+"]['Targets']",json.difference(json.get(setCondition,"Targets"),tempToken))]
		[h:prunedConditionsSet = json.path.delete(prunedConditionsSet,"\$[*][?(@.Targets empty true)]")]
		[h:setProperty("a5e.stat.ConditionsSet",prunedConditionsSet,conditionSettingToken)]
	}]

	[h:removeToken(tempToken)]
}]