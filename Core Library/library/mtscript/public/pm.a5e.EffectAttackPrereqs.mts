[h:EffectToCheck = arg(0)]
[h:AttackPrerequisites = arg(1)]
[h:meetsAttackPrereqs = 1]

[h:attackInfo = json.get(EffectToCheck,"ToResolve")]
[h,if(json.isEmpty(attackInfo)): return(0,0)]
[h:attackInfo = json.get(attackInfo,"Attack")]
[h,if(json.isEmpty(attackInfo)): return(0,0)]

[h,if(json.contains(AttackPrerequisites,"isCrit")): meetsAttackPrereqs = min(meetsAttackPrereqs,json.get(AttackPrerequisites,"isCrit") == json.get(attackInfo,"CritTest"))]

[h:weaponInfo = json.get(EffectToCheck,"WeaponData")]
[h,if(!json.isEmpty(weaponInfo)),CODE:{
	[h:"<!-- TODO: Effect Refactor: MeleeRangedAttack data should be in the 'Attack' portion of ToResolve instead of 'WeaponData' -->"]
	[h,if(json.get(AttackPrerequisites,"MeleeRangedAttack")!=""): meetsAttackPrereqs = min(meetsAttackPrereqs,json.get(AttackPrerequisites,"MeleeRangedAttack") == json.get(weaponInfo,"MeleeRangedAttack"))]

	[h,if(json.get(AttackPrerequisites,"isWeapon") == 0): meetsAttackPrereqs = 0]
};{
	[h,if(json.get(AttackPrerequisites,"isWeapon") == 1): meetsAttackPrereqs = 0]
	[h,if(json.get(AttackPrerequisites,"MeleeRangedAttack")!=""): meetsAttackPrereqs = 0]
}]
[h:return(0,meetsAttackPrereqs)]