[h:allValidationInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip,"Tooltip")]

[h:effectOptions = pm.a5e.TargetEffectFiltering(allValidationInfo)]

[h:effectChoice = pm.a5e.TargetEffectTargeting(effectOptions)]