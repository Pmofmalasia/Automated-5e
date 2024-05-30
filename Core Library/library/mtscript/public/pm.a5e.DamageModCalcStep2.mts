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

[h:AllSourcesTest = if(json.get(modifierInstance,"All")==1,1,0)]

[h:"<!-- Damage modifiers are calculated in instances - at this level, there is only one instance of damage, but instances of effects that modify the damage. This is because separate features that provide damage modifiers may only be *situationally* better than the other, as opposed to strictly better. Therefore, each feature that can provide damage modification is checked to see what provides the best benefit. That being said, all of this feels like insanity and hopefully there is a better way. -->"]

[h:"<!-- Additional note: I think Physical damage does not need a separate note from magical, since if something is not magical then it is physical by default, but will need to consider this. --> "]

[h,if(AllSourcesTest),CODE:{
	[h:return(0,modifierDamageTypes)]
};{
	[h:isDamageModApplicable = 1]
	[h:tempSourceToken = json.get(hp.Data,"SourceToken")]
	
	[h,if(json.get(modifierInstance,"Creature") != ""): isDamageModApplicable = pm.a5e.CreaturePrereqs(tempSourceToken,json.get(modifierInstance,"Creature"),ParentToken)]
	[h:return(isDamageModApplicable,"[]")]

	[h:weaponInfo = json.get(SourceEffect,"WeaponData")]
	[h:spellInfo = json.get(SourceEffect,"SpellData")]
	[h:affectsMagical = json.get(modifierInstance,"Magical")]
	[h:affectsPhysical = json.get(modifierInstance,"Physical")]
	[h,if(affectsMagical == 1 || affectsPhysical == 1),CODE:{
		[h:isMagical = 0]
		[h,if(spellInfo != ""): isMagical = 1]
		[h,if(weaponInfo != ""): isMagical = max(json.get(weaponInfo,"isMagical"),isMagical)]
		
		[h,if(affectsMagical == 1): isDamageModApplicable = min(isDamageModApplicable,isMagical)]
		[h,if(affectsPhysical == 1): isDamageModApplicable = min(isDamageModApplicable,!isMagical)]
	};{}]
	[h:return(isDamageModApplicable,"[]")]

	[h,if(!json.isEmpty(weaponInfo)),CODE:{
		[h:"<!-- TODO: Effect Refactor: MeleeRangedAttack data should be in the 'Attack' portion of ToResolve so it can be tested for spells/features alike -->"]
		[h,if(json.get(modifierInstance,"MeleeRanged")!=""): isDamageModApplicable = min(isDamageModApplicable,json.get(modifierInstance,"MeleeRanged") != json.get(weaponInfo,"MeleeRanged"))]
		[h,if(json.get(modifierInstance,"MeleeRangedAttack")!=""): isDamageModApplicable = min(isDamageModApplicable,json.get(modifierInstance,"MeleeRangedAttack") != json.get(weaponInfo,"MeleeRangedAttack"))]

		[h:allWeaponMaterials = json.get(weaponInfo,"Materials")]
		[h,if(json.get(weaponInfo,"Coating") != ""): allWeaponMaterials = json.append(allWeaponMaterials,json.get(weaponInfo,"Coating"))]

		[h,if(json.get(modifierInstance,"IncludeMaterial")!=""): isDamageModApplicable = min(isDamageModApplicable,json.contains(json.get(modifierInstance,"IncludeMaterial"),allWeaponMaterials))]
		[h,if(json.get(modifierInstance,"ExcludeMaterial")!=""): isDamageModApplicable = min(isDamageModApplicable,!json.contains(json.get(modifierInstance,"ExcludeMaterial"),allWeaponMaterials))]
	};{}]
	[h:return(isDamageModApplicable,"[]")]

	[h,if(!json.isEmpty(spellInfo)),CODE:{
		[h,if(json.get(modifierInstance,"IncludeSpellName") != ""): isDamageModApplicable = min(isDamageModApplicable,!json.contains(json.get(modifierInstance,"IncludeSpellName"),json.get(spellData,"Name")))]
		[h,if(json.get(modifierInstance,"IncludeSchool")!=""): isDamageModApplicable = json.contains(json.get(modifierInstance,"IncludeSchool"),json.get(spellData,"School"))]
		[h,if(json.get(modifierInstance,"ExcludeSchool")!=""): isDamageModApplicable = !json.contains(json.get(modifierInstance,"ExcludeSchool"),json.get(spellData,"School"))]
	};{}]

	[h,if(isDamageModApplicable):
		return(0,modifierDamageTypes);
		return(0,"[]")
	]
}]