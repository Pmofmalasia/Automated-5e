[h:pm.RangeNum = arg(1)]
[h:pm.RangeUnits=arg(2)]
[h:currentFeatureRangeUnits = pm.StandardRange(pm.RangeUnits)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:miRangeSet = json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.RangeSet!=-1)]['RangeSet']")]
[h,if(json.isEmpty(miRangeSet)): miRangeSetFinal = -1 ; miRangeSetFinal = math.arrayMax(miRangeSet)]

[h:miRangeBonus = json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.RangeBonus!=0)]['RangeBonus']")]
[h,if(json.isEmpty(miRangeBonus)): miRangeBonusFinal = 0 ; miRangeBonusFinal = math.arraySum(miRangeBonus)]

[h:currentFeatureRange = if(miRangeSetFinal==-1,(pm.RangeNum + miRangeBonusFinal),max(miRangeSetFinal,(pm.RangeNum + miRangeBonusFinal)))]

[h:abilityTable = json.append(abilityTable,json.set("","ShowIfCondensed",0,"Header","Range","FalseHeader","","FullContents","","RulesContents",if(or(currentFeatureRangeUnits=="Other",currentFeatureRangeUnits=="Touch",currentFeatureRangeUnits=="Self"),"",currentFeatureRange+" ")+currentFeatureRangeUnits,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",currentFeatureRange,"Units",currentFeatureRangeUnits))]