[h:oldParentToken = ParentToken]
[h:oldFeatures = a5e.UnifiedAbilities]
[h:callingInstance = arg(0)]
[h:ParentToken = json.get(arg(1),"ParentToken")]
[h:a5e.UnifiedAbilities = json.get(arg(1),"Abilities")]

[h:pm.PassiveFunction(callingInstance)]

[h:ParentToken = oldParentToken]
[h:a5e.UnifiedAbilities = oldFeatures]