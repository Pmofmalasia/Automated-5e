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
[h:"<!-- This macro is used for the statsheet. There is another macro, pm.a5e.DamageModCalc, which is used for change HP. This macro provides the instances that provide damage. The other macro takes these instances and checks to see if they apply to a particular set of damage. This macro will remain to be used in other functions. -->"]

[h:mod.Vuln = "[]"]
[h:mod.Res = "[]"]
[h:mod.Immun = "[]"]
[h:mod.Absorb = "[]"]
[h:mod.DR = "[]"]

[h:pm.PassiveFunction("DamageMod")]

[h:macro.return = json.set("","Vulnerability",mod.Vuln,"Resistance",mod.Res,"Immunity",mod.Immun,"Absorption",mod.Absorb,"DR",mod.DR)]