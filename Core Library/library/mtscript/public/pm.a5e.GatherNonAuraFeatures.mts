[h:switchToken(arg(0))]
[h:a5e.UnifiedAbilities = json.path.put(getProperty("a5e.stat.AllFeatures"),"[*]","AbilityType","Feature")]
[h:a5e.ConditionsToBeUnified = json.path.put(getProperty("a5e.stat.ConditionList"),"[*]","IsActive",1)]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,json.path.put(a5e.ConditionsToBeUnified,"[*]","AbilityType","Condition"))]

[h:a5e.ValidItems = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.IsActive > 0)]")]
[h:a5e.InventoryAbilities = json.path.read(a5e.ValidItems,"[*][?(@.isPassiveEffects == 1)]")]
[h:a5e.InventoryAbilities = json.path.put(a5e.InventoryAbilities,"[*]","AbilityType","Item")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.InventoryAbilities)]

[h:a5e.ItemBuffs = json.path.read(a5e.ValidItems,"[*]['ItemBuffs']")]
[h:a5e.ItemBuffs = json.path.put(a5e.ItemBuffs,"[*]","AbilityType","ItemBuff")]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,a5e.ItemBuffs)]

[h:macro.return = a5e.UnifiedAbilities]