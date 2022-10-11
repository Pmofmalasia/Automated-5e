[h:subeffectData = macro.args]
[h:currentSpellData = getLibProperty("cd.NewSpell","pm.a5e.Core")]
[h:thisPlayerCurrentSpellData = json.get(currentSpellData,getPlayerName())]

[h:howMitigate = json.get(subeffectData,"howMitigate")]
[h:subeffectData = json.remove(subeffectData,"howMitigate")]
[h,if(howMitigate == "Save"),CODE:{
    [h:saveInfo = json.set("","SaveType",json.get(subeffectData,"SaveType"))]
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
            saveInfo = json.set(saveInfo,"DamageHalved",number(json.get(subeffectData,"saveMitigation"+whichType)));
            saveInfo = json.set(saveInfo,"DamageHalved",max(number(json.get(subeffectData,"saveMitigation"+whichType)),json.get(saveInfo,"DamageHalved")))
        ]

        [h,if(json.get(subeffectData,"saveMitigation"+whichType)!=0): saveInfo = json.set(saveInfo,"TypesInclusive",json.append(json.get(saveInfo,"TypesInclusive"),json.get(subeffectData,"DamageType"+whichType)))]
        
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
[h:allBaseConditions = pm.a5e.GetBaseConditions("Name","json")]
[h:conditionsAlwaysSet = "[]"]
[h,if(isCondition == "All" || isCondition == "Mixture"),CODE:{
    [h:conditionsAlwaysSet = "[]"]
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,"AlwaysSet"+tempCondition)): conditionsAlwaysSet = json.append(conditionsAlwaysSet,json.set("","Name",tempCondition,"Class","Condition","AlwaysAdded",1))]
        [h:subeffectData = json.remove(subeffectData,"AlwaysSet"+tempCondition)]
    }]
    [h,if(json.contains(subeffectData,"isAlwaysSetSpellSpecific")),CODE:{

    }]
}]

[h:"<!-- Note: Needs data on how MANY of the options you can choose added -->"]
[h:conditionOptions = "[]"]
[h,if(isCondition == "Options" || isCondition == "Mixture"),CODE:{
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,"ConditionOption"+tempCondition)): conditionOptions = json.append(conditionOptions,json.set("","Name",tempCondition,"Class","Condition","AlwaysAdded",0))]
        [h:subeffectData = json.remove(subeffectData,"ConditionOption"+tempCondition)]
    }]
}]

[h:"<!-- May want to use a different format for options vs. always set instead of just the one key. Don't see any downsides to this method at the moment, though, and it is more consistent with how feature conditions are stored. -->"]
[h,if(isCondition != "None"): subeffectData = json.set(subeffectData,"Conditions",json.merge(conditionsAlwaysSet,conditionOptions))]

[h,switch(json.get(subeffectData,"conditionSaveEffect")),CODE:
    case "": {};
    case "0": {
        [h:subeffectData = json.set(subeffectData,"ConditionsResisted",json.set("","Inclusive","[]"))]
    };
    case "1": {
        [h:conditionsNullified = "[]"]
        [h,foreach(tempCondition,allBaseConditions),CODE:{
            [h,if(json.contains(subeffectData,"SaveNullify"+tempCondition)): conditionsNullified = json.append(conditionsNullified,json.set("","Name",tempCondition,"Class","Condition"))]
            [h:subeffectData = json.remove(subeffectData,"SaveNullify"+tempCondition)]
        }]
        [h:subeffectData = json.set(subeffectData,"ConditionsResisted",json.set("","Inclusive",conditionsNullified))]
    };
    case "2": {
        [h:subeffectData = json.set(subeffectData,"ConditionsResisted",json.set("","Inclusive","All"))]
    };
    case "Different": {
        [h:"<!-- TODO later -->"]
    }
]
[h:subeffectData = json.remove(subeffectData,"conditionSaveEffect")]

[h:summonData = json.get(subeffectData,"isSummons")]
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
        "Value",json.get(subeffectData,"moveTargetValue"),
        "Units",json.get(subeffectData,"moveTargetUnits"),
        "Direction",json.get(subeffectData,"moveTargetDirection")
    )]
    [h,if(json.get(subeffectData,"moveTargetAHLScaling") > 0):
        moveTargetData = json.set(moveTargetData,
            "AHLScaling",json.get(subeffectData,"moveTargetAHLScaling"),
            "AHLValue",json.get(subeffectData,"moveTargetAHLValue"));
        moveTargetData = json.set(moveTargetData,
            "AHLScaling",0,
            "AHLValue",0)
    ]

    [h:subeffectData = json.set(subeffectData,"Movement",moveTargetData)]
}]

[h:broadcast(json.indent(subeffectData))]

[h:totalSubeffects = json.get(thisPlayerCurrentSpellData,"Total")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichEffect")]
[h:spellLevel = json.get(subeffectData,"SpellLevel")]
[h:setLibProperty("cd.NewSpell",json.set(currentSpellData,getPlayerName(),json.append(thisPlayerCurrentSpellData,SpellCoreData)))]


[h,if(thisSubeffectNum>=totalSubeffects),CODE:{
    [h:closeDialog("Spell Creation")]
    [h,MACRO("CreateSpellEnd@Lib:pm.a5e.Core"): ""]
};{
    [h,MACRO("CreateSpellSubeffect@Lib:pm.a5e.Core"): json.set("","Total",totalSubeffects,"WhichEffect",thisSubeffectNum+1,"SpellLevel",json.get(SpellCoreData,"spellLevel"))]
}]