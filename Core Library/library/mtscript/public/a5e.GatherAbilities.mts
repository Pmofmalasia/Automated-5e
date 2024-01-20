[h:ParentToken = arg(0)]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = pm.a5e.GatherThisTokenFeatures(ParentToken,0)]
[h:a5e.AuraFeatures = "[]"]
[h:a5e.AuraTokens = getTokens("json",json.set("","light",json.set("","category","A5E_Auras")))]
[h,foreach(tempToken,a5e.AuraTokens),CODE:{
	[h:tempAuraFeatures = pm.a5e.GatherThisTokenFeatures(tempToken,1)]
	[h,foreach(auraFeature,tempAuraFeatures),CODE:{
		[h:thisAuraData = json.get(auraFeature,"Aura")]
		[h:FilteredTargets = pm.a5e.TargetCreatureFiltering(
			json.set("","ParentToken",tempToken,"List",json.append("",ParentToken),"Range",json.get(thisAuraData,"Range")),
			json.get(json.get(thisAuraData,"TargetLimits"),"Creature")
		)]
		[h:ValidTargets = json.get(FilteredTargets,"ValidTargets")]
		[h,if(json.contains(ValidTargets,ParentToken)): a5e.UnifiedAbilities = json.append(a5e.UnifiedAbilities,json.set(auraFeature,"AuraSource",tempToken))]
	}]
	[h:"<!-- TODO: Current issue - this method does not allow for adjusting aura range based on magic items, other features, etc. Perhaps could be adjusted at the time of setting the condition. -->"]
}]
[h:macro.return = a5e.UnifiedAbilities]