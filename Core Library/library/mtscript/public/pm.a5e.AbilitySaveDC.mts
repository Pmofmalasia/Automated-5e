[h:pm.DCInfo=arg(1)]
[h:pm.SaveType=arg(2)]
[h:pm.SaveModifiers=arg(3)]
[h,if(argCount()>4): otherSaveOptions = arg(4); otherSaveOptions = "{}"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:DCType = json.type(pm.DCInfo)]
[h,if(DCType=="UNKNOWN"),CODE:{
	[h:"<!-- Expected input if it is a string is either a number or the name of a stat -->"]
	[h,if(isNumber(pm.DCInfo)),CODE:{
		[h:pm.DC = pm.DCInfo]
		[h:pm.DCPrimeStat = ""]
	};{
		[h:pm.DCPrimeStat = pm.DCInfo]
		[h:pm.DC = 8 + json.get(AtrMods,pm.DCPrimeStat) + Proficiency]
	}]
};{
	[h:pm.baseDC = json.get(pm.DCInfo,"Base")]
	[h:pm.DCPrimeStat = json.get(pm.DCInfo,"Stat")]
	[h:pm.DC = pm.baseDC + json.get(AtrMods,pm.DCPrimeStat) + Proficiency]
}]

[h:isDamageHalved = json.get(pm.SaveModifiers,"DamageHalved")]
[h:isDamageHalved = if(isDamageHalved == "",0,isDamageHalved)]
[h:TypesHalvedInclusive = json.get(pm.SaveModifiers,"TypesInclusive")]
[h:TypesHalvedExclusive = json.get(pm.SaveModifiers,"TypesExclusive")]
[h:conditionsResistedInclusive = json.get(pm.SaveModifiers,"ConditionsInclusive")]
[h:conditionsResistedExclusive = json.get(pm.SaveModifiers,"ConditionsExclusive")]

[h:isSpellSave = if(json.get(otherSaveOptions,"SpellSave")=="",0,json.get(otherSaveOptions,"SpellSave"))]

[h:miSaveDCSet=json.path.read(MagicItemClassBonuses,"[*][?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"'  && @.Subclass=='"+pm.Subclass+"' && @.SaveDCSet!=-1)]['SaveDCSet']")]
[h,if(json.isEmpty(miSaveDCSet)): miSaveDCSetFinal = -1 ; miSaveDCSetFinal = math.arrayMax(miSaveDCSet)]

[h:miSaveDCBonus=json.path.read(MagicItemClassBonuses,"[*][?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && @.Subclass=='"+pm.Subclass+"' && @.SaveDCBonus!=0)]['SaveDCBonus']")]
[h,if(json.isEmpty(miSaveDCBonus)): miSaveDCBonusFinal = 0; miSaveDCBonusFinal = math.arraySum(miSaveDCBonus)]

[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.DC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.DC+miSaveDCBonusFinal)))]

[h,if(isSpellSave),CODE:{
	
};{}]

[h:pm.DCFinal=if(miSaveDCSetFinal==-1,(pm.DC+miSaveDCBonusFinal),max(miSaveDCSetFinal,(pm.DC+miSaveDCBonusFinal)))]

[h:saveDataFinal = json.set("",
	"DC",pm.DCFinal,
	"SaveType",pm.SaveType,
	"DamageModifier",json.set("",
		"DamageHalved",isDamageHalved,
		"TypesInclusive",TypesHalvedInclusive,
		"TypesExclusive",TypesHalvedExclusive),
	"ConditionsResisted",json.set("",
		"Inclusive",conditionsResistedInclusive,
		"Exclusive",conditionsResistedExclusive)
	)]

[h:macro.return = json.set("",
   "Table",json.set("",
      "ShowIfCondensed",1,
      "Header","Saving Throw",
      "FalseHeader","",
      "FullContents",pm.SaveType,
      "RulesContents"," - <b>DC <span style='font-size:1.5em'>"+pm.DCFinal+"</span></b>",
      "RollContents","",
      "DisplayOrder","['Full','Rules','Roll']"),
   "SaveDC",pm.DCFinal,
   "SaveType",pm.SaveType,
   "SaveData",saveDataFinal
)]