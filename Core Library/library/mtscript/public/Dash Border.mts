[h:DashData = macro.args]
[h:Flavor = json.get(DashData,"Flavor")]
[h:ParentToken = json.get(DashData,"ParentToken")]
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

[h,MACRO("Dash@Lib:pm.a5e.Core"): DashData]
[h:DashData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DashData,"Table"))]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Dash",
	"DisplayName","Dash",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Dash","OtherCombatActions"),
	"Description","When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.<br><br>Any increase or decrease to your speed changes this additional movement by the same amount. If your speed of 30 feet is reduced to 15 feet, for instance, you can move up to 30 feet this turn if you dash.",
	"AbridgedDescription","This turn, you gain a bonus equal to your speed after applying modifiers."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]