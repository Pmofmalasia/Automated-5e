[h:switchToken(arg(0))]
[h:a5e.UnifiedAbilities = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.IsActive > 0)]")]
[h:a5e.UnifiedAbilities = json.path.put(a5e.UnifiedAbilities,"\$[*]","AbilityType","Feature")]
[h:a5e.ConditionsToBeUnified = json.path.put(getProperty("a5e.stat.ConditionList"),"\$[*]","IsActive",1)]
[h:a5e.ConditionsToBeUnified = pm.a5e.MergeTieredConditions(a5e.ConditionsToBeUnified)]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,json.path.put(a5e.ConditionsToBeUnified,"\$[*]","AbilityType","Condition"))]

[h:"<!-- Note: IsActive check is now exclusively used for passive features, and is done in pm.PassiveFunction. If weird things happen, check there. -->"]
[h:a5e.ValidItems = getProperty("a5e.stat.Inventory")]
[h,if(0): a5e.InventoryAbilities = json.path.read(a5e.ValidItems,"\$[*][?(@.isPassiveFunction == 1)]"); a5e.InventoryAbilities = getProperty("a5e.stat.Inventory")]
[h:a5e.InventoryAbilities = json.path.put(a5e.InventoryAbilities,"\$[*]","AbilityType","Item")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.InventoryAbilities)]

[h:a5e.TempItemConditions = json.path.read(a5e.ValidItems,"\$[*]['ItemConditions']")]
[h:a5e.ItemConditions = "[]"]
[h,foreach(tempCondition,a5e.TempItemConditions): a5e.ItemConditions = json.merge(a5e.ItemConditions,tempCondition)]
[h:a5e.ItemConditions = json.path.put(a5e.ItemConditions,"\$[*]","AbilityType","ItemCondition")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.ItemConditions)]

[h,if(argCount() > 1),CODE:{
	[h:includeAuras = arg(1)]
	[h,switch(includeAuras):
		case 0: a5e.UnifiedAbilities = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Aura == null || @.Aura == '')]","DEFAULT_PATH_LEAF_TO_NULL");
		case 1: a5e.UnifiedAbilities = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Aura != null)]","DEFAULT_PATH_LEAF_TO_NULL");
		default: ""
	]
};{}]

[h:macro.return = a5e.UnifiedAbilities]