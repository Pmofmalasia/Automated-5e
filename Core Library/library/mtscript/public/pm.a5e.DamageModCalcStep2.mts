[h:hp.Data = arg(0)]
[h:modifierInstance = arg(1)]
[h:SourceID = json.get(hp.Data,"SourceID")]
[h:SourceEffect = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"\$[*][?(@.ID == '"+SourceID+"')]")]
[h,if(json.isEmpty(SourceEffect)): SourceEffect = "{}"; SourceEffect = json.get(SourceEffect,0)]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:switchToken(ParentToken)]

[h:modifierDamageTypes = json.get(modifierInstance,"DamageTypes")]
[h,if(json.contains(modifierDamageTypes,"All")),CODE:{
	[h:modifierDamageTypes = json.remove(modifierDamageTypes,json.indexOf(modifierDamageTypes,"All"))]
	[h:modifierDamageTypes = json.merge(modifierDamageTypes,pm.GetDamageTypes("Name","json"))]
};{}]
[h:ExcludeTypes = number(json.get(modifierInstance,"Exclusive"))]
[h,if(ExcludeTypes): modifierDamageTypes = json.difference(pm.GetDamageTypes("Name","json"),modifierDamageTypes)]

[h:DamageModifierPrerequisites = json.get(modifierInstance,"Prereqs")]
[h:AllSourcesTest = json.isEmpty(DamageModifierPrerequisites)]

[h:"<!-- Damage modifiers are calculated in instances - at this level, there is only one instance of damage, but instances of effects that modify the damage. This is because separate features that provide damage modifiers may only be *situationally* better than the other, as opposed to strictly better. -->"]

[h:"<!-- Additional note: I think Physical damage does not need a separate note from magical, since if something is not magical then it is physical by default, but will need to consider this. --> "]

[h,if(AllSourcesTest): return(0,modifierDamageTypes)]

[h:isDamageModApplicable = 1]
[h:isDamageModApplicable = pm.a5e.EffectMeetsPrereqs(SourceEffect,DamageModifierPrerequisites,ParentToken)]

[h,if(isDamageModApplicable):
	return(0,modifierDamageTypes);
	return(0,"[]")
]