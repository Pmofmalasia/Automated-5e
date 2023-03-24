[h:pm.baseDieNum=arg(0)]
[h:pm.baseDieSize=arg(1)]
[h:pm.DamageBonus=arg(2)]
[h:pm.DamageType=arg(3)]
[h,if(argCount()>4),CODE:{
	[h:damNoModification = if(json.get(arg(4),"NoModification")=="",0,json.get(arg(4),"NoModification"))]
	[h:damIsWeapon = if(json.get(arg(4),"IsWeapon")=="",0,json.get(arg(4),"IsWeapon"))]
	[h:damIsSpell = if(json.get(arg(4),"IsSpell")=="",0,json.get(arg(4),"IsSpell"))]
	[h:damIsAttack = if(json.get(arg(4),"IsAttack")=="",0,json.get(arg(4),"IsAttack"))]
	[h:damTarget = if(json.get(arg(4),"Target")=="","",json.get(arg(4),"Target"))]
	[h:damIsModBonus = if(json.get(arg(4),"IsModBonus")=="",0,json.get(arg(4),"IsCrit"))]
	[h:damIsCrit = if(json.get(arg(4),"IsCrit")=="",0,json.get(arg(4),"IsCrit"))]
};{
	[h:damNoModification = 0]
	[h:damIsWeapon = 0]
	[h:damIsSpell = 0]
	[h:damIsAttack = 0]
	[h:damIsModBonus = 0]
	[h:damIsCrit = 0]
	[h:damTarget = ""]
}]

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
	case "Untyped": DamageTypeDisplay = "Untyped";
	default: DamageTypeDisplay = pm.GetDisplayName(pm.DamageType,"sb.DamageTypes")
]

[h:FeatureDamageData = json.set("",
	"DamageType",pm.DamageType,
	"DamageDieNumber",pm.baseDieNum,
	"DamageDieSize",DieSizeFinal,
	"DamageFlatBonus",pm.DamageBonus,
	"IsModBonus",damIsModBonus
)]

[h:FeatureNonDamageData = json.set("",
    "IsSpell",damIsSpell,
    "IsWeapon",damIsWeapon,
    "IsAttack",damIsAttack,
    "Modifier",1,
    "ScalingBase",0,
    "Target",damTarget,
    "PrimeStat",json.get(currentFeatureInfo,"PrimeStat")
)]

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
	[h:pm.DamageRoll = pm.a5e.DamageRoll(FeatureDamageData,FeatureNonDamageData,"[]")]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",DamageTypeDisplay+if(or(pm.DamageType=="Healing",pm.DamageType=="TempHP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<b><span style='color:"+if(or(pm.DamageType=="Healing",pm.DamageType=="TempHP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+json.get(pm.DamageRoll,if(damIsCrit,"Crit","")+"Total")+"</span></b>",
		"RulesContents",if(json.get(pm.DamageRoll,if(damIsCrit,"Crit","")+"Formula")=="","",json.get(pm.DamageRoll,if(damIsCrit,"Crit","")+"Formula")+" = "),
		"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.DamageBonus==0)),"",json.get(pm.DamageRoll,if(damIsCrit,"Crit","")+"String")+" = "),
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]