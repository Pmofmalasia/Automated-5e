[h:resourceInfo = arg(0)]
[h:resourceUsed = arg(1)]
[h,if(argCount()>2): pm.ResourceKey = arg(2); pm.ResourceKey = ""]

[h,if(json.get(resourceInfo,"ResourceSource") == ""):
	resourceSource = "Feature";
	resourceSource = json.get(resourceInfo,"ResourceSource")
]
[h:ResourceSourceData = pm.a5e.FeatureSourceData(resourceSource,resourceInfo)]
[h:sourceProperty = json.get(ResourceSourceData,"Property")]
[h:sourcePath = json.get(ResourceSourceData,"Path")]
[h:matchingFeature = json.get(json.path.read(getProperty(sourceProperty),sourcePath),0)]

[h,if(pm.ResourceKey==""),CODE:{
	[h:pm.MaxResourceBase = evalMacro(json.get(matchingFeature,"MaxResource"))]
	[h:pm.ResourceAmount = json.get(matchingFeature,"Resource")]
	[h,if(pm.ResourceAmount>=resourceUsed),CODE:{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",1,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType","Feature",
			"TempResourceSource",resourceSource
		)]
	};{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",0,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType","Feature",
			"TempResourceSource",resourceSource
		)]
	}]
};{
	[h:pm.MaxResourceBase = json.get(evalMacro(json.get(matchingFeature,"MaxResource")),pm.ResourceKey)]
	[h:pm.ResourceAmount = json.get(json.get(matchingFeature,"Resource"),pm.ResourceKey)]
	[h,if(pm.ResourceAmount>=resourceUsed),CODE:{
		[h:displayNameObjCheck = json.type(json.get(matchingFeature,"ResourceDisplayName"))]
		[h,if(displayNameObjCheck=="UNKNOWN"):
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
				"TempResourceType","Feature",
				"TempResourceSource",resourceSource,
				"TempEnoughResource",1);
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
				"TempResourceType","Feature",
				"TempResourceSource",resourceSource,
				"TempEnoughResource",1)
		]
	};{
		[h:displayNameObjCheck = json.type(json.get(matchingFeature,"ResourceDisplayName"))]
		[h,if(displayNameObjCheck=="UNKNOWN"):
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
				"TempResourceType","Feature",
				"TempResourceSource",resourceSource,
				"TempEnoughResource",0);
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
				"TempResourceType","Feature",
				"TempResourceSource",resourceSource,
				"TempEnoughResource",0)
		]
	}]
}]