[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.DurationNum=arg(1)]
[h:pm.DurationUnits=arg(2)]

[h:miDurationSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DurationSet!=-1)]['DurationSet']")]
[h,if(json.isEmpty(miDurationSet)): miDurationSetFinal = -1 ; miDurationSetFinal = math.arrayMax(miDurationSet)]

[h:miDurationBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DurationBonus!=0)]['DurationBonus']")]
[h,if(json.isEmpty(miDurationBonus)): miDurationBonusFinal = 0 ; miDurationBonusFinal = math.arraySum(miDurationBonus)]

[h:pm.DurationFinal=if(miDurationSetFinal==-1,(pm.DurationNum+miDurationBonusFinal),max(miDurationSetFinal,(pm.DurationNum+miDurationBonusFinal)))]
[h:macro.return = json.set("","ShowIfCondensed",0,"Header","Duration","FalseHeader","","FullContents","","RulesContents",pm.DurationFinal+" "+pm.DurationUnits,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.DurationFinal,"Units","Rounds")]