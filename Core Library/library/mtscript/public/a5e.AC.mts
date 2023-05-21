[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]
[h:EquippedArmorID = getProperty("a5e.stat.EquippedArmor")]
[h,if(EquippedArmorID == ""):
	tempEquippedArmorData = "[]";
	tempEquippedArmorData = json.path.read(CurrentInventory,"[*][?(@.ItemID == "+EquippedArmorID+")]")
]
[h,if(json.isEmpty(tempEquippedArmorData)):
	EquippedArmorData = getProperty("a5e.stat.NaturalArmor");
	EquippedArmorData = json.get(tempEquippedArmorData,0)
]

[h:baseAC = json.get(EquippedArmorData,"BaseAC")]
[h:isDexterityBonus = json.get(EquippedArmorData,"isDexterityBonus")]
[h:isDexterityCap = json.get(EquippedArmorData,"isDexterityCap")]
[h:DexterityCap = json.get(EquippedArmorData,"DexterityCap")]
[h:bonusAC = json.get(EquippedArmorData,"MagicBonus")]

[h:MaximumShieldNumber = 1]
[h:shieldAC = 0]
[h:ShieldsEquipped = json.path.read(CurrentInventory,"[*][?(@.Type == 'Shield' && @.ItemID in "+CurrentHeldItems+")]")]
[h,foreach(tempShield,ShieldsEquipped): shieldAC = max(shieldAC,json.get(tempShield,"BaseAC"))]
[h:"<!-- TODO: Add support for multiple shields -->"]

[h:setFinalAC = 0]
[h:setBaseAC = 0]
[h:setOverrideFinalAC = -1]

[h:pm.PassiveFunction("AC")]

[h,if(isDexterityBonus),CODE:{
	[h,if(isDexterityCap):
		dexBonus = min(DexterityCap,json.get(getProperty("a5e.stat.AtrMods"),"Dexterity"));
		dexBonus = json.get(getProperty("a5e.stat.AtrMods"),"Dexterity")
	]
};{
	[h:dexBonus = 0]	
}]
[h:baseACFinal = max(baseAC,setBaseAC)]

[h:ACFinal = baseACFinal + dexBonus + bonusAC + shieldAC]
[h:ACFinal = max(ACFinal,setFinalAC)]
[h,if(setOverrideFinalAC!=-1): ACFinal = setOverrideFinalAC]

[h:macro.return = ACFinal]