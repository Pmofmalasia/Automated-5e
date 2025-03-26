[h:RestorationInstance = arg(0)]

[h:RestorationFilter = "@.Restore"+RestorationInstance+" != null || (@.ResourceData.Restoration."+RestorationInstance+" != null && @.ResourceData != null)"]

[h:RestorationFeatures = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?("+RestorationFilter+")]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(RestorationFeatures)): RestorationFeatures = json.path.put(RestorationFeatures,"\$[*]","ResourceSource","Feature")]

[h:RestorationItems = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?("+RestorationFilter+")]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(RestorationItems)): RestorationItems = json.path.put(RestorationItems,"\$[*]","ResourceSource","Item")]

[h:RestorationConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?("+RestorationFilter+")]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(RestorationConditions)): RestorationConditions = json.path.put(RestorationConditions,"\$[*]","ResourceSource","Condition")]

[h:RestorationItemConditions = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*]['ItemConditions'][?("+RestorationFilter+")]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(RestorationItemConditions)): RestorationItemConditions = json.path.put(RestorationItemConditions,"\$[*]","ResourceSource","ItemCondition")]

[h:AllRestorationAbilities = json.merge(RestorationFeatures,RestorationItems,RestorationConditions,RestorationItemConditions)]

[h,foreach(ability,AllRestorationAbilities),CODE:{
	[h,if(json.get(ability,"ResourceData") != ""),CODE:{
		[h:restorationHow = json.get(json.get(json.get(ability,"ResourceData"),"Restoration"),RestorationInstance)]
	};{
		[h:"<!-- Legacy code for old format (@.Restore+'Instance' in the filter is also legacy) -->"]
		[h:restorationHow = json.get(ability,"Restore"+RestorationInstance)]
	}]
	
	[h,if(json.type(restorationHow) != "ARRAY"): restorationHow = json.append("",restorationHow)]
	[h,foreach(method,restorationHow),CODE:{
		[h:RestorationData = pm.a5e.RestoreResource(ability,method,ParentToken)]
		[h:abilityTable = json.merge(abilityTable,json.get(RestorationData,"Table"))]		
	}]
}]