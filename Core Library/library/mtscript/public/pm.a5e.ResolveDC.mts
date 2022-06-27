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
[h,if(thisTokenDamageDealt!=""): typesHalvedFinal = json.intersection(typesHalvedFinal,json.fields(thisTokenDamageDealt,"json"))]

[h,foreach(damageType,json.fields(thisTokenDamageDealt,"json")): thisTokenDamageDealt = if(json.contains(typesHalvedFinal,damageType) && isDamageHalved!=0,json.set(thisTokenDamageDealt,damageType,floor(json.get(thisTokenDamageDealt,damageType)*if(isDamageHalved==1,(1/2),0))),thisTokenDamageDealt)]

[h:ConditionsResistedInfo = json.get(DCData,"ConditionsResisted")]
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