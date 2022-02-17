[h:a5e.UnifiedAbilities = json.path.put(allAbilities,"[*]","AbilityType","Feature")]
[h:a5e.ConditionsToBeUnified = json.path.put(ConditionList,"[*]","IsActive",1)]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,json.path.put(a5e.ConditionsToBeUnified,"[*]","AbilityType","Condition"))]
[h:macro.return = a5e.UnifiedAbilities]