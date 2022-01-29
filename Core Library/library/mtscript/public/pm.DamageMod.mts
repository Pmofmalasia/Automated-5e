[h:a5e.GatherAbilities()]

[h:pm.VulnInfo = ""]
[h:pm.ResInfo = ""]
[h:pm.ImmunInfo = ""]
[h:pm.AbsorbInfo = ""]
[h:pm.DRInfo = ""]
[h,foreach(dmgType,pm.GetDamageTypes("Name","json")),CODE:{
	[h:pm.VulnInfo = json.set(pm.VulnInfo,dmgType,0)]
	[h:pm.ResInfo = json.set(pm.ResInfo,dmgType,0)]
	[h:pm.ImmunInfo = json.set(pm.ImmunInfo,dmgType,0)]
	[h:pm.AbsorbInfo = json.set(pm.AbsorbInfo,dmgType,0)]
	[h:pm.DRInfo = json.set(pm.DRInfo,dmgType,0)]
	[h:pm.DRInfo = json.set(pm.DRInfo,dmgType+"Phys",0)]
	[h:pm.DRInfo = json.set(pm.DRInfo,dmgType+"Mag",0)]
}]

[h:"<!-- Current calculation for passive abilities: damage type key = if(oldValue==newValue,old,new+old) -->"]

[h:pm.PassiveFunction("DamageMod")]

[h:macro.return = json.set("","Vulnerability",pm.VulnInfo,"Resistance",pm.ResInfo,"Immunity",pm.ImmunInfo,"Absorption",pm.AbsorbInfo,"DR",pm.DRInfo)]