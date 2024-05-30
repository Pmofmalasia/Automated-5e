[h:EffectToCheck = arg(0)]
[h:GeneralPrerequisites = arg(1)]

[h:meetsGeneralPrereqs = 1]

[h:weaponInfo = json.get(EffectToCheck,"WeaponData")]
[h:spellInfo = json.get(EffectToCheck,"SpellData")]
[h:affectsMagical = json.get(GeneralPrerequisites,"Magical")]
[h:affectsPhysical = json.get(GeneralPrerequisites,"Physical")]
[h,if(affectsMagical == 1 || affectsPhysical == 1),CODE:{
	[h:isMagical = 0]
	[h,if(spellInfo != ""): isMagical = 1]
	[h,if(weaponInfo != ""): isMagical = max(json.get(weaponInfo,"isMagical"),isMagical)]
	
	[h,if(affectsMagical == 1): meetsGeneralPrereqs = min(meetsGeneralPrereqs,isMagical)]
	[h,if(affectsPhysical == 1): meetsGeneralPrereqs = min(meetsGeneralPrereqs,!isMagical)]
};{}]
[h:return(meetsGeneralPrereqs,0)]

[h:return(0,1)]