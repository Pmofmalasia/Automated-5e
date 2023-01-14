[h:DCData = json.get(arg(0),"DCData")]
[h:ConditionsRemovedSaveInfo = json.get(DCData,"ConditionsRemoved")]
[h:broadcast(effConditionInfo)]

[h:"<!-- Note: Conditions that require failure to be removed are evaled in success and vice versa, since there are 3 options for when to remove a condition (success, failure, not affected by save) -->"]
[h:ConditionsRemovedSaveInfo = json.get(DCData,"ConditionsRemoved")]
[h,if(ConditionsRemovedSaveInfo != ""): 
    preventConditionRemovalTest = json.get(ConditionsRemovedSaveInfo,"Success");
    preventConditionRemovalTest = 0
]
[h,if(preventConditionRemovalTest==1): thisTokenConditionsRemovedInfo = "{}"]