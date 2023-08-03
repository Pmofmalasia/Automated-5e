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
	[h:ClassFeatureData = json.set("",
		"Flavor","",
		"ParentToken",tokenEndingTurn,
		"DMOnly",0,
		"Class","zzInitiative",
		"Name","Advance Initiative: "+getName(tokenEndingTurn)+" to "+getName(tokenStartingTurn),
		"FalseName","Advance Initiative",
		"OnlyRules",0
		)]

	[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
	[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
	[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
	
	[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
	[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
	[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]
	
	[h:broadcastAsToken(output.GM,"gm")]
	[h:broadcastAsToken(output.PC,"not-gm")]
	
};{}]
[h:selectTokens(tokenStartingTurn, 0)]
[h:nextInitiative()]