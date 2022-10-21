[h:damage.ThisInstance = arg(0)]
[h:damage.NonDamageProperties = arg(1)]
[h:damage.Functions = arg(2)]

[h:damage.IsSpell = json.get(damage.NonDamageProperties,"IsSpell")]

[h,if(!json.isEmpty(damage.ThisInstance,"DamageTypeOptions")):
    damage.Type = pm.RemoveSpecial(eval("DamageTypeSelection"+roll.count));
    damage.Type = json.get(damage.ThisInstance,"DamageType")
]
[h:"<!-- Needs AHL as well -->"]
[h:damage.AllDice = "[]"]
[h:damage.AllCritDice = "[]"]
[h:damage.DieNumber = json.get(damage.ThisInstance,"DamageDieNumber")]
[h:damage.DieSize = json.get(damage.ThisInstance,"DamageDieSize")]
[h:damage.CritDieNumber = damage.DieNumber]

[h,count(damage.DieNumber): damage.AllDice = json.append(damage.AllDice,damage.DieSize)]
[h:damage.Rules = damage.DieNumber+"d"+damage.DieSize]

[h,count(damage.CritDieNumber): damage.AllCritDice = json.append(damage.AllCritDice,damage.DieSize)]
[h:damage.CritRules = damage.CritDieNumber+"d"+damage.DieSize]

[h:damage.FlatBonus = json.get(damage.ThisInstance,"DamageFlatBonus")]
[h:damage.IsModBonus = json.get(damage.ThisInstance,"IsModBonus")]

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
[h:damage.RollDisplay = json.toList(damage.Array," + ")+pm.PlusMinus(damage.PrimeStatBonus,damage.IsModBonus)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(damage.AddedFlatBonus),""," + "+json.toList(damage.AddedFlatBonus," + "))]
[h:damage.Max = math.arraySum(damage.FinalDice) + damage.TotalAddedFlatBonus]

[h:damage.FinalCritDice = json.merge(damage.AllDice,damage.AllCritDice,damage.AddedRolledDice,damage.AddedRolledDice)]
[h:damage.CritArray = "[]"]
[h,foreach(die,damage.FinalCritDice): damage.CritArray = json.append(damage.CritArray,eval("1d"+die))]
[h:damage.CritTotal = math.arraySum(damage.CritArray) + damage.TotalAddedFlatBonus]
[h:damage.CritRollDisplay = json.toList(damage.CritArray," + ")+pm.PlusMinus(damage.PrimeStatBonus,damage.IsModBonus)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(damage.AddedFlatBonus),""," + "+json.toList(damage.AddedFlatBonus," + "))]
[h:damage.CritMax = math.arraySum(damage.FinalCritDice) + damage.TotalAddedFlatBonus]

[h:return(0,json.set(damage.NonDamageProperties,
    "Array",damage.Array,
    "Total",damage.Total,
    "String",damage.RollDisplay,
    "MaxTotal",damage.Max,
    "Dice",damage.FinalDice,
    "Bonus",damage.TotalAddedFlatBonus,
    "Formula",damage.RulesFinal,
    "CritFormula",damage.CritRulesFinal,
    "CritDice",damage.FinalCritDice,
    "CritArray",damage.CritArray,
    "CritString",damage.CritRollDisplay,
    "CritTotal",damage.CritTotal,
    "CritMaxTotal",damage.CritMax,
    "DamageType",damage.Type,
    "NoModification",if(json.contains(damage.ThisInstance,"NoModification"),json.get(damage.ThisInstance,"NoModification"),0)
))]