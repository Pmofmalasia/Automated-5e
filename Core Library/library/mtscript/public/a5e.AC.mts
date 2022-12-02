[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:baseAC = json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"BaseAC")]
[h:dexMax = json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"DexMax")]
[h:bonusAC = json.get(json.get(getProperty("a5e.stat.Armor"),json.get(getProperty("a5e.stat.Armor"),0)),"MagicBonus")]
[h:shieldAC = if(json.get(json.get(getProperty("a5e.stat.Shield"),json.get(getProperty("a5e.stat.Shield"),0)),"Name")=="None",0,2)+json.get(json.get(getProperty("a5e.stat.Shield"),json.get(getProperty("a5e.stat.Shield"),0)),"MagicBonus")]

[h:setFinalAC = 0]
[h:setBaseAC = 0]
[h:setOverrideFinalAC = -1]

[h:"<!-- Temporary magic item calculation for current, old magic items -->"]
[h:setFinalAC = json.get(MagicItemStats,"sAC")]
[h:setOverrideFinalAC = json.get(MagicItemStats,"soAC")]
[h:bonusAC = bonusAC + json.get(MagicItemStats,"bAC")]

[h:pm.PassiveFunction("AC")]

[h:dexBonus = if(dexMax == 0,0,min(dexMax,json.get(getProperty("a5e.stat.AtrMods"),"Dexterity")))]
[h:baseACFinal = max(baseAC,setBaseAC)]

[h:ACFinal = baseACFinal + dexBonus + bonusAC + shieldAC]
[h:ACFinal = max(ACFinal,setFinalAC)]
[h,if(setOverrideFinalAC!=-1): ACFinal = setOverrideFinalAC]

[h:macro.return = ACFinal]