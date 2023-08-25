[h:pm.DurationNum = arg(1)]
[h:pm.DurationUnits = arg(2)]
[h:currentFeatureDurationUnits = pm.StandardDuration(pm.DurationUnits)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:"<!-- TODO: Re-add magic item changing duration here -->"]

[h:currentFeatureDuration = pm.DurationNum]

[h:abilityTable = json.append(abilityTable,(json.set("","ShowIfCondensed",0,"Header","Duration","FalseHeader","","FullContents","","RulesContents",currentFeatureDuration+" "+currentFeatureDurationUnits+if(currentFeatureDuration!=1,"s",""),"RollContents","","DisplayOrder","['Rules','Roll','Full']")))]

[h:return(!IsTooltip)]
	
[h:effectsToMerge = json.append("",json.set("","Duration",json.set("","Value",currentFeatureDuration,"Units",currentFeatureDurationUnits)))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]