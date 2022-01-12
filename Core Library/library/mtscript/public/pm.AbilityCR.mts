[h:pm.Ability=arg(0)]
[h:pm.baseDC=arg(1)]
[h:pm.SaveType=arg(2)]
[h:pm.isSpellSave=arg(3)]

[h:miSaveDCSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.SaveDCSet!=-1)]['SaveDCSet']")]
[h:miSaveDCSetFinal=-1]
[h,foreach(item,miSaveDCSet),CODE:{[h:miSaveDCSetFinal=if(miSaveDCSetFinal==-1,item,max(item,miSaveDCSetFinal))]}]
[h:miSaveDCBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.SaveDCBonus!=0)]['SaveDCBonus']")]
[h:miSaveDCBonusFinal=0]
[h,foreach(item,miSaveDCBonus),CODE:{[h:miSaveDCBonusFinal=miSaveDCBonusFinal+item]}]
[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.baseDC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.baseDC+miSaveDCBonusFinal)))]

[h,if(pm.isSpellSave),CODE:{
	
};{}]

[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.baseDC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.baseDC+miSaveDCBonusFinal)))]

[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Saving Throw","FalseHeader","","FullContents",pm.SaveType,"RulesContents",": DC "+pm.DCFinal+" ","RollContents","","DisplayOrder","['Full','Rules','Roll']","Value",pm.DCFinal,"Units",pm.SaveType)]