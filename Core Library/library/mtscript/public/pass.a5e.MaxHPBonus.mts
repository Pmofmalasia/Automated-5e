[h:PassiveFeatureData = arg(0)]
[h:passMaxHPBonus = arg(1)]

[h,if(json.contains(passMaxHPBonus,"SetFinal")): setMaxHP = max(setMaxHP,json.get(passMaxHPBonus,"SetFinal"))]

[h,if(json.contains(passMaxHPBonus,"Multiplier")): multiplierMaxHP = multiplierMaxHP + json.get(passMaxHPBonus,"Multiplier")]

[h,if(json.contains(passMaxHPBonus,"SetOverrideFinal")): setOverrideMaxHP = if(setOverrideMaxHP == -1,json.get(passMaxHPBonus,"SetOverrideFinal"),min(setOverrideMaxHP,json.get(passMaxHPBonus,"SetOverrideFinal")))]

[h,if(json.contains(passMaxHPBonus,"Bonus")),CODE:{
	[h:passThisBonus = json.get(passMaxHPBonus,"Bonus")]
	[h,if(!isNumber(passThisBonus)): passThisBonus = json.get(getProperty("a5e.stat.AtrMods"),passThisBonus)]
	[h:bonusMaxHP = bonusMaxHP + passThisBonus]
}]