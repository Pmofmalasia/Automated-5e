[h:FeatureData = macro.args]
[h:ParentToken = json.get(FeatureData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:Flavor = json.get(FeatureData,"Flavor")]
[h:FeatureName = json.get(FeatureData,"Name")]
[h:FeatureClass = json.get(FeatureData,"Class")]
[h:FeatureSubclass = json.get(FeatureData,"Subclass")]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:abilityTable = pm.a5e.GenerateFeatureTooltip(ParentToken,FeatureData,a5e.UnifiedAbilities,json.set("","NeedsNonEffectData",1))]
[h:FeatureDisplayName = json.get(FeatureData,"DisplayName")]
[h:FeatureFalseName = json.get(FeatureData,"FalseName")]
[h,if(FeatureFalseName == ""),switch(FeatureClass):
	case "Item": FeatureFalseName = "Item Effect";
	default: FeatureFalseName = "Class Feature"
]
[h:FeatureDescription = base64.decode(json.get(FeatureData,"Description"))]
[h,if(json.isEmpty(abilityTable) && FeatureDescription == ""): FeatureDescription = "There are no specific rules for this item."]

[h:needsSplitGMOutput = (getProperty("a5e.stat.Allegiance") == "Enemy")]
[h:BorderData = json.set("",
	"Name",FeatureName,
	"DisplayName",FeatureDisplayName,
	"FalseName",FeatureFalseName,
	"DisplayClass",FeatureClass
)]
[h:TooltipOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",needsSplitGMOutput,
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("",FeatureName,"Feature"),
	"OutputTargets","",
	"Description",FeatureDescription,
	"AbridgedDescription",FeatureDescription
)]
[r,MACRO("GatherTooltipComponents@Lib:pm.a5e.Core"): TooltipOutputComponents]