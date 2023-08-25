[h:basicTargetData = arg(1)]
[h,if(argCount()>2): targetObjectFilters = arg(2); targetObjectFilters = "{}"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{};{
	[h:targetObjectCarryLimit = json.get(targetObjectFilters,"Carried")]
	[h,if(targetObjectCarryLimit != 0),CODE:{
		[h,if(json.get(targetObjectFilters,"UseCreatureTargetingLimitsForHeld") == 1): 
			targetCarriedObjectCreatures = pm.a5e.GetEffectComponent(pm.a5e.EffectData,"TargetOptions",whichEffect);
			targetCarriedObjectCreatures = json.get(pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",json.get(basicTargetData,"ParentToken"),"Range",json.get(basicTargetData,"Range")),json.get(targetObjectFilters,"CarryingCreatureFilter")),"ValidTargets")
		]

		[h:targetValidHeldObjects = pm.a5e.TargetHeldObjectFiltering(targetCarriedObjectCreatures,targetObjectFilters)]
	};{}]

	[h,if(targetObjectCarryLimit != 1),CODE:{
		[h:"<!-- TODO: Add non-carried object filtering here later -->"]
	};{}]

	[h:targetObjectValidTargets = json.set("","Object",targetValidHeldObjects)]
	
	[h:MultiTypeTargetingData = json.set("",
		"ValidTargets",targetObjectValidTargets,
		"TargetingInstances",1,
		"TargetNumber",json.get(basicTargetData,"Number")
	)]
	[h,MACRO("MixedTypeTargeting@Lib:pm.a5e.Core"): MultiTypeTargetingData]
	[h:TargetObjects = macro.return]

	[h:"<!-- Note: This is here because the output is in an 'extra' array to account for mulitple targeting instances -->"]
	[h,if(json.get(basicTargetData,"Number")==1): TargetObjects = json.get(TargetObjects,0)]
	
	[h:effectsToMerge = json.append("",json.set("","Targets",TargetObjects))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]