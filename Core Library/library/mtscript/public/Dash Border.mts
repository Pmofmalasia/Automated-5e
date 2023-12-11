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

[h:outputRules = pm.a5e.PlayerOutputRules(json.set("",
	"DMOnly",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"OnlyRules",1,
	"ParentToken",ParentToken
))]
[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Class","zzOtherCombatActions",
	"Name","Dash"
)]

[h:BorderOutputs = pm.a5e.BuildChatBorder(BorderData,outputRules)]
[h:TableOutputs = pm.a5e.FullTableProcessing(abilityTable,outputRules,1)]

[h:GMOutput = json.get(BorderOutputs,"GM") + json.get(TableOutputs,"GM") + "</div></div>"]
[h:PlayerOutput = json.get(BorderOutputs,"Player") + json.get(TableOutputs,"Player") + "</div></div>"]
[h:ChatOutputData = json.set("",
	"GM",GMOutput,
	"Player",PlayerOutput,
	"MaxColNum",json.get(TableOutputs,"MaxColNum"),
	"ColorData",json.set("",
		"Class","zzOtherCombatActions",
		"ParentToken",ParentToken
))]

[h,MACRO("ChatOutput@Lib:pm.a5e.Core"): ChatOutputData]