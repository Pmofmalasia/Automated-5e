[h:ParentToken = arg(0)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:VisionTypeBonuses = "[]"]

[h:pm.PassiveFunction("Vision")]

[h:ValidVisionTypes = "{}"]
[h,foreach(bonus,VisionTypeBonuses),CODE:{
	[h:thisVisionTypeName = json.get(bonus,"Name")]
	[h:currentVisionType = json.get(ValidVisionTypes,thisVisionTypeName)]
	[h,if(currentVisionType == ""),CODE:{
		[h:currentVisionType = json.remove(bonus,"Name")]
	};{
		[h:currentBase = json.get(currentVisionType,"Base")]
		[h:currentBonus = json.get(currentVisionType,"Bonus")]
		[h:currentSet = json.get(currentVisionType,"Set")]
		[h:currentSetOverride = json.get(currentVisionType,"SetOverride")]
		[h:currentMultiplier = json.get(currentVisionType,"Multiplier")]

		[h:newBase = json.get(bonus,"Base")]
		[h:newBonus = json.get(bonus,"Bonus")]
		[h:newSet = json.get(bonus,"Set")]
		[h:newSetOverride = json.get(bonus,"SetOverride")]
		[h:newMultiplier = json.get(bonus,"Multiplier")]

		[h,if(json.contains(bonus,"Unlimited")): currentVisionType = json.set(currentVisionType,"Unlimited",1)]
		[h,if(currentBase != "" && newBase != ""):
			currentVisionType = json.set(currentVisionType,"Base",max(newBase,currentBase));
			currentVisionType = if(currentBase == "",json.set(currentVisionType,"Base",newBase),currentVisionType)
		]
		[h,if(currentBonus != "" && newBonus != ""):
			currentVisionType = json.set(currentVisionType,"Bonus",newBonus + currentBonus);
			currentVisionType = if(currentBonus == "",json.set(currentVisionType,"Bonus",newBonus),currentVisionType)
		]
		[h,if(currentSet != "" && newSet != ""):
			currentVisionType = json.set(currentVisionType,"Set",max(newSet,currentSet));
			currentVisionType = if(currentSet == "",json.set(currentVisionType,"Set",newSet),currentVisionType)
		]
		[h,if(currentSetOverride != "" && newSetOverride != ""):
			currentVisionType = json.set(currentVisionType,"SetOverride",min(newSetOverride,currentSetOverride));
			currentVisionType = if(currentSetOverride == "",json.set(currentVisionType,"SetOverride",newSetOverride),currentVisionType)
		]
		[h,if(currentMultiplier != "" && newMultiplier != ""):
			currentVisionType = json.set(currentVisionType,"Multiplier",newMultiplier + currentMultiplier);
			currentVisionType = if(currentMultiplier == "",json.set(currentVisionType,"Multiplier",newMultiplier),currentVisionType)
		]
	}]

	[h:ValidVisionTypes = json.set(ValidVisionTypes,thisVisionTypeName,currentVisionType)]
}]

[h:"<!-- TODO: Add an 'in' for things to nullify vision types, e.g. blindness nullifying anything affected by it -->"]

[h:FinalVisionTypes = "{}"]
[h:VisionTypeNames = json.fields(ValidVisionTypes,"json")]
[h,foreach(visionType,VisionTypeNames),CODE:{
	[h:thisVisionTypeData = json.get(ValidVisionTypes,visionType)]
	[h,if(json.get(thisVisionTypeData,"Unlimited") == 1),CODE:{
		[h:FinalVisionTypes = json.set(FinalVisionTypes,visionType,json.set("","Unlimited",1))]
	};{
		[h:BaseVisionDistance = number(json.get(thisVisionTypeData,"Base"))]
		[h:BonusVisionDistance = number(json.get(thisVisionTypeData,"Bonus"))]
		[h:SetVisionDistance = number(json.get(thisVisionTypeData,"Set"))]
		[h:SetOverrideVisionDistance = json.get(thisVisionTypeData,"SetOverride")]
		[h:MultiplierVisionDistance = 1 + number(json.get(thisVisionTypeData,"Multiplier"))]

		[h:TotalVisionDistance = max(SetVisionDistance,(BaseVisionDistance + BonusVisionDistance) * MultiplierVisionDistance)]
		[h,if(SetOverrideVisionDistance != ""):
			FinalVisionDistance = min(SetOverrideVisionDistance,TotalVisionDistance);
			FinalVisionDistance = TotalVisionDistance
		]

		[h:FinalVisionTypes = json.set(FinalVisionTypes,visionType,json.set("","Value",FinalVisionDistance))]
	}]
}]

[h:return(0,FinalVisionTypes)]