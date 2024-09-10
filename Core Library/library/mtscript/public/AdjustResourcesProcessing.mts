[h:adjustedResourceData = macro.args]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:allFeatures = js.a5e.GatherFeatures(ParentToken,json.set("","ignoreRequirePassive",true))]
[h:featuresWithResource = json.path.read(allFeatures,"\$[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:switchToken(ParentToken)]

[h,foreach(feature,featuresWithResource),CODE:{
	[h:thisFeatureMaxResource = evalMacro(json.get(feature,"MaxResource"))]
	[h,if(json.type(thisFeatureMaxResource) == "OBJECT"),CODE:{
		[h:thisAbilityIdentifier = json.get(feature,"AbilityType")+json.get(feature,"Name")+json.get(feature,"Class")+json.get(feature,"Subclass")]
		[h:thisResourceDisplayNames = json.get(feature,"ResourceDisplayName")]
		[h:thisResourceCurrentAmounts = json.get(feature,"Resource")]

		[h:resourceKeys = json.fields(thisFeatureMaxResource)]
		[h:newResourceAmount = "{}"]
		[h,foreach(resource,resourceKeys): newResourceAmount = json.set(newResourceAmount,resource,json.get(adjustedResourceData,thisAbilityIdentifier+resource))]

		[h:changedValueTest = !json.equals(newResourceAmount,thisResourceCurrentAmounts)]
	};{
		[h:thisAbilityIdentifier = json.get(feature,"AbilityType")+json.get(feature,"Name")+json.get(feature,"Class")+json.get(feature,"Subclass")]
		[h:thisResourceDisplayName = if(json.get(feature,"ResourceDisplayName") == "",json.get(feature,"DisplayName"),json.get(feature,"ResourceDisplayName"))]
		[h:thisResourceCurrentAmount = json.get(feature,"Resource")]

		[h:newResourceAmount = json.get(adjustedResourceData,thisAbilityIdentifier)]
		[h:changedValueTest = newResourceAmount != thisResourceCurrentAmount]
	}]

	[h,if(changedValueTest),CODE:{
		[h:featureSource = pm.a5e.FeatureSourceData(json.get(feature,"AbilityType"),feature)]
		[h:setProperty(json.get(featureSource,"Property"),json.path.set(getProperty(json.get(featureSource,"Property")),json.get(featureSource,"Path")+"['Resource']",newResourceAmount))]
	};{}]
}]

[h:closeDialog("AdjustResources")]
[h:broadcast("Resources updated for "+getName()+" by the GM.")]