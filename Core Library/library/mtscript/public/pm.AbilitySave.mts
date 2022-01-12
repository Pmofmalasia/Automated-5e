[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.baseDC=arg(1)]
[h:pm.SaveType=arg(2)]
[h:pm.isSpellSave=arg(3)]

[h:miSaveDCSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.SaveDCSet!=-1)]['SaveDCSet']")]
[h,if(json.isEmpty(miSaveDCSet)): miSaveDCSetFinal = -1 ; miSaveDCSetFinal = math.arrayMax(miSaveDCSet)]

[h:miSaveDCBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.SaveDCBonus!=0)]['SaveDCBonus']")]
[h,if(json.isEmpty(miSaveDCBonus)): miSaveDCBonusFinal = 0 ; miSaveDCBonusFinal = math.arraySum(miSaveDCBonus)]

[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.baseDC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.baseDC+miSaveDCBonusFinal)))]

[h,if(pm.isSpellSave),CODE:{
	
};{}]

[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.baseDC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.baseDC+miSaveDCBonusFinal)))]

[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Saving Throw","FalseHeader","","FullContents",pm.SaveType,"RulesContents"," - <b>DC <span style='font-size:1.5em'>"+pm.DCFinal+"</span></b>","RollContents","","DisplayOrder","['Full','Rules','Roll']","Value",pm.DCFinal,"Units",pm.SaveType)]