[h:ParentToken = macro.args]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.EffectData = "[]"]
[h:effectsToMerge = "[]"]
[h:abilityTable = "[]"]
[h:whichEffect = 0]
[h:pm.a5e.OverarchingContext = "EndTurn"]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","End of Turn Effect",
	"Type","Save",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:pm.a5e.StartAndEndTurnEffects("End")]

[h:setState("Initiative", 0)]
[h:macro.return = abilityTable]