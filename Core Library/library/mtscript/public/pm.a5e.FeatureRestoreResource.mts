[h:pm.ResourceInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:abilityTable = json.merge(abilityTable,json.get(resourceData,"Table"))]

[h:return(!IsTooltip)]

[h:effectsToMerge = json.append("",json.set("","ResourceRestoration",json.get(resourceData,"Data")))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]