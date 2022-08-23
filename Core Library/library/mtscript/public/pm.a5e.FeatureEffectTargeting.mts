[h:allValidationInfo = arg(1)]
[h,if(argCount()>2): miscOptions = arg(2); miscOptions = "{}"]

[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]

[h:effectOptions = pm.a5e.TargetEffectFiltering(allValidationInfo)]

[h:effectChoice = pm.a5e.TargetEffectTargeting(effectOptions,miscOptions)]

[h:effectChoice = json.path.delete(effectChoice,"[*][?(@.OverallType=='None')]")]

[h:return(!json.isEmpty(effectChoice))]

[h:effectChoice = json.path.set(effectChoice,"[*][?(@.OverallType == '"+json.get(abilityPriorData,"OverallType")+"' && @.ID == '')]",abilityPriorData)]

[h:effectsToMerge = json.append("",json.set("","TargetedEffects",effectChoice))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]