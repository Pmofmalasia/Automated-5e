[h:ItemList = ""]

[h,count(json.length(MagicItemNames)),CODE:{
	[h:ItemList = json.append(ItemList,json.set("",
		"Name",json.get(MagicItemNames,roll.count),
		"Activated",json.get(MagicItemActivation,roll.count),
		"Attunement",json.get(MagicItemAttuned,roll.count),
		"Equipment",json.get(MagicItemEquipment,roll.count),
		"Vulnerabilities",json.get(MagicItemVuln,roll.count),
		"Resistances",json.get(MagicItemRes,roll.count),
		"Immunities",json.get(MagicItemImmun,roll.count),
		"Absorbs",json.get(MagicItemAbsorb,roll.count),
		"DRs",json.get(MagicItemDR,roll.count),
		"ConditionImmunities",json.get(MagicItemCondImmun,roll.count),
		"Attributes",json.get(MagicItemAttributes,roll.count),
		"Saves",json.get(MagicItemSaves,roll.count),
		"Check Adv",json.get(MagicItemCheckAdv,roll.count),
		"Check Dis",json.get(MagicItemCheckDis,roll.count),
		"Check Bonus",json.get(MagicItemCheckBonus,roll.count),
		"Check Prof",json.get(MagicItemCheckProf,roll.count),
		"Check Message",json.get(MagicItemCheckMessage,roll.count),
		"Initiative",json.get(MagicItemInit,roll.count),
		"DeathSaves",json.get(MagicItemDeath,roll.count),
		"Concentration",json.get(MagicItemConc,roll.count),
		"HP",json.get(MagicItemHP,roll.count),
		"AC",json.get(MagicItemAC,roll.count),
		"Movement",json.get(MagicItemMovement,roll.count),
		"Cantrips",json.get(MagicItemCantrips,roll.count),
		"Spells",json.get(MagicItemSpells,roll.count),
		"Weapons",json.get(MagicItemWeapons,roll.count),
		"WeaponProficiencies",json.get(MagicItemWeaponProf,roll.count)
		))]
}]

[MACRO("Magic Item Stats@Lib:pm.a5e.Core"):ItemList]