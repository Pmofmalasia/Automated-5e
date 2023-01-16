[h:DCData = json.get(arg(0),"DCData")]
[h:ConditionsRemovedSaveInfo = json.get(DCData,"ConditionsRemoved")]
[h:thisTokenModifiableComponents = json.get(arg(0),"ModifiableComponents")]
[h:thisTokenDamageDealt = json.get(thisTokenModifiableComponents,"Damage")]
[h:thisTokenConditionInfo = json.get(thisTokenModifiableComponents,"Conditions")]
[h:thisTokenConditionsRemovedInfo = json.get(thisTokenModifiableComponents,"ConditionsRemoved")]
[h:thisTokenConditionsApplied = json.get(thisTokenModifiableComponents,"ConditionsApplied")]
[h:thisTokenTargetSpecificEffects = json.get(thisTokenModifiableComponents,"TargetSpecific")]

[h:"<!-- Note: Conditions that require failure to be removed are evaled in success and vice versa, since there are 3 options for when to remove a condition (success, failure, not affected by save) -->"]
[h:ConditionsRemovedSaveInfo = json.get(DCData,"ConditionsRemoved")]
[h,if(ConditionsRemovedSaveInfo != ""): 
    preventConditionRemovalTest = json.get(ConditionsRemovedSaveInfo,"Success");
    preventConditionRemovalTest = 0
]
[h,if(preventConditionRemovalTest==1): thisTokenConditionsRemovedInfo = "{}"]

[h:macro.return = json.set("",
    "Conditions",thisTokenConditionInfo,
    "Damage",thisTokenDamageDealt,
    "ConditionsRemoved",thisTokenConditionsRemovedInfo,
    "ConditionsApplied",thisTokenConditionsApplied
)]