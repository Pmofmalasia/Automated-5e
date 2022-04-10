[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:IsTooltip = 0]

[h:baseMaxHP = RolledMaxHP+(json.get(AtrMods,"Constitution")*Level)-HPDrain]
[h:bonusMaxHP = 0]
[h:setMaxHP = 0]
[h:setOverrideMaxHP = -1]

[h:"<!-- Temporary magic item calculation for current, old magic items -->"]
[h:setMaxHP = json.get(MagicItemStats,"sMaxHP"))]
[h:setOverrideMaxHP = json.get(MagicItemStats,"soMaxHP")]
[h:bonusMaxHP = json.get(MagicItemStats,"bMaxHP")]

[h:pm.PassiveFunction("MaxHP")]

[h:maxHPFinal = baseMaxHP + bonusMaxHP]
[h:maxHPFinal = max(setMaxHP,maxHPFinal)]
[h,if(setOverrideMaxHP!=-1): maxHPFinal = setOverrideMaxHP]

[h:macro.return = maxHPFinal]