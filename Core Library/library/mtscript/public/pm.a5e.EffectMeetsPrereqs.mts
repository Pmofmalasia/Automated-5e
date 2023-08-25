[h:EffectToCheck = arg(0)]
[h:PrerequisitesToCheckFor = arg(1)]

[h:MeetsAllPrereqs = 1]
[h:GeneralPrerequisites = json.get(PrerequisitesToCheckFor,"General")]

[h,if(json.contains(PrerequisitesToCheckFor,"ForcedSave")): MeetsAllPrereqs = pm.a5e.EffectForcedSavePrereqs(EffectToCheck,json.get(PrerequisitesToCheckFor,"ForcedSave"))]
[h:return(MeetsAllPrereqs,0)]

[h:AttackPrerequisites = json.get(PrerequisitesToCheckFor,"Attack")]
[h:DamagePrerequisites = json.get(PrerequisitesToCheckFor,"Damage")]
[h:ForcedCheckPrerequisites = json.get(PrerequisitesToCheckFor,"ForcedCheck")]
[h:ConditionsAppliedPrerequisites = json.get(PrerequisitesToCheckFor,"ConditionsApplied")]
[h:MovementPrerequisites = json.get(PrerequisitesToCheckFor,"Movement")]
[h:TargetPrerequisites = json.get(PrerequisitesToCheckFor,"Target")]

[h:return(0,MeetsAllPrereqs)]