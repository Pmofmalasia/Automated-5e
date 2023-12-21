[h:DisengageData = macro.args]
[h:Flavor=json.get(DisengageData,"Flavor")]
[h:ParentToken=json.get(DisengageData,"ParentToken")]
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

[h,MACRO("Disengage@Lib:pm.a5e.Core"): DisengageData]
[h:DisengageData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(DisengageData,"Table"))]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Disengage",
	"DisplayName","Disengage",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Disengage","OtherCombatActions"),
	"OutputTargets","",
	"Description","If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.",
	"AbridgedDescription","Your movement doesn't provoke opportunity attacks this turn."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]