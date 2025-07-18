[h:CoreFeatureData = macro.args]
[h:CoreFeatureData = pm.a5e.KeyStringsToNumbers(CoreFeatureData)]

[h:FeatureData = js.ct.a5e.CreateFeatureCoreProcessing(CoreFeatureData)]
[h:closeDialog("CreateFeatureCore")]

[h,if(json.contains(FeatureData,"isPassiveFeature")),CODE:{
	[h:PassiveFeatureData = json.set(FeatureData,
		"ParentToken",json.get(CoreFeatureData,"ParentToken")
	)]
	[h:html.dialog5("CreatePassiveFeature","lib://pm.a5e.core/CreatePassiveFeature.html?cachelib=false","value="+base64.encode(PassiveFeatureData)+"; closebutton=0; width=675; height=1050")]
};{
	[h,if(json.contains(FeatureData,"ActiveEffects")),CODE:{
		[h:ActiveEffectsData = json.get(FeatureData,"ActiveEffects")]

		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
			"WhichSubeffect",1,
			"WhichEffect",1,
			"EffectsNumber",json.get(ActiveEffectsData,"EffectsNumber"),
			"EffectChoiceMethod",json.get(ActiveEffectsData,"Method"),
			"EffectType","Feature",
			"FeatureData",FeatureData,
			"ExtraData",json.set("","FeatureType",json.get(FeatureData,"Type")),
			"ParentToken",json.get(CoreFeatureData,"ParentToken")
		)]
	};{
		[h:endFeatureData = json.set("",
			"FeatureData",FeatureData,
			"FeatureType",json.get(FeatureData,"Type"),
			"ParentToken",json.get(CoreFeatureData,"ParentToken")
		)]
		[h,MACRO("CreateFeatureEnd@Lib:pm.a5e.Core"): endFeatureData]
	}]	
}]