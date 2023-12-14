[h:RandomEncounterSettings = data.getData("addon:","pm.a5e.core","gd.RandomEncounterSettings")]

[h:baseEncounterChance = json.get(RandomEncounterSettings,"BaseChance")]
[h:accumulatedEncounterChance = json.get(RandomEncounterSettings,"AccumulatedChance")]
[h:maxEncounterChance = json.get(RandomEncounterSettings,"MaxChance")]
[h:encounterChanceIncrement = json.get(RandomEncounterSettings,"ChanceIncrement")]

[h:currentEncounterChance = min(maxEncounterChance,baseEncounterChance + accumulatedEncounterChance)]

[h:abort(input(
	" junkVar | -------- Roll Random Encounter -------- |  | LABEL | SPAN=TRUE ",
	" junkVar | "+currentEncounterChance+"% | Current Encounter Chance | LABEL | ",
	" movementType | Careful,Neutral,Reckless | Party Movement Type | LIST | SELECT=1 ",
	" situationalModifier |  | Manual Increase/Decrease to Chance ",
	" timePassed | None,5 Minutes,10 Minutes,1 Hour,8 Hours | Time Passed | LIST | ",
	" showPlayers |  | Show Roll to Players | CHECK "
))]

[h:movementTypeModifier = if(movementType == 0,0.75,if(movementType == 2,1.25,1))]
[h:finalEncounterChance = floor((currentEncounterChance + situationalModifier) * movementTypeModifier)]
[h:encounterRoll = 1d100]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Encounter Chance",
	"RulesContents",finalEncounterChance+"%",
	"DisplayOrder","['Rules','Roll','Full']"
),json.set("",
	"ShowIfCondensed",1,
	"Header","Roll",
	"RollContents",encounterRoll,
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(encounterRoll > finalEncounterChance):
	accumulatedEncounterChance = accumulatedEncounterChance + encounterChanceIncrement;
	accumulatedEncounterChance = 0
]
[h:data.setData("addon:","pm.a5e.core","gd.RandomEncounterSettings",json.set(RandomEncounterSettings,"AccumulatedChance",accumulatedEncounterChance))]

[h:ClassFeatureData = json.set("",
	"needsSplitGMOutput",showPlayers,
	"Class","zzGeneral",
	"Name","Random Encounter Roll",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
	
[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h,if(showPlayers): broadcastAsToken(output.PC,"not-gm")]