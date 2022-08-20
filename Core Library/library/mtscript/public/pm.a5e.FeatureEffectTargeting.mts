[h:allValidationInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]

[h:effectOptions = pm.a5e.TargetEffectFiltering(allValidationInfo)]

[h:effectChoice = pm.a5e.TargetEffectTargeting(effectOptions)]

[h:effectsToMerge = json.append("",json.set("","EffectTarget",effectChoice))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]