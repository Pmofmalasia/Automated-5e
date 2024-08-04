[h:allConditions = arg(0)]

[h:tieredConditions = json.path.read(allConditions,"\$[*][?(@.HasTiers == 1 && @.HasTiers != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:combinedTieredConditions = "[]"]
[h,foreach(condition,tieredConditions),CODE:{
	[h:thisConditionFilter = pm.a5e.PathFeatureFilter(condition)]
	[h:alreadyMergedTest = !json.isEmpty(json.path.read(combinedTieredConditions,"\$[*][?("+thisConditionFilter+")]"))]
	[h,if(!alreadyMergedTest),CODE:{
		[h:allSourcesLevel = json.path.read(tieredConditions,"\$[*][?("+thisConditionFilter+")]['Level']")]
		[h:totalLevel = math.arraySum(allSourcesLevel)]
		[h:combinedTieredConditions = json.append(combinedTieredConditions,json.set(condition,"Level",totalLevel))]

		[h:allConditions = json.path.delete(allConditions,"\$[*][?("+thisConditionFilter+")]")]
	};{}]
}]

[h:allConditions = json.merge(allConditions,combinedTieredConditions)]
[h:return(0,allConditions)]