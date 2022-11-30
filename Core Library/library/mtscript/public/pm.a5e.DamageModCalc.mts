[h:hp.Data = arg(0)]
[h:Flavor = json.get(hp.Data,"Flavor")]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:hp.Source = json.get(hp.Data,"SourceType")]
[h:hp.DamageDealt = json.get(hp.Data,"DamageDealt")]
[h:switchToken(ParentToken)]

[h:hp.VulnerableTypes = "[]"]
[h:hp.ResistanceTypes = "[]"]
[h:hp.ImmunityTypes = "[]"]
[h:hp.AbsorptionTypes = "[]"]
[h:hp.DRTypes = json.fromStrProp(pm.GetDamageTypes("Name","=0;")+"=0")]
[h:hp.DRTypes = json.set(hp.DRTypes,"Healing",0)]
[h:hp.DRTypes = json.set(hp.DRTypes,"Temp HP",0)]

[h,foreach(modifierInstance,json.get(getProperty("a5e.stat.DamageModifiers"),"Vulnerability")),CODE:{
	[h:hp.VulnerableTypes = json.union(hp.VulnerableTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(getProperty("a5e.stat.DamageModifiers"),"Resistance")),CODE:{
	[h:hp.ResistanceTypes = json.union(hp.ResistanceTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(getProperty("a5e.stat.DamageModifiers"),"Immunity")),CODE:{
	[h:hp.ImmunityTypes = json.union(hp.ImmunityTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(getProperty("a5e.stat.DamageModifiers"),"Absorption")),CODE:{
	[h:hp.AbsorptionTypes = json.union(hp.AbsorptionTypes,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance))]
}]

[h,foreach(modifierInstance,json.get(getProperty("a5e.stat.DamageModifiers"),"DR")),CODE:{
	[h:hp.DRAmount = json.get(modifierInstance,"Amount")]
	[h,foreach(damageType,pm.a5e.DamageModCalcStep2(hp.Data,modifierInstance)): hp.DRTypes = json.set(hp.DRTypes,damageType,(hp.DRAmount+json.get(hp.DRTypes,damageType)))]
}]

[h:macro.return = json.set("","Vulnerability",hp.VulnerableTypes,"Resistance",hp.ResistanceTypes,"Immunity",hp.ImmunityTypes,"Absorption",hp.AbsorptionTypes,"DR",hp.DRTypes)]