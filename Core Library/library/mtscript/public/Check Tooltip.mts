[h:abilityTable = ""]
[h:tooltipData = macro.args]
[h:ParentToken = json.get(tooltipData,"ParentToken")]

[h,foreach(TempSkill,pm.GetSkills()),CODE:{
	[h:ProfType = json.get(getProperty("a5e.stat.Skills"),json.get(TempSkill,"Name"))]
	[h,switch(ProfType):
		case 1: ProfString = " (Proficient)";
		case 2: ProfString = " (Expert)";
		case "0.5": ProfString = " (Half Proficient)";
		default: ProfString = "";
	]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",json.get(TempSkill,"DisplayName")+" ("+substring(json.get(TempSkill,"Attribute"),0,3)+")",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.PlusMinus(json.get(getProperty("a5e.stat.AtrMods"),json.get(TempSkill,"Attribute"))+(ProfType*getProperty("a5e.stat.Proficiency")),1)+ProfString,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,foreach(TempAttribute,pm.GetAttributes()): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(TempAttribute,"DisplayName"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.PlusMinus(json.get(getProperty("a5e.stat.AtrMods"),json.get(TempAttribute,"Name")),1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:BorderData = json.set("",
	"Name","SkillBonuses",
	"DisplayName","Skill Bonuses",
	"FalseName","",
	"DisplayClass","zzChecksAndSaves",
	"ColorSubtype",""
)]
[h:TooltipOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Check","ChecksAndSaves"),
	"OutputTargets","",
	"Description","",
	"AbridgedDescription",""
)]
[r,MACRO("GatherTooltipComponents@Lib:pm.a5e.Core"): TooltipOutputComponents]