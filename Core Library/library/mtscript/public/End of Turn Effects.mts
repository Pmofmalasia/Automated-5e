[h:switchToken(macro.args)]
[h:a5e.GatherAbilities()]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","End of "+token.name+"'s Turn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
		
[h:pm.PassiveFunction("EndTurn")]

[h:"<!-- Insert function for management of time here, removing .5 of a turn. Note: abilities that last until end of the same turn should have a duration of .5, until start of next turn duration 1, end of next turn duration 1.5 -->"]

[h:setState("Initiative", 0)]
[h:macro.return = abilityTable]