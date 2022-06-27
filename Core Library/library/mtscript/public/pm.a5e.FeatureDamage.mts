[h:pm.baseDieNum=arg(1)]
[h:pm.baseDieSize=arg(2)]
[h:pm.DamageBonus=arg(3)]
[h:pm.DamageType=arg(4)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]

[h:miDieSizeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeSet!=-1)]['DieSizeSet']")]
[h,if(json.isEmpty(miDieSizeSet)): miDieSizeSetFinal = -1 ; miDieSizeSetFinal = math.arrayMax(miDieSizeSet)]
[h:miDieSizeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeBonus!=0)]['DieSizeBonus']")]
[h,if(json.isEmpty(miDieSizeBonus)): miDieSizeBonusFinal = 0 ; miDieSizeBonusFinal = math.arraySum(miDieSizeBonus)]
[h:DieSizeFinal = if(miDieSizeSetFinal == -1,(pm.baseDieSize+miDieSizeBonusFinal),max(miDieSizeSetFinal,(pm.baseDieSize+miDieSizeBonusFinal)))]

[h,if(IsTooltip),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),"Healing","Damage"),
		"FalseHeader","",
		"FullContents","",
		"RulesContents",if(pm.baseDieNum>0,pm.baseDieNum+"d"+DieSizeFinal,"")+pm.PlusMinus(pm.DamageBonus,0)+" "+pm.DamageType+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),""," Damage"),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']")
	)]
};{
	[h:pm.DamageRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.DamageBonus)]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",pm.DamageType+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<b><span style='color:"+if(or(pm.DamageType=="Healing",pm.DamageType=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+json.get(pm.DamageRoll,"Roll")+"</span></b>",
		"RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.DamageBonus,0)+" = "),
		"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.DamageBonus==0)),"",json.get(pm.DamageRoll,"String")+" = "),
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:effectsToMerge = json.append("",json.set("","Damage",json.set("",pm.DamageType,json.get(pm.DamageRoll,"Roll"))))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]