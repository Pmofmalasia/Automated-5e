[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note to self: should just do all movement types here, so that calculations for one movement type based on another do not need to be done multiple times on the character sheet -->"]
[h:"<!-- Additional Note to self: The multipliers are 0 to be able to account for fractions later. -->"]

[h:speedBase = getProperty("a5e.stat.BaseSpeed")]
[h:speedBonus = 0]
[h:speedSet = 0]
[h:speedMultiplier = 0]
[h:speedSetOverride = -1]

[h:burrowEqualsWalking = 0]
[h:burrowBase = getProperty("a5e.stat.BaseBurrowSpeed")]
[h:burrowSet = 0]
[h:burrowBonus = 0]
[h:burrowMultiplier = 0]
[h:burrowSetOverride = -1]

[h:climbEqualsWalking = 0]
[h:climbBase = getProperty("a5e.stat.BaseClimbSpeed")]
[h:climbSet = 0]
[h:climbBonus = 0]
[h:climbMultiplier = 0]
[h:climbSetOverride = -1]

[h:flyEqualsWalking = 0]
[h:flyBase = getProperty("a5e.stat.BaseFlySpeed")]
[h:flySet = 0]
[h:flyBonus = 0]
[h:flyMultiplier = 0]
[h:flySetOverride = -1]
[h:IsHover = 0]

[h:swimEqualsWalking = 0]
[h:swimBase = getProperty("a5e.stat.BaseSwimSpeed")]
[h:swimSet = 0]
[h:swimBonus = 0]
[h:swimMultiplier = 0]
[h:swimSetOverride = -1]

[h:"<!-- Temporary magic item calculation for current, old magic items -->"]
[h:speedBonus = json.get(MagicItemStats,"iSpeedBonus")]
[h:speedMultiplier = json.get(MagicItemStats,"iSpeedMultiplier")]
[h:speedSet = json.get(MagicItemStats,"iSpeedSet")]
[h:speedSetOverride = json.get(MagicItemStats,"iSpeedSetOverride")]

[h:burrowEqualsWalking = json.get(MagicItemStats,"iIsBurrow")]
[h:burrowBonus = json.get(MagicItemStats,"iBurrowBonus")]
[h:burrowMultiplier = json.get(MagicItemStats,"iBurrowMultiplier")]
[h:burrowSet = json.get(MagicItemStats,"iBurrowSet")]
[h:burrowSetOverride = json.get(MagicItemStats,"iBurrowSetOverride")]

[h:climbEqualsWalking = json.get(MagicItemStats,"iIsClimb")]
[h:climbBonus = json.get(MagicItemStats,"iClimbBonus")]
[h:climbMultiplier = json.get(MagicItemStats,"iClimbMultiplier")]
[h:climbSet = json.get(MagicItemStats,"iClimbSet")]
[h:climbSetOverride = json.get(MagicItemStats,"iClimbSetOverride")]

[h:flyEqualsWalking = json.get(MagicItemStats,"iIsFly")]
[h:flyBonus = json.get(MagicItemStats,"iFlyBonus")]
[h:flyMultiplier = json.get(MagicItemStats,"iFlyMultiplier")]
[h:flySet = json.get(MagicItemStats,"iFlySet")]
[h:flySetOverride = json.get(MagicItemStats,"iFlySetOverride")]
[h:IsHover = json.get(MagicItemStats,"iIsHover")]

[h:swimEqualsWalking = json.get(MagicItemStats,"iIsSwim")]
[h:swimBonus = json.get(MagicItemStats,"iSwimBonus")]
[h:swimMultiplier = json.get(MagicItemStats,"iSwimMultiplier")]
[h:swimSet = json.get(MagicItemStats,"iSwimSet")]
[h:swimSetOverride = json.get(MagicItemStats,"iSwimSetOverride")]

[h:pm.PassiveFunction("Speed")]

[h,if(speedSetOverride!=-1),CODE:{
	[h:SpeedFinal = speedSetOverride]
};{
	[h,if(speedMultiplier < 0): speedMultiplier = (1/(abs(speedMultiplier)+1)); speedMultiplier = speedMultiplier+1]
	[h:SpeedFinal = (speedBase + speedBonus) * speedMultiplier]
	[h:SpeedFinal = max(speedSet,SpeedFinal)]
}]

[h,if(burrowSetOverride!=-1),CODE:{
	[h:BurrowFinal = burrowSetOverride]
};{
	[h,if(burrowMultiplier < 0): burrowMultiplier = (1/(abs(burrowMultiplier)+1)); burrowMultiplier = burrowMultiplier+1]
	[h:BurrowFinal = max(burrowBase,(burrowEqualsWalking*SpeedFinal))]
	[h:BurrowFinal = (BurrowFinal + burrowBonus) * burrowMultiplier]
	[h:BurrowFinal = max(burrowSet,BurrowFinal)]
}]

[h,if(climbSetOverride!=-1),CODE:{
	[h:ClimbFinal = climbSetOverride]
};{
	[h,if(climbMultiplier < 0): climbMultiplier = (1/(abs(climbMultiplier)+1)); climbMultiplier = climbMultiplier+1]
	[h:ClimbFinal = max(climbBase,(climbEqualsWalking*SpeedFinal))]
	[h:ClimbFinal = (ClimbFinal + climbBonus) * climbMultiplier]
	[h:ClimbFinal = max(climbSet,ClimbFinal)]
}]

[h,if(flySetOverride!=-1),CODE:{
	[h:FlyFinal = flySetOverride]
};{
	[h,if(flyMultiplier < 0): flyMultiplier = (1/(abs(flyMultiplier)+1)); flyMultiplier = flyMultiplier+1]
	[h:FlyFinal = max(flyBase,(flyEqualsWalking*SpeedFinal))]
	[h:FlyFinal = (FlyFinal + flyBonus) * flyMultiplier]
	[h:FlyFinal = max(flySet,FlyFinal)]
}]

[h,if(swimSetOverride!=-1),CODE:{
	[h:SwimFinal = swimSetOverride]
};{
	[h,if(swimMultiplier < 0): swimMultiplier = (1/(abs(swimMultiplier)+1)); swimMultiplier = swimMultiplier+1]
	[h:SwimFinal = max(swimBase,(swimEqualsWalking*SpeedFinal))]
	[h:SwimFinal = (SwimFinal + swimBonus) * swimMultiplier]
	[h:SwimFinal = max(swimSet,SwimFinal)]
}]

[h:macro.return = json.set("","Walking",SpeedFinal,"Burrow",BurrowFinal,"Climb",ClimbFinal,"Fly",FlyFinal,"Swim",SwimFinal,"Hover",IsHover)]