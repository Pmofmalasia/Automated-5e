[h:RandomEncounterSettings = data.getData("addon:","pm.a5e.core","gd.RandomEncounterSettings")]
[h,if(RandomEncounterSettings == ""): RandomEncounterSettings = "{}"]

[h:baseEncounterChance = json.get(RandomEncounterSettings,"BaseChance")]
[h:accumulatedEncounterChance = json.set(RandomEncounterSettings,"AccumulatedChance")]
[h:maxEncounterChance = json.set(RandomEncounterSettings,"MaxChance")]
[h:encounterChanceIncrement = json.set(RandomEncounterSettings,"ChanceIncrement")]

[h:abort(input(
	" junkVar | -------- Random Encounter Settings -------- |  | LABEL | SPAN=TRUE ",
	" baseEncounterChance | "+baseEncounterChance+" | Base Encounter Chance | ",
	" maxEncounterChance | "+maxEncounterChance+" | Maximum Encounter Chance | ",
	" encounterChanceIncrement | "+encounterChanceIncrement+" | Increase in Encounter Chance per Roll | ",
	" accumulatedEncounterChance | "+accumulatedEncounterChance+" | Current Additional Encounter Chance | "
))]

[h:RandomEncounterSettings = json.set("",
	"BaseChance",number(baseEncounterChance),
	"AccumulatedChance",number(accumulatedEncounterChance),
	"MaxChance",number(maxEncounterChance),
	"ChanceIncrement",number(encounterChanceIncrement)
)]
[h:data.setData("addon:","pm.a5e.core","gd.RandomEncounterSettings",RandomEncounterSettings)]