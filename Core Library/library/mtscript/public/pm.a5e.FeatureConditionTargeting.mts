[h:targetTokenOptions = arg(1)]
[h:targetFilters = arg(2)]
[h:targetOtherData = arg(3)]
[h:targetNumber = json.get(targetOtherData,"Number")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:FeatureTargetConditionOptions = pm.a5e.TargetConditionFiltering(targetTokenOptions,targetFilters)]
	
	[h:FeatureConditionTargets = pm.a5e.TargetConditionTargeting(FeatureTargetConditionOptions,targetNumber)]
	
	[h:effectsToMerge = json.append("",json.set("","TargetedConditions",FeatureConditionTargets))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]