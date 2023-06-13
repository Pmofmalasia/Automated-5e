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
		[h:pm.DC = 8 + json.get(getProperty("a5e.stat.AtrMods"),pm.DCPrimeStat) + getProperty("a5e.stat.Proficiency")]
	}]
};{
	[h,switch(json.get(pm.DCInfo,"DCMethod")),CODE:
		case "Custom":{
			[h:pm.baseDC = json.get(pm.DCInfo,"Base")]
			[h:pm.DCPrimeStat = json.get(pm.DCInfo,"Stat")]
			[h:pm.DC = pm.baseDC + json.get(getProperty("a5e.stat.AtrMods"),pm.DCPrimeStat) + getProperty("a5e.stat.Proficiency")]
		};
		case "SharedDC":{
			[h:pm.PassiveFunction("SharedDC",json.set("","SpecificFeature",json.get(pm.DCInfo,"Name")+json.get(pm.DCInfo,"Class")+json.get(pm.DCInfo,"Subclass"),"ParentToken",ParentToken))]
		};
		case "SpellSave":{
			[h:pm.PassiveFunction("SharedDC",json.set("","SpecificFeature",json.get(pm.DCInfo,"Name")+json.get(pm.DCInfo,"Class")+json.get(pm.DCInfo,"Subclass"),"ParentToken",ParentToken))]
		};
		default:{
			[h:pm.baseDC = json.get(pm.DCInfo,"Base")]
			[h:pm.DCPrimeStat = json.get(pm.DCInfo,"Stat")]
			[h:pm.DC = pm.baseDC + json.get(getProperty("a5e.stat.AtrMods"),pm.DCPrimeStat) + getProperty("a5e.stat.Proficiency")]
		}
	]
}]

[h,if(json.type(pm.SaveType)=="UNKNOWN"),CODE:{
	[h:ForcedSaveDisplay = pm.GetDisplayName(pm.SaveType,"sb.Attributes")]
};{
	[h:tempForcedSkillDisplay = ""]
	[h,foreach(tempSave,pm.SaveType),CODE:{
		[h:tempForcedSkillDisplay = json.append(tempForcedSkillDisplay,pm.GetDisplayName(tempSave,"sb.Attributes"))]
	}]
	[h:ForcedSaveDisplay = pm.a5e.CreateDisplayList(tempForcedSkillDisplay,"or")]
}]

[h:isDamageHalved = json.get(pm.SaveModifiers,"DamageHalved")]
[h:isDamageHalved = if(isDamageHalved == "",0,isDamageHalved)]
[h:TypesHalvedInclusive = json.get(pm.SaveModifiers,"TypesInclusive")]
[h:TypesHalvedExclusive = json.get(pm.SaveModifiers,"TypesExclusive")]
[h:conditionsResistedInclusive = json.get(pm.SaveModifiers,"ConditionsInclusive")]
[h:conditionsResistedExclusive = json.get(pm.SaveModifiers,"ConditionsExclusive")]

[h:isSpellSave = if(json.get(otherSaveOptions,"SpellSave")=="",0,json.get(otherSaveOptions,"SpellSave"))]

[h:"<!-- TODO: Re-add magic item changing DC here -->"]

[h:pm.DCFinal = pm.DC]

[h,if(isSpellSave),CODE:{
	
};{}]

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

[h,if(json.get(pm.SaveModifiers,"ConditionModification")!=""): saveDataFinal = json.set(saveDataFinal,"ConditionModification",json.get(pm.SaveModifiers,"ConditionModification"))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Saving Throw",
	"FalseHeader","",
	"FullContents",ForcedSaveDisplay,
	"RulesContents"," - <b>DC <span style='font-size:1.5em'>"+pm.DCFinal+"</span></b>",
	"RollContents","",
	"DisplayOrder","['Full','Rules','Roll']")
)]

[h:effectsToMerge = json.append("",json.set("","SaveDC",saveDataFinal))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]