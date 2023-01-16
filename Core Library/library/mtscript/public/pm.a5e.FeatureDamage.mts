[h:pm.baseDieNum=arg(1)]
[h:pm.baseDieSize=arg(2)]
[h:pm.DamageBonus=arg(3)]
[h:pm.DamageType=arg(4)]
[h,if(argCount()>5),CODE:{
	[h:damNoModification = if(json.get(arg(5),"NoModification")=="",0,json.get(arg(5),"NoModification"))]
	[h:damIsWeapon = if(json.get(arg(5),"IsWeapon")=="",0,json.get(arg(5),"IsWeapon"))]
	[h:damIsSpell = if(json.get(arg(5),"IsSpell")=="",0,json.get(arg(5),"IsSpell"))]
};{
	[h:damNoModification = 0]
	[h:damIsWeapon = 0]
	[h:damIsSpell = 0]
}]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]

[h,if(json.type(pm.baseDieSize)=="OBJECT"),CODE:{
	[h:pm.PassiveFunction("DieSize",json.set("","SpecificFeature",json.get(pm.baseDieSize,"Name")+json.get(pm.baseDieSize,"Class")+json.get(pm.baseDieSize,"Subclass"),"ParentToken",ParentToken))]
};{}]

[h:miDieSizeSet=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeSet!=-1)]['DieSizeSet']")]
[h,if(json.isEmpty(miDieSizeSet)): miDieSizeSetFinal = -1 ; miDieSizeSetFinal = math.arrayMax(miDieSizeSet)]
[h:miDieSizeBonus=json.path.read(MagicItemClassBonuses,".[?(@.IsActive>0 && @.Ability=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"' && @.DieSizeBonus!=0)]['DieSizeBonus']")]
[h,if(json.isEmpty(miDieSizeBonus)): miDieSizeBonusFinal = 0 ; miDieSizeBonusFinal = math.arraySum(miDieSizeBonus)]
[h:DieSizeFinal = if(miDieSizeSetFinal == -1,(pm.baseDieSize+miDieSizeBonusFinal),max(miDieSizeSetFinal,(pm.baseDieSize+miDieSizeBonusFinal)))]

[h,switch(pm.DamageType):
	case "Healing": DamageTypeDisplay = "Healing";
	case "TempHP": DamageTypeDisplay = "Temporary HP";
	default: DamageTypeDisplay = pm.GetDisplayName(pm.DamageType,"sb.DamageTypes")
]

[h,if(IsTooltip),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",DamageTypeDisplay+if(or(pm.DamageType=="Healing",pm.DamageType=="TempHP"),""," Damage"),
		"FalseHeader","",
		"FullContents","",
		"RulesContents",if(pm.baseDieNum>0,pm.baseDieNum+"d"+DieSizeFinal,"")+pm.PlusMinus(pm.DamageBonus,0),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']")
	)]
};{
	[h:pm.DamageRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.DamageBonus)]
	[h:pm.DamageRoll = json.set(pm.DamageRoll,
		"DamageType",pm.DamageType,
		"NoModification",damNoModification,
		"IsWeapon",damIsWeapon,
		"IsSpell",damIsSpell,
		"Modifier",1
	)]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",DamageTypeDisplay+if(or(pm.DamageType=="Healing",pm.DamageType=="TempHP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<b><span style='color:"+if(or(pm.DamageType=="Healing",pm.DamageType=="TempHP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+json.get(pm.DamageRoll,"Total")+"</span></b>",
		"RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.DamageBonus,0)+" = "),
		"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.DamageBonus==0)),"",json.get(pm.DamageRoll,"String")+" = "),
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:effectsToMerge = json.append("",json.set("","Damage",json.append("",pm.DamageRoll)))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]