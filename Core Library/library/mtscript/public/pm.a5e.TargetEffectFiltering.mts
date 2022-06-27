[h:allValidationInfo = arg(0)]
[h:effectTypesAllowed = json.get(allValidationInfo,"EffectTypes")]
[h:effectSaveFilters = json.get(allValidationInfo,"SaveFilters")]
[h:effectCheckFilters = json.get(allValidationInfo,"CheckFilters")]
[h:effectAttackFilters = json.get(allValidationInfo,"AttackFilters")]
[h:effectSpellFilters = json.get(allValidationInfo,"SpellFilters")]
[h:effectWeaponFilters = json.get(allValidationInfo,"WeaponFilters")]
[h:effectDeathFilters = json.get(allValidationInfo,"DeathFilters")]
[h:effectInitiativeFilters = json.get(allValidationInfo,"InitiativeFilters")]
[h:effectConcFilters = json.get(allValidationInfo,"ConcFilters")]
[h:effectTarget = json.get(allValidationInfo,"Target")]

[h:currentEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]

[h:validEffects = "[]"]
[h,if(json.get(effectTypesAllowed,"Save")==1),CODE:{
    [h:tempValidEffects = json.path.read(currentEffects,"[*][?(@.Save.SavesMade."+effectTarget+"!=null)]['ID']","DEFAULT_PATH_LEAF_TO_NULL")]
};{}]

[h,if(json.get(effectTypesAllowed,"Check")==1),CODE:{
    [h:tempValidEffects = json.path.read(currentEffects,"[*][?(@.Check.ChecksMade."+effectTarget+"!=null)]['ID']","DEFAULT_PATH_LEAF_TO_NULL")]
};{}]

[h,if(json.get(effectTypesAllowed,"Attack")==1),CODE:{
    [h:tempValidEffects = json.path.read(currentEffects,"[*][?(@.Attack!=null && @.ParentToken=="+effectTarget+")]]['ID']","DEFAULT_PATH_LEAF_TO_NULL")]
};{}]

[h:"<!-- Should track both the effect and the part of the effect that is targeted - would feel bad to have to essentially pick an effect twice -->"]