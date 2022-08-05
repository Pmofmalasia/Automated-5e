[h:basicTargetData = arg(1)]
[h:targetFilters = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:pm.FeatureTargetOptions = pm.a5e.TargetCreatureFiltering(json.set(basicTargetData,"ParentToken",ParentToken),targetFilters)]
	[h:"<!-- TODO: Return self without going through targeting input ONLY if the ability is ALWAYS incapable of targeting anything other than self. -->"]
	[h:pm.FeatureTargets = pm.a5e.TargetCreatureTargeting(pm.FeatureTargetOptions,json.get(basicTargetData,"Number"))]

	[h:effectsToMerge = json.append("",json.set("","Targets",pm.FeatureTargets))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]