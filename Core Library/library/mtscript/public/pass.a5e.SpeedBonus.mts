[h:PassiveFeatureData = arg(0)]
[h:passSpeedData = arg(1)]

[h,if(json.contains(passSpeedData,"All")),CODE:{
	[h:passAllTypesData = json.get(passSpeedData,"All")]

	[h:additionalSpeedData = json.get(passSpeedData,"Speed")]
	[h:additionalBurrowData = json.get(passSpeedData,"Burrow")]
	[h:additionalClimbData = json.get(passSpeedData,"Climb")]
	[h:additionalFlyData = json.get(passSpeedData,"Fly")]
	[h:additionalSwimData = json.get(passSpeedData,"Swim")]

	[h,if(additionalSpeedData == ""): additionalSpeedData = "{}"]
	[h,if(additionalBurrowData == ""): additionalBurrowData = "{}"]
	[h,if(additionalClimbData == ""): additionalClimbData = "{}"]
	[h,if(additionalFlyData == ""): additionalFlyData = "{}"]
	[h,if(additionalSwimData == ""): additionalSwimData = "{}"]

	[h:"<!-- Note: This order prefers keeping the specific bonus (e.g only to burrowing) over the general bonus (from the All key) -->"]
	[h:newSpeedData = json.merge(passAllTypesData,additionalSpeedData)]
	[h:newBurrowData = json.merge(passAllTypesData,additionalBurrowData)]
	[h:newClimbData = json.merge(passAllTypesData,additionalClimbData)]
	[h:newFlyData = json.merge(passAllTypesData,additionalFlyData)]
	[h:newSwimData = json.merge(passAllTypesData,additionalSwimData)]

	[h:passSpeedData = json.set(passSpeedData,
		"Speed",newSpeedData,
		"Burrow",newBurrowData,
		"Climb",newClimbData,
		"Fly",newFlyData,
		"Swim",newSwimData
	)]
};{}]

[h,if(json.contains(passSpeedData,"Speed")),CODE:{
	[h:passWalkingSpeedData = json.get(passSpeedData,"Speed")]

	[h,if(json.contains(passWalkingSpeedData,"Base")): speedBase = max(speedBase,json.get(passWalkingSpeedData,"Base"))]
	[h,if(json.contains(passWalkingSpeedData,"Bonus")): speedBonus = speedBonus + json.get(passWalkingSpeedData,"Bonus")]
	[h,if(json.contains(passWalkingSpeedData,"Set")): speedSet = max(speedSet,json.get(passWalkingSpeedData,"Set"))]
	[h,if(json.contains(passWalkingSpeedData,"SetOverride")): speedSetOverride = if(speedSetOverride == -1,json.get(passWalkingSpeedData,"SetOverride"),min(speedSetOverride,json.get(passWalkingSpeedData,"SetOverride")))]
	[h,if(json.contains(passWalkingSpeedData,"Multiplier")): speedMultiplier = speedMultiplier + json.get(passWalkingSpeedData,"Multiplier")]
};{}]

[h,if(json.contains(passSpeedData,"Burrow")),CODE:{
	[h:passBurrowData = json.get(passSpeedData,"Burrow")]

	[h,if(json.contains(passBurrowData,"Base")): burrowBase = max(burrowBase,json.get(passBurrowData,"Base"))]
	[h,if(json.contains(passBurrowData,"EqualsWalking")): burrowEqualsWalking = max(burrowEqualsWalking,json.get(passBurrowData,"EqualsWalking"))]
	[h,if(json.contains(passBurrowData,"Bonus")): burrowBonus = burrowBonus + json.get(passBurrowData,"Bonus")]
	[h,if(json.contains(passBurrowData,"Set")): burrowSet = max(burrowSet,json.get(passBurrowData,"Set"))]
	[h,if(json.contains(passBurrowData,"SetOverride")): burrowSetOverride = if(burrowSetOverride == -1,json.get(passBurrowData,"SetOverride"),min(burrowSetOverride,json.get(passBurrowData,"SetOverride")))]
	[h,if(json.contains(passBurrowData,"Multiplier")): burrowMultiplier = burrowMultiplier + json.get(passBurrowData,"Multiplier")]
};{}]

[h,if(json.contains(passSpeedData,"Climb")),CODE:{
	[h:passClimbData = json.get(passSpeedData,"Climb")]

	[h,if(json.contains(passClimbData,"Base")): climbBase = max(climbBase,json.get(passClimbData,"Base"))]
	[h,if(json.contains(passClimbData,"EqualsWalking")): climbEqualsWalking = max(climbEqualsWalking,json.get(passClimbData,"EqualsWalking"))]
	[h,if(json.contains(passClimbData,"Bonus")): climbBonus = climbBonus + json.get(passClimbData,"Bonus")]
	[h,if(json.contains(passClimbData,"Set")): climbSet = max(climbSet,json.get(passClimbData,"Set"))]
	[h,if(json.contains(passClimbData,"SetOverride")): climbSetOverride = if(climbSetOverride == -1,json.get(passClimbData,"SetOverride"),min(climbSetOverride,json.get(passClimbData,"SetOverride")))]
	[h,if(json.contains(passClimbData,"Multiplier")): climbMultiplier = climbMultiplier + json.get(passClimbData,"Multiplier")]
};{}]

[h,if(json.contains(passSpeedData,"Fly")),CODE:{
	[h:passFlyData = json.get(passSpeedData,"Fly")]

	[h,if(json.contains(passFlyData,"Base")): flyBase = max(flyBase,json.get(passFlyData,"Base"))]
	[h,if(json.contains(passFlyData,"EqualsWalking")): flyEqualsWalking = max(flyEqualsWalking,json.get(passFlyData,"EqualsWalking"))]
	[h,if(json.contains(passFlyData,"Bonus")): flyBonus = flyBonus + json.get(passFlyData,"Bonus")]
	[h,if(json.contains(passFlyData,"Set")): flySet = max(flySet,json.get(passFlyData,"Set"))]
	[h,if(json.contains(passFlyData,"SetOverride")): flySetOverride = if(flySetOverride == -1,json.get(passFlyData,"SetOverride"),min(flySetOverride,json.get(passFlyData,"SetOverride")))]
	[h,if(json.contains(passFlyData,"Multiplier")): flyMultiplier = flyMultiplier + json.get(passFlyData,"Multiplier")]

	[h,if(json.contains(passFlyData,"Hover")): IsHover = max(IsHover,json.get(passFlyData,"Hover"))]
};{}]

[h,if(json.contains(passSpeedData,"Swim")),CODE:{
	[h:passSwimData = json.get(passSpeedData,"Swim")]

	[h,if(json.contains(passSwimData,"Base")): swimBase = max(swimBase,json.get(passSwimData,"Base"))]
	[h,if(json.contains(passSwimData,"EqualsWalking")): swimEqualsWalking = max(swimEqualsWalking,json.get(passSwimData,"EqualsWalking"))]
	[h,if(json.contains(passSwimData,"Bonus")): swimBonus = swimBonus + json.get(passSwimData,"Bonus")]
	[h,if(json.contains(passSwimData,"Set")): swimSet = max(swimSet,json.get(passSwimData,"Set"))]
	[h,if(json.contains(passSwimData,"SetOverride")): swimSetOverride = if(swimSetOverride == -1,json.get(passSwimData,"SetOverride"),min(swimSetOverride,json.get(passSwimData,"SetOverride")))]
	[h,if(json.contains(passSwimData,"Multiplier")): swimMultiplier = swimMultiplier + json.get(passSwimData,"Multiplier")]
};{}]