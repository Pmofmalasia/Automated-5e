[h:subeffectData = arg(0)]
[h:objectTargetData = arg(1)]

[h:objectTargetData = json.set(objectTargetData,"Carried",json.get(subeffectData,"ObjectTargetWornCarried"))]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWornCarried")]


[h,switch(json.get(subeffectData,"ObjectTargetWornCarried")),CODE:
    case "":{
        
    };
    case "Inclusive":{
		
    };
    case "Exclusive":{
		
    }
]

[h,if(json.get(subeffectData,"targetCreatureTypes") != "All"),CODE:{
    [h:creatureTypeList = pm.GetCreatureTypes("Name","json")]
    [h:inclusiveCreatures = "[]"]
    [h:exclusiveCreatures = "[]"]
    [h,foreach(tempCreature,creatureTypeList),CODE:{
        [h,if(json.contains(subeffectData,"CreatureTypeTargetInclusive"+tempCreature)): inclusiveCreatures = json.append(inclusiveCreatures,tempCreature)]
        [h,if(json.contains(subeffectData,"CreatureTypeTargetExclusive"+tempCreature)): exclusiveCreatures = json.append(exclusiveCreatures,tempCreature)]
        [h:subeffectData = json.remove(subeffectData,"CreatureTypeTargetInclusive"+tempCreature)]
        [h:subeffectData = json.remove(subeffectData,"CreatureTypeTargetExclusive"+tempCreature)]
    }]
    [h,if(!json.isEmpty(inclusiveCreatures)): objectTargetData = json.set(objectTargetData,"TypeInclusive",inclusiveCreatures)]
    [h,if(!json.isEmpty(exclusiveCreatures)): objectTargetData = json.set(objectTargetData,"TypeExclusive",exclusiveCreatures)]
    [h:subeffectData = json.remove(subeffectData,"targetCreatureTypes")]
}]

[h,if(json.contains(subeffectData,"targetCanSee")),CODE:{
    [h:objectTargetData = json.set(objectTargetData,"Sight",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanSee")]
}]        
[h,if(json.contains(subeffectData,"targetCanHear")),CODE:{
    [h:objectTargetData = json.set(objectTargetData,"Hear",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanHear")]
}]        
[h,if(json.contains(subeffectData,"targetCanUnderstand")),CODE:{
    [h:objectTargetData = json.set(objectTargetData,"Understand",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanUnderstand")]
}]

[h,if(json.get(subeffectData,"isTargetCondition") != "None"),CODE:{
    [h:baseConditionList = pm.a5e.GetBaseConditions("Name","json")]
    [h:inclusiveConditions = "[]"]
    [h:exclusiveConditions = "[]"]
    [h,foreach(tempCondition,baseConditionList),CODE:{
        [h,if(json.contains(subeffectData,"InclusiveConditions"+tempCondition)): inclusiveConditions = json.append(inclusiveConditions,json.set("","Name",tempCondition,"Class","Condition"))]
        [h,if(json.contains(subeffectData,"ExclusiveConditions"+tempCondition)): exclusiveConditions = json.append(exclusiveConditions,json.set("","Name",tempCondition,"Class","Condition"))]
        [h:subeffectData = json.remove(subeffectData,"InclusiveConditions"+tempCondition)]
        [h:subeffectData = json.remove(subeffectData,"ExclusiveConditions"+tempCondition)]
    }]
    [h,if(!json.isEmpty(inclusiveConditions)): objectTargetData = json.set(objectTargetData,"TargetConditionsInclusive",inclusiveConditions)]
    [h,if(!json.isEmpty(exclusiveConditions)): objectTargetData = json.set(objectTargetData,"TargetConditionsExclusive",exclusiveConditions)]
    [h:subeffectData = json.remove(subeffectData,"isTargetCondition")]
}]

[h,if(json.contains(subeffectData,"isAbilityScore")),CODE:{
    [h,foreach(tempAbility,pm.GetAttributes("Name","json")),CODE:{
        [h,switch(json.get(subeffectData,"is"+tempAbility+"Limit")):
            case "No": "";
            case "Minimum": objectTargetData = json.set(objectTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility)));
            case "Maximum": objectTargetData = json.set(objectTargetData,tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility)));
            case "Range": objectTargetData = json.set(objectTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility)),tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility)))
        ]
        [h:subeffectData = json.remove(subeffectData,"min"+tempAbility)]
        [h:subeffectData = json.remove(subeffectData,"max"+tempAbility)]
        [h:subeffectData = json.remove(subeffectData,"is"+tempAbility+"Limit")]
    }]
    [h:subeffectData = json.remove(subeffectData,"isAbilityScore")]
}]

[h,if(json.contains(subeffectData,"isAlignment")),CODE:{
    [h:AlignmentsAllowed = json.set("",
        "LawfulGood",json.contains(subeffectData,"alignmentLawfulGood"),
        "LawfulNeutral",json.contains(subeffectData,"alignmentLawfulNeutral"),
        "LawfulEvil",json.contains(subeffectData,"alignmentLawfulEvil"),
        "NeutralGood",json.contains(subeffectData,"alignmentNeutralGood"),
        "NeutralNeutral",json.contains(subeffectData,"alignmentNeutralNeutral"),
        "NeutralEvil",json.contains(subeffectData,"alignmentNeutralEvil"),
        "ChaoticGood",json.contains(subeffectData,"alignmentChaoticGood"),
        "ChaoticNeutral",json.contains(subeffectData,"alignmentChaoticNeutral"),
        "ChaoticEvil",json.contains(subeffectData,"alignmentChaoticEvil"),
        "Unaligned",json.contains(subeffectData,"alignmentUnaligned")
    )]
    [h:objectTargetData = json.set(objectTargetData,"Alignment",AlignmentsAllowed)]
    [h:subeffectData = json.remove(subeffectData,"isAlignment")]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulGood")]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulNeutral")]
    [h:subeffectData = json.remove(subeffectData,"alignmentLawfulEvil")]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralGood")]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralNeutral")]
    [h:subeffectData = json.remove(subeffectData,"alignmentNeutralEvil")]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticGood")]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticNeutral")]
    [h:subeffectData = json.remove(subeffectData,"alignmentChaoticEvil")]
    [h:subeffectData = json.remove(subeffectData,"alignmentUnaligned")]
}]

[h:objectTargetData = json.set(objectTargetData,"MaxCover",json.get(subeffectData,"MaxCover"))]

[h:macro.return = json.set("","Subeffect",subeffectData,"Creature",objectTargetData)]