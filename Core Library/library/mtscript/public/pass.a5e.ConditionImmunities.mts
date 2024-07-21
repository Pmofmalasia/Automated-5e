[h:ConditionImmunityFeature = arg(0)]
[h:ConditionImmunityData = json.get(ConditionImmunityFeature,"CallCondImmun")]

[h:ConditionImmunityInstances = json.merge(ConditionImmunityInstances,ConditionImmunityData)]