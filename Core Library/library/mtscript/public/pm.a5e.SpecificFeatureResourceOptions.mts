[h:resourceInfo = arg(0)]
[h:resourceUsed = arg(1)]
[h,if(argCount()>2): pm.ResourceKey = arg(2); pm.ResourceKey = ""]

[h,if(json.get(resourceInfo,"Type") == ""):
	resourceSource = "Feature";
	resourceSource = json.get(resourceInfo,"Type")
]
[h,switch(resourceSource),CODE:
	case "Feature":{
		[h:sourceProperty = "a5e.stat.AllFeatures"]
		[h:sourcePath = "@.Name=='"+json.get(resourceInfo,"Name")+"' && @.Class=='"+json.get(resourceInfo,"Class")+"' && @.Subclass=='"+json.get(resourceInfo,"Subclass")+"'"]
	};
	case "Condition":{
		[h:sourceProperty = "a5e.stat.Conditions"]
		[h:sourcePath = "@.Name=='"+json.get(resourceInfo,"Name")+"' && @.Class=='"+json.get(resourceInfo,"Class")+"' && @.Subclass=='"+json.get(resourceInfo,"Subclass")+"'"]
	};
	case "Item":{
		[h:sourceProperty = "a5e.stat.Inventory"]
		[h:sourcePath = "@.ItemID=='"+json.get(resourceInfo,"ItemID")+"'"]
	}
]

[h:matchingFeature = json.get(json.path.read(getProperty(sourceProperty),"[*][?("+sourcePath+")]"),0)]

[h,if(pm.ResourceKey==""),CODE:{
	[h:pm.MaxResourceBase = evalMacro(json.get(matchingFeature,"MaxResource"))]
	[h:pm.ResourceAmount = json.get(matchingFeature,"Resource")]
	[h,if(pm.ResourceAmount>=resourceUsed),CODE:{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",1,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType",resourceSource
		)]
	};{
		[h:macro.return = json.set(matchingFeature,
			"TempEnoughResource",0,
			"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
			"TempResourceType",resourceSource
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
				"TempResourceType",resourceSource,
				"TempEnoughResource",1);
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
				"TempResourceType",resourceSource,
				"TempEnoughResource",1)
		]
	};{
		[h:displayNameObjCheck = json.type(json.get(matchingFeature,"ResourceDisplayName"))]
		[h,if(displayNameObjCheck=="UNKNOWN"):
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(matchingFeature,"ResourceDisplayName")=="",json.get(matchingFeature,"DisplayName"),json.get(matchingFeature,"ResourceDisplayName")),
				"TempResourceType",resourceSource,
				"TempEnoughResource",0);
			macro.return = json.set(matchingFeature,
				"TempResourceKey",pm.ResourceKey,
				"TempResourceDisplayName",if(json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)=="",json.get(matchingFeature,"DisplayName"),json.get(json.get(matchingFeature,"ResourceDisplayName"),pm.ResourceKey)),
				"TempResourceType",resourceSource,
				"TempEnoughResource",0)
		]
	}]
}]