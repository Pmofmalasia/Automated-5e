[h:SubeffectData = arg(0)]
[h:NonSubeffectData = arg(1)]
[h:SubeffectFunctionPrefixes = json.get(NonSubeffectData,"InstancePrefixes")]
[h:MultiEffectModifier = number(json.get(NonSubeffectData,"MultiEffectModifier"))]
[h:BaseEffectData = json.get(NonSubeffectData,"BaseData")]

[h:thisEffectData = "{}"]

[h,if(json.get(SubeffectData,"ParentSubeffect")!=""),CODE:{
	[h:ParentSubeffectNum = json.get(SubeffectData,"ParentSubeffect") + MultiEffectModifier]
	[h:subeffect.ParentEffectData = json.get(json.path.read(pm.a5e.EffectData,"[*][?(@.WhichIntrinsicSubeffect == '"+ParentSubeffectNum+"')]"),0)]
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
};{
	[h:UseParentCrit = 0]
}]

[h,if(json.contains(SubeffectData,"UseResource")),CODE:{
	[h:subeffect.ResourceData = pm.a5e.UseResource(json.get(SubeffectData,"UseResource"),IsTooltip)]

	[h:SubeffectData = json.set(SubeffectData,"Resource",json.get(subeffect.ResourceData,"Data"))]
	[h:abilityTable = json.merge(abilityTable,json.get(subeffect.ResourceData,"Table"))]
};{}]

[h:"<!-- TODO:AoE Temporary while AOE is being fully implemented (in MT, not by me) -->"]
[h,if(json.contains(SubeffectData,"AoE")),CODE:{
	[h:subeffect.AoEData = json.get(SubeffectData,"AoE")]
	[h,switch(json.get(subeffect.AoEData,"Shape")),CODE:
		case "Cone":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
		};
		case "Cube":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
		};
		case "Cylinder":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"RadiusValue"),json.get(subeffect.AoEData,"HeightValue"))]
		};
		case "HalfSphere":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
		};
		case "Line":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"LengthValue"),json.get(subeffect.AoEData,"WidthValue"))]
		};
		case "Panels":{

		};
		case "Sphere":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
		};
		case "Wall":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"LengthValue"),json.get(subeffect.AoEData,"WidthValue"),json.get(subeffect.AoEData,"HeightValue"))]
		};
		default:{
			[h:temp.RangeBonus = 0]
		}
	]
};{
	[h:temp.RangeBonus = 0]
}]

[h:subeffect.RangeData = json.get(SubeffectData,"Range")]
[h:subeffect.RangeType = json.get(SubeffectData,"RangeType")]
[h,if(subeffect.RangeType == "SelfRanged" || subeffect.RangeType == "Ranged"),CODE:{
	[h,if(json.get(subeffect.RangeData,"AHLScaling")>0):
		subeffect.AHLRange = json.get(subeffect.RangeData,"AHLValue") * floor(AHLTier / json.get(subeffect.RangeData,"AHLScaling"));
		subeffect.AHLRange = 0
	]
	[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",json.get(subeffect.RangeData,"Value") + subeffect.AHLRange + temp.RangeBonus)]

	[h,if(subeffect.RangeType == "SelfRanged"):
		subeffect.RangeDisplay = "Self ("+json.get(subeffect.RangeData,"Value")+" "+json.get(subeffect.RangeData,"Units")+")";
		subeffect.RangeDisplay = "Range "+json.get(subeffect.RangeData,"Value")+" "+json.get(subeffect.RangeData,"Units")
	]
};{
	[h,if(subeffect.RangeType == "Touch"),CODE:{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",5 + temp.RangeBonus,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Touch"]
	};{
		[h:subeffect.RangeData = "{}"]
		[h:subeffect.RangeDisplay = "Prior Target"]
	}]

	[h,if(subeffect.RangeType == "Self"),CODE:{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",0 + temp.RangeBonus,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Self"]
	};{}]
}]

[h:"<!-- TODO: Add AOE display to this line. May need to rethink using subeffect.RangeData as the indicator for adding this line when done. -->"]
[h,if(!json.isEmpty(subeffect.RangeData)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Range",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",subeffect.RangeDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(json.contains(SubeffectData,"isTargetNumberUnlimited")),CODE:{
	[h:subeffect.TargetNumber = 99999999999]
};{
	[h:subeffect.TargetNumber = json.get(SubeffectData,"TargetNumber")]
	[h,if(json.get(SubeffectData,"TargetNumberAHLScaling") != 0 && AHLTier > 0),CODE:{
		[h:subeffect.TargetNumber = subeffect.TargetNumber + (json.get(SubeffectData,"TargetNumberAHL") * floor(AHLTier / json.get(SubeffectData,"TargetNumberAHLScaling")))]
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
[h,if(json.contains(subeffect.TargetTypes,"Creature")),CODE:{
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
	[h:subeffect.LinkedPriorTargets = pm.a5e.GetEffectComponent(pm.a5e.EffectData,"Targets",json.get(SubeffectData,"ParentSubeffect"))]

	[h:"<!-- TODO: Will need to filter out non-creature PriorTargets in the future -->"]
	[h:subeffect.CreatureTargetOptions = json.merge(subeffect.CreatureTargetOptions,subeffect.LinkedPriorTargets)]
	[h:subeffect.PriorTargetingData = json.get(subeffect.TargetingData,"PriorTargets")]

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
}]

[h,if(json.contains(subeffect.TargetTypes,"Object")),CODE:{
	[h:subeffect.TargetObjectLimits = json.get(subeffect.TargetingData,"Object")]
	[h:subeffect.ObjectTargetOptions = "[]"]

	[h:"<!-- Note: Empty string 'Carried' key means that it does not matter if an item is worn or carried - resulting in 2 if statements instead of 1. -->"]
	[h:CarriedLimits = json.get(subeffect.TargetObjectLimits,"Carried")]
	[h,if(CarriedLimits!=0),CODE:{
		[h,if(json.get(subeffect.TargetObjectLimits,"UseCreatureTargetingLimitsForHeld")): 
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

[h,if(!json.isEmpty(subeffect.MultipleTargetTypeTargets)),CODE:{
	[h:subeffect.MultiTypeTargetingData = json.set("",
		"ValidTargets",subeffect.MultipleTargetTypeTargets,
		"TargetingInstances",MissileCount,
		"TargetNumber",subeffect.TargetNumber
	)]
	[h,MACRO("MixedTypeTargeting@Lib:pm.a5e.Core"): subeffect.MultiTypeTargetingData]
	[h:subeffect.AllTargets = macro.return]
};{}]

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