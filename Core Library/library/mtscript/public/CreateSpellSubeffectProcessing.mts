[h:subeffectData = macro.args]
[h:currentSpellData = getLibProperty("ct.NewSpell","pm.a5e.Core")]
[h:thisPlayerCurrentSpellData = json.get(currentSpellData,getPlayerName())]
[h:currentEffectData = json.get(thisPlayerCurrentSpellData,json.length(thisPlayerCurrentSpellData)-1)]

[h:howMitigate = json.get(subeffectData,"howMitigate")]
[h:subeffectData = json.remove(subeffectData,"howMitigate")]
[h,if(howMitigate == "Save"),CODE:{
    [h:SaveData = json.set("","SaveType",json.get(subeffectData,"SaveType"))]
    [h:subeffectData = json.remove(subeffectData,"SaveType")]
}]

[h:damageTypeNumber = max(0,number(json.get(subeffectData,"differentTypes")))]
[h:subeffectData = json.remove(subeffectData,"isDamage")]
[h:subeffectData = json.remove(subeffectData,"differentTypes")]
[h:damageInfo = "[]"]
[h,count(damageTypeNumber),CODE:{
    [h:whichType = roll.count + 1]
    [h:thisDamageTypeInfo = json.set("",
        "DamageType",json.get(subeffectData,"DamageType"+whichType),
        "DamageDieNum",number(json.get(subeffectData,"DamageDieNum"+whichType)),
        "DamageDieSize",number(json.get(subeffectData,"DamageDieSize"+whichType)),
        "DamageFlatBonus",number(json.get(subeffectData,"DamageFlatBonus"+whichType)),
        "ModBonus",json.contains(subeffectData,"ModBonus"+whichType)
    )]

    [h,if(json.get(subeffectData,"isAHL"+whichType)!=0):
        thisDamageTypeInfo = json.set(thisDamageTypeInfo,
            "AHLScaling",number(json.get(subeffectData,"isAHL"+whichType)),
            "AHLDieSize",number(json.get(subeffectData,"AHLDieSize"+whichType)),
            "AHLDieNum",number(json.get(subeffectData,"AHLDieNum"+whichType)),
            "AHLFlatBonus",number(json.get(subeffectData,"AHLFlatBonus"+whichType))
    )]
    
    [h:"<!-- TODO: This will introduce a disconnect between the input and what happens in the code - need to create the ability to apply DamageHalved to each individual type? As it stands now a spell that halves one type and completely reduces another on save will just have all damage types that are reduced completely nullified. Super low priority because why would you do that anyway. -->"]
    [h,if(howMitigate == "Save"),CODE:{
        [h,if(roll.count==0):
            SaveData = json.set(SaveData,"DamageHalved",number(json.get(subeffectData,"saveMitigation"+whichType)));
            SaveData = json.set(SaveData,"DamageHalved",max(number(json.get(subeffectData,"saveMitigation"+whichType)),json.get(SaveData,"DamageHalved")))
        ]

        [h,if(json.get(subeffectData,"saveMitigation"+whichType)!=0): SaveData = json.set(SaveData,"TypesInclusive",json.append(json.get(SaveData,"TypesInclusive"),json.get(subeffectData,"DamageType"+whichType)))]
        
        [h:subeffectData = json.remove(subeffectData,"saveMitigation"+whichType)]
    }]

    [h:subeffectData = json.remove(subeffectData,"DamageType"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"DamageDieNum"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"DamageDieSize"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"DamageFlatBonus"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"ModBonus"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"AHLDieSize"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"AHLDieNum"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"AHLFlatBonus"+whichType)]
    [h:subeffectData = json.remove(subeffectData,"isAHL"+whichType)]

    [h:damageInfo = json.append(damageInfo,thisDamageTypeInfo)]
}]

[h:subeffectData = json.set(subeffectData,"Damage",damageInfo)]

[h:isCondition = json.get(subeffectData,"isCondition")]
[h:subeffectData = json.remove(subeffectData,"isCondition")]
[h:allBaseConditions = pm.a5e.GetBaseConditions("Name","json")]
[h:conditionsAlwaysSet = "[]"]
[h:spellSpecificConditions = "[]"]
[h:spellName = json.get(currentEffectData,"SpellName")]
[h,if(isCondition == "All" || isCondition == "Mixture"),CODE:{
    [h:conditionsAlwaysSet = "[]"]
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,"AlwaysSet"+tempCondition)): conditionsAlwaysSet = json.append(conditionsAlwaysSet,json.set("","Name",tempCondition,"Class","Condition","AlwaysAdded",1))]
        [h:subeffectData = json.remove(subeffectData,"AlwaysSet"+tempCondition)]
    }]
    
    [h,switch(json.contains(subeffectData,"AlwaysSetSpellSpecific")+""+json.contains(subeffectData,"isSpellSpecificAlwaysSetMultiple")),CODE:
        case "10":{
            [h:conditionsAlwaysSet = json.append(conditionsAlwaysSet,json.set("","Name",spellName,"Class","Spell","Subclass",spellName))]
            [h:spellSpecificConditions = json.append(spellSpecificConditions,json.set("","Name",spellName,"Class","Spell","Subclass",spellName))]
        };
        case "11":{
            [h:conditionNames = json.fromList(encode(json.get(subeffectData,"AlwaysSetSpellSpecificNames")),"%0A")]
            [h,foreach(tempCondition,conditionNames): conditionsAlwaysSet = json.append(conditionsAlwaysSet,json.set("","Name",tempCondition,"Class","Spell","Subclass",spellName))]
            [h,foreach(tempCondition,conditionNames): spellSpecificConditions = json.append(spellSpecificConditions,json.set("","Name",tempCondition,"Class","Spell","Subclass",spellName))]
            [h:subeffectData = json.remove(subeffectData,"isSpellSpecificAlwaysSetMultiple")]
            [h:subeffectData = json.remove(subeffectData,"AlwaysSetSpellSpecificNames")]
        };
        default:{};
    ]
    [h:subeffectData = json.remove(subeffectData,"AlwaysSetSpellSpecific")]
}]

[h:conditionOptions = "[]"]
[h,if(isCondition == "Choose" || isCondition == "Mixture"),CODE:{
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,"ConditionOption"+tempCondition)): conditionOptions = json.append(conditionOptions,json.set("","Name",tempCondition,"Class","Condition","AlwaysAdded",0))]
        [h:subeffectData = json.remove(subeffectData,"ConditionOption"+tempCondition)]
    }]

    [h,switch(json.contains(subeffectData,"ConditionOptionSpellSpecific")+""+json.contains(subeffectData,"isSpellSpecificConditionOptionMultiple")),CODE:
        case "10":{
            [h:conditionOptions = json.append(conditionOptions,json.set("","Name",spellName,"Class","Spell","Subclass",spellName))]
            [h:spellSpecificConditions = json.append(spellSpecificConditions,json.set("","Name",spellName,"Class","Spell","Subclass",spellName))]
        };
        case "11":{
            [h:conditionNames = json.fromList(encode(json.get(subeffectData,"ConditionOptionSpellSpecificNames")),"%0A")]
            [h,foreach(tempCondition,conditionNames): conditionOptions = json.append(conditionOptions,json.set("","Name",tempCondition,"Class","Spell","Subclass",spellName))]
            [h,foreach(tempCondition,conditionNames): spellSpecificConditions = json.append(spellSpecificConditions,json.set("","Name",tempCondition,"Class","Spell","Subclass",spellName))]
            [h:subeffectData = json.remove(subeffectData,"isSpellSpecificConditionOptionMultiple")]
            [h:subeffectData = json.remove(subeffectData,"ConditionOptionSpellSpecificNames")]
        };
        default:{}
    ]
    [h:subeffectData = json.remove(subeffectData,"ConditionOptionSpellSpecific")]
}]

[h:"<!-- May want to use a different format for options vs. always set instead of just the one key. Don't see any downsides to this method at the moment, though, and it is more consistent with how feature conditions are stored. -->"]
[h,if(isCondition != "None"): subeffectData = json.set(subeffectData,"Conditions",json.merge(conditionsAlwaysSet,conditionOptions))]

[h,switch(json.get(subeffectData,"conditionSaveEffect")),CODE:
    case "": {};
    case "0": {
        [h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive","[]"))]
    };
    case "1": {
        [h:conditionsNullified = "[]"]
        [h,foreach(tempCondition,allBaseConditions),CODE:{
            [h,if(json.contains(subeffectData,"SaveNullify"+tempCondition)): conditionsNullified = json.append(conditionsNullified,json.set("","Name",tempCondition,"Class","Condition"))]
            [h:subeffectData = json.remove(subeffectData,"SaveNullify"+tempCondition)]
        }]
        [h,if(json.contains(subeffectData,"SaveNullifySpellSpecific")): conditionsNullified = json.merge(conditionsNullified,spellSpecificConditions)]
        [h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive",conditionsNullified))]
        [h:subeffectData = json.remove(subeffectData,"SaveNullifySpellSpecific")]
    };
    case "2": {
        [h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive","All"))]
    };
    case "Different": {
        [h:"<!-- TODO later -->"]
    }
]
[h:subeffectData = json.remove(subeffectData,"conditionSaveEffect")]

[h:summonData = json.get(subeffectData,"isSummons")]
[h:subeffectData = json.remove(subeffectData,"isSummons")]
[h,switch(summonData),CODE:
    case "SpellEffect":{

    };
    case "Single":{

    };
    case "Options":{

    };
    case "Criteria":{

    };
    default:{

    }
]

[h,if(json.contains(subeffectData,"isMoveTarget")),CODE:{
    [h:moveTargetData = json.set("",
        "Value",number(json.get(subeffectData,"moveTargetValue")),
        "Units",json.get(subeffectData,"moveTargetUnits"),
        "Direction",json.get(subeffectData,"moveTargetDirection")
    )]

    [h,if(json.get(subeffectData,"moveTargetAHLScaling") != "0"):
        moveTargetData = json.set(moveTargetData,
            "AHLScaling",number(json.get(subeffectData,"moveTargetAHLScaling")),
            "AHLValue",number(json.get(subeffectData,"moveTargetAHLValue")));
        moveTargetData = json.set(moveTargetData,
            "AHLScaling",0,
            "AHLValue",0)
    ]

    [h:subeffectData = json.remove(subeffectData,"isMoveTarget")]
    [h:subeffectData = json.remove(subeffectData,"moveTargetValue")]
    [h:subeffectData = json.remove(subeffectData,"moveTargetUnits")]
    [h:subeffectData = json.remove(subeffectData,"moveTargetDirection")]
    [h:subeffectData = json.remove(subeffectData,"moveTargetAHLScaling")]
    [h:subeffectData = json.remove(subeffectData,"moveTargetAHLValue")]
    [h:subeffectData = json.set(subeffectData,"Movement",moveTargetData)]
}]

[h,if(json.get(subeffectData,"savePreventMove") != ""): SaveData = json.set(SaveData,"MoveResisted",json.get(subeffectData,"savePreventMove"))]
[h:subeffectData = json.remove(subeffectData,"savePreventMove")]

[h,switch(json.get(subeffectData,"lightType")),CODE:
    case "None":{};
    case "":{};
    case "BrightDim":{
        [h:lightData = json.set("",
            "LightType",json.get(subeffectData,"lightType"),
            "Value",number(json.get(subeffectData,"lightDistanceValue")),
            "Units",json.get(subeffectData,"lightDistanceUnits"),
            "SecondaryValue",number(json.get(subeffectData,"lightDistanceValue")+number(json.get(subeffectData,"secondaryLightDistanceValue")),
            "IsSunlight",json.contains(subeffectData,"isSunlight")
        )]

        [h:subeffectData = json.set(subeffectData,"Light",lightData)]
        [h:subeffectData = json.remove(subeffectData,"lightDistanceValue")]
        [h:subeffectData = json.remove(subeffectData,"lightDistanceUnits")]
        [h:subeffectData = json.remove(subeffectData,"secondaryLightDistanceValue")]
        [h:subeffectData = json.remove(subeffectData,"isSunlight")]
    };
    default:{
        [h:lightData = json.set("",
            "LightType",json.get(subeffectData,"lightType"),
            "Value",number(json.get(subeffectData,"lightDistanceValue")),
            "Units",json.get(subeffectData,"lightDistanceUnits"),
            "IsSunlight",json.contains(subeffectData,"isSunlight")
        )]

        [h:subeffectData = json.set(subeffectData,"Light",lightData)]
        [h:subeffectData = json.remove(subeffectData,"lightDistanceValue")]
        [h:subeffectData = json.remove(subeffectData,"lightDistanceUnits")]
        [h:subeffectData = json.remove(subeffectData,"isSunlight")]
    }
]
[h:subeffectData = json.remove(subeffectData,"lightType")]

[h,if(json.get(subeffectData,"RangeType") == "SelfRanged" || json.get(subeffectData,"RangeType") == "Ranged"),CODE:{
    [h:rangeData = json.set("",
        "Value",json.get(subeffectData,"RangeValue"),
        "Units",json.get(subeffectData,"RangeUnits")
    )]
    [h,if(json.get(subeffectData,"RangeScalingAHL") != "0"):
        rangeData = json.set(rangeData,
            "AHLScaling",number(json.get(subeffectData,"RangeScalingAHL")),
            "AHLValue",number(json.get(subeffectData,"RangeValueAHL")));
            rangeData = json.set(rangeData,
            "AHLScaling",0,
            "AHLValue",0)
    ]
    [h:subeffectData = json.remove(subeffectData,"RangeValue")]
    [h:subeffectData = json.remove(subeffectData,"RangeUnits")]
    [h:subeffectData = json.remove(subeffectData,"RangeScalingAHL")]
    [h:subeffectData = json.remove(subeffectData,"RangeValueAHL")]
    [h:subeffectData = json.set(subeffectData,"Range",rangeData)]
}]

[h,switch(json.get(subeffectData,"aoeShape")),CODE:
    case "None":{};
    case "Choose":{
        [h:AoEShapes = json.append("","Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall")]
        [h:AoEShapeOptions = "[]"]
        [h,foreach(tempShape,AoEShapes),CODE:{
            [h:isOptionTest = json.contains(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti")]
            [h,if(isOptionTest): AoEShapeData = ct.a5e.AoESpellDataProcessing(tempShape)]
            [h,if(isOptionTest): AoEShapeOptions = json.append(AoEShapeOptions,json.set(AoEShapeData,"Shape",pm.RemoveSpecial(tempShape)))]
            [h:subeffectData = json.remove(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti")]
        }]

        [h:subeffectData = json.set(subeffectData,"AoEOptions",AoEShapeOptions)]
    };
    default:{
        [h:AoEShapeData = ct.a5e.AoESpellDataProcessing(json.get(subeffectData,"aoeShape"))]

        [h:subeffectData = json.set(subeffectData,"AoE",json.set(AoEShapeData,"Shape",pm.RemoveSpecial(json.get(subeffectData,"aoeShape"))))]
    }
]
[h:subeffectData = json.remove(subeffectData,"aoeShape")]

[h:targetData = "{}"]
[h,switch(json.get(subeffectData,"TargetType")),CODE:
    case "AnyCreature":{
        [h:targetData = json.set(targetData,"Creature","{}")]
    };
    case "AlliedCreature":{
        [h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Ally",1,"Self",1)))]
    };
    case "SelfOnly":{
        [h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Self",1)))]
    };
    case "EnemyCreature":{
        [h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Foe",1)))]
    };
    case "HumanoidCreature":{
        [h:targetData = json.set(targetData,"Creature",json.set("","TypeInclusive","Humanoid"))]
    };
    case "Creature":{
        [h:CreatureTargetingData = ct.a5e.CreatureTargetingLimitProcessing(subeffectData,targetData)]
        [h:subeffectData = json.get(CreatureTargetingData,"Subeffect")]
        [h:creatureData = json.get(CreatureTargetingData,"Creature")]
        [h:targetData = json.set(targetData,"Creature",creatureData)]
        [h:subeffectData = json.remove(subeffectData,"MaxCover")]
    };
    case "Object":{

    };
    case "CreatureObject":{
        [h:CreatureTargetingData = ct.a5e.CreatureTargetingLimitProcessing(subeffectData,targetData)]
        [h:subeffectData = json.get(CreatureTargetingData,"Subeffect")]
        [h:creatureData = json.get(CreatureTargetingData,"Creature")]
        [h:targetData = json.set(targetData,"Creature",creatureData)]
        [h:subeffectData = json.remove(subeffectData,"MaxCover")]
    };
    case "Point":{

    };
    case "Effect":{

    };
    case "FreeHand":{

    }
]
[h:subeffectData = json.remove(subeffectData,"TargetType")]

[h:subeffectData = json.set(subeffectData,"TargetLimits",targetData)]
[h:subeffectData = json.remove(subeffectData,"MaxCover")]

[h,if(howMitigate == "Save"): subeffectData = json.set(subeffectData,"SaveData",SaveData)]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h:totalSubeffects = number(json.get(subeffectData,"TotalSubeffects"))]
[h:thisSubeffectNum = number(json.get(subeffectData,"WhichSubeffect"))]
[h:spellLevel = json.get(subeffectData,"SpellLevel")]
[h:subeffectData = json.remove(subeffectData,"TotalSubeffects")]
[h:subeffectData = json.remove(subeffectData,"WhichSubeffect")]
[h:subeffectData = json.remove(subeffectData,"SpellLevel")]

[h:thisEffectSubeffectData = json.get(currentEffectData,"Subeffects")]
[h:thisEffectSubeffectData = json.append(thisEffectSubeffectData,subeffectData)]
[h:currentEffectData = json.set(currentEffectData,"Subeffects",thisEffectSubeffectData)]
[h:thisPlayerCurrentSpellData = json.set(thisPlayerCurrentSpellData,json.length(thisPlayerCurrentSpellData)-1,currentEffectData)]
[h:setLibProperty("ct.NewSpell",json.set(currentSpellData,getPlayerName(),thisPlayerCurrentSpellData),"Lib:pm.a5e.Core")]

[h:baseSpellData = json.get(thisPlayerCurrentSpellData,0)]
[h:lastSubeffectTest = (thisSubeffectNum>=totalSubeffects)]
[h:lastEffectTest = json.length(thisPlayerCurrentSpellData) >= json.get(baseSpellData,"multiEffects")]
[h,switch(lastSubeffectTest+""+lastEffectTest),CODE:
    case "11":{
        [h:tempAllConditions = json.path.read(json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"[*]['Subeffects'][*][?(@.Conditions!=null)]['Conditions']","DEFAULT_PATH_LEAF_TO_NULL")]
        [h:allConditions = "[]"]
        [h,foreach(tempConditions,tempAllConditions): allConditions = json.merge(allConditions,tempConditions)]
        [h,if(!json.isEmpty(allConditions)): SpellConditions = json.path.read(allConditions,"[?(@.Name=='"+spellName+"' && @.Class=='Spell')]"); SpellConditions = "[]"]
        [h:closeDialog("Spell Creation")]
        [h,if(json.length(SpellConditions)<=1),CODE:{
            [h,MACRO("CreateSpellEnd@Lib:pm.a5e.Core"): ""]
        };{
            [h,MACRO("CreateSpellFinalInfo@Lib:pm.a5e.Core"): ""]
        }]
    };
    case "10":{
        [h:broadcast("PreEff")]
        [h:baseSpellData = json.set(json.get(thisPlayerCurrentSpellData,0),"WhichEffect",json.length(thisPlayerCurrentSpellData)+1)]
        [h,MACRO("CreateSpellCore@Lib:pm.a5e.Core"): baseSpellData]
    };
    default:{
        [h,MACRO("CreateSpellSubeffect@Lib:pm.a5e.Core"): json.set("","TotalSubeffects",totalSubeffects,"WhichSubeffect",thisSubeffectNum+1,"SpellLevel",spellLevel)]        
    }
]