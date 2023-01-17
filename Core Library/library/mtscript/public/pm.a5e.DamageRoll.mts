[h:damage.ThisInstance = arg(0)]
[h:damage.NonDamageData = arg(1)]
[h:damage.FunctionPrefixes = arg(2)]
[h,if(json.isEmpty(damage.FunctionPrefixes)):
    damage.FunctionPrefixes = json.append("","");
    damage.FunctionPrefixes = json.merge(json.append("",""),damage.FunctionPrefixes)
]

[h:damage.IsSpell = json.get(damage.NonDamageData,"IsSpell")]
[h,if(json.contains(damage.NonDamageData,"ScalingBase")):
    damage.ScalingBase = json.get(damage.NonDamageData,"ScalingBase");
    damage.ScalingBase = 0
]

[h,if(json.contains(damage.ThisInstance,"AHLScaling")):     
    damage.ScalingFrequency = json.get(damage.ThisInstance,"AHLScaling");
    damage.ScalingFrequency = 0
]

[h:"<!-- Scaling Frequency is 1 = every level, 2 = every other, 3 = every third, etc. so it is divided. -->"]
[h,if(damage.ScalingFrequency > 0):
    damage.Scaling = floor(damage.ScalingBase / damage.ScalingFrequency);
    damage.Scaling = 0
]

[h:damage.Type = json.get(damage.ThisInstance,"DamageType")]
[h:damage.AllDice = "[]"]
[h:damage.AllCritDice = "[]"]
[h:damage.DieNumber = json.get(damage.ThisInstance,"DamageDieNumber")]
[h:damage.DieSize = json.get(damage.ThisInstance,"DamageDieSize")]

[h,if(json.contains(damage.ThisInstance,"AHLDieNum")): damage.DieNumber = damage.DieNumber + (damage.Scaling * json.get(damage.ThisInstance,"AHLDieNum"))]

[h:damage.CritDieNumber = damage.DieNumber]

[h,count(damage.DieNumber): damage.AllDice = json.append(damage.AllDice,damage.DieSize)]
[h:damage.Rules = damage.DieNumber+"d"+damage.DieSize]

[h,count(damage.CritDieNumber): damage.AllCritDice = json.append(damage.AllCritDice,damage.DieSize)]
[h:damage.CritRules = damage.CritDieNumber+"d"+damage.DieSize]

[h:damage.FlatBonus = json.get(damage.ThisInstance,"DamageFlatBonus")]
[h:damage.IsModBonus = json.get(damage.ThisInstance,"IsModBonus")]

[h,if(json.contains(damage.ThisInstance,"AHLFlatBonus")): damage.FlatBonus = damage.FlatBonus + (damage.Scaling * json.get(damage.ThisInstance,"AHLFlatBonus"))]

[h:damage.PrimeStat = json.get(damage.NonDamageData,"PrimeStat")]
[h:damage.FlatBonusRules = if(damage.IsModBonus,substring(damage.PrimeStat,0,3),"")]
[h,if(damage.FlatBonus==0): listAppend(damage.FlatBonusRules,damage.FlatBonus," + ")]

[h,if(damage.IsModBonus),CODE:{
    [h:damage.PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),damage.PrimeStat)]
    [h:damage.PrimeStatBonus = damage.PrimeStatMod]
};{
    [h:damage.PrimeStatMod = 0]
    [h:damage.PrimeStatBonus = 0]
}]
[h:damage.FlatBonusTotal = damage.PrimeStatBonus + damage.FlatBonus]

[h:damage.AddedRolledRules = ""]
[h:damage.AddedFlatBonusRules = ""]
[h:damage.AddedRolledDice = "[]"]
[h:damage.AddedFlatBonus = "[]"]

[h:"<!-- TODO: Needs transmission of targets through NonDamageData or whatever it's called -->"]
[h,foreach(tempPrefix,damage.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Damage")]
    [h:pm.PassiveFunction(tempPrefix+"DamageTargeted",json.set("","ParentToken",json.get(damage.NonDamageData,"Target")))]
}]

[h:damage.RulesFinal = damage.Rules+if(damage.AddedRolledRules=="",""," + "+damage.AddedRolledRules)+if(damage.FlatBonusRules=="",""," + "+damage.FlatBonusRules)+if(damage.AddedFlatBonusRules=="",""," + "+damage.AddedFlatBonusRules)]
[h:damage.CritRulesFinal = damage.Rules+" + "+damage.CritRules+if(damage.AddedRolledRules=="",""," + "+damage.AddedRolledRules+" + "+damage.AddedRolledRules)+if(damage.FlatBonusRules=="",""," + "+damage.FlatBonusRules)+if(damage.AddedFlatBonusRules=="",""," + "+damage.AddedFlatBonusRules)]

[h:damage.FinalDice = json.merge(damage.AllDice,damage.AddedRolledDice)]
[h:damage.Array = "[]"]
[h,foreach(die,damage.FinalDice): damage.Array = json.append(damage.Array,eval("1d"+die))]
[h,if(json.isEmpty(damage.AddedFlatBonus)):
    damage.TotalAddedFlatBonus = damage.FlatBonusTotal;
    damage.TotalAddedFlatBonus = math.arraySum(damage.AddedFlatBonus) + damage.FlatBonusTotal
]

[h:damage.Total = math.arraySum(damage.Array) + damage.TotalAddedFlatBonus]
[h:damage.FlatDisplay = pm.PlusMinus(damage.PrimeStatBonus,damage.IsModBonus)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(damage.AddedFlatBonus),""," + "+json.toList(damage.AddedFlatBonus," + "))]
[h:damage.RollDisplay = json.toList(damage.Array," + ")+damage.FlatDisplay]
[h:damage.Max = math.arraySum(damage.FinalDice) + damage.TotalAddedFlatBonus]

[h:"<!-- TODO: Temporarily separate out addedRolledDice and regular rolled dice array so the order can be natty dice, natty crit dice, added dice, added crit dice in the array -->"]
[h:damage.FinalCritDice = json.merge(damage.AllCritDice,damage.AddedRolledDice)]
[h:damage.CritArray = damage.Array]
[h,foreach(die,damage.FinalCritDice): damage.CritArray = json.append(damage.CritArray,eval("1d"+die))]
[h:damage.CritTotal = math.arraySum(damage.CritArray) + damage.Total]
[h:damage.CritRollDisplay = json.toList(damage.CritArray," + ")+pm.PlusMinus(damage.PrimeStatBonus,damage.IsModBonus)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(damage.AddedFlatBonus),""," + "+json.toList(damage.AddedFlatBonus," + "))]
[h:damage.CritMax = math.arraySum(damage.FinalCritDice) + damage.Max]

[h:damage.NonDamageData = json.remove(damage.NonDamageData,"Target")]
[h:return(0,json.set(damage.NonDamageData,
    "Array",damage.Array,
    "Total",damage.Total,
    "String",damage.RollDisplay,
    "MaxTotal",damage.Max,
    "Dice",damage.FinalDice,
    "Bonus",damage.TotalAddedFlatBonus,
    "BonusString",damage.FlatDisplay,
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