[h:oldEffect = arg(0)]
[h:newEffect = arg(1)]

[h:sameGroupTest = -1]

[h,foreach(conditionGroup,json.get(oldEffect,"ConditionInfo")): sameGroupTest = if(json.equals(json.get(newEffect,"EndInfo"),json.get(json.get(oldEffect,"ConditionInfo"),"EndInfo")),roll.count,sameGroupTest)]

[h,if(sameGroupTest>=0),CODE:{
    [h:oldEffectNewConditions = json.merge(json.get(json.get(json.get(oldEffect,"ConditionInfo"),sameGroupTest),"Conditions"),json.get(newEffect,"Conditions"))]
    [h:oldEffect = json.path.set(oldEffect,"['ConditionInfo']["+sameGroupTest+"]['Conditions']",oldEffectNewConditions)]
};{
    [h:oldEffect = json.set(oldEffect,"ConditionInfo",json.append(json.get(oldEffect,"ConditionInfo"),newEffect))]
}] 

[h:macro.return = oldEffect]