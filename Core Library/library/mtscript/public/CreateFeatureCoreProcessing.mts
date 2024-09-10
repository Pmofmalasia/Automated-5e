[h:CoreFeatureData = macro.args]
[h:CoreFeatureData = pm.a5e.KeyStringsToNumbers(CoreFeatureData)]

[h:FeatureData = js.ct.a5e.CreateFeatureCoreProcessing(CoreFeatureData)]

[h,if(json.contains(FeatureData,"ActiveEffects")),CODE:{
	[h:ActiveEffectsData = json.get(FeatureData,"ActiveEffects")]

	[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
		"WhichSubeffect",1,
		"WhichEffect",1,
		"EffectsNumber",json.get(ActiveEffectsData,"EffectsNumber"),
		"EffectChoiceMethod",json.get(ActiveEffectsData,"Method"),
		"EffectType","Feature",
		"FeatureData",FeatureData,
		"ExtraData",json.set("","FeatureType",json.get(FeatureData,"Type"))
	)]
};{
	[h:endFeatureData = json.set("",
		"FeatureData",FeatureData,
		"FeatureType",json.get(FeatureData,"Type"),
		"ParentToken",json.get(CoreFeatureData,"ParentToken")
	)]
	[h,MACRO("CreateFeatureEnd@Lib:pm.a5e.Core"): endFeatureData]
}]