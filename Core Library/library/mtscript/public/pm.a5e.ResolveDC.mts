[h:DCData = json.get(arg(0),"DCData")]
[h:thisTokenModifiableComponents = json.get(arg(0),"ModifiableComponents")]
[h:pm.a5e.OverarchingContext = json.get(arg(0),"DCType")]
[h:AllEffectData = json.get(arg(0),"EffectData")]
[h:TokenInfo = arg(1)]
[h:ParentToken = json.get(TokenInfo,"ParentToken")]
[h:TargetToken = json.get(TokenInfo,"TargetToken")]
[h,if(arg(2)): DCResult = "Success"; DCResult = "Failure"]
[h:IsTooltip = 0]
[h:AdditionalDCResolution = 0]
[h:abilityTable = "[]"]

[h:"<!-- Note: Below is a dummy placeholder since a5e.UnifiedAbilities will be set in PassiveFunction anyway -->"]
[h:a5e.UnifiedAbilities = "[]"]

[h:thisTokenDamageDealt = json.get(thisTokenModifiableComponents,"Damage")]
[h:thisTokenConditionInfo = json.get(thisTokenModifiableComponents,"Conditions")]
[h:thisTokenConditionModificationInfo = json.get(thisTokenModifiableComponents,"ConditionModification")]
[h:thisTokenConditionsApplied = json.get(thisTokenModifiableComponents,"ConditionsApplied")]
[h:thisTokenTargetSpecificEffects = json.get(thisTokenModifiableComponents,"TargetSpecific")]

[h:DamageModInfo = if(json.get(DCData,"DamageModifier")=="","{}",json.get(DCData,"DamageModifier"))]
[h:isDamageHalved = if(json.get(DamageModInfo,"DamageHalved")=="",0,json.get(DamageModInfo,"DamageHalved"))]
[h:DCSuccessHalvesDamage = isDamageHalved]
[h:typesHalvedInclusive = json.get(DamageModInfo,"TypesInclusive")]
[h:typesHalvedExclusive = if(json.get(DamageModInfo,"TypesExclusive")=="","[]",json.get(DamageModInfo,"TypesExclusive"))]

[h,if(DCSuccessHalvesDamage!=0),CODE:{
    [h,switch(json.type(typesHalvedInclusive)):
        case "UNKNOWN": typesHalvedFinal = if(typesHalvedInclusive == "All",pm.GetDamageTypes("Name","json"),json.difference(pm.GetDamageTypes("Name","json"),typesHalvedExclusive));
        case "ARRAY": typesHalvedFinal = json.difference(json.intersection(typesHalvedInclusive,pm.GetDamageTypes("Name","json")),typesHalvedExclusive);
        default: typesHalvedFinal = "[]"
    ]
};{
    [h:typesHalvedFinal = "[]"]
}]

[h,if(thisTokenDamageDealt!=""),CODE:{
    [h:thisEffectDamageTypes = json.unique(json.path.read(thisTokenDamageDealt,"\$[*]['DamageType']"))]
    [h:typesHalvedFinal = json.intersection(typesHalvedFinal,thisEffectDamageTypes)]
};{}]

[h,if(DCResult == "Failure"): isDamageHalved = 0]

[h:ConditionsResistedInfo = json.get(DCData,"ConditionsResisted")]
[h,if(ConditionsResistedInfo==""): ConditionsResistedInfo = "{}"]
[h:conditionsResistedInclusive = json.get(ConditionsResistedInfo,"Inclusive")]
[h:conditionsResistedExclusive = if(json.get(ConditionsResistedInfo,"Exclusive")=="","[]",json.get(ConditionsResistedInfo,"Exclusive"))]

[h,switch(json.type(conditionsResistedInclusive)):
    case "UNKNOWN": conditionsResistedFinal = if(conditionsResistedInclusive == "All",thisTokenConditionsApplied,if(conditionsResistedExclusive=="[]","[]",json.difference(thisTokenConditionsApplied,conditionsResistedExclusive)));
    case "ARRAY": conditionsResistedFinal = json.difference(conditionsResistedInclusive,conditionsResistedExclusive);
    default: conditionsResistedFinal = "[]"
]

[h:isConditionResisted = (DCResult == "Success")]

[h:"<!-- Note: Conditions that require failure to be removed are still evaled in success and vice versa, since there are 3 options for if a condition should be removed (success, failure, neither) -->"]
[h:ConditionModificationSaveInfo = json.get(DCData,"ConditionModification")]
[h,if(ConditionModificationSaveInfo != ""): 
    preventConditionRemovalTest = json.get(ConditionModificationSaveInfo,DCResult);
    preventConditionRemovalTest = 0
]

[h:pm.PassiveFunction(pm.a5e.OverarchingContext+DCResult,json.set("","ParentToken",ParentToken))]
[h:switchToken(TargetToken)]
[h:pm.PassiveFunction(pm.a5e.OverarchingContext+DCResult+"Targeted",json.set("","ParentToken",TargetToken))]

[h,foreach(damageInstance,thisTokenDamageDealt),CODE:{
    [h:thisTypeModifiedTest = (json.contains(typesHalvedFinal,json.get(damageInstance,"DamageType")) && isDamageHalved!=0)]
    [h:modificationImmunityTest = (json.get(damageInstance,"NoModification")==1)]
    [h:modifyThisInstance = and(!modificationImmunityTest,thisTypeModifiedTest)]
    [h,if(modifyThisInstance): thisTokenDamageDealt = json.path.set(thisTokenDamageDealt,"\$["+roll.count+"]['Modifier']",json.path.read(thisTokenDamageDealt,"\$["+roll.count+"]['Modifier']")*if(isDamageHalved==1,(1/2),0))]
}]

[h,if(isConditionResisted),CODE:{
	[h,foreach(condition,conditionsResistedFinal): thisTokenConditionInfo = json.path.delete(thisTokenConditionInfo,"\$[*]['Conditions'][*][?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]")]

	[h:tempDeleteCount = 0]
	[h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
		[h:allResistedTest = json.isEmpty(json.get(conditionSet,"Conditions"))]
		[h,if(allResistedTest): thisTokenConditionInfo = json.remove(thisTokenConditionInfo,(roll.count-tempDeleteCount))]
		[h,if(allResistedTest): tempDeleteCount = tempDeleteCount + 1]
	}]
};{}]

[h,if(preventConditionRemovalTest==1): thisTokenConditionModificationInfo = "{}"]

 [h:"<!-- Note: Target specific effect stuff will now be merged in ResolveEffects. -->"]

[h:macro.return = json.set("",
    "Conditions",thisTokenConditionInfo,
    "Damage",thisTokenDamageDealt,
    "ConditionModification",thisTokenConditionModificationInfo,
    "ConditionsApplied",thisTokenConditionsApplied,
	"NeedsAdditionalResolution",AdditionalDCResolution,
	"Table",abilityTable
)]