[h:basicTargetData = arg(1)]
[h,if(argCount()>2): targetFilters = arg(2); targetFilters = "{}"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:FeatureTargetOptionData = pm.a5e.TargetCreatureFiltering(json.set(basicTargetData,"ParentToken",ParentToken),targetFilters)]
	
	[h:FeatureTargetOptions = json.get(FeatureTargetOptionData,"ValidTargets")]
	[h:SelfOnlyTest = json.get(FeatureTargetOptionData,"SelfOnly")]
	[h:MustTargetAll = number(json.get(basicTargetData,"TargetAll"))]
	[h,if(SelfOnlyTest || MustTargetAll),CODE:{
		[h:pm.FeatureTargets = FeatureTargetOptions]
	};{
		[h:pm.FeatureTargets = pm.a5e.TargetCreatureTargeting(json.set("",
			"ValidTargets",FeatureTargetOptions,
			"TargetNumber",json.get(basicTargetData,"Number"),
			"ParentToken",ParentToken,
			"Origin",if(json.get(basicTargetData,"Origin") == "",ParentToken,json.get(basicTargetData,"Origin"))
		))]

		[h,if(json.get(basicTargetData,"Number") == 1): pm.FeatureTargets = json.get(pm.FeatureTargets,0)]
	}]
	
	[h:effectsToMerge = json.append("",json.set("","Targets",pm.FeatureTargets))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]