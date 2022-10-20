[h:SpellSubeffectData = arg(0)]

[h,if(json.contains(SpellSubeffectData,"Damage")),CODE:{
	[h:allDamageData = json.get(SpellSubeffectData,"Damage")]
	[h:DamageTypeOptionNum = json.length(json.path.read(allDamageData,"[*][?(@.DamageTypeOptions != null]","DEFAULT_PATH_LEAF_TO_NULL"))]

	[h,if(DamageTypeOptionNum>1):
		DamageTypeSelectInput = "junkVar |  | --------------- Damage Type Options --------------- | LABEL | SPAN=TRUE ";
		DamageTypeSelectInput = ""
	]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:thisInstanceDamageOptions = "[]"]
		[h,foreach(tempDamageOption,json.get(allDamageData,"DamageTypeOptions")): thisInstanceDamageOptions = json.append(thisInstanceDamageOptions,pm.GetDisplayName(tempDamageOption,"sb.DamageTypes"))]
		[h,if(!json.isEmpty(thisInstanceDamageOptions)): DamageTypeSelectInput = listAppend(DamageTypeSelectInput," DamageTypeSelection"+roll.count+" | Choose a Damage Type | "+thisInstanceDamageOptions+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
	}]

	[h:abort(input(DamageTypeOptionNum))]
}]

[h,if(json.contains(SpellSubeffectData,"Attack")),CODE:{

};{
	[h:d20CritTest = 0]
}]

[h,if(json.contains(SpellSubeffectData,"Save")),CODE:{
	[h:SpellSaveDC = 8 + Proficiency + PrimeStatMod]

	[h:pm.PassiveFunction("SpellSaveDC")]

	[h:SpellSaveDCData = json.set(json.get(SpellSubeffectData,"Save"),"DC",SpellSaveDC)]
}]

[h:SpellDamageData = "[]"]
[h,foreach(tempDamageInstance,json.get(SpellSubeffectData,"Damage")),CODE:{
	[h,if(!json.isEmpty(tempDamageInstance,"DamageTypeOptions")):
	damage.Type = pm.RemoveSpecial(eval("DamageTypeSelection"+roll.count));
		damage.Type = json.get(tempDamageInstance,"DamageType")
	]
[h:"<!-- Needs AHL as well -->"]
	[h:damage.AllDice = "[]"]
	[h:damage.AllCritDice = "[]"]
	[h:damage.DieNumber = json.get(tempDamageInstance,"DamageDieNumber")]
	[h:damage.DieSize = json.get(tempDamageInstance,"DamageDieSize")]
	[h:damage.CritDieNumber = damage.DieNumber]

	[h,count(damage.DieNumber): damage.AllDice = json.append(damage.AllDice,damage.DieSize)]
	[h:damage.Rules = damage.DieNumber+"d"+damage.DieSize]

	[h,count(damage.CritDieNumber): damage.AllCritDice = json.append(damage.AllCritDice,damage.DieSize)]
	[h:damage.CritRules = damage.CritDieNumber+"d"+damage.DieSize]

	[h:damage.FlatBonus = json.get(tempDamageInstance,"DamageFlatBonus")]
	[h:damage.IsModBonus = json.get(tempDamageInstance,"IsModBonus")]

	[h:damage.FlatBonusRules = if(damage.IsModBonus,substring(PrimeStat,0,3),"")]
	[h,if(damage.FlatBonus==0): listAppend(damage.FlatBonusRules,damage.FlatBonus," + ")]

	[h,if(damage.IsModBonus): damage.PrimeStatBonus = PrimeStatMod]
	[h:damage.FlatBonusTotal = damage.PrimeStatBonus + damage.FlatBonus]

	[h:damage.AddedRolledRules = ""]
	[h:damage.AddedFlatBonusRules = ""]
	[h:damage.AddedRolledDice = "[]"]
	[h:damage.AddedFlatBonus = "[]"]
   
	[h:pm.PassiveFunction("SpellDamage")]
	[h:pm.PassiveFunction("AttackDamage")]
	[h:pm.PassiveFunction("SpellDamageTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("AttackDamageTargeted",json.set("","ParentToken",thisAttackTarget))]
	
	[h:damage.RulesFinal = damage.Rules+if(damage.AddedRolledDamageRules=="",""," + "+damage.AddedRolledDamageRules)+" + "+damage.FlatBonusRules+if(damage.AddedFlatBonusRules=="",""," + "+damage.AddedFlatBonusRules)]
	[h:damage.CritRulesFinal = damage.Rules+" + "+damage.CritRules+if(damage.AddedRolledDamageRules=="",""," + "+damage.AddedRolledDamageRules+" + "+damage.AddedRolledDamageRules)+" + "+damage.FlatBonusRules+if(damage.AddedFlatBonusRules=="",""," + "+damage.AddedFlatBonusRules)]
	
	[h:damage.FinalDice = json.merge(damage.AllDice,damage.AddedRolledDice)]
	[h:damage.Array = "[]"]
	[h,foreach(die,damage.FinalDice): damage.Array = json.append(damage.Array,eval("1d"+die))]
	[h,if(json.isEmpty(damage.AddedFlatBonus)):
		damage.TotalAddedFlatBonus = damage.FlatBonusTotal;
		damage.TotalAddedFlatBonus = math.arraySum(damage.AddedFlatBonus) + damage.FlatBonusTotal
	]

	[h:damage.Total = math.arraySum(damage.Array) + damage.TotalAddedFlatBonus]
	[h:damage.RollDisplay = json.toList(damage.Array," + ")+pm.PlusMinus(damage.PrimeStatBonus,1)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(wa.AddedFlatBonus),""," + "+json.toList(wa.AddedFlatBonus," + "))]
	[h:wa.DmgMax = math.arraySum(wa.FinalDamageDice) + wa.TotalAddedFlatBonus]
	
	[h:wa.FinalCritDamageDice = json.merge(wa.AllDmgDice,wa.AllCritDmgDice,wa.AddedRolledDamageDice,wa.AddedRolledDamageDice)]
	[h:wa.CritDmgArray = "[]"]
	[h,foreach(die,wa.FinalCritDamageDice): wa.CritDmgArray = json.append(wa.CritDmgArray,eval("1d"+die))]
	[h:wa.CritDmg = math.arraySum(wa.CritDmgArray) + wa.TotalAddedFlatBonus]
	[h:wa.CritDmgRolls = json.toList(wa.CritDmgArray," + ")+pm.PlusMinus(wa.PrimeStatBonus,1)+pm.PlusMinus(wa.MagicBonus,0)+if(json.isEmpty(wa.AddedFlatBonus),""," + "+json.toList(wa.AddedFlatBonus," + "))]
	[h:wa.CritDmgMax = math.arraySum(wa.FinalCritDamageDice) + wa.TotalAddedFlatBonus]

	[h:damage.Info = json.set("",
		"Array",wa.DmgArray,
		"Total",wa.Dmg,
		"String",wa.DmgRolls,
		"MaxTotal",wa.DmgMax,
		"Dice",wa.FinalDamageDice,
		"Bonus",wa.TotalAddedFlatBonus,
		"Formula",wa.DmgRulesFinal,
		"CritFormula",wa.CritDmgRulesFinal,
		"CritDice",wa.FinalCritDamageDice,
		"CritArray",wa.CritDmgArray,
		"CritString",wa.CritDmgRolls,
		"CritTotal",wa.CritDmg,
		"CritMaxTotal",wa.CritDmgMax,
		"DamageType",damage.Type,
		"NoModification",0,
		"IsWeapon",0,
		"IsSpell",1,
		"IsAttack",0,
		"Modifier",1
	)]
}]