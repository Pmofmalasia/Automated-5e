[h:FeatureData = json.get(macro.args,"FeatureData")]
[h:FeatureName = json.get(FeatureData,"Name")]
[h:FeatureType = json.get(macro.args,"FeatureType")]

[h:FeatureData = json.remove(FeatureData,"Sourcebook")]
[h:FeatureData = json.remove(FeatureData,"EffectsNumber")]
[h:FeatureData = json.remove(FeatureData,"SpecialEffects")]
[h:FeatureData = json.remove(FeatureData,"ParentToken")]

[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h,switch(FeatureType):
		case "Background": PropertyName = "sb.Backgrounds";
		case "Feat": PropertyName = "sb.Feats";
		case "MonsterFeature": PropertyName = "sb.MonsterFeatures";
		case "Condition": PropertyName = "sb.Conditions";
		default: PropertyName = "sb.Abilities"
	]

	[h:setLibProperty(PropertyName,json.append(getLibProperty(PropertyName,"Lib:"+json.get(FeatureData,"Library")),FeatureData),"Lib:"+json.get(FeatureData,"Library"))]
};{
	[h:switchToken(ParentToken)]

	[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),json.set(FeatureData,"IsActive",1,"IsDisplayed",1)))]

	[h,switch(FeatureType):
		case "Background": PropertyName = "sb.Backgrounds";
		case "Feat": PropertyName = "sb.Feats";
		case "MonsterFeature": PropertyName = "sb.MonsterFeatures";
		case "Condition": PropertyName = "sb.Conditions";
		default: PropertyName = "sb.Abilities"
	]

	[h:setLibProperty(PropertyName,json.append(getLibProperty(PropertyName,"Lib:"+json.get(FeatureData,"Library")),FeatureData),"Lib:"+json.get(FeatureData,"Library"))]

	[h:MacroCreationData = json.set("",
		"AbilityList",json.get(FeatureData,"ButtonInfo"),
		"Effects",json.get(FeatureData,"Effects"),
		"ParentToken",ParentToken
	)]
	[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): MacroCreationData]
}]

[h:broadcast("Feature "+json.get(FeatureData,"DisplayName")+" created.")]