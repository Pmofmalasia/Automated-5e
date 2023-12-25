[h:DescriptionData = macro.args]
[h:ParentToken = json.get(DescriptionData,"ParentToken")]
[h:DisplayClass = json.get(DescriptionData,"DisplayClass")]
[h:ColorSubtype = json.get(DescriptionData,"ColorSubtype")]
[h:Description = json.get(DescriptionData,"Description")]
[h:OutputTargets = json.get(DescriptionData,"OutputTargets")]

[h:BorderData = json.set("",
	"DisplayName",json.get(DescriptionData,"DisplayName")+": Full Description",
	"FalseName","",
	"DisplayClass",DisplayClass,
	"ColorSubtype",ColorSubtype
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",0,
	"BorderData",BorderData,
	"Table","[]",
	"ShowFullRulesType","[]",
	"OutputTargets",OutputTargets,
	"Description",Description,
	"AbridgedDescription",Description
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]