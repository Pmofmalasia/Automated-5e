[h:HideData = macro.args]
[h:Flavor=json.get(HideData,"Flavor")]
[h:ParentToken=json.get(HideData,"ParentToken")]
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

[h,MACRO("Hide@Lib:pm.a5e.Core"): HideData]
[h:HideData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(HideData,"Table"))]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Hide",
	"DisplayName","Hide",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Hide","OtherCombatActions"),
	"OutputTargets","",
	"Description","When you take the Hide action, you make a Dexterity (Stealth) check in an attempt to hide, following the rules in chapter 7 for hiding. If you succeed, you gain certain benefits, as described in the \"Unseen Attackers and Targets\" section in the Player's Handbook.",
	"AbridgedDescription","You make a Stealth check contested by other creatures' Passive Perception or Perception check if actively looking. If you succeed, you have advantage on attacks against targets that cannot see you. Attacking gives away your location."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]