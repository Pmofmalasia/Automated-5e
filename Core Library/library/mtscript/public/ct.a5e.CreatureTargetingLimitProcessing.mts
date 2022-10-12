[h:subeffectData = arg(0)]
[h:creatureTargetData = arg(1)]

[h,switch(json.get(subeffectData,"targetAllegiance")),CODE:
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
[h:subeffectData = json.remove(subeffectData,"targetAllegiance")]

[h,if(json.contains(subeffectData,"targetCanSee")),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Sight",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanSee")]
}]        
[h,if(json.contains(subeffectData,"targetCanHear")),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Hear",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanHear")]
}]        
[h,if(json.contains(subeffectData,"targetCanUnderstand")),CODE:{
    [h:creatureTargetData = json.set(creatureTargetData,"Understand",1)]
    [h:subeffectData = json.remove(subeffectData,"targetCanUnderstand")]
}]

[h:creatureTargetData = json.set(creatureTargetData,"MaxCover",json.get(subeffectData,"MaxCover"))]

[h,if(json.get(subeffectData,"targetCreatureTypes") == "Inclusive" || json.get(subeffectData,"targetCreatureTypes") == "Mixture"),CODE:{
    
}]

[h,if(json.get(subeffectData,"isTargetCondition") == "Inclusive" || json.get(subeffectData,"isTargetCondition") == "Mixture"),CODE:{
    
}]

[h,if(json.contains(subeffectData,"isAbilityScore")),CODE:{
    [h,foreach(tempAbility,pm.GetAttributes("Name","json")),CODE:{
        [h,switch(json.get(subeffectData,"is"+tempAbility+"Limit")):
            case "No": "";
            case "Minimum": creatureTargetData = json.set(creatureTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility)));
            case "Maximum": creatureTargetData = json.set(creatureTargetData,tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility)));
            case "Range": creatureTargetData = json.set(creatureTargetData,tempAbility+"Min",number(json.get(subeffectData,"min"+tempAbility)),tempAbility+"Max",number(json.get(subeffectData,"max"+tempAbility)))
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
    [h:creatureTargetData = json.set(creatureTargetData,"Alignment",AlignmentsAllowed)]
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

[h:macro.return = json.set("","Subeffect",subeffectData,"Creature",creatureTargetData)]