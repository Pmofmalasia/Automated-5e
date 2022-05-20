[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.a5e.OverarchingContext=json.get(arg(0),"OverarchingContext")]
[h:a5e.UnifiedAbilities = json.get(arg(0),"UnifiedAbilities")]
[h:IsTooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken=json.get(arg(0),"ParentToken")]

[h:pm.baseDieNum=arg(1)]
[h:pm.baseDieSize=arg(2)]
[h:pm.baseBonus=arg(3)]
[h:DamageColor=pm.DamageColor()]

[h,if(json.type(pm.baseDieSize)=="OBJECT"),CODE:{
	[h:pm.PassiveFunction("DieSize",json.set("","SpecificFeature",json.get(pm.baseDieSize,"Name")+json.get(pm.baseDieSize,"Class")+json.get(pm.baseDieSize,"Subclass"),"ParentToken",json.get(pm.baseDieSize,"ParentToken")))]
};{}]

[h:miDieSizeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DieSizeSet!=-1)]['DieSizeSet']")]
[h,if(json.isEmpty(miDieSizeSet)): miDieSizeSetFinal = -1 ; miDieSizeSetFinal = math.arrayMax(miDieSizeSet)]

[h:miDieSizeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DieSizeBonus!=0)]['DieSizeBonus']")]
[h,if(json.isEmpty(miDieSizeBonus)): miDieSizeBonusFinal = 0 ; miDieSizeBonusFinal = math.arraySum(miDieSizeBonus)]

[h:DieSizeFinal = if(miDieSizeSetFinal == -1,(pm.baseDieSize+miDieSizeBonusFinal),max(miDieSizeSetFinal,(pm.baseDieSize+miDieSizeBonusFinal)))]

[h,if(IsTooltip),CODE:{
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Die Size","FalseHeader","","FullContents","","RulesContents",pm.baseDieNum+"d"+DieSizeFinal+pm.PlusMinus(pm.baseBonus,0),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.baseDieNum,"Units",DieSizeFinal)]
};{
	[h:pm.DamageRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.baseBonus)]
	
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Roll","FalseHeader","","FullContents","<b><span style='color:"+DamageColor+"; font-size:1.5em'>"+json.get(pm.DamageRoll,"Roll")+"</span></b>","RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.baseBonus,0)+" = "),"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.baseBonus==0)),"",json.get(pm.DamageRoll,"String")+" = "),"DisplayOrder","['Rules','Roll','Full']","Value",json.get(pm.DamageRoll,"Roll"),"Units","")]
}]