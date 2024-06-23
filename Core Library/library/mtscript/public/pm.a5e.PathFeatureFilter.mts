[h:FeatureToSearch = arg(0)]

[h,switch(json.get(FeatureToSearch,"AbilityType")),CODE:
	case "Item": path = "@.ItemID == '"+json.get(FeatureToSearch,"ItemID")+"'";
	case "ItemCondition": path = "@.ItemID == '"+json.get(FeatureToSearch,"ItemID")+"' && @.ItemConditions.*.Name == '"+json.get(FeatureToSearch,"Name")+"' && @.ItemConditions.*.Class == '"+json.get(FeatureToSearch,"Class")+"' && @.ItemConditions.*.Subclass == '"+json.get(FeatureToSearch,"Subclass")+"'";
	default: path = "@.Name == '"+json.get(FeatureToSearch,"Name")+"' && @.Class == '"+json.get(FeatureToSearch,"Class")+"' && @.Subclass == '"+json.get(FeatureToSearch,"Subclass")+"'"
]

[h:return(0,path)]