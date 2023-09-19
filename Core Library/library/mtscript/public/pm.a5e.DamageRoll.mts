[h:damage.ThisInstance = arg(0)]
[h:damage.NonDamageData = arg(1)]
[h,if(argCount() > 2):
	damage.FunctionPrefixes = arg(2);
	damage.FunctionPrefixes = "[]"
]
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
[h:damage.DieNumber = number(json.get(damage.ThisInstance,"DamageDieNumber"))]
[h:damage.DieSize = json.get(damage.ThisInstance,"DamageDieSize")]

[h,if(json.contains(damage.ThisInstance,"AHLDieNum")): damage.DieNumber = damage.DieNumber + (damage.Scaling * json.get(damage.ThisInstance,"AHLDieNum"))]

[h:damage.CritDieNumber = damage.DieNumber]
[h,if(json.get(damage.ThisInstance,"BonusCritDice")!=""): damage.CritDieNumber = damage.CritDieNumber + json.get(damage.ThisInstance,"BonusCritDice")]

[h,count(damage.DieNumber): damage.AllDice = json.append(damage.AllDice,damage.DieSize)]
[h,if(damage.DieNumber==0):
	damage.Rules = "";
	damage.Rules = damage.DieNumber+"d"+damage.DieSize
]

[h,count(damage.CritDieNumber): damage.AllCritDice = json.append(damage.AllCritDice,damage.DieSize)]
[h,if(damage.CritDieNumber==0): 
	damage.CritRules = "";
	damage.CritRules = damage.CritDieNumber+"d"+damage.DieSize
]

[h:damage.FlatBonus = number(json.get(damage.ThisInstance,"DamageFlatBonus"))]
[h:damage.IsModBonus = number(json.get(damage.ThisInstance,"IsModBonus"))]

[h,if(json.contains(damage.ThisInstance,"AHLFlatBonus")): damage.FlatBonus = damage.FlatBonus + (damage.Scaling * json.get(damage.ThisInstance,"AHLFlatBonus"))]

[h:damage.PrimeStat = json.get(damage.NonDamageData,"PrimeStat")]
[h,if(damage.IsModBonus):
    damage.FlatBonusRules = substring(damage.PrimeStat,0,3);
    damage.FlatBonusRules = ""
]
[h,if(damage.FlatBonus!=0): listAppend(damage.FlatBonusRules,damage.FlatBonus," + ")]

[h,if(damage.IsModBonus),CODE:{
    [h:damage.PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),damage.PrimeStat)]
    [h:damage.PrimeStatBonus = damage.PrimeStatMod]
};{
    [h:damage.PrimeStatMod = 0]
    [h:damage.PrimeStatBonus = 0]
}]
[h:damage.FlatBonusTotal = damage.PrimeStatBonus + damage.FlatBonus]

[h:damage.PriorPercentBonus = 0]
[h:damage.PriorCritPercentBonus = 0]
[h,if(json.contains(damage.ThisInstance,"PriorDamagePercent")),CODE:{
	[h:getPriorDamageData = json.set("","Main","Damage")]

	[h:damage.PriorDamageData = pm.a5e.GetEffectComponent(pm.a5e.EffectData,getPriorDamageData,ParentSubeffectNum)]
	[h:damage.PriorDamage = json.get(damage.PriorDamageData,"Total")]
	[h:damage.ParentCritDamage = json.get(damage.PriorDamageData,"CritTotal")]

	[h:damage.PriorPercent = number(json.get(damage.ThisInstance,"PriorDamagePercent"))]

	[h:damage.PriorPercentBonus = floor(damage.PriorPercent * damage.PriorDamage)]
	[h:damage.PriorCritPercentBonus = floor(damage.PriorPercent * damage.ParentCritDamage)]

	[h,switch(damage.PriorPercent):
		case 1: damage.PriorPercentRules = "Prior Damage";
		case 0: damage.PriorPercentRules = "";
		case "0.5": damage.PriorPercentRules = "Half of Prior Damage";
		case "0.25": damage.PriorPercentRules = "Quarter of Prior Damage";
		default: damage.PriorPercentRules = (damage.PriorPercent * 100)+"% of Prior Damage"
	]
};{
	[h:damage.PriorPercentRules = ""]
}]

[h:damage.AddedRolledRules = ""]
[h:damage.AddedFlatBonusRules = ""]
[h:damage.AddedRolledDice = "[]"]
[h:damage.AddedFlatBonus = "[]"]

[h,foreach(tempPrefix,damage.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Damage")]
    [h,if(json.get(damage.NonDamageData,"Target")!=""): pm.PassiveFunction(tempPrefix+"DamageTargeted",json.set("","ParentToken",json.get(damage.NonDamageData,"Target")))]
}]

[h:damage.RulesFinal = damage.Rules + damage.AddedRolledRules + if(damage.FlatBonusRules=="",""," + "+damage.FlatBonusRules) + damage.AddedFlatBonusRules + if(damage.PriorPercentRules=="",""," + "+damage.PriorPercentRules)]
[h:damage.CritRulesFinal = damage.Rules+" + "+damage.CritRules + damage.AddedRolledRules + damage.AddedRolledRules+if(damage.FlatBonusRules=="",""," + "+damage.FlatBonusRules) + damage.AddedFlatBonusRules + if(damage.PriorPercentRules=="",""," + "+damage.PriorPercentRules)]

[h:damage.FinalDice = json.merge(damage.AllDice,damage.AddedRolledDice)]
[h:damage.Array = "[]"]
[h,foreach(die,damage.FinalDice),CODE:{
	[h,if(die > 0):
		damage.Array = json.append(damage.Array,eval("1d"+die));
		damage.Array = json.append(damage.Array,-eval("1d"+abs(die)))
	]
}]
[h,if(json.isEmpty(damage.AddedFlatBonus)):
    damage.TotalAddedFlatBonus = damage.FlatBonusTotal;
    damage.TotalAddedFlatBonus = math.arraySum(damage.AddedFlatBonus) + damage.FlatBonusTotal
]

[h,if(json.isEmpty(damage.Array)):
    damage.Total = damage.TotalAddedFlatBonus;
    damage.Total = math.arraySum(damage.Array) + damage.TotalAddedFlatBonus
]
[h:damage.FlatDisplay = pm.PlusMinus(damage.PrimeStatBonus,damage.IsModBonus)+pm.PlusMinus(damage.FlatBonus,0)+if(json.isEmpty(damage.AddedFlatBonus),""," + "+json.toList(damage.AddedFlatBonus," + "))+pm.PlusMinus(damage.PriorPercentBonus,0)]
[h:damage.RollDisplay = json.toList(damage.Array," + ")+damage.FlatDisplay]
[h,if(json.isEmpty(damage.FinalDice)):
    damage.Max = damage.TotalAddedFlatBonus;
    damage.Max = math.arraySum(damage.FinalDice) + damage.TotalAddedFlatBonus
]

[h:damage.Total = damage.Total + damage.PriorPercentBonus]

[h:"<!-- TODO: Temporarily separate out addedRolledDice and regular rolled dice array so the order can be natty dice, natty crit dice, added dice, added crit dice in the array -->"]
[h:damage.FinalCritDice = json.merge(damage.AllCritDice,damage.AddedRolledDice)]
[h:damage.CritArray = "[]"]
[h,foreach(die,damage.FinalCritDice),CODE:{
	[h,if(die > 0):
		damage.CritArray = json.append(damage.CritArray,eval("1d"+die));
		damage.CritArray = json.append(damage.CritArray,-eval("1d"+abs(die)))
	]
}]
[h,if(json.isEmpty(damage.CritArray)):
    damage.CritTotal = damage.Total;
    damage.CritTotal = math.arraySum(damage.CritArray) + damage.Total
]
[h:damage.CritRollDisplay = json.toList(damage.Array," + ")+" + "+json.toList(damage.CritArray," + ")+damage.FlatDisplay]
[h,if(json.isEmpty(damage.FinalCritDice)):
    damage.CritMax = damage.Max;
    damage.CritMax = math.arraySum(damage.FinalCritDice) + damage.Max
]

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