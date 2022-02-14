[h:a5e.GatherAbilities()]
[h:IsTooltip = 0]

[h:"<!-- Note to self: should just do all movement types here, so that calculations for one movement type based on another do not need to be done multiple times on the character sheet -->"]

[h:speedBase = 0]
[h:speedBonus = 0]
[h:speedSet = 0]
[h:speedMultiplier = 1]
[h:speedSetOverride = -1]

[h:burrowEqualsWalking = 0]
[h:burrowBase = 0]
[h:burrowSet = 0]
[h:burrowBonus = 0]
[h:burrowMultiplier = 1]
[h:burrowSetOverride = -1]

[h:climbEqualsWalking = 0]
[h:climbBase = 0]
[h:climbSet = 0]
[h:climbBonus = 0]
[h:climbMultiplier = 1]
[h:climbSetOverride = -1]

[h:flyEqualsWalking = 0]
[h:flyBase = 0]
[h:flySet = 0]
[h:flyBonus = 0]
[h:flyMultiplier = 1]
[h:flySetOverride = -1]
[h:IsHover = 0]

[h:swimEqualsWalking = 0]
[h:swimBase = 0]
[h:swimSet = 0]
[h:swimBonus = 0]
[h:swimMultiplier = 1]
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
	[h:SpeedFinal = (speedBase + speedBonus) * speedMultiplier]
	[h:SpeedFinal = max(speedSet,SpeedFinal)]
}]

[h,if(burrowSetOverride!=-1),CODE:{
	[h:BurrowFinal = burrowSetOverride]
};{
	[h:BurrowFinal = max(burrowBase,(burrowEqualsWalking*SpeedFinal))]
	[h:BurrowFinal = (BurrowFinal + burrowBonus) * burrowMultiplier]
	[h:BurrowFinal = max(burrowSet,BurrowFinal)]
}]

[h,if(climbSetOverride!=-1),CODE:{
	[h:ClimbFinal = climbSetOverride]
};{
	[h:ClimbFinal = max(climbBase,(climbEqualsWalking*SpeedFinal))]
	[h:ClimbFinal = (ClimbFinal + climbBonus) * climbMultiplier]
	[h:ClimbFinal = max(climbSet,ClimbFinal)]
}]

[h,if(flySetOverride!=-1),CODE:{
	[h:FlyFinal = flySetOverride]
};{
	[h:FlyFinal = max(flyBase,(flyEqualsWalking*SpeedFinal))]
	[h:FlyFinal = (FlyFinal + flyBonus) * flyMultiplier]
	[h:FlyFinal = max(flySet,FlyFinal)]
}]

[h,if(swimSetOverride!=-1),CODE:{
	[h:SwimFinal = swimSetOverride]
};{
	[h:SwimFinal = max(swimBase,(swimEqualsWalking*SpeedFinal))]
	[h:SwimFinal = (SwimFinal + swimBonus) * swimMultiplier]
	[h:SwimFinal = max(swimSet,SwimFinal)]
}]

[h:macro.return = json.set("","Walking",SpeedFinal,"Burrow",BurrowFinal,"Climb",ClimbFinal,"Fly",FlyFinal,"Swim",SwimFinal,"Hover",IsHover)]