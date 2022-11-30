[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:setProperty("a5e.stat.BaseMaxHP",getProperty("a5e.stat.RolledMaxHP")+(json.get(getProperty("a5e.stat.AtrMods"),"Constitution")*getProperty("a5e.stat.Level"))-getProperty("a5e.stat.HPDrain"))]
[h:bonusMaxHP = 0]
[h:multiplierMaxHP = 1]
[h:setMaxHP = 0]
[h:setOverrideMaxHP = -1]

[h:"<!-- Temporary magic item calculation for current, old magic items -->"]
[h:setMaxHP = json.get(MagicItemStats,"sMaxHP")]
[h:setOverrideMaxHP = json.get(MagicItemStats,"soMaxHP")]
[h:bonusMaxHP = json.get(MagicItemStats,"bMaxHP")]

[h:pm.PassiveFunction("MaxHP")]

[h:maxHPFinal = (getProperty("a5e.stat.BaseMaxHP") + bonusMaxHP) * multiplierMaxHP]
[h:maxHPFinal = max(setMaxHP,maxHPFinal)]
[h,if(setOverrideMaxHP!=-1): maxHPFinal = setOverrideMaxHP]

[h:macro.return = maxHPFinal]