[h:pm.DurationNum = arg(1)]
[h:pm.DurationUnits = arg(2)]
[h:currentFeatureDurationUnits = pm.StandardDuration(pm.DurationUnits)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:miDurationSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DurationSet!=-1)]['DurationSet']")]
[h,if(json.isEmpty(miDurationSet)): miDurationSetFinal = -1 ; miDurationSetFinal = math.arrayMax(miDurationSet)]

[h:miDurationBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DurationBonus!=0)]['DurationBonus']")]
[h,if(json.isEmpty(miDurationBonus)): miDurationBonusFinal = 0 ; miDurationBonusFinal = math.arraySum(miDurationBonus)]

[h:currentFeatureDuration = if(miDurationSetFinal==-1,(pm.DurationNum+miDurationBonusFinal),max(miDurationSetFinal,(pm.DurationNum+miDurationBonusFinal)))]

[h:abilityTable = json.append(abilityTable,(json.set("","ShowIfCondensed",0,"Header","Duration","FalseHeader","","FullContents","","RulesContents",currentFeatureDuration+" "+pm.DurationUnits+if(currentFeatureDuration!=1,"s",""),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",currentFeatureDuration,"Units",currentFeatureDuration)))]