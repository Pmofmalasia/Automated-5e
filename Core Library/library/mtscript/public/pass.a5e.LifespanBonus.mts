[h:PassiveFeatureData = arg(0)]
[h:passLifespanBonus = arg(1)]

[h,if(json.contains(passLifespanBonus,"SetFinal")): setLifespan = max(setLifespan,json.get(passLifespanBonus,"SetFinal"))]

[h,if(json.contains(passLifespanBonus,"Multiplier")): multiplierLifespan = multiplierLifespan + json.get(passLifespanBonus,"Multiplier")]

[h,if(json.contains(passLifespanBonus,"SetOverrideFinal")): setOverrideLifespan = if(setOverrideLifespan == -1,json.get(passLifespanBonus,"SetOverrideFinal"),min(setOverrideLifespan,json.get(passLifespanBonus,"SetOverrideFinal")))]

[h,if(json.contains(passLifespanBonus,"Bonus")),CODE:{
	[h:passThisBonus = json.get(passLifespanBonus,"Bonus")]
	[h,if(!isNumber(passThisBonus)): passThisBonus = json.get(getProperty("a5e.stat.AtrMods"),passThisBonus)]
	[h:bonusLifespan = bonusLifespan + passThisBonus]
}]