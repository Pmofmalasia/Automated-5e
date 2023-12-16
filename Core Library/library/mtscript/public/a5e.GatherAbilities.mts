[h:ParentToken = arg(0)]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = pm.a5e.GatherNonAuraFeatures(ParentToken)]
[h:a5e.AuraFeatures = "[]"]
[h:a5e.AuraTokens = getTokens("json",json.set("","light",json.set("","category","A5E_Auras")))]
[h,foreach(tempToken,a5e.AuraTokens),CODE:{
	[h:tempFeatures = pm.a5e.GatherNonAuraFeatures(tempToken)]
	[h:tempAuraFeatures = json.path.read(tempFeatures,"\$[*][?(@.Aura != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,foreach(auraFeature,tempAuraFeatures),CODE:{
		[h:thisAuraData = json.get(auraFeature,"Aura")]
		[h:ValidTargets = pm.a5e.TargetCreatureFiltering(
			json.set("","ParentToken",tempToken,"List",json.append("",ParentToken),"Range",json.get(thisAuraData,"Range")),
			json.get(json.get(thisAuraData,"Targeting"),"Creature")
		)]
		[h,if(json.contains(ValidTargets,ParentToken)): a5e.UnifiedAbilities = json.append(a5e.UnifiedAbilities,auraFeature)]
	}]
	[h:"<!-- NOTE: Current issue - this method does not allow for adjusting aura range based on magic items, other features, etc. Perhaps could be adjusted at the time of setting the condition. -->"]
}]
[h:macro.return = a5e.UnifiedAbilities]