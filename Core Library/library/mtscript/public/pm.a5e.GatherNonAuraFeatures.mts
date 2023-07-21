[h:switchToken(arg(0))]
[h:a5e.UnifiedAbilities = json.path.put(getProperty("a5e.stat.AllFeatures"),"[*]","AbilityType","Feature")]
[h:a5e.ConditionsToBeUnified = json.path.put(getProperty("a5e.stat.ConditionList"),"[*]","IsActive",1)]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,json.path.put(a5e.ConditionsToBeUnified,"[*]","AbilityType","Condition"))]

[h:a5e.ValidItems = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.IsActive > 0)]")]
[h:a5e.InventoryAbilities = json.path.read(a5e.ValidItems,"[*][?(@.isPassiveFunction == 1)]")]
[h:a5e.InventoryAbilities = json.path.put(a5e.InventoryAbilities,"[*]","AbilityType","Item")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.InventoryAbilities)]

[h:a5e.TempItemConditions = json.path.read(a5e.ValidItems,"[*]['ItemConditions']")]
[h:a5e.ItemConditions = "[]"]
[h,foreach(tempCondition,a5e.TempItemConditions): a5e.ItemConditions = json.merge(a5e.ItemConditions,tempCondition)]
[h:a5e.ItemConditions = json.path.put(a5e.ItemConditions,"[*]","AbilityType","ItemCondition")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.ItemConditions)]

[h:macro.return = a5e.UnifiedAbilities]