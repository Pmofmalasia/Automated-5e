[h:pm.baseDieNum=arg(1)]
[h:pm.baseDieSize=arg(2)]
[h:pm.baseBonus=arg(3)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:DamageColor=pm.DamageColor()]

[h,if(json.type(pm.baseDieSize)=="OBJECT"),CODE:{
	[h:pm.PassiveFunction("SharedDC",json.set("","SpecificFeature",json.get(pm.baseDieSize,"Name")+json.get(pm.baseDieSize,"Class")+json.get(pm.baseDieSize,"Subclass"),"ParentToken",json.get(pm.baseDieSize,"ParentToken")))]
};{}]

[h:miDieSizeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeSet!=-1)]['DieSizeSet']")]
[h,if(json.isEmpty(miDieSizeSet)): miDieSizeSetFinal = -1 ; miDieSizeSetFinal = math.arrayMax(miDieSizeSet)]

[h:miDieSizeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeBonus!=0)]['DieSizeBonus']")]
[h,if(json.isEmpty(miDieSizeBonus)): miDieSizeBonusFinal = 0 ; miDieSizeBonusFinal = math.arraySum(miDieSizeBonus)]

[h:DieSizeFinal = if(miDieSizeSetFinal == -1,(pm.baseDieSize+miDieSizeBonusFinal),max(miDieSizeSetFinal,(pm.baseDieSize+miDieSizeBonusFinal)))]

[h,if(IsTooltip),CODE:{
	[h:currentFeatureRoll = DieSizeFinal]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Die Size",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",pm.baseDieNum+"d"+DieSizeFinal+pm.PlusMinus(pm.baseBonus,0),"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{
	[h:pm.MiscRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.baseBonus)]
	
	[h:currentFeatureRoll = json.get(pm.MiscRoll,"Total")]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Roll",
		"FalseHeader","",
		"FullContents","<b><span style='color:"+DamageColor+"; font-size:1.5em'>"+json.get(pm.MiscRoll,"Total")+"</span></b>",
		"RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.baseBonus,0)+" = "),
		"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.baseBonus==0)),"",json.get(pm.MiscRoll,"String")+" = "),
		"DisplayOrder","['Rules','Roll','Full']")
	)]
	
	[h:effectsToMerge = json.append("",json.set("","Roll",pm.MiscRoll))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]