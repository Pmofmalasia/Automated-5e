[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.RangeNum=arg(1)]
[h:pm.RangeUnits=arg(2)]
[h:pm.StandardRangeUnits = pm.StandardRange(pm.RangeUnits)]

[h:miRangeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.RangeSet!=-1)]['RangeSet']")]
[h,if(json.isEmpty(miRangeSet)): miRangeSetFinal = -1 ; miRangeSetFinal = math.arrayMax(miRangeSet)]

[h:miRangeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.RangeBonus!=0)]['RangeBonus']")]
[h,if(json.isEmpty(miRangeBonus)): miRangeBonusFinal = 0 ; miRangeBonusFinal = math.arraySum(miRangeBonus)]

[h:pm.RangeNumFinal = if(miRangeSetFinal==-1,(pm.RangeNum+miRangeBonusFinal),max(miRangeSetFinal,(pm.RangeNum+miRangeBonusFinal)))]

[h:macro.return = json.set("","ShowIfCondensed",0,"Header","Range","FalseHeader","","FullContents","","RulesContents",if(or(pm.StandardRangeUnits=="Other",pm.StandardRangeUnits=="Touch",pm.StandardRangeUnits=="Self"),"",pm.RangeNumFinal+" ")+pm.RangeUnits,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.RangeNum,"Units",pm.StandardRangeUnits)]