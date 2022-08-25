[h:allValidationInfo = "arg(1)"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]

[h:"<!-- TODO: Needs some form of filtering to only allow parts of the effect, e.g. only the attack roll and not the damage. -->"]

[h,if(json.type(abilityPriorData)=="OBJECT"): effectList = json.append("",abilityPriorData); effectList = abilityPriorData]

[h,foreach(effect,effectList),CODE:{
    [h,switch(json.get(effect,"OverallType")),CODE:
        case "Check":{
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempEffectType","Check")]
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempThisTarget",ParentToken)]
        };
        case "Save":{
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempEffectType","Save")]
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempThisTarget",ParentToken)]
        };
        case "Attack":{
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempEffectType","Attack")]
            [h:effectList = json.path.put(effectList,"["+roll.count+"]","tempThisTarget",ParentToken)]
        };
    ]
}]

[h:effectsToMerge = json.append("",json.set("","TargetedEffectOptions",effectList))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]