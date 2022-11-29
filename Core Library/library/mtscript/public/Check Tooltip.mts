[h:abilityTable = ""]
[h:tooltipData = macro.args]

[h,foreach(TempSkill,pm.GetSkills()): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(TempSkill,"DisplayName")+" ("+substring(json.get(TempSkill,"Attribute"),0,3)+")",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.PlusMinus(json.get(getProperty("a5e.stat.AtrMods"),json.get(TempSkill,"Attribute"))+(json.get(Skills,json.get(TempSkill,"Name"))*getProperty("a5e.stat.Proficiency")),1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,foreach(TempAttribute,pm.GetAttributes()): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(TempAttribute,"DisplayName"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.PlusMinus(json.get(getProperty("a5e.stat.AtrMods"),json.get(TempAttribute,"Name")),1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:ClassFeatureData = json.set("",
	"DMOnly",json.get(tooltipData,"DMOnly"),
	"BorderColorOverride",json.get(tooltipData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(tooltipData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(tooltipData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(tooltipData,"AccentTextOverride"),
	"TitleFont",json.get(tooltipData,"TitleFont"),
	"BodyFont",json.get(tooltipData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","",
	"DisplayName","Skill Bonuses",
	"Effect","",
	"abilityTable",abilityTable
	)]

[r:pm.TooltipOutput(ClassFeatureData)]