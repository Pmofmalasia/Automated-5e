[h:sp.Data = macro.args]
[h:ParentToken = json.get(sp.Data,"ParentToken")]
[h:DisplayClass = json.get(sp.Data,"DisplayClass")]
[h:ColorSubtype = json.get(sp.Data,"ColorSubtype")]
[h:Description = json.get(sp.Data,"Description")]
[h:OutputTargets = json.get(sp.Data,"OutputTargets")]

[h:BorderData = json.set("",
	"DisplayName",json.get(sp.Data,"DisplayName")+": Full Description",
	"FalseName","",
	"DisplayClass","zzSpell",
	"ColorSubtype",json.set("","Source",sSource,"Level",sLevel)
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