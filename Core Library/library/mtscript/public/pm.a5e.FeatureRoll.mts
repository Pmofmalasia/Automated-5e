[h:pm.baseDieNum = arg(1)]
[h:pm.baseDieSize = arg(2)]
[h:pm.baseBonus = arg(3)]
[h,if(argCount()>4),CODE:{
	[h:pm.ExtraRolls = if(json.get(arg(4),"ExtraRolls")=="",0,json.get(arg(4),"ExtraRolls"))]
	[h:pm.AdvantageRoll = if(json.get(arg(4),"AdvantageRoll")=="",0,json.get(arg(4),"AdvantageRoll"))]
	[h:pm.DisadvantageRoll = if(json.get(arg(4),"DisadvantageRoll")=="",0,json.get(arg(4),"DisadvantageRoll"))]
	[h:pm.AdvantageBalance = if(or(and(pm.DisadvantageRoll==0,pm.AdvantageRoll==0),and(pm.DisadvantageRoll!=0,pm.AdvantageRoll!=0)),0,if(pm.DisadvantageRoll==0,1,-1))]
};{
	[h:pm.ExtraRolls = 0]
	[h:pm.AdvantageBalance = 0]
}]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:DamageColor = pm.DamageColor()]

[h,if(json.type(pm.baseDieSize)=="OBJECT"),CODE:{
	[h:pm.PassiveFunction("DieSize",json.set("","SpecificFeature",json.get(pm.baseDieSize,"Name")+json.get(pm.baseDieSize,"Class")+json.get(pm.baseDieSize,"Subclass"),"ParentToken",ParentToken))]
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
	[h:pm.AllRollData = ""]
	[h:pm.AllRollTableLines = ""]
	[h:highestTotalIndex = 0]
	[h:lowestTotalIndex = 0]
	[h,count(pm.ExtraRolls+1),CODE:{
		[h:pm.MiscRoll = pm.DieRoller(pm.baseDieNum,pm.baseDieSize,pm.baseBonus)]
		
		[h:currentFeatureRoll = json.get(pm.MiscRoll,"Total")]
		[h:pm.AllRollTableLines = json.append(pm.AllRollTableLines,json.set("",
			"ShowIfCondensed",1,
			"Header","Roll"+if(pm.ExtraRolls>0," #"+(roll.count+1),""),
			"FalseHeader","",
			"FullContents","<b><span style='color:"+DamageColor+"; font-size:1.5em'>"+json.get(pm.MiscRoll,"Total")+"</span></b>",
			"RulesContents",if(pm.baseDieNum==0,"",pm.baseDieNum+"d"+pm.baseDieSize+pm.PlusMinus(pm.baseBonus,0)+" = "),
			"RollContents",if(or(pm.baseDieNum==0,and(pm.baseDieNum==1,pm.baseBonus==0)),"",json.get(pm.MiscRoll,"String")+" = "),
			"DisplayOrder","['Rules','Roll','Full']")
		)]

		[h:pm.AllRollData = json.append(pm.AllRollData,pm.MiscRoll)]
		[h:pm.AllRollTotals = json.path.read(pm.AllRollData,"[*]['Total']")]

		[h:highestTotalIndex = if(json.get(pm.MiscRoll,"Total") > math.arrayMax(pm.AllRollTotals),roll.count,highestTotalIndex)]
		[h:lowestTotalIndex = if(json.get(pm.MiscRoll,"Total") < math.arrayMin(pm.AllRollTotals),roll.count,lowestTotalIndex)]
	}]

	[h,switch(pm.AdvantageBalance):
		case -1: finalIndex = lowestTotalIndex;
		case 0: finalIndex = 0;
		case 1: finalIndex = highestTotalIndex
	]

	[h:finalRollTotal = json.get(json.get(pm.AllRollData,finalIndex),"Total")]
	[h:tempAllIndividualRolls = json.path.read(pm.AllRollData,"[*]['Array']")]
	[h:allIndividualRolls= "[]"]
	[h,foreach(roll,tempAllIndividualRolls): allIndividualRolls = json.merge(allIndividualRolls,roll)]

	[h:finalRollData = json.set("",
		"FinalTotal",finalRollTotal,
		"AllRolls",allIndividualRolls,
		"RollData",pm.AllRollData
	)]

	[h:abilityTable = json.merge(abilityTable,pm.AllRollTableLines)]
	
	[h:effectsToMerge = json.append("",json.set("","Roll",finalRollData))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]