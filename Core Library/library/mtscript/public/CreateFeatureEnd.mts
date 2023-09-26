[h:FeatureData = json.get(data.getData("addon:","pm.a5e.core","ct.NewFeature"),getPlayerName())]
[h:FeatureName = json.get(FeatureData,"Name")]
[h:FeatureType = json.get(FeatureData,"FeatureType")]
[h:AddToLibTest = !number(json.get(macro.args,"UniqueMonsterFeature"))]

[h:FeatureType = json.remove(FeatureData,"FeatureType")]
[h:FeatureData = json.remove(FeatureData,"Sourcebook")]
[h:FeatureData = json.remove(FeatureData,"EffectsNumber")]
[h:FeatureData = json.remove(FeatureData,"SpecialEffects")]
[h:FeatureData = json.remove(FeatureData,"ParentToken")]

[h:setLibProperty("ct.NewFeature",json.remove(data.getData("addon:","pm.a5e.core","ct.NewFeature"),getPlayerName()),"Lib:pm.a5e.Core")]

[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h:"<!-- Note: If there is no ParentToken it is added to the library regardless of AddToLibTest -->"]

	[h,switch(FeatureType):
		case "Background": PropertyName = "sb.Backgrounds";
		case "Feat": PropertyName = "sb.Feats";
		case "MonsterFeature": PropertyName = "sb.MonsterFeatures";
		case default: PropertyName = "sb.Abilities"
	]

	[h:setLibProperty(PropertyName,json.append(getLibProperty(PropertyName,"Lib:"+json.get(FeatureData,"Library")),FeatureData),"Lib:"+json.get(FeatureData,"Library"))]
};{
	[h:switchToken(ParentToken)]

	[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),FeatureData))]

	[h,if(AddToLibTest),CODE:{
		[h,switch(FeatureType):
			case "Background": PropertyName = "sb.Backgrounds";
			case "Feat": PropertyName = "sb.Feats";
			case "MonsterFeature": PropertyName = "sb.MonsterFeatures";
			default: PropertyName = "sb.Abilities"
		]
	
		[h:setLibProperty(PropertyName,json.append(getLibProperty(PropertyName,"Lib:"+json.get(FeatureData,"Library")),FeatureData),"Lib:"+json.get(FeatureData,"Library"))]
	};{}]

	[h:MacroCreationData = json.set("",
		"AbilityList",json.get(FeatureData,"ButtonInfo"),
		"Effects",json.get(FeatureData,"Effects"),
		"ParentToken",ParentToken
	)]
	[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): MacroCreationData]
}]

[h:broadcast("Feature "+json.get(FeatureData,"DisplayName")+" created.")]