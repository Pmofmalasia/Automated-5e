[h:WeaponData = arg(0)]
[h:allWeaponTags = pm.a5e.GetCoreData("sb.WeaponTags","Name","json")]
[h:ChosenWeaponTagsArray = "[]"]
[h,foreach(tempTag,allWeaponTags),CODE:{
	[h,if(json.contains(WeaponData,"weaponTag"+tempTag)): ChosenWeaponTagsArray = json.append(ChosenWeaponTagsArray,tempTag)]
	[h:WeaponData = json.remove(WeaponData,"weaponTag"+tempTag)]
}]
[h:WeaponData = json.set(WeaponData,"WeaponTags",ChosenWeaponTagsArray)]

[h:allWeaponProperties = pm.a5e.GetCoreData("sb.WeaponProperties","Name","json")]
[h:ChosenWeaponPropertiesArray = "[]"]
[h,foreach(tempProperty,allWeaponProperties),CODE:{
	[h,if(json.contains(WeaponData,"weaponProperty"+tempProperty)): ChosenWeaponPropertiesArray = json.append(ChosenWeaponPropertiesArray,tempProperty)]
	[h:WeaponData = json.remove(WeaponData,"weaponProperty"+tempProperty)]
}]
[h:WeaponData = json.set(WeaponData,"WeaponProperties",ChosenWeaponPropertiesArray)]

[h:allWeaponDamage = "[]"]
[h,count(json.get(WeaponData,"WeaponDamageInstanceNumber")),CODE:{
	[h:"<!-- TODO: Currently no functionality for choosing among multiple damage types, consider implementing? -->"]
	[h:thisDamageObject = json.set("",
		"DamageType",json.get(WeaponData,"WeaponDamageType"+roll.count),
		"DamageDieNumber",number(json.get(WeaponData,"WeaponDamageDieNumber"+roll.count)),
		"DamageDieSize",number(json.get(WeaponData,"WeaponDamageDieSize"+roll.count)),
		"DamageFlatBonus",json.get(WeaponData,"WeaponDamageBonus"+roll.count),
		"IsModBonus",json.contains(WeaponData,"WeaponAddDmgMod"+roll.count)
	)]

	[h:allWeaponDamage = json.append(allWeaponDamage,thisDamageObject)]

	[h:WeaponData = json.remove(WeaponData,"WeaponDamageType"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"WeaponDamageDieNumber"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"WeaponDamageDieSize"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"WeaponDamageBonus"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"WeaponAddDmgMod"+roll.count)]
}]

[h:WeaponData = json.set(WeaponData,"WeaponDamage",allWeaponDamage)]
[h:WeaponData = json.remove(WeaponData,"WeaponDamageInstanceNumber")]
[h:WeaponData = json.remove(WeaponData,"addDamageType")]
[h:WeaponData = json.remove(WeaponData,"removeDamageType")]

[h:VersatileInstanceNumber = json.contains(ChosenWeaponPropertiesArray,"Versatile")*number(json.get(WeaponData,"VersatileDamageInstanceNumber"))]
[h:allVersatileDamage = "[]"]
[h,count(VersatileInstanceNumber),CODE:{
	[h:thisDamageObject = json.set("",
		"DamageType",json.get(WeaponData,"VersatileDamageType"+roll.count),
		"DamageDieNumber",number(json.get(WeaponData,"VersatileDamageDieNumber"+roll.count)),
		"DamageDieSize",number(json.get(WeaponData,"VersatileDamageDieSize"+roll.count)),
		"DamageFlatBonus",json.get(WeaponData,"VersatileDamageBonus"+roll.count),
		"IsModBonus",json.contains(WeaponData,"VersatileAddDmgMod"+roll.count)
	)]

	[h:allVersatileDamage = json.append(allVersatileDamage,thisDamageObject)]

	[h:WeaponData = json.remove(WeaponData,"VersatileDamageType"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"VersatileDamageDieNumber"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"VersatileDamageDieSize"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"VersatileDamageBonus"+roll.count)]
	[h:WeaponData = json.remove(WeaponData,"VersatileAddDmgMod"+roll.count)]
}]

[h,if(json.contains(ChosenWeaponPropertiesArray,"Versatile")): WeaponData = json.set(WeaponData,"VersatileDamage",allVersatileDamage)]
[h:WeaponData = json.remove(WeaponData,"VersatileDamageInstanceNumber")]

[h,if(json.get(WeaponData,"WeaponCritThreshMethod")=="Set"),CODE:{
	[h:WeaponData = json.set(WeaponData,"CritThresh",json.get(WeaponData,"WeaponCritThresh"))]
};{
	[h:WeaponData = json.set(WeaponData,"CritThreshReduction",json.get(WeaponData,"WeaponCritThresh"))]
	[h:WeaponData = json.set(WeaponData,"CritThresh",20)]
}]
[h:WeaponData = json.remove(WeaponData,"WeaponCritThreshMethod")]
[h:WeaponData = json.remove(WeaponData,"WeaponCritThresh")]

[h:"<-- TODO: Add weapon crit dice here after deciding on format for how to store data -->"]

[h:return(0,WeaponData)]