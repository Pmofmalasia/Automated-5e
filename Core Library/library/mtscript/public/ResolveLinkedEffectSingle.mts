[h:LinkedEffectData = macro.args]
[h:thisTargetLinkedEffects = json.get(LinkedEffectData,"LinkedEffects")]
[h:thisTarget = json.get(LinkedEffectData,"SpecificTargets")]

[h:ParentEffectData = json.remove(LinkedEffectData,"SpecificTargets")]
[h:ParentEffectData = json.remove(ParentEffectData,"LinkedEffects")]

[h:abilityTable = "[]"]
[h,foreach(tempEffect,thisTargetLinkedEffects),CODE:{
	[h,MACRO("ResolveEffects@Lib:pm.a5e.Core"): json.set(tempEffect,
		"SpecificTargets",thisTarget,
		"ParentEffectData",ParentEffectData
	)]

	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:macro.return = json.set("","Table",abilityTable)]