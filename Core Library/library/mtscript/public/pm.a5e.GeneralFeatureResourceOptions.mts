[h:resourceName = arg(0)]
[h:resourceUsed = arg(1)]

[h:allMatchingFeatures = json.path.read(allAbilities,"[*][?(@.ResourceName=='"+resourceName+"' || (@.Name=='"+resourceName+"' && @.ResourceName==null))]","DEFAULT_PATH_LEAF_TO_NULL")]
			
[h:pm.MaxResourceIndex = 0]
[h,foreach(resource,allMatchingFeatures): pm.MaxResourceIndex = if(evalMacro(json.get(resource,"MaxResource")) > evalMacro(json.get(json.get(allMatchingFeatures,pm.MaxResourceIndex),"MaxResource")),roll.count,pm.MaxResourceIndex)]

[h:matchingFeature = json.get(allMatchingFeatures,pm.MaxResourceIndex)]
[h:pm.MaxResourceBase = evalMacro(json.get(matchingFeature,"MaxResource"))]
[h:pm.ResourceAmount = json.get(matchingFeature,"Resource")]

[h:macro.return = json.set(matchingFeature,
		"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
		"TempResourceType","Feature",
		"TempEnoughResource",if(pm.ResourceAmount>=resourceUsed,1,0)
)]