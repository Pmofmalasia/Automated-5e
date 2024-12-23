[h:adjustedResourceData = pm.a5e.KeyStringsToNumbers(macro.args)]
[h:ParentToken = json.get(adjustedResourceData,"ParentToken")]
[h:allFeatures = js.a5e.GatherFeatures(ParentToken,json.set("","ignoreRequirePassive",true,"ignoreIsActive",true))]
[h:featuresWithResource = json.path.read(allFeatures,"\$[*][?(@.ResourceData != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:switchToken(ParentToken)]

[h:js.a5e.AdjustResourcesProcessing(adjustedResourceData,featuresWithResource,ParentToken)]

[h:closeDialog("AdjustResources")]
[h:broadcast("Resources updated for "+getName()+" by the GM.")]