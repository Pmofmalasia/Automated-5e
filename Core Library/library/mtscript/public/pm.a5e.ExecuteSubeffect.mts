[h:SubeffectData = arg(0)]
[h:NonSubeffectData = arg(1)]
[h:SubeffectFunctionPrefixes = json.get(NonSubeffectData,"InstancePrefixes")]
[h:MultiEffectModifier = number(json.get(NonSubeffectData,"MultiEffectModifier"))]
[h:BaseEffectData = json.get(NonSubeffectData,"BaseData")]
[h:thisEffectData = "{}"]

[h,if(json.get(SubeffectData,"ParentSubeffect")!=""),CODE:{
	[h:ParentSubeffectNum = json.get(SubeffectData,"ParentSubeffect") + MultiEffectModifier]
	[h:subeffect.ParentEffectData = json.path.read(pm.a5e.EffectData,"\$[*][?(@.WhichIntrinsicSubeffect == '"+ParentSubeffectNum+"' && @.EffectDeferred == null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(json.isEmpty(subeffect.ParentEffectData)),CODE:{
		[h:pm.a5e.EffectData = json.path.put(pm.a5e.EffectData,"\$[*][?(@.WhichIntrinsicSubeffect == '"+json.get(SubeffectData,"WhichIntrinsicSubeffect")+"')]","EffectDeferred",1)]
		[h:return(0,0)]
	};{
		[h:subeffect.ParentEffectData = json.get(subeffect.ParentEffectData,0)]
	}]
	[h:ParentSubeffectRequirements = json.get(SubeffectData,"ParentSubeffectRequirements")]

	[h:thisEffectData = json.set(thisEffectData,
		"ParentSubeffect",json.get(subeffect.ParentEffectData,"ID"),
		"ParentSubeffectRequirements",ParentSubeffectRequirements
	)]

	[h,if(json.get(ParentSubeffectRequirements,"Requirement") == "Attack"),CODE:{
		[h:UseParentCrit = and(
			json.get(ParentSubeffectRequirements,"Result") == "Hit",
			!json.contains(SubeffectData,"Attack"),
			!json.contains(SubeffectData,"SaveData")
		)]
	};{
		[h:UseParentCrit = 0]
	}]

	[h:ParentMeetsPrereqs = pm.a5e.ParentSubeffectInitialPrereqs(subeffect.ParentEffectData,ParentSubeffectRequirements)]
	[h,if(!ParentMeetsPrereqs),CODE:{
		[h:pm.a5e.EffectData = json.path.put(pm.a5e.EffectData,"\$[*][?(@.WhichIntrinsicSubeffect == '"+json.get(SubeffectData,"WhichIntrinsicSubeffect")+"')]","EffectDeferred",1)]
		[h:return(0,0)]
	}]
};{
	[h:UseParentCrit = 0]
}]

[h,if(json.contains(SubeffectData,"UseResource")),CODE:{
	[h:subeffect.ResourceData = pm.a5e.UseResource(json.get(SubeffectData,"UseResource"),IsTooltip)]

	[h:SubeffectData = json.set(SubeffectData,"Resource",json.get(subeffect.ResourceData,"Data"))]
	[h:abilityTable = json.merge(abilityTable,json.get(subeffect.ResourceData,"Table"))]
};{}]

[h:subeffect.RangeExecution = pm.a5e.ExecuteSubeffectRange(SubeffectData,AHLTier)]
[h:subeffect.RangeData = json.get(subeffect.RangeExecution,"Data")]
[h:rangeTableLine = json.get(subeffect.RangeExecution,"Table")]
[h,if(rangeTableLine != ""): abilityTable = json.append(abilityTable,rangeTableLine)]

[h,if(json.contains(SubeffectData,"isTargetNumberUnlimited")),CODE:{
	[h:subeffect.TargetNumber = 99999999999]
};{
	[h:subeffect.TargetNumber = number(json.get(SubeffectData,"TargetNumber"))]
	[h:subeffect.TargetNumberAHLScaling = number(json.get(SubeffectData,"TargetNumberAHLScaling"))]
	[h,if(subeffect.TargetNumberAHLScaling != 0 && AHLTier > 0),CODE:{
		[h:subeffect.TargetNumber = subeffect.TargetNumber + (number(json.get(SubeffectData,"TargetNumberAHL")) * floor(AHLTier / subeffect.TargetNumberAHLScaling))]
	};{}]
}]

[h,if(json.contains(SubeffectData,"isMultitargetDistanceUnlimited")),CODE:{
	[h:subeffect.MultiTargetDistance = subeffect.RangeData]
};{
	[h:subeffect.MultiTargetDistance = json.set("","MultitargetDistanceValue",json.get(SubeffectData,"MultitargetDistance"),"MultitargetDistanceUnits",json.get(subeffect.RangeData,"Units"))]
}]

[h,if(json.contains(SubeffectData,"zAOE")),CODE:{
	[h:AoEScaling=if(sAoESizeScalingAHL=="Every Level",AHLTier,if(sAoESizeScalingAHL=="Every Other Level",floor(AHLTier/2),if(sAoESizeScalingAHL=="Every Three Levels",floor(AHLTier/3),0)))]
	[h:dAoESizeAHL = sAoESizeAHL*AoEScaling]
	[h:RangeScaling=if(sRangeScalingAHL=="Every Level",AHLTier,if(sRangeScalingAHL=="Every Other Level",floor(AHLTier/2),if(sRangeScalingAHL=="Every Three Levels",floor(AHLTier/3),0)))]
	[h:dRangeAHL = sRangeAHL*RangeScaling]
	[h:DamageScaling=if(AHLScaling=="Every Level",AHLTier,if(AHLScaling=="Every Other Level",floor(AHLTier/2),if(AHLScaling=="Every Three Levels",floor(AHLTier/3),0)))]
}]

[h,if(json.contains(SubeffectData,"TargetOrigin")),CODE:{
	
};{
	[h:subeffect.TargetOrigin = ParentToken]
}]

[h:MissileCount = max(number(json.get(SubeffectData,"MissileNumber")),1)]
[h:AHLMissileScaling = number(json.get(SubeffectData,"MissileNumberAHL"))]
[h,if(AHLMissileScaling > 0):
	AHLMissiles = floor(AHLTier/AHLMissileScaling);
	AHLMissiles = 0
]
[h:MissileCount = MissileCount + AHLMissiles]

[h:"<!-- TODO:AoE Remove AoE check from MustTargetAll check once implemented in MT -->"]
[h:subeffect.TargetingData = json.get(SubeffectData,"TargetLimits")]
[h:subeffect.TargetTypes = json.fields(subeffect.TargetingData,"json")]
[h:UseAllValidTargetsTest = and(json.get(SubeffectData,"MustTargetAll") == 1,!json.contains(SubeffectData,"AoE"))]

[h:subeffect.AllTargets = "[]"]
[h:subeffect.MultipleTargetTypeTargets = "{}"]
[h:subeffect.CreatureTargetOptions = "[]"]
[h:noTargetingTest = 1]
[h:cancelSubeffectTest = 0]
[h,if(json.contains(subeffect.TargetTypes,"Creature")),CODE:{
	[h:noTargetingTest = 0]
	[h:subeffect.TargetCreatureLimits = json.get(subeffect.TargetingData,"Creature")]
	[h:subeffect.TargetOptionData = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",subeffect.TargetOrigin,"Range",subeffect.RangeData),subeffect.TargetCreatureLimits)]
	
	[h:"<!-- Note: SelfOnlyTest and UseValidTargetsTest could be combined, kept for readability -->"]
	[h:subeffect.CreatureTargetOptions = json.get(subeffect.TargetOptionData,"ValidTargets")]
	[h:SelfOnlyTest = json.get(subeffect.TargetOptionData,"SelfOnly")]
	[h,if(SelfOnlyTest),CODE:{
		[h:subeffect.AllTargets = json.merge(subeffect.AllTargets,subeffect.CreatureTargetOptions)]
	};{
		[h,if(UseAllValidTargetsTest): 
			subeffect.AllTargets = json.merge(subeffect.AllTargets,subeffect.CreatureTargetOptions);
			subeffect.MultipleTargetTypeTargets = json.set(subeffect.MultipleTargetTypeTargets,"Creature",subeffect.CreatureTargetOptions)
		]
	}]
}]

[h,if(json.contains(subeffect.TargetTypes,"PriorTargets")),CODE:{
	[h:noTargetingTest = 0]
	[h:subeffect.LinkedPriorTargets = pm.a5e.GetEffectComponent(pm.a5e.EffectData,"Targets",json.get(SubeffectData,"ParentSubeffect"))]

	[h:"<!-- TODO: Will need to manage non-creature PriorTargets as well in the future -->"]
	[h:subeffect.PriorTargetingData = json.get(subeffect.TargetingData,"PriorTargets")]
	[h:subeffect.PriorTargetLimits = json.get(subeffect.PriorTargetingData,"PriorTargetLimits")]
	[h,if(json.get(subeffect.PriorTargetingData,"PriorTargetLimits") != ""),CODE:{
		[h:PriorTargetCreatureFilter = json.get(subeffect.PriorTargetLimits,"Creature")]
		[h,if(PriorTargetCreatureFilter != ""): subeffect.LinkedPriorTargets = json.get(pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",subeffect.TargetOrigin,"Range",subeffect.RangeData,"List",subeffect.LinkedPriorTargets),PriorTargetCreatureFilter),"ValidTargets")]
	};{}]
	[h:subeffect.CreatureTargetOptions = json.merge(subeffect.CreatureTargetOptions,subeffect.LinkedPriorTargets)]

	[h,if(json.get(subeffect.PriorTargetingData,"TargetAll")),CODE:{
		[h:subeffect.AllTargets = json.merge(subeffect.AllTargets,subeffect.LinkedPriorTargets)]
	};{
		[h:"<!-- TODO: May require some filtering here if not all are valid. This whole CODE block means that in the future if target changing is implemented, it will need to change subsequent targeting as well. Better to do it this way than change targeting during resolution of effects due to the input required. -->"]
		[h,if(UseAllValidTargetsTest): 
			subeffect.AllTargets = json.merge(subeffect.AllTargets,subeffect.LinkedPriorTargets);
			subeffect.PriorTargetsChosen = "[]"
		]
	}]

	[h:"<!-- TODO: Will need to support PriorTargets in targeting, see that macro. Move the below statement to replace the empty array in the above if() -->"]
	[h,if(0): subeffect.MultipleTargetTypeTargets = json.set(subeffect.MultipleTargetTypeTargets,"PriorTargets",subeffect.PriorTargetsChosen)]

	[h:"<!-- Note: The following is used to later abort the subeffect if there are no valid targets. Use case: Divine Smite attacking a non-fiend, undead, etc. The extra damage should not trigger at all in this instance. Without returning, there is a leftover linked effect targeting nothing and the subeffect that isn't occurring is shown in chat. -->"]
	[h:cancelSubeffectTest = json.isEmpty(subeffect.LinkedPriorTargets)]
}]

[h,if(json.contains(subeffect.TargetTypes,"Object")),CODE:{
	[h:noTargetingTest = 0]
	[h:subeffect.TargetObjectLimits = json.get(subeffect.TargetingData,"Object")]
	[h:subeffect.ObjectTargetOptions = "[]"]

	[h:"<!-- Note: Empty string 'Carried' key means that it does not matter if an item is worn or carried - resulting in 2 if statements instead of 1. -->"]
	[h:CarriedLimits = json.get(subeffect.TargetObjectLimits,"Carried")]
	[h,if(CarriedLimits!=0),CODE:{
		[h:UseTargetCreature = number(json.get(subeffect.TargetObjectLimits,"UseCreatureTargetingLimitsForHeld"))]
		[h,if(UseTargetCreature): 
			subeffect.HeldItemCreatureOptions = subeffect.CreatureTargetOptions;
			subeffect.HeldItemCreatureOptions = json.get(pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",subeffect.TargetOrigin,"Range",subeffect.RangeData),json.get(subeffect.TargetObjectLimits,"CarryingCreatureFilter")),"ValidTargets")
		]

		[h:subeffect.ObjectTargetOptions = json.merge(subeffect.ObjectTargetOptions,pm.a5e.TargetHeldObjectFiltering(subeffect.HeldItemCreatureOptions,subeffect.TargetObjectLimits))]
	};{}]

	[h,if(CarriedLimits!=1),CODE:{
		[h:"<!-- TODO: Add targeting for non-held items -->"]
	};{}]

	[h,if(UseAllValidTargetsTest): 
		subeffect.AllTargets = json.merge(subeffect.AllTargets,subeffect.ObjectTargetOptions);
		subeffect.MultipleTargetTypeTargets = json.set(subeffect.MultipleTargetTypeTargets,"Object",subeffect.ObjectTargetOptions)
	]
}]

[h,if(!json.isEmpty(subeffect.MultipleTargetTypeTargets) && !noTargetingTest),CODE:{
	[h:subeffect.MultiTypeTargetingData = json.set("",
		"ValidTargets",subeffect.MultipleTargetTypeTargets,
		"TargetingInstances",MissileCount,
		"TargetNumber",subeffect.TargetNumber,
		"ParentToken",ParentToken,
		"Origin",subeffect.TargetOrigin
	)]
	[h,MACRO("MixedTypeTargeting@Lib:pm.a5e.Core"): subeffect.MultiTypeTargetingData]
	[h:subeffect.AllTargets = macro.return]
};{
	[h:"<!-- Note: As above, only true if PriorTargets are involved (allowing for targeting point in range, etc.) -->"]
	[h,if(cancelSubeffectTest): return(0)]
}]

[h:BaseSubeffectExecutionData = thisEffectData]
[h:MissilesCompleted = 0]
[h:"<!-- Note: MultiEffectModifier and MissilesCompleted are both separate counters used as they count from separate sources (weapon attacks made at once vs. the following loop) and MissileCount is needed for some things specifically in the loop. I highly doubt these two would ever interact, though. -->"]
[h,count(MissileCount),CODE:{
	[h:pm.a5e.ExecuteSubeffectMissilesLoop()]
	[h:MissilesCompleted = MissilesCompleted + 1]
	[h:MultiEffectModifier = MultiEffectModifier + 1]
}]

[h,if(json.get(SubeffectData,"PersistentEffects") != ""),CODE:{
	[h,if(json.get(SubeffectData,"PersistentEffects") == 1),CODE:{
		[h:PersistentEffectData = BaseEffectData]
	};{
		[h:PersistentEffectData = json.set(BaseEffectData,"Effects",json.get(SubeffectData,"PersistentEffects"))]
	}]
	[h:PersistentEffectData = json.set(PersistentEffectData,"AHLTier",AHLTier)]
	[h:setProperty("a5e.stat.ActiveEffects",json.append(getProperty("a5e.stat.ActiveEffects"),PersistentEffectData))]
}]

[h:subeffect.ActivateItem = json.get(SubeffectData,"isActivateItem")]
[h,if(subeffect.ActivateItem != ""),CODE:{
	[h:subeffect.ItemID = json.get(BaseEffectData,"ItemID")]
	[h,switch(subeffect.ActivateItem):
		case "Activate": finalActivationState = 1;
		case "Deactivate": finalActivationState = 0;
		case "Toggle": finalActivationState = json.get(json.path.read(getProperty("a5e.stat.Inventory",ParentToken),"\$[*][?(@.ItemID == '"+subeffect.ItemID+"')]['IsActive']"),0)
	]

	[h:setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory",ParentToken),"\$[*][?(@.ItemID == '"+subeffect.ItemID+"')]['IsActive']",finalActivationState),ParentToken)]
};{}]