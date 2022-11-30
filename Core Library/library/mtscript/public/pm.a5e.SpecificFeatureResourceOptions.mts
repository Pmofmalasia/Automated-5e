[h:resourceInfo = arg(0)]
[h:resourceUsed = arg(1)]
[h,if(argCount()>2): pm.ResourceKey = arg(2); pm.ResourceKey = ""]

[h:matchingFeature = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name=='"+json.get(resourceInfo,"Name")+"' && @.Class=='"+json.get(resourceInfo,"Class")+"' && @.Subclass=='"+json.get(resourceInfo,"Subclass")+"')]"),0)]
			
[h,if(pm.ResourceKey==""),CODE:{
	[h:pm.MaxResourceBase = evalMacro(json.get(matchingFeature,"MaxResource"))]
	[h:pm.ResourceAmount = json.get(matchingFeature,"Resource")]
	[h,if(pm.ResourceAmount>=resourceUsed),CODE:{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",1,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType","Feature"
		)]
	};{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",0,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType","Feature"
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
				"TempEnoughResource",1);
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
				"TempResourceType","Feature",
				"TempEnoughResource",1)
		]
	};{
		[h:displayNameObjCheck = json.type(json.get(matchingFeature,"ResourceDisplayName"))]
		[h,if(displayNameObjCheck=="UNKNOWN"):
			macro.return = json.set(matchingFeature,
					"TempResourceKey",pm.ResourceKey,
					"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
					"TempResourceType","Feature",
					"TempEnoughResource",0);
			macro.return = json.set(matchingFeature,
					"TempResourceKey",pm.ResourceKey,
					"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
					"TempResourceType","Feature","TempEnoughResource",0)
		]
	}]
}]