[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]
[h:"<!-- TODO: This macro is used for the statsheet. There is another macro, pm.a5e.DamageModCalc, which is used for change HP. That macro takes into account the specific damage instance, while this does not. Could likely merge these two macros, and would also be good to create another that outputs the result as a string for the statsheet. -->"]

[h:mod.Vuln = "[]"]
[h:mod.Res = "[]"]
[h:mod.Immun = "[]"]
[h:mod.Absorb = "[]"]
[h:mod.DR = "[]"]

[h:pm.PassiveFunction("DamageMod")]

[h:macro.return = json.set("","Vulnerability",mod.Vuln,"Resistance",mod.Res,"Immunity",mod.Immun,"Absorption",mod.Absorb,"DR",mod.DR)]