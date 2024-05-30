[h:EffectToCheck = arg(0)]
[h:EffectPrerequisites = arg(1)]
[h,if(argCount() > 2): ParentToken = arg(2); ParentToken = ""]

[h:MeetsAllPrereqs = 1]
[h:GeneralPrerequisites = json.get(EffectPrerequisites,"General")]
[h,if(!json.isEmpty(GeneralPrerequisites)): MeetsAllPrereqs = pm.a5e.EffectGeneralPrereqs(EffectToCheck,GeneralPrerequisites)]

[h,if(json.contains(EffectPrerequisites,"ForcedSave")): MeetsAllPrereqs = pm.a5e.EffectForcedSavePrereqs(EffectToCheck,json.get(EffectPrerequisites,"ForcedSave"))]
[h:return(MeetsAllPrereqs,0)]

[h:AttackPrerequisites = json.get(EffectPrerequisites,"Attack")]
[h:DamagePrerequisites = json.get(EffectPrerequisites,"Damage")]
[h:ForcedCheckPrerequisites = json.get(EffectPrerequisites,"ForcedCheck")]
[h:ConditionsAppliedPrerequisites = json.get(EffectPrerequisites,"ConditionsApplied")]
[h:MovementPrerequisites = json.get(EffectPrerequisites,"Movement")]
[h:TargetPrerequisites = json.get(EffectPrerequisites,"Target")]
[h:"<!-- Note: Will need additional steps for Target prereq than just jumping to CreaturePrereq as will need to account for more general things like target number, other target types (object, effects), etc. Likely will have a TargetsPrereq that calls to CreaturePrereq. -->"]
[h:UserPrerequisites = json.get(EffectPrerequisites,"User")]
[h,if(!json.isEmpty(UserPrerequisites)): MeetsAllPrereqs = pm.a5e.CreaturePrereqs(json.get(EffectToCheck,"ParentToken"),UserPrerequisites,ParentToken)]

[h:return(0,MeetsAllPrereqs)]