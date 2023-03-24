[h:ModificationMethod = arg(1)]
[h,if(argCount()>2):
	MethodSpecificData = arg(2);
	MethodSpecificData = "{}"
]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:return(!IsTooltip)]

[h:CombinedData = json.set(MethodSpecificData,
	"Method",ModificationMethod
)]

[h,MACRO("AssembleModifyConditionData@Lib:pm.a5e.Core"): CombinedData]

[h:effectsToMerge = json.append("",json.set("","ConditionModificationInfo",macro.return))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]