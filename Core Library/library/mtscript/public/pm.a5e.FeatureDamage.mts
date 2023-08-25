[h:AllDamageArgs = json.remove(macro.args,0)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:"<!-- This macro is basically just a wrapper for FeatureDamageRoll so that other Feature UDFs can make damage rolls without having to add them to an effect (e.g. FeatureDamageRollModification) -->"]
[h,if(json.length(AllDamageArgs)>4):
	pm.a5e.FeatureDamageRoll(json.get(AllDamageArgs,0),json.get(AllDamageArgs,1),json.get(AllDamageArgs,2),json.get(AllDamageArgs,3),json.get(AllDamageArgs,4));
	pm.a5e.FeatureDamageRoll(json.get(AllDamageArgs,0),json.get(AllDamageArgs,1),json.get(AllDamageArgs,2),json.get(AllDamageArgs,3))
]

[h,if(IsTooltip),CODE:{};{
	[h:effectsToMerge = json.append("",json.set("","Damage",json.append("",pm.DamageRoll)))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]