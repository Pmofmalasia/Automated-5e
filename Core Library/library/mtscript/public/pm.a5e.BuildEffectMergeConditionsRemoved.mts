[h:oldEffect = arg(0)]
[h:newEffect = arg(1)]
[h:oldEffectConditionsRemoved = json.get(oldEffect,"ConditionsRemovedInfo")]

[h:sameGroupTest = -1]

[h,if(json.get(oldEffectConditionsRemoved,"Groups
")==""),CODE:{
    [h:oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"Groups",json.get(newEffect,"Groups"))]
};{
    [h,if(json.get(newEffect,"Groups")!=""): oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"Groups",json.get(newEffect,"Groups"))]
}]

[h,if(json.get(oldEffectConditionsRemoved,"ConditionTypes")==""),CODE:{
    [h:oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"ConditionTypes",json.get(newEffect,"ConditionTypes"))]
};{
    [h,if(json.get(newEffect,"ConditionTypes")!=""): oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"ConditionTypes",json.get(newEffect,"ConditionTypes"))]
}]

[h,if(json.get(oldEffectConditionsRemoved,"ConditionNames")==""),CODE:{
    [h:oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"ConditionNames",json.get(newEffect,"ConditionNames"))]
};{
    [h,if(json.get(newEffect,"ConditionNames")!=""): oldEffectConditionsRemoved = json.set(oldEffectConditionsRemoved,"ConditionNames",json.get(newEffect,"ConditionNames"))]
}]

[h:oldEffect = json.set(oldEffect,"ConditionsRemovedInfo",oldEffectConditionsRemoved)]

[h:macro.return = oldEffect]