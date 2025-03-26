[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]

[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note: HD are used as a stand-in for level when determining the bonus from CON as NPCs use this method. Should be fine for PCs but might break if items that give bonuses to HD number are used. -->"]
[h:totalHD = 0]
[h:HDObject = getProperty("a5e.stat.MaxHitDice")]
[h,foreach(tempHDSize,json.fields(HDObject)): totalHD = totalHD + json.get(HDObject,tempHDSize)]

[h:baseMaxHP = getProperty("a5e.stat.RolledMaxHP")+(json.get(getProperty("a5e.stat.AtrMods"),"Constitution")*totalHD)]
[h:bonusMaxHP = 0]
[h:multiplierMaxHP = 1]
[h:setMaxHP = 0]
[h:setOverrideMaxHP = -1]

[h:pm.PassiveFunction("MaxHP")]

[h:maxHPFinal = (baseMaxHP + bonusMaxHP) * multiplierMaxHP]
[h:maxHPFinal = max(setMaxHP,maxHPFinal)]
[h,if(setOverrideMaxHP!=-1): maxHPFinal = setOverrideMaxHP]

[h:return(0,maxHPFinal)]