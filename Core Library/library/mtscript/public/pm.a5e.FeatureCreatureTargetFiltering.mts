[h:basicTargetData = arg(1)]
[h:targetFilters = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:pm.FeatureTargetOptions = pm.a5e.TargetCreatureFiltering(json.set(basicTargetData,"ParentToken",ParentToken),targetFilters)]

	[h:effectsToMerge = json.append("",json.set("","TargetOptions",json.get(pm.FeatureTargetOptions,"ValidTargets")))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]