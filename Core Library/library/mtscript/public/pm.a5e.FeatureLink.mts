[h:currentFeatureEffect = arg(1)]
[h,if(argcount()>2): extraInfo = arg(2); extraInfo = json.set("","ExtraData","{}")]
[h:currentFeatureAltName = json.get(extraInfo,"AltName")]
[h:currentFeatureExtraData = json.get(extraInfo,"ExtraData")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:currentFeatureExtraData = json.merge(currentFeatureExtraData,currentFeatureInfo)]
[h:currentFeatureLibrary = json.get(currentFeatureInfo,"Library")]
[h:currentFeatureType = json.get(currentFeatureInfo,"Type")]
[h:currentFeatureContext = json.get(currentFeatureInfo,"Context")]
[h:ShowFullRules = json.get(currentFeatureInfo,"FullRules")]

[h:currentFeatureLink = macroLinkText(if(currentFeatureAltName=="",currentFeatureName,pm.RemoveSpecial(currentFeatureAltName))+" ### "+currentFeatureClass+" ### "+if(currentFeatureSubclass=="","",currentFeatureSubclass+" ### ")+if(currentFeatureType=="Feature","",currentFeatureType+" ### ")+"Link@Lib:"+currentFeatureLibrary,"gm-self",json.set(currentFeatureExtraData,"ParentToken",ParentToken,"IsTooltip",0,"Context",currentFeatureContext,"OverarchingContext",pm.a5e.OverarchingContext),ParentToken)]
[h:currentFeatureTooltipLink = macroLinkText(if(currentFeatureAltName=="",currentFeatureName,pm.RemoveSpecial(currentFeatureAltName))+" ### "+currentFeatureClass+" ### "+if(currentFeatureSubclass=="","",currentFeatureSubclass+" ### ")+if(currentFeatureType=="Feature","",currentFeatureType+" ### ")+"Link@Lib:"+currentFeatureLibrary,"gm-self",json.set(currentFeatureExtraData,"ParentToken",ParentToken,"IsTooltip",1,"Context",currentFeatureContext,"OverarchingContext",pm.a5e.OverarchingContext),ParentToken)]
[h,if(IsTooltip),CODE:{
	[h:abilityTable = json.append(abilityTable,pm.a5e.CreateBasicTableLine(
		currentFeatureDisplayName,
		currentFeatureEffect,
		"<a href='"+currentFeatureTooltipLink+"' style='color:%{LinkTextColor}'>Feature Info</a>"
	))]
};{
	[h,if(ShowFullRules):
		abilityTable = json.append(abilityTable,pm.a5e.CreateBasicTableLine(
			currentFeatureDisplayName,
			currentFeatureEffect,
			json.set("","Type","Rules","Body","<a href='"+currentFeatureLink+"' style='color:%{LinkTextColor}'>Use Feature</a> / <a href='"+currentFeatureTooltipLink+"' style='color:%{LinkTextColor}'>Feature Info</a>")));
		abilityTable = json.append(abilityTable,pm.a5e.CreateBasicTableLine(
			currentFeatureDisplayName,
			"<a href='"+currentFeatureLink+"' style='color:%{LinkTextColor}'>Use Feature</a> / <a href='"+currentFeatureTooltipLink+"' style='color:%{LinkTextColor}'>Feature Info</a>"
		))
	]

	[h:AttackResolutionPassiveInstances = json.append("","AttackOnHit","AttackOnHitTargeted","AttackOnMiss","AttackOnMissTargeted")]
	[h,if(json.contains(AttackResolutionPassiveInstances,currentFeatureContext)): AdditionalAttackResolution = 1]
}]