[h:abilityTable = ""]
[h:tooltipData = macro.args]

[h,foreach(TempAttribute,pm.GetAttributes()): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(TempAttribute,"DisplayName"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.PlusMinus(json.get(getProperty("a5e.stat.AtrMods"),json.get(TempAttribute,"Name"))+(json.get(getProperty("a5e.stat.Saves"),json.get(TempAttribute,"Name"))*getProperty("a5e.stat.Proficiency")),1),
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
	"DisplayName","Save Bonuses",
	"Effect","",
	"abilityTable",abilityTable
)]

[r:pm.TooltipOutput(ClassFeatureData)]