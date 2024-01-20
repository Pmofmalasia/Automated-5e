[h:subeffectData = arg(0)]
[h:IDSuffix = arg(1)]
[h:TargetingInfo = ""]

[h:TargetingInfo = json.set(TargetingInfo,"UsePriorOrigin",json.contains(subeffectData,"UsePriorOrigin"+IDSuffix))]
[h:subeffectData = json.remove(subeffectData,"UsePriorOrigin"+IDSuffix)]

[h:FixedTargetsData = pm.a5e.PruneIDSuffix(subeffectData,TargetingInfo,IDSuffix,json.append("","TargetNumber","TargetNumberAHL","TargetNumberAHLScaling","MultitargetDistance","isMultitargetDistanceUnlimited","isSight"))]
[h:subeffectData = json.get(FixedTargetsData,"Source")]
[h:TargetingInfo = json.get(FixedTargetsData,"Destination")]

[h,if(json.get(subeffectData,"RangeType"+IDSuffix) == "SelfRanged" || json.get(subeffectData,"RangeType"+IDSuffix) == "Ranged"),CODE:{
	[h:rangeData = json.set("",
		"Value",number(json.get(subeffectData,"RangeValue"+IDSuffix)),
		"Units",json.get(subeffectData,"RangeUnits"+IDSuffix)
	)]
	[h,if(json.get(subeffectData,"RangeScalingAHL"+IDSuffix) != "0" && json.contains(subeffectData,"RangeScalingAHL"+IDSuffix)):
		rangeData = json.set(rangeData,
			"AHLScaling",number(json.get(subeffectData,"RangeScalingAHL"+IDSuffix)),
			"AHLValue",number(json.get(subeffectData,"RangeValueAHL"+IDSuffix)));
			rangeData = json.set(rangeData,
			"AHLScaling",0,
			"AHLValue",0)
	]
	[h:subeffectData = json.remove(subeffectData,"RangeValue"+IDSuffix)]
	[h:subeffectData = json.remove(subeffectData,"RangeUnits"+IDSuffix)]
	[h:subeffectData = json.remove(subeffectData,"RangeScalingAHL"+IDSuffix)]
	[h:subeffectData = json.remove(subeffectData,"RangeValueAHL"+IDSuffix)]
	[h:TargetingInfo = json.set(TargetingInfo,"Range",rangeData)]
};{}]

[h:TargetingInfo = json.set(TargetingInfo,"MustTargetAll",json.contains(subeffectData,"MustTargetAll"+IDSuffix))]

[h,switch(json.get(subeffectData,"aoeShape"+IDSuffix)),CODE:
	case "None":{};
	case "":{};
	case "Choose":{
		[h:AoEShapes = json.append("","Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall")]
		[h:AoEShapeOptions = "[]"]
		[h,foreach(tempShape,AoEShapes),CODE:{
			[h:isOptionTest = json.contains(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti"+IDSuffix)]
			[h,if(isOptionTest): AoEShapeData = ct.a5e.AoEDataProcessing(tempShape,IDSuffix)]
			[h,if(isOptionTest): AoEShapeOptions = json.append(AoEShapeOptions,json.set(AoEShapeData,"Shape",pm.RemoveSpecial(tempShape)))]
			[h:subeffectData = json.remove(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti"+IDSuffix)]
		}]

		[h:TargetingInfo = json.set(TargetingInfo,"AoEOptions",AoEShapeOptions)]
	};
	default:{
		[h:AoEShapeData = ct.a5e.AoEDataProcessing(json.get(subeffectData,"aoeShape"+IDSuffix),IDSuffix)]

		[h:TargetingInfo = json.set(TargetingInfo,"AoE",json.set(AoEShapeData,"Shape",pm.RemoveSpecial(json.get(subeffectData,"aoeShape"+IDSuffix))))]
	}
]
[h:subeffectData = json.remove(subeffectData,"aoeShape"+IDSuffix)]

[h,if(json.contains(subeffectData,"isMissiles"+IDSuffix)),CODE:{
	[h:FixedMissilesData = pm.a5e.PruneIDSuffix(subeffectData,TargetingInfo,IDSuffix,json.append("","MissileNumber","MissileNumberAHL","isMissileSameDamageRoll"))]
	[h:subeffectData = json.get(FixedMissilesData,"Source")]
	[h:TargetingInfo = json.get(FixedMissilesData,"Destination")]
	[h:subeffectData = json.remove(subeffectData,"isMissiles"+IDSuffix)]
}]

[h:return(0,json.set("","Subeffect",subeffectData,"Targeting",TargetingInfo))]