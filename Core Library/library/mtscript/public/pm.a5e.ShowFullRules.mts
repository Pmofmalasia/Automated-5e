[h:FeatureTypes = arg(0)]
[h,if(json.type(FeatureTypes) == "UNKNOWN"): FeatureTypes = json.append("",FeatureTypes)]

[h:FullRulesSettings = data.getData("addon:","pm.a5e.core","FullRulesSettings")]
[h,foreach(type,FeatureTypes),CODE:{
	[h:hasSetting = json.contains(FullRulesSettings,type)]
	[h:return(!hasSetting,json.get(FullRulesSettings,type))]
}]

[h:return(0,json.get(FullRulesSettings,"Default"))]