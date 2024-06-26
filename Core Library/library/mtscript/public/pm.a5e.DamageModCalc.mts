[h:hp.Data = arg(0)]
[h:Flavor = json.get(hp.Data,"Flavor")]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:hp.DamageDealt = json.get(hp.Data,"DamageDealt")]
[h:switchToken(ParentToken)]

[h:hp.VulnerableTypes = "[]"]
[h:hp.ResistanceTypes = "[]"]
[h:hp.ImmunityTypes = "[]"]
[h:hp.AbsorptionTypes = "[]"]
[h:hp.DRTypes = json.fromStrProp(pm.GetDamageTypes("Name","=0;")+"=0")]
[h:hp.DRTypes = json.set(hp.DRTypes,"Healing",0)]
[h:hp.DRTypes = json.set(hp.DRTypes,"TempHP",0)]

[h:tempDamageModifiers = getProperty("a5e.stat.DamageModifiers")]
[h,foreach(modifierInstance,json.get(tempDamageModifiers,"Vulnerability")),CODE:{
	[h:hp.VulnerableTypes = json.union(hp.VulnerableTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(tempDamageModifiers,"Resistance")),CODE:{
	[h:hp.ResistanceTypes = json.union(hp.ResistanceTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(tempDamageModifiers,"Immunity")),CODE:{
	[h:hp.ImmunityTypes = json.union(hp.ImmunityTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(tempDamageModifiers,"Absorption")),CODE:{
	[h:hp.AbsorptionTypes = json.union(hp.AbsorptionTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(tempDamageModifiers,"DR")),CODE:{
	[h:hp.DRAmount = json.get(modifierInstance,"Amount")]
	[h,foreach(damageType,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance)): hp.DRTypes = json.set(hp.DRTypes,damageType,(hp.DRAmount+json.get(hp.DRTypes,damageType)))]
}]

[h:macro.return = json.set("","Vulnerability",hp.VulnerableTypes,"Resistance",hp.ResistanceTypes,"Immunity",hp.ImmunityTypes,"Absorption",hp.AbsorptionTypes,"DR",hp.DRTypes)]