[h:switchToken(arg(0))]
[h:a5e.UnifiedAbilities = json.path.put(getProperty("a5e.stat.AllFeatures"),"[*]","AbilityType","Feature")]
[h:a5e.ConditionsToBeUnified = json.path.put(getProperty("a5e.stat.ConditionList"),"[*]","IsActive",1)]
[h:a5e.UnifiedAbilities = json.merge(a5e.UnifiedAbilities,json.path.put(a5e.ConditionsToBeUnified,"[*]","AbilityType","Condition"))]

[h:macro.return = a5e.UnifiedAbilities]