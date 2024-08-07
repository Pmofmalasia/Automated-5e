[h:subeffectData = arg(0)]
[h:dataKeySuffix = arg(1)]
[h:creatureTargetData ="{}"]

[h:allegianceData = ct.a5e.AllegiancePrereqProcessing(subeffectData,dataKeySuffix)]
[h:creatureTargetData = json.merge(creatureTargetData,json.get(allegianceData,"Allegiance"))]
[h:subeffectData = json.get(allegianceData,"Input")]

[h,if(json.get(subeffectData,"isCreatureTypeLimits"+dataKeySuffix) != ""),CODE:{
	[h:CreatureTypeReturnData = ct.a5e.CreatureTypeLimitsProcessing(subeffectData,dataKeySuffix)]
	[h:subeffectData = json.get(CreatureTypeReturnData,"InputData")]
	[h:ExclusiveInclusive = json.get(subeffectData,"isCreatureTypeLimits"+dataKeySuffix)]
	[h:creatureTargetData = json.set(creatureTargetData,"Type"+ExclusiveInclusive,json.get(CreatureTypeReturnData,"CreatureTypes"))]
};{}]
[h:subeffectData = json.remove(subeffectData,"isCreatureTypeLimits"+dataKeySuffix)]

[h,if(json.get(subeffectData,"isCreatureSubtypeLimits"+dataKeySuffix) != ""),CODE:{
	[h:CreatureSubtypeReturnData = ct.a5e.CreatureSubtypeLimitsProcessing(subeffectData,dataKeySuffix)]
	[h:subeffectData = json.get(CreatureSubtypeReturnData,"InputData")]
	[h:ExclusiveInclusive = json.get(subeffectData,"isCreatureSubtypeLimits"+dataKeySuffix)]
	[h:creatureTargetData = json.set(creatureTargetData,"Subtype"+ExclusiveInclusive,json.get(CreatureSubtypeReturnData,"CreatureSubtypes"))]
};{}]
[h:subeffectData = json.remove(subeffectData,"isCreatureSubtypeLimits"+dataKeySuffix)]

[h,if(json.get(subeffectData,"SizePrereqs"+dataKeySuffix) != ""),CODE:{
	[h:SizePrereqReturnData = ct.a5e.SizePrerequisiteProcessing(subeffectData,dataKeySuffix)]
	[h:subeffectData = json.get(SizePrereqReturnData,"InputData")]
	[h:creatureTargetData = json.merge(creatureTargetData,json.get(SizePrereqReturnData,"SizeData"))]
};{}]
[h:subeffectData = json.remove(subeffectData,"SizePrereqs"+dataKeySuffix)]

[h:PerceptionData = ct.a5e.PerceptionPrerequisiteProcessing(subeffectData,dataKeySuffix)]
[h:subeffectData = json.get(PerceptionData,"Input")]
[h:creatureTargetData = json.merge(creatureTargetData,json.get(PerceptionData,"Perception"))]

[h:HPLimitData = ct.a5e.HPPrerequisiteProcessing(subeffectData,dataKeySuffix)]
[h:subeffectData = json.get(HPLimitData,"Input")]
[h:creatureTargetData = json.merge(creatureTargetData,json.get(HPLimitData,"HP"))]

[h,if(json.get(subeffectData,"isAbilityScore"+dataKeySuffix) != ""),CODE:{
	[h:AttributePrereqProcessing = ct.a5e.AttributePrerequisiteProcessing(subeffectData,dataKeySuffix)]
	[h:subeffectData = json.get(AttributePrereqProcessing,"Input")]
	[h:creatureTargetData = json.merge(creatureTargetData,json.get(AttributePrereqProcessing,"Attributes"))]
};{}]
[h:subeffectData = json.remove(subeffectData,"isAbilityScore"+dataKeySuffix)]

[h:ConditionLimitData = ct.a5e.ConditionPrerequisiteProcessing(subeffectData,dataKeySuffix)]
[h:subeffectData = json.get(ConditionLimitData,"Input")]
[h:creatureTargetData = json.merge(creatureTargetData,json.get(ConditionLimitData,"Conditions"))]

[h,if(json.get(subeffectData,"AlignmentPrereqMethod"+dataKeySuffix) != ""),CODE:{
	[h:AlignmentData = ct.a5e.AlignmentPrerequisiteProcessing(subeffectData,dataKeySuffix)]
	[h:subeffectData = json.get(AlignmentData,"Input")]
	[h:creatureTargetData = json.merge(creatureTargetData,json.get(AlignmentData,"Alignment"))]
};{
	[h:subeffectData = json.remove(subeffectData,"AlignmentPrereqMethod"+dataKeySuffix)]
}]

[h:creatureTargetData = json.set(creatureTargetData,"MaxCover",json.get(subeffectData,"MaxCover"))]

[h:return(0,json.set("","Subeffect",subeffectData,"Creature",creatureTargetData))]