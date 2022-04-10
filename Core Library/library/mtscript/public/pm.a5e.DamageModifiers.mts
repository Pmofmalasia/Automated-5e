[h:mod.Vuln = "[]"]
[h:mod.Res = "[]"]
[h:mod.Immun = "[]"]
[h:mod.Absorb = "[]"]
[h:mod.DR = "[]"]
[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:IsTooltip = 0]

[h:pm.PassiveFunction("DamageMod")]

[h:macro.return = json.set("","Vulnerability",mod.Vuln,"Resistance",mod.Res,"Immunity",mod.Immun,"Absorption",mod.Absorb,"DR",mod.DR)]