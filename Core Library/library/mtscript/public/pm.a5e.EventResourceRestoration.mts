[h:RestorationInstances = arg(0)]
[h,if(json.type(RestorationInstances) == "UNKNOWN"): RestorationInstances = json.append("",RestorationInstances)]
[h:ResotrationFilter = "@.Restore"+json.toList(RestorationInstances," == 1 || @.Restore")+" == 1"]

[h:RestorationFeatures = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?("+ResotrationFilter+")]")]
[h,if(!json.isEmpty(RestorationFeatures)): RestorationFeatures = json.path.putcarefully(RestorationFeatures,"[*]","ResourceSource","Feature")]

[h:RestorationItems = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?("+ResotrationFilter+")]")]
[h,if(!json.isEmpty(RestorationItems)): RestorationItems = json.path.putcarefully(RestorationItems,"[*]","ResourceSource","Item")]

[h:RestorationConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?("+ResotrationFilter+")]")]
[h,if(!json.isEmpty(RestorationConditions)): RestorationConditions = json.path.putcarefully(RestorationConditions,"[*]","ResourceSource","Condition")]

[h:RestorationItemConditions = json.path.read(getProperty("a5e.stat.Inventory"),"[*]['ItemConditions'][?("+ResotrationFilter+")][*]")]
[h,if(!json.isEmpty(RestorationItemConditions)): RestorationItemConditions = json.path.putcarefully(RestorationItemConditions,"[*]","ResourceSource","ItemCondition")]

[h:AllRestorationAbilities = json.merge(RestorationFeatures,RestorationItems,RestorationConditions,RestorationItemConditions)]

[h,foreach(ability,AllRestorationAbilities),CODE:{
	[h:RestorationData = pm.a5e.RestoreResource(ability,ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(RestorationData,"Table"))]
}]