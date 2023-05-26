[h:EffectData = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(EffectData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Effect"]
[h:pm.a5e.EffectData = "[]"]
[h:abilityTable = "[]"]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:AHLTier = 0]
[h:EffectSubeffects = json.get(EffectData,"Subeffects")]
[h,foreach(tempSubeffect,EffectSubeffects): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","BaseData",EffectData))]

[h:macro.return = json.set("","Table",abilityTable,"Effect",pm.a5e.EffectData)]