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
    [h:broadcast(whichType)]
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
[h:"<!-- TODO: This will introduce a disconnect between the input and what happens in the code - need to create the ability to apply DamageHalved to each individual type? Low priority. -->"]
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
[h,if(isCondition == "All" || isCondition == "Mixture"),CODE:{
    [h:conditionsAlwaysSet = "[]"]
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,tempCondition+"AlwaysSet")): json.append(conditionsAlwaysSet,json.set("","Name",tempCondition,"Class","Condition"))]
    }]
    [h,if(json.contains(subeffectData,"SpellConditionAlwaysSet")),CODE:{

    }]
}]

[h,if(isCondition == "Options" || isCondition == "Mixture"),CODE:{
    [h:conditionOptions = "[]"]
    [h,foreach(tempCondition,allBaseConditions),CODE:{
        [h,if(json.contains(subeffectData,tempCondition+"Option")): json.append(conditionOptions,json.set("","Name",tempCondition,"Class","Condition"))]
    }]
}]

[h,switch(json.get(subeffectData,"conditionSaveEffect")),CODE:
    case "": {};
    case "0": {};
    case "1": {
        
    };
    case "2": {
        
    };
    case "Different": {
        
    }
]

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

[h:broadcast(json.indent(subeffectData))]

[h:totalSubeffects = json.get(thisPlayerCurrentSpellData,"Total")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichEffect")]
[h:spellLevel = json.get(subeffectData,"SpellLevel")]
[h:setLibProperty("cd.NewSpell",json.set(currentSpellData,getPlayerName(),json.append(thisPlayerCurrentSpellData,SpellCoreData)))]
[h:broadcast("HI")]


[h,if(thisSubeffectNum>=totalSubeffects),CODE:{
    [h:closeDialog("Spell Creation")]
    [h,MACRO("CreateSpellEnd@Lib:pm.a5e.Core"): ""]
};{
    [h,MACRO("CreateSpellSubeffect@Lib:pm.a5e.Core"): json.set("","Total",totalSubeffects,"WhichEffect",thisSubeffectNum+1,"SpellLevel",json.get(SpellCoreData,"spellLevel"))]
}]