[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note to self: The multipliers are 0 to be able to account for fractions later. -->"]

[h:ArmorTooHeavyTest = 0]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]
[h:EquippedArmorID = getProperty("a5e.stat.EquippedArmor")]
[h,if(EquippedArmorID == ""):
	tempEquippedArmorData = "[]";
	tempEquippedArmorData = json.path.read(CurrentInventory,"[*][?(@.ItemID == '"+EquippedArmorID+"')]")
]
[h,if(json.isEmpty(tempEquippedArmorData)):
	EquippedArmorData = "{}";
	EquippedArmorData = json.get(tempEquippedArmorData,0)
]
[h,if(json.get(EquippedArmorData,"StrengthRequirement")!=0 && json.get(EquippedArmorData,"StrengthRequirement")!=""),CODE:{
	[h:ArmorStrengthReq = json.get(EquippedArmorData,"StrengthRequirement")]
	[h:CurrentStrength = json.get(getProperty("a5e.stat.Attributes"),"Strength")]
	[h:ArmorTooHeavyTest = ArmorStrengthReq > CurrentStrength]
};{}]

[h:speedBase = getProperty("a5e.stat.BaseSpeed")]
[h:speedBonus = 0]
[h:speedSet = 0]
[h:speedMultiplier = 0]
[h:speedSetOverride = -1]

[h:burrowEqualsWalking = 0]
[h:burrowBase = getProperty("a5e.stat.BaseBurrowSpeed")]
[h:burrowBonus = 0]
[h:burrowSet = 0]
[h:burrowMultiplier = 0]
[h:burrowSetOverride = -1]

[h:climbEqualsWalking = 0]
[h:climbBase = getProperty("a5e.stat.BaseClimbSpeed")]
[h:climbBonus = 0]
[h:climbSet = 0]
[h:climbMultiplier = 0]
[h:climbSetOverride = -1]

[h:flyEqualsWalking = 0]
[h:flyBase = getProperty("a5e.stat.BaseFlySpeed")]
[h:flyBonus = 0]
[h:flySet = 0]
[h:flyMultiplier = 0]
[h:flySetOverride = -1]
[h:IsHover = 0]

[h:swimEqualsWalking = 0]
[h:swimBase = getProperty("a5e.stat.BaseSwimSpeed")]
[h:swimBonus = 0]
[h:swimSet = 0]
[h:swimMultiplier = 0]
[h:swimSetOverride = -1]

[h:pm.PassiveFunction("Speed")]

[h,if(ArmorTooHeavyTest),CODE:{
	[h:speedBonus = speedBonus - 10]
	[h:burrowBonus = burrowBonus - 10]
	[h:climbBonus = climbBonus - 10]
	[h:flyBonus = flyBonus - 10]
	[h:swimBonus = swimBonus - 10]
};{}]

[h,if(speedSetOverride!=-1),CODE:{
	[h:SpeedFinal = speedSetOverride]
};{
	[h,if(speedMultiplier < 0):
		speedMultiplier = (1/(abs(speedMultiplier)+1));
		speedMultiplier = speedMultiplier+1
	]
	[h:SpeedFinal = floor(speedBase + speedBonus) * speedMultiplier]
	[h:SpeedFinal = max(speedSet,SpeedFinal)]
}]

[h,if(burrowSetOverride!=-1),CODE:{
	[h:BurrowFinal = burrowSetOverride]
};{
	[h,if(burrowMultiplier < 0): burrowMultiplier = (1/(abs(burrowMultiplier)+1)); burrowMultiplier = burrowMultiplier+1]
	[h:BurrowFinal = max(burrowBase,(burrowEqualsWalking*SpeedFinal))]
	[h:BurrowFinal = floor(BurrowFinal + burrowBonus) * burrowMultiplier]
	[h:BurrowFinal = max(burrowSet,BurrowFinal)]
}]

[h,if(climbSetOverride!=-1),CODE:{
	[h:ClimbFinal = climbSetOverride]
};{
	[h,if(climbMultiplier < 0): climbMultiplier = (1/(abs(climbMultiplier)+1)); climbMultiplier = climbMultiplier+1]
	[h:ClimbFinal = max(climbBase,(climbEqualsWalking*SpeedFinal))]
	[h:ClimbFinal = floor(ClimbFinal + climbBonus) * climbMultiplier]
	[h:ClimbFinal = max(climbSet,ClimbFinal)]
}]

[h,if(flySetOverride!=-1),CODE:{
	[h:FlyFinal = flySetOverride]
};{
	[h,if(flyMultiplier < 0): flyMultiplier = (1/(abs(flyMultiplier)+1)); flyMultiplier = flyMultiplier+1]
	[h:FlyFinal = max(flyBase,(flyEqualsWalking*SpeedFinal))]
	[h:FlyFinal = floor(FlyFinal + flyBonus) * flyMultiplier]
	[h:FlyFinal = max(flySet,FlyFinal)]
}]

[h,if(swimSetOverride!=-1),CODE:{
	[h:SwimFinal = swimSetOverride]
};{
	[h,if(swimMultiplier < 0): swimMultiplier = (1/(abs(swimMultiplier)+1)); swimMultiplier = swimMultiplier+1]
	[h:SwimFinal = max(swimBase,(swimEqualsWalking*SpeedFinal))]
	[h:SwimFinal = floor(SwimFinal + swimBonus) * swimMultiplier]
	[h:SwimFinal = max(swimSet,SwimFinal)]
}]

[h:macro.return = json.set("","Walking",SpeedFinal,"Burrow",BurrowFinal,"Climb",ClimbFinal,"Fly",FlyFinal,"Swim",SwimFinal,"Hover",IsHover)]