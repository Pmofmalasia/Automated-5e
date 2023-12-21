[h:TestData = macro.args]
[h:Flavor=json.get(TestData,"Flavor")]
[h:ParentToken=json.get(TestData,"ParentToken")]
[h:outputTargets = json.get(TestData,"OutputTargets")]
[h:d20TestType = json.get(TestData,"TestType")]

[h,MACRO("ModifyD20Test@Lib:pm.a5e.Core"): TestData]
[h:TestData = macro.return]
[h:abilityTable = json.get(TestData,"Table")]
[h:UpdateD20TestData = json.remove(TestData,"Table")]

[h,MACRO("UpdateD20TestData@Lib:pm.a5e.Core"): UpdateD20TestData]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name",d20TestType+"Reroll",
	"DisplayName",d20TestType+" Reroll",
	"FalseName","",
	"DisplayClass",if(d20TestType=="Attack","zzWeaponAttack","zzChecksAndSaves"),
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("",d20TestType,if(d20TestType == "Attack","Attack","ChecksAndSaves")),
	"OutputTargets",outputTargets,
	"Description","",
	"AbridgedDescription",""
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]