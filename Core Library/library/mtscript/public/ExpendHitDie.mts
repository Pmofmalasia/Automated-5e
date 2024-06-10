[h:HitDiceData = macro.args]
[h:ParentToken = json.get(HitDiceData,"ParentToken")]
[h:SpentHitDice = json.get(HitDiceData,"SpentHitDice")]
[h:HitDiceBonus = json.get(HitDiceData,"Bonus")]
[h:PassiveInstanceSuffixes = json.append(json.get(HitDiceData,"PassiveInstanceSuffixes"),"")]
[h:switchToken(ParentToken)]

[h,if(json.get(HitDiceData,"UnifiedAbilities") == ""):
	a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken);
	a5e.UnifiedAbilities = json.get(HitDiceData,"UnifiedAbilities")
]
[h:pm.a5e.OverarchingContext = "Spell"]

[h,foreach(instance,PassiveInstanceSuffixes): pm.PassiveFunction("HitDieSpendPreRoll"+instance)]

[h:SpentHitDieSizes = json.fields(SpentHitDice)]
[h,foreach(size,SpentHitDieSizes),CODE:{
	[h:thisSizeSpent = json.get(SpentHitDice,size)]
	[h:HitDiceBonus = json.set(HitDiceBonus,"Modifier",thisSizeSpent)]
	[h:thisBonusInfo = pm.a5e.GetBonusValue(HitDiceBonus,ParentToken)]
	[h:HitDieRoll = pm.DieRoller(thisSizeSpent,size)]
}]
[h:HitDieRoll = pm.DieRoller()]

[h,foreach(instance,PassiveInstanceSuffixes): pm.PassiveFunction("HitDieSpendPostRoll"+instance)]