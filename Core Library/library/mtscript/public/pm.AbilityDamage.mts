[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.baseDieNum=arg(1)]
[h:pm.baseDieSize=arg(2)]
[h:pm.DamageBonus=arg(3)]
[h:pm.DamageType=arg(4)]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]

[h:miDieSizeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DieSizeSet!=-1)]['DieSizeSet']")]
[h,if(json.isEmpty(miDieSizeSet)): miDieSizeSetFinal = -1 ; miDieSizeSetFinal = math.arrayMax(miDieSizeSet)]
[h:miDieSizeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.DieSizeBonus!=0)]['DieSizeBonus']")]
[h,if(json.isEmpty(miDieSizeBonus)): miDieSizeBonusFinal = 0 ; miDieSizeBonusFinal = math.arraySum(miDieSizeBonus)]
[h:DieSizeFinal = if(miDieSizeSetFinal == -1,(pm.baseDieSize+miDieSizeBonusFinal),max(miDieSizeSetFinal,(pm.baseDieSize+miDieSizeBonusFinal)))]

[h,if(pm.Tooltip),CODE:{
	[h:macro.return = json.set("",
		"Table",json.set("","ShowIfCondensed",1,"Header",if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),"Healing","Damage"),"FalseHeader","","FullContents","","RulesContents",if(pm.baseDieNum>0,pm.baseDieNum+"d"+DieSizeFinal,"")+pm.PlusMinus(pm.DamageBonus,0)+" "+pm.DamageType+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),""," Damage"),"RollContents","","DisplayOrder","['Rules','Roll','Full']")
		,"Value",pm.baseDieNum,
		"Units",DieSizeFinal
	)]
};{
	[h:pm.DamageRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.DamageBonus)]
	
	[h:macro.return = json.set("","Table",
		json.set("","ShowIfCondensed",1,"Header",pm.DamageType+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),""," Damage"),"FalseHeader","","FullContents","<b><span style='color:"+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+json.get(pm.DamageRoll,"Roll")+"</span></b>","RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.DamageBonus,0)+" = "),"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.DamageBonus==0)),"",json.get(pm.DamageRoll,"String")+" = "),"DisplayOrder","['Rules','Roll','Full']"),
		"Amount",json.get(pm.DamageRoll,"Roll"),
		"DamageType",pm.DamageType
	)]
}]