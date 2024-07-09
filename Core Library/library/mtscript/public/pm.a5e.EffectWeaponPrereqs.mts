[h:EffectToCheck = arg(0)]
[h:WeaponPrerequisites = arg(1)]

[h:meetsWeaponPrereqs = 1]

[h:weaponInfo = json.get(EffectToCheck,"WeaponData")]
[h,if(!json.isEmpty(weaponInfo)),CODE:{
	[h:"<!-- TODO: Effect Refactor: MeleeRangedAttack data should be in the 'Attack' portion of ToResolve so it can be tested for spells/features alike -->"]
	[h,if(json.get(WeaponPrerequisites,"MeleeRanged")!=""): meetsWeaponPrereqs = min(meetsWeaponPrereqs,json.get(WeaponPrerequisites,"MeleeRanged") == json.get(weaponInfo,"MeleeRanged"))]

	[h:allWeaponMaterials = json.get(weaponInfo,"Materials")]
	[h,if(json.get(weaponInfo,"Coating") != ""): allWeaponMaterials = json.append(allWeaponMaterials,json.get(weaponInfo,"Coating"))]
	[h,if(json.get(WeaponPrerequisites,"IncludeMaterial")!=""): meetsWeaponPrereqs = min(meetsWeaponPrereqs,json.contains(json.get(WeaponPrerequisites,"IncludeMaterial"),allWeaponMaterials))]
	[h,if(json.get(WeaponPrerequisites,"ExcludeMaterial")!=""): meetsWeaponPrereqs = min(meetsWeaponPrereqs,!json.contains(json.get(WeaponPrerequisites,"ExcludeMaterial"),allWeaponMaterials))]
};{
	[h,if(json.get(WeaponPrerequisites,"IncludeMaterial")!=""): meetsWeaponPrereqs = 0]
	[h,if(json.get(WeaponPrerequisites,"MeleeRanged")!=""): meetsWeaponPrereqs = 0]
}]
[h:return(0,meetsWeaponPrereqs)]