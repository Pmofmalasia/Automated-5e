[h,if(initiativeSize() < 1): assert(0, "There are no tokens in initiative at this time.", 0)]
[h,if(getInitiativeRound() == -1 && initiativeSize() > 0),CODE:{
    [h:nextInitiative()]
    [h:setState("Initiative", 1, getInitiativeToken())]
    [h:selectTokens(getInitiativeToken(), 0)]
	[h:broadcast("Start of Initiative")]
	[h:return(0)]
};{}]

[h:initList = getInitiativeList()]
[h:initTokens = json.get(initList, "tokens")]
[h:numInitTokens = json.length(initTokens)]
[h:currentInitiativePosition = json.get(initList, "current")]
[h:nextInitiativePosition = currentInitiativePosition + 1]
[h:nextRound = json.get(initList, "round") + 1]
[h:currentRound = getInitiativeRound()]
[h:tokenEndingTurn = getInitiativeToken()]

[h,if(nextInitiativePosition == numInitTokens): nextInitiativePosition = 0]
[h:tokenStartingTurn = json.get(json.get(initTokens, nextInitiativePosition), "tokenId")]

[h,MACRO("EndofTurnEffects@Lib:pm.a5e.Core"): tokenEndingTurn]
[h:abilityTable = macro.return]

[h,MACRO("StartofTurnEffects@Lib:pm.a5e.Core"): tokenStartingTurn]
[h:abilityTable = json.merge(abilityTable,macro.return)]

[h,if(json.length(abilityTable)>2),CODE:{
[h:"<!-- TODO: Will need to split if needsSplitGMOutput if end token needs and start does not (or vice versa) -->"]
	[h:BorderData = json.set("",
		"Flavor","",
		"Name","Initiative",
		"DisplayName","Initiative",
		"FalseName","",
		"DisplayClass","zzInitiative",
		"ColorSubtype",""
	)]
	[h:AllOutputComponents = json.set("",
		"ParentToken",tokenEndingTurn,
		"needsSplitGMOutput",0,
		"BorderData",BorderData,
		"Table",abilityTable,
		"ShowFullRulesType",json.append("","Initiative")
	)]

	[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]
};{}]
[h:selectTokens(tokenStartingTurn, 0)]
[h:nextInitiative()]