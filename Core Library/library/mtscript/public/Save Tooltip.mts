[h:abilityTable = ""]
[h:tooltipData = macro.args]
[h:ParentToken = json.get(tooltipData,"ParentToken")]

[h:TokenSaves = getProperty("a5e.stat.Saves")]
[h:TokenModifiers = getProperty("a5e.stat.AtrMods")]
[h:TokenProficiency = getProperty("a5e.stat.Proficiency")]
[h,foreach(TempAttribute,pm.GetAttributes()),CODE:{
	[h:ProfType = json.get(TokenSaves,json.get(TempAttribute,"Name"))]
	[h,switch(ProfType):
		case 1: ProfString = " (Proficient)";
		case 2: ProfString = " (Expert)";
		case "0.5": ProfString = " (Half Proficient)";
		default: ProfString = "";
	]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",json.get(TempAttribute,"DisplayName"),
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.PlusMinus(json.get(TokenModifiers,json.get(TempAttribute,"Name"))+(ProfType*TokenProficiency),1)+ProfString,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:BorderData = json.set("",
	"Name","SaveBonuses",
	"DisplayName","Save Bonuses",
	"FalseName","",
	"DisplayClass","zzChecksAndSaves",
	"ColorSubtype",""
)]
[h:TooltipOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Save","ChecksAndSaves"),
	"OutputTargets","",
	"Description","",
	"AbridgedDescription",""
)]
[r,MACRO("GatherTooltipComponents@Lib:pm.a5e.Core"): TooltipOutputComponents]