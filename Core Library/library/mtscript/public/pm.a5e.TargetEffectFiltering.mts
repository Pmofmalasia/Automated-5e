[h:allValidationInfo = arg(0)]
[h:effectIDOptions = json.get(allValidationInfo,"IDOptions")]
[h:effectTargets = json.get(allValidationInfo,"Targets")]
[h:effectTypesAllowed = json.get(allValidationInfo,"EffectTypes")]
[h:effectSaveFilters = json.get(allValidationInfo,"SaveFilters")]
[h:effectCheckFilters = json.get(allValidationInfo,"CheckFilters")]
[h:effectAttackFilters = json.get(allValidationInfo,"AttackFilters")]
[h:effectSpellFilters = json.get(allValidationInfo,"SpellFilters")]
[h:effectWeaponFilters = json.get(allValidationInfo,"WeaponFilters")]
[h:effectDeathFilters = json.get(allValidationInfo,"DeathFilters")]
[h:effectInitiativeFilters = json.get(allValidationInfo,"InitiativeFilters")]
[h:effectConcFilters = json.get(allValidationInfo,"ConcFilters")]

[h:allEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:effectFilter = ""]
[h:"<!-- effectIDOptions exists instead of just using that ID in the first place for situations like Battle Master maneuvers activated through a link following an attack that might apply to any of the attacks made. If effectIDOptions is only one ID, it should just return that ID without requiring an input. -->"]

[h,if(effectIDOptions==""),CODE:{
    [h:specificEffectList = allEffects]
};{
    [h,if(json.length(effectIDOptions)==1): return(0,json.get(effectIDOptions,0))]
    [h:specificEffectList = json.path.read(allEffects,"[*][?(@.ID in "+effectIDOptions+")]")]
}]

[h:effectsWithTarget = "[]"]
[h,if(effectTargets=="" || effectTargets=="Undefined"),CODE:{
    [h,foreach(effect,allEffects),CODE:{
        [h:effectsWithTarget = json.append(effectsWithTarget,json.set(effect,"tempThisTarget",json.get(effect,"ParentToken")))]
        [h,foreach(target,json.get(effect,"Targets")): effectsWithTarget = json.append(effectsWithTarget,json.set(effect,"tempThisTarget",target))]
    }]
};{
    [h:effectsWithTarget = "[]"]
    [h,foreach(effect,allEffects),CODE:{
        [h:tempParentToken = json.get(effect,"ParentToken")]
        [h,if(json.contains(effectTargets,tempParentToken)): effectsWithTarget = json.append(effectsWithTarget,json.set(effect,"tempThisTarget",tempParentToken))]

        [h,foreach(target,json.get(effect,"Targets")):
            effectsWithTarget = if(json.contains(effectTargets,target),
            json.append(effectsWithTarget,json.set(effect,"tempThisTarget",target)),
            effectsWithTarget)
        ]
    }]
}]

[h:effectOptions = "[]"]
[h,if(effectTypesAllowed!=""),CODE:{
    [h,if(json.get(effectTypesAllowed,"Check")==1),CODE:{
        [h:tempEffectOptions = "[]"]
        [h:effectsOfThisType = "[]"]
        [h,foreach(effect,effectsWithTarget): effectsOfThisType = json.merge(effectsOfThisType,json.path.read(json.get(effectsWithTarget,roll.count),"[?(@.ToResolve.CheckDC.ChecksMade."+json.get(effect,"tempThisTarget")+".Value >= 0 || (@.ParentToken=='"+json.get(effect,"tempThisTarget")+"' && @.ToResolve.CheckDC.DC.Value >= 0))]"))]
        [h,if(!json.isEmpty(effectsOfThisType)): tempEffectOptions = json.merge(tempEffectOptions,json.path.put(effectsOfThisType,"[*]","tempEffectType","Check"))]
        [h:effectOptions = json.merge(effectOptions,tempEffectOptions)]
    };{}]
    
    [h,if(json.get(effectTypesAllowed,"Save")==1),CODE:{
        [h:tempEffectOptions = "[]"]
        [h:effectsOfThisType = "[]"]
        [h,foreach(effect,effectsWithTarget): effectsOfThisType = json.merge(effectsOfThisType,json.path.read(json.get(effectsWithTarget,roll.count),"[?(@.ToResolve.SaveDC.SavesMade."+json.get(effect,"tempThisTarget")+".Value >= 0)]"))]
        [h,if(!json.isEmpty(effectsOfThisType)): tempEffectOptions = json.merge(tempEffectOptions,json.path.put(effectsOfThisType,"[*]","tempEffectType","Save"))]
        [h:effectOptions = json.merge(effectOptions,tempEffectOptions)]
    };{}]
    
    [h,if(json.get(effectTypesAllowed,"Attack")==1),CODE:{
        [h:tempEffectOptions = "[]"]
        [h:effectsOfThisType = "[]"]
        [h,foreach(effect,effectsWithTarget): effectsOfThisType = json.merge(effectsOfThisType,json.path.read(effectsWithTarget,"["+roll.count+"][?(@.ParentToken=='"+json.get(effect,"tempThisTarget")+"' && @.ToResolve.Attack!=null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
        [h,if(!json.isEmpty(effectsOfThisType)): tempEffectOptions = json.merge(tempEffectOptions,json.path.put(effectsOfThisType,"[*]","tempEffectType","Attack"))]
        [h:effectOptions = json.merge(effectOptions,tempEffectOptions)]
    };{}]
    
    [h,if(json.get(effectTypesAllowed,"Damage")==1): effectFilter = listAppend(effectFilter,"@.ToResolve.Damage!=null"," || ")]
    
    [h,if(json.get(effectTypesAllowed,"WeaponAttack")==1): effectFilter = listAppend(effectFilter,"@.Type=='WeaponAttack'"," || ")]
    
    [h,if(json.get(effectTypesAllowed,"Spell")==1): effectFilter = listAppend(effectFilter,"@.Type=='Spell'"," || ")]
    
    [h,if(json.get(effectTypesAllowed,"Condition")==1): effectFilter = listAppend(effectFilter,"@.ToResolve.Conditions!=null"," || ")]
};{
    [h:effectOptions = effectsWithTarget]
}]

[h,if(effectSaveFilters!=""),CODE:{

};{}]

[h,if(effectCheckFilters!=""),CODE:{

};{}]

[h,if(effectAttackFilters!=""),CODE:{

};{}]
[h:"<!-- Weapon and Spell filters may need to be moved up sooner also -->"]
[h,if(effectSpellFilters!=""),CODE:{

};{}]

[h,if(effectWeaponFilters!=""),CODE:{

};{}]

[h,if(effectDeathFilters!=""),CODE:{

};{}]

[h,if(effectInitiativeFilters!=""),CODE:{

};{}]

[h,if(effectConcFilters!=""),CODE:{

};{}]

[h:macro.return = effectOptions]