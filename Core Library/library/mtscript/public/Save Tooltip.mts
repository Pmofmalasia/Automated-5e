[h:abilityTable = ""]
[h:tooltipData = macro.args]

[h,foreach(TempAttribute,pm.GetAttributes()): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",json.get(TempAttribute,"DisplayName"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.PlusMinus(json.get(AtrMods,json.get(TempAttribute,"Name"))+(json.get(Saves,json.get(TempAttribute,"Name"))*Proficiency),1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
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