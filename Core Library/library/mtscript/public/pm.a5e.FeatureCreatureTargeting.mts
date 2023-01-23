[h:basicTargetData = arg(1)]
[h:targetFilters = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:FeatureTargetOptionData = pm.a5e.TargetCreatureFiltering(json.set(basicTargetData,"ParentToken",ParentToken),targetFilters)]
	[h:"<!-- TODO: Return self without going through targeting input ONLY if the ability is ALWAYS incapable of targeting anything other than self. -->"]
	
	[h:FeatureTargetOptions = json.get(FeatureTargetOptionData,"ValidTargets")]
	[h:SelfOnlyTest = json.get(FeatureTargetOptionData,"SelfOnly")]
	[h,if(SelfOnlyTest),CODE:{
		[h:pm.FeatureTargets = FeatureTargetOptions]
	};{
		[h:pm.FeatureTargets = pm.a5e.TargetCreatureTargeting(FeatureTargetOptions,json.get(basicTargetData,"Number"))]
	}]
	
	[h:effectsToMerge = json.append("",json.set("","Targets",pm.FeatureTargets))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]