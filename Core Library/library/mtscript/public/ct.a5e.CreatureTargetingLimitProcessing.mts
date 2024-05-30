[h:subeffectData = arg(0)]
[h:dataKeySuffix = arg(1)]
[h:creatureTargetData ="{}"]

[h,switch(json.get(subeffectData,"targetAllegiance"+dataKeySuffix)),CODE:
    case "All":{
        
    };
    case "Self":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Self",1))]
    };
    case "Allies":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Ally",1,"Self",1))]
    };
    case "AlliesNonself":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Ally",1))]
    };
    case "NotSelf":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","NotSelf",1))]
    };
    case "Enemies":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Foe",1))]
    };
    case "Nonhostile":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Neutral",1,"Ally",1,"Self",1))]
    };
    case "NonhostileNotself":{
        [h:creatureTargetData = json.set(creatureTargetData,"Allegiance",json.set("","Neutral",1,"Ally",1))]
    }
]
[h:subeffectData = json.remove(subeffectData,"targetAllegiance"+dataKeySuffix)]

[h,if(json.get(subeffectData,"targetCreatureTypes"+dataKeySuffix) != "All"),CODE:{
    [h:creatureTypeList = pm.GetCreatureTypes("Name","json")]
    [h:inclusiveCreatures = "[]"]
    [h:exclusiveCreatures = "[]"]
    [h,foreach(tempCreature,creatureTypeList),CODE:{
        [h,if(json.contains(subeffectData,"CreatureTypeTargetInclusive"+tempCreature+dataKeySuffix)): inclusiveCreatures = json.append(inclusiveCreatures,tempCreature)]
        [h,if(json.contains(subeffectData,"CreatureTypeTargetExclusive"+tempCreature+dataKeySuffix)): exclusiveCreatures = json.append(exclusiveCreatures,tempCreature)]
        [h:subeffectData = json.remove(subeffectData,"CreatureTypeTargetInclusive"+tempCreature+dataKeySuffix)]
        [h:subeffectData = json.remove(subeffectData,"CreatureTypeTargetExclusive"+tempCreature+dataKeySuffix)]
    }]
    [h,if(!json.isEmpty(inclusiveCreatures)): creatureTargetData = json.set(creatureTargetData,"TypeInclusive",inclusiveCreatures)]
    [h,if(!json.isEmpty(exclusiveCreatures)): creatureTargetData = json.set(creatureTargetData,"TypeExclusive",exclusiveCreatures)]
}]
[h:subeffectData = json.remove(subeffectData,"targetCreatureTypes"+dataKeySuffix)]

[h:sizeLimitType = json.get(subeffectData,"targetCreatureSizes"+dataKeySuffix)]
[h,if(sizeLimitType != "All"),CODE:{
	[h:validSizes = "[]"]
	[h:sizeList = json.append("","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal")]
	[h,foreach(size,sizeList),CODE:{
		[h:sizeCheckedTest = json.contains(subeffectData,"targetCreatureSizes"+size+dataKeySuffix)]
		[h:validSizeTest = or(and(sizeCheckedTest,sizeLimitType=="Inclusive"),and(!sizeCheckedTest,sizeLimitType=="Exclusive"))]
		[h,if(validSizeTest): validSizes = json.append(validSizes,size)]

		[h:subeffectData = json.remove(subeffectData,"targetCreatureSizes"+size+dataKeySuffix)]
	}]
	[h:creatureTargetData = json.set(creatureTargetData,"Size",validSizes)]
};{}]
[h:subeffectData = json.remove(subeffectData,"targetCreatureSizes"+dataKeySuffix)]

[h,if(json.contains(subeffectData,"targetCanSee"+dataKeySuffix)),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Sight",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanSee"+dataKeySuffix)]
}]        
[h,if(json.contains(subeffectData,"targetCanHear"+dataKeySuffix)),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Hear",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanHear"+dataKeySuffix)]
}]        
[h,if(json.contains(subeffectData,"targetCanUnderstand"+dataKeySuffix)),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Understand",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanUnderstand"+dataKeySuffix)]
}]

[h,switch(json.get(subeffectData,"targetCreatureHPType"+dataKeySuffix)),CODE:
	case "":{};
	case "Comparison":{
		[h:creatureHPTargetData = json.set("",
			"Type","Comparison",
			"Target",json.get(subeffectData,"targetCreatureHPTarget"+dataKeySuffix),
			"Comparitor",json.get(subeffectData,"targetCreatureHPComparitor"+dataKeySuffix)
		)]
		[h:subeffectData = json.remove(subeffectData,"targetCreatureHPTarget"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"targetCreatureHPComparitor"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"targetCreatureHPTargetType"+dataKeySuffix)]
		[h:creatureTargetData = json.set(creatureTargetData,"HP",creatureHPTargetData)]
	};
	default:{
		[h:creatureTargetData = json.set(creatureTargetData,"HP",json.set("","Type",json.get(subeffectData,"targetCreatureHPType"+dataKeySuffix)))]
	}
]
[h:subeffectData = json.remove(subeffectData,"targetCreatureHPType"+dataKeySuffix)]

[h,if(json.get(subeffectData,"isTargetCondition"+dataKeySuffix) != "None"),CODE:{
    [h:baseConditionList = pm.a5e.GetBaseConditions("Name","json")]
    [h:inclusiveConditions = "[]"]
    [h:exclusiveConditions = "[]"]
    [h,foreach(tempCondition,baseConditionList),CODE:{
        [h,if(json.contains(subeffectData,"InclusiveConditions"+dataKeySuffix+tempCondition)): inclusiveConditions = json.append(inclusiveConditions,json.set("","Name",tempCondition,"Class","Condition"))]
        [h,if(json.contains(subeffectData,"ExclusiveConditions"+dataKeySuffix+tempCondition)): exclusiveConditions = json.append(exclusiveConditions,json.set("","Name",tempCondition,"Class","Condition"))]
        [h:subeffectData = json.remove(subeffectData,"InclusiveConditions"+dataKeySuffix+tempCondition)]
        [h:subeffectData = json.remove(subeffectData,"ExclusiveConditions"+dataKeySuffix+tempCondition)]
    }]
    [h,if(!json.isEmpty(inclusiveConditions)): creatureTargetData = json.set(creatureTargetData,"ConditionsInclusive",inclusiveConditions)]
    [h,if(!json.isEmpty(exclusiveConditions)): creatureTargetData = json.set(creatureTargetData,"ConditionsExclusive",exclusiveConditions)]
}]
[h:subeffectData = json.remove(subeffectData,"isTargetCondition"+dataKeySuffix)]

[h,if(json.contains(subeffectData,"isAbilityScore"+dataKeySuffix)),CODE:{
    [h,foreach(tempAbility,pm.GetAttributes("Name","json")),CODE:{
        [h,switch(json.get(subeffectData,"is"+tempAbility+"Limit"+dataKeySuffix)):
            case "No": "";
            case "Minimum": creatureTargetData = json.set(creatureTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility+dataKeySuffix)));
            case "Maximum": creatureTargetData = json.set(creatureTargetData,tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility+dataKeySuffix)));
            case "Range": creatureTargetData = json.set(creatureTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility+dataKeySuffix)),tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility+dataKeySuffix)))
        ]
        [h:subeffectData = json.remove(subeffectData,"min"+tempAbility+dataKeySuffix)]
        [h:subeffectData = json.remove(subeffectData,"max"+tempAbility+dataKeySuffix)]
        [h:subeffectData = json.remove(subeffectData,"is"+tempAbility+"Limit"+dataKeySuffix)]
    }]
    [h:subeffectData = json.remove(subeffectData,"isAbilityScore"+dataKeySuffix)]
}]

[h,if(json.contains(subeffectData,"isAlignment"+dataKeySuffix)),CODE:{
    [h:AlignmentsAllowed = json.set("",
        "LawfulGood",json.contains(subeffectData,"alignmentLawfulGood"+dataKeySuffix),
        "LawfulNeutral",json.contains(subeffectData,"alignmentLawfulNeutral"+dataKeySuffix),
        "LawfulEvil",json.contains(subeffectData,"alignmentLawfulEvil"+dataKeySuffix),
        "NeutralGood",json.contains(subeffectData,"alignmentNeutralGood"+dataKeySuffix),
        "NeutralNeutral",json.contains(subeffectData,"alignmentNeutralNeutral"+dataKeySuffix),
        "NeutralEvil",json.contains(subeffectData,"alignmentNeutralEvil"+dataKeySuffix),
        "ChaoticGood",json.contains(subeffectData,"alignmentChaoticGood"+dataKeySuffix),
        "ChaoticNeutral",json.contains(subeffectData,"alignmentChaoticNeutral"+dataKeySuffix),
        "ChaoticEvil",json.contains(subeffectData,"alignmentChaoticEvil"+dataKeySuffix),
        "UnalignedUnaligned",json.contains(subeffectData,"alignmentUnaligned"+dataKeySuffix)
    )]
    [h:creatureTargetData = json.set(creatureTargetData,"Alignment",AlignmentsAllowed)]
    [h:subeffectData = json.remove(subeffectData,"isAlignment"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulGood"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulNeutral"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulEvil"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralGood"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralNeutral"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralEvil"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticGood"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticNeutral"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticEvil"+dataKeySuffix)]
    [h:subeffectData = json.remove(subeffectData,"alignmentUnaligned"+dataKeySuffix)]
}]

[h:creatureTargetData = json.set(creatureTargetData,"MaxCover",json.get(subeffectData,"MaxCover"))]

[h:macro.return = json.set("","Subeffect",subeffectData,"Creature",creatureTargetData)]