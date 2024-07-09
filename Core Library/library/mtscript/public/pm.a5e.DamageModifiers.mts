[h,if(argCount()>0),CODE:{
    [h:ParentToken = json.get(arg(0),"ParentToken")]
    [h,if(ParentToken!=""): switchToken(ParentToken)]
	[h,if(argCount()>1):
		a5e.UnifiedAbilities = arg(1);
		a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)
	]
};{
    [h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
}]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]
[h:"<!-- This macro is only used for gathering the instances of damage resistance. DamageModCalc actually applies these resistances to damage dealt. -->"]

[h:mod.Vuln = "[]"]
[h:mod.Res = "[]"]
[h:mod.Immun = "[]"]
[h:mod.Absorb = "[]"]
[h:mod.DR = "[]"]

[h:pm.PassiveFunction("DamageMod")]

[h:return(0,json.set("","Vulnerability",mod.Vuln,"Resistance",mod.Res,"Immunity",mod.Immun,"Absorption",mod.Absorb,"DR",mod.DR))]