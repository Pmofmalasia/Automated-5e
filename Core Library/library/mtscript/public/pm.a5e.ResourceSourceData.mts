[h:ResourceSource = arg(0)]
[h:resourceInfo = arg(1)]

[h,switch(resourceSource),CODE:
	case "Feature":{
		[h:sourceProperty = "a5e.stat.AllFeatures"]
		[h:sourcePath = "\$[*][?(@.Name=='"+json.get(resourceInfo,"Name")+"' && @.Class=='"+json.get(resourceInfo,"Class")+"' && @.Subclass=='"+json.get(resourceInfo,"Subclass")+"')]"]
	};
	case "Condition":{
		[h:sourceProperty = "a5e.stat.Conditions"]
		[h:sourcePath = "\$[*][?(@.Name=='"+json.get(resourceInfo,"Name")+"' && @.Class=='"+json.get(resourceInfo,"Class")+"' && @.Subclass=='"+json.get(resourceInfo,"Subclass")+"')]"]
	};
	case "Item":{
		[h:sourceProperty = "a5e.stat.Inventory"]
		[h:sourcePath = "\$[*][?(@.ItemID=='"+json.get(resourceInfo,"ItemID")+"')]"]
	};
	case "ItemCondition":{
		[h:sourceProperty = "a5e.stat.Inventory"]
		[h:sourcePath = "\$[*][?(@.ItemID == '"+json.get(resourceInfo,"ItemID")+"')]['ItemConditions'][?(@.Name == '"+json.get(resourceInfo,"Name")+"' && @.Class == '"+json.get(resourceInfo,"Class")+"' && @.Subclass == '"+json.get(resourceInfo,"Subclass")+"')]"]
	}
]

[h:return(0,json.set("","Property",sourceProperty,"Path",sourcePath))]