[h:DCData = json.get(arg(0),"DCData")]

[h:DamageModInfo = if(json.get(DCData,"DamageModifier")=="","{}",json.get(DCData,"DamageModifier"))]
[h:isDamageHalved = if(json.get(DamageModInfo,"DamageHalved")=="",0,json.get(DamageModInfo,"DamageHalved"))]
[h:typesHalvedInclusive = json.get(DamageModInfo,"TypesInclusive")]
[h:typesHalvedExclusive = if(json.get(DamageModInfo,"TypesExclusive")=="","[]",json.get(DamageModInfo,"TypesExclusive"))]

[h,if(isDamageHalved!=0),CODE:{
    [h,switch(json.type(typesHalvedInclusive)):
        case "UNKNOWN": typesHalvedFinal = if(typesHalvedInclusive == "All",pm.GetDamageTypes("Name","json"),json.difference(pm.GetDamageTypes("Name","json"),typesHalvedExclusive));
        case "ARRAY": typesHalvedFinal = json.difference(json.intersection(typesHalvedInclusive,pm.GetDamageTypes("Name","json")),typesHalvedExclusive);
        default: typesHalvedFinal = "[]"
    ]
};{
    [h:typesHalvedFinal = "[]"]
}]

[h,if(thisTokenDamageDealt!=""),CODE:{
    [h:thisEffectDamageTypes = json.unique(json.path.read(thisTokenDamageDealt,"[*]['DamageType']"))]
    [h:typesHalvedFinal = json.intersection(typesHalvedFinal,thisEffectDamageTypes)]
};{}]

[h,foreach(damageInstance,thisTokenDamageDealt),CODE:{
    [h:thisTypeModifiedTest = (json.contains(typesHalvedFinal,json.get(damageInstance,"DamageType")) && isDamageHalved!=0)]
    [h:modificationImmunityTest = (json.get(damageInstance,"NoModification")==1)]
    [h:modifyThisInstance = and(!modificationImmunityTest,thisTypeModifiedTest)]
    [h,if(modifyThisInstance): thisTokenDamageDealt = json.path.set(thisTokenDamageDealt,"["+roll.count+"]['Modifier']",json.path.read(thisTokenDamageDealt,"["+roll.count+"]['Modifier']")*if(isDamageHalved==1,(1/2),0))]
}]

[h:ConditionsResistedInfo = json.get(DCData,"ConditionsResisted")]
[h,if(ConditionsResistedInfo==""): ConditionsResistedInfo = "{}"]
[h:conditionsResistedInclusive = json.get(ConditionsResistedInfo,"Inclusive")]
[h:conditionsResistedExclusive = if(json.get(ConditionsResistedInfo,"Exclusive")=="","[]",json.get(ConditionsResistedInfo,"Exclusive"))]

[h,switch(json.type(conditionsResistedInclusive)):
    case "UNKNOWN": conditionsResistedFinal = if(conditionsResistedInclusive == "All",thisTokenConditionsApplied,if(conditionsResistedExclusive=="[]","[]",json.difference(thisTokenConditionsApplied,conditionsResistedExclusive)));
    case "ARRAY": conditionsResistedFinal = json.difference(conditionsResistedInclusive,conditionsResistedExclusive);
    default: conditionsResistedFinal = "[]"
]

[h,foreach(condition,conditionsResistedFinal): thisTokenConditionInfo = json.path.delete(thisTokenConditionInfo,"[*]['Conditions'][*][?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]")]

[h:tempDeleteCount = 0]
[h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
    [h:allResistedTest = json.isEmpty(json.get(conditionSet,"Conditions"))]
    [h,if(allResistedTest): thisTokenConditionInfo = json.remove(thisTokenConditionInfo,(roll.count-tempDeleteCount))]
    [h,if(allResistedTest): tempDeleteCount = tempDeleteCount + 1]
}]

[h:"<!-- Note: Conditions that require failure to be removed are evaled in success and vice versa, since there are 3 options (success, failure, neither) -->"]
[h:ConditionsRemovedSaveInfo = json.get(DCData,"ConditionsRemoved")]
[h,if(ConditionsRemovedSaveInfo != ""): 
    preventConditionRemovalTest = json.get(ConditionsRemovedSaveInfo,"Failure");
    preventConditionRemovalTest = 0
]
[h,if(preventConditionRemovalTest==1): thisTokenConditionsRemovedInfo = "{}"]

[h,if(json.type(effTargetSpecific)=="OBJECT"),CODE:{
    [h:targetSpecificDamage = json.get(effTargetSpecific,targetToken)]
    [h:targetSpecificDamageTypes = json.fields(targetSpecificDamage)]
};{
    [h:targetSpecificDamage = "{}"]
    [h:targetSpecificDamageTypes = ""]
}]

[h,foreach(damageType,targetSpecificDamageTypes),CODE:{
    [h:allTargetsDamage = json.get(thisTokenDamageDealt,damageType)]
    [h,if(allTargetsDamage==""):
        thisTokenDamageDealt = json.path.put(thisTokenDamageDealt,"['Damage']",damageType,json.get(targetSpecificDamage,damageType));
        thisTokenDamageDealt = json.path.set(thisTokenDamageDealt,"['Damage']['"+damageType+"']",json.get(targetSpecificDamage,damageType)+allTargetsDamage)
    ]			
}]