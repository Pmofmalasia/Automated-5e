[h:"<!-- Use case: Adds a previously defined set of effects (currently only from args sent in FeatureLink) to the list of valid targets for targeting an effect. Therefore, needs to be paired with FeatureEffectTargeting. -->"]
[h:allValidationInfo = "arg(1)"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]

[h:"<!-- TODO: Needs some form of filtering to only allow parts of the effect, e.g. only the attack roll and not the damage. -->"]
[h:"<!-- TODO: Currently relies on args sent in FeatureLink sending all of the data, will likely want an option to send just an effect ID as an arg in the future. -->"]

[h,if(json.type(abilityPriorData)=="OBJECT"): effectList = json.append("",abilityPriorData); effectList = abilityPriorData]

[h,foreach(effect,effectList),CODE:{
    [h,switch(json.get(effect,"TestType")),CODE:
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
		default:{}
    ]
}]

[h:effectsToMerge = json.append("",json.set("","TargetedEffectOptions",effectList))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]