[h:PassiveFeatureData = arg(0)]
[h:passACBonus = arg(1)]

[h,if(json.contains(passACBonus,"SetFinal")): setFinalAC = max(setFinalAC,json.get(passACBonus,"SetFinal"))]

[h,if(json.contains(passACBonus,"SetBase")): setBaseAC = max(setBaseAC,json.get(passACBonus,"SetBase"))]

[h,if(json.contains(passACBonus,"SetOverrideFinal")): setOverrideFinalAC = if(setOverrideFinalAC == -1,json.get(passACBonus,"SetOverrideFinal"),min(setOverrideFinalAC,json.get(passACBonus,"SetOverrideFinal")))]

[h,if(json.contains(passACBonus,"Bonus")),CODE:{
	[h:passThisBonus = json.get(passACBonus,"Bonus")]
	[h,if(!isNumber(passThisBonus)): passThisBonus = json.get(getProperty("a5e.stat.AtrMods"),passThisBonus)]
	[h:bonusAC = bonusAC + passThisBonus]
}]