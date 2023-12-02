[h:RandomEncounterSettings = data.getData("addon:","pm.a5e.core","gd.RandomEncounterSettings")]

[h:baseEncounterChance = json.get(RandomEncounterSettings,"BaseChance")]
[h:accumulatedEncounterChance = json.set(RandomEncounterSettings,"AccumulatedChance")]
[h:maxEncounterChance = json.set(RandomEncounterSettings,"MaxChance")]
[h:encounterChanceIncrement = json.set(RandomEncounterSettings,"ChanceIncrement")]

[h:currentEncounterChance = min(maxEncounterChance,baseEncounterChance + accumulatedEncounterChance)]

[h:abort(input(
	" junkVar | -------- Roll Random Encounter -------- |  | LABEL | SPAN=TRUE ",
	" junkVar | "+currentEncounterChance+"% | Current Encounter Chance | LABEL | ",
	" movementType | Careful,Neutral,Reckless | Party Movement Type | LIST | ",
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

[h:ClassFeatureData = json.set("",
	"DMOnly",showPlayers,
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
[h:broadcastAsToken(output.PC,outputTargets)]