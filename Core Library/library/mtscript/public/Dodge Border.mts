[h:DodgeData = macro.args]
[h:Flavor=json.get(DodgeData,"Flavor")]
[h:ParentToken=json.get(DodgeData,"ParentToken")]
[h:abilityTable = "[]"]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Usage Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","1 Action",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,MACRO("Dodge@Lib:pm.a5e.Core"): DodgeData]
[h:DodgeData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DodgeData,"Table"))]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Dodge",
	"DisplayName","Dodge",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Dodge","OtherCombatActions"),
	"OutputTargets","",
	"Description","When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated (as explained in the appendix) or if your speed drops to 0.",
	"AbridgedDescription","Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated or your speed drops to 0."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]