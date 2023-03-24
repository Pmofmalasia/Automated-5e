[h:ParentToken = macro.args]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:effectsToMerge = "[]"]
[h:abilityTable = "[]"]
[h:pm.a5e.OverarchingContext = "EndTurn"]

[h:pm.a5e.StartAndEndTurnEffects("End")]

[h:setState("Initiative", 0)]
[h:macro.return = abilityTable]