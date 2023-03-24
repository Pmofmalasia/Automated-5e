[h:DCData = json.get(arg(0),"DCData")]
[h:thisTokenModifiableComponents = json.get(arg(0),"ModifiableComponents")]
[h:thisTokenDamageDealt = json.get(thisTokenModifiableComponents,"Damage")]
[h:thisTokenConditionInfo = json.get(thisTokenModifiableComponents,"Conditions")]
[h:thisTokenConditionModificationInfo = json.get(thisTokenModifiableComponents,"ConditionModification")]
[h:thisTokenConditionsApplied = json.get(thisTokenModifiableComponents,"ConditionsApplied")]
[h:thisTokenTargetSpecificEffects = json.get(thisTokenModifiableComponents,"TargetSpecific")]

[h:"<!-- Note: Conditions that require failure to be removed are evaled in success and vice versa, since there are 3 options for when to remove a condition (success, failure, not affected by save) -->"]
[h:ConditionModificationSaveInfo = json.get(DCData,"ConditionModification")]
[h,if(ConditionModificationSaveInfo != ""): 
    preventConditionRemovalTest = json.get(ConditionModificationSaveInfo,"Success");
    preventConditionRemovalTest = 0
]
[h,if(preventConditionRemovalTest==1): thisTokenConditionModificationInfo = "{}"]

[h:macro.return = json.set("",
    "Conditions",thisTokenConditionInfo,
    "Damage",thisTokenDamageDealt,
    "ConditionModification",thisTokenConditionModificationInfo,
    "ConditionsApplied",thisTokenConditionsApplied
)]