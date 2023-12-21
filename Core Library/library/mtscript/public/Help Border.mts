[h:HelpData = macro.args]
[h:Flavor=json.get(HelpData,"Flavor")]
[h:ParentToken=json.get(HelpData,"ParentToken")]
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

[h,MACRO("Help@Lib:pm.a5e.Core"): HelpData]
[h:HelpData = macro.return]

[h:abilityTable = json.merge(abilityTable,json.get(HelpData,"Table"))]

[h,if(json.get(HelpData,"HelpType") == "Help"),CODE:{
	[h:Description = "You can lend your aid to another creature in the completion of a task. When you take the Help action, the creature you aid gains advantage on the next ability check it makes to perform the task you are helping with, provided that it makes the check before the start of your next turn."]
	[h:AbridgedDescription = "The creature you aid gains advantage on the next ability check it makes to perform the task, if it does so before the start of your next turn."]
};{
	[h:Description = "You can aid a friendly creature in attacking a creature within 5 feet of you. You feint, distract the target, or in some other way team up to make your ally's attack more effective. If your ally attacks the target before your next turn, the first attack roll is made with advantage."]
	[h:AbridgedDescription = "You aid a friendly creature in attacking a creature within range. If your ally attacks the target before your next turn, the first attack roll is made with advantage."]
}]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Help",
	"DisplayName","Help",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Help","OtherCombatActions"),
	"OutputTargets","",
	"Description",Description,
	"AbridgedDescription",AbridgedDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]