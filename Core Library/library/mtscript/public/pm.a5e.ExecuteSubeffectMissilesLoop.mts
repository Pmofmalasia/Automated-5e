[h:thisEffectData = json.set(BaseSubeffectExecutionData,"ID",pm.a5e.GenerateEffectID())]

[h,if(!json.isEmpty(subeffect.MultipleTargetTypeTargets)),CODE:{
	[h:"<!-- Note: If an effect is single target (TargetNumber = 1), then targeting instances are stored as [['TargetID'],['TargetID2']], etc., hence the following line. -->"]
	[h,if(subeffect.TargetNumber == 1):
		subeffect.ThisMissileTargets = json.get(subeffect.AllTargets,MissilesCompleted);
		subeffect.ThisMissileTargets = subeffect.AllTargets
	]
};{
	[h:subeffect.ThisMissileTargets = subeffect.AllTargets]
}]

[h,if(!json.isEmpty(subeffect.ThisMissileTargets)): thisEffectData = json.set(thisEffectData,"Targets",subeffect.ThisMissileTargets)]

[h,if(json.contains(SubeffectData,"Damage")),CODE:{
	[h:allDamageData = json.get(SubeffectData,"Damage")]
	[h:DamageTypeOptionNum = json.length(json.path.read(allDamageData,"[*][?(@.DamageTypeOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]

	[h,if(DamageTypeOptionNum>1):
		DamageTypeSelectInput = "junkVar |  | --------------- Damage Type Options --------------- | LABEL | SPAN=TRUE ";
		DamageTypeSelectInput = ""
	]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:thisInstanceDamageOptions = "[]"]
		[h,foreach(tempDamageOption,json.get(tempDamageType,"DamageTypeOptions")): thisInstanceDamageOptions = json.append(thisInstanceDamageOptions,pm.GetDisplayName(tempDamageOption,"sb.DamageTypes"))]
		[h,if(!json.isEmpty(thisInstanceDamageOptions)): DamageTypeSelectInput = listAppend(DamageTypeSelectInput," DamageTypeSelection"+roll.count+" | Choose a Damage Type | "+thisInstanceDamageOptions+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
	}]

	[h:abort(input(DamageTypeSelectInput))]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:typeOptionTest = json.contains(json.get(allDamageData,roll.count),"DamageTypeOptions")]
		[h,if(typeOptionTest): allDamageData = json.path.set(allDamageData,"["+roll.count+"]['DamageType']",pm.RemoveSpecial(eval("DamageTypeSelection"+roll.count)))]
	}]
}]

[h:subeffect.IsAttack = json.contains(SubeffectData,"Attack")]
[h,if(subeffect.IsAttack),CODE:{
	[h:subeffect.AttackData = json.get(SubeffectData,"Attack")]
	[h:attack.ToHitBonus = 0]
	[h:attack.ProfTest = 1]

	[h:"<!-- TODO: Might make sense to reassess using PrimeStatMod here (and in general) -->"]
	[h,switch(json.get(subeffect.AttackData,"ToHitMethod")),CODE:
		case "SpellAttack":{
			[h:"<!-- TODO: Will need method of choosing spell class for non-spell things using the spell save DC -->"]
			[h:PrimeStatMod = PrimeStatMod]
		};
		case "Stat":{
			[h:PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),json.get(thisSubeffectSaveData,"ToHitStat"))]
		};
		case "SetValue":{
			[h:attack.ToHitBonus = json.get(thisSubeffectSaveData,"ToHitBonus")]
			[h:attack.ProfTest = 0]
		};
		default:{
			[h:PrimeStatMod = PrimeStatMod]
		}
	]

	[h:"<!-- Note: Critical hit threshhold info is handled in AttackRoll macro -->"]

	[h:"<!-- Note: May need to filter subeffect.ThisMissileTargets somehow to remove non-token options, as they will likely not play well with attacks. -->"]
	[h:subeffect.RerollData = json.get(NonSubeffectData,"RerollData")]
	[h,if(subeffect.RerollData == ""): subeffect.RerollData = "{}"]

	[h:thisAttackData = json.merge(subeffect.RerollData,subeffect.AttackData)]
	[h,if(json.length(subeffect.ThisMissileTargets)>1):
		subeffect.AttackData = pm.a5e.AttackRoll(thisAttackData,SubeffectFunctionPrefixes);
		subeffect.AttackData = pm.a5e.AttackRoll(thisAttackData,SubeffectFunctionPrefixes,json.get(subeffect.ThisMissileTargets,0))		
	]
	[h:attack.CritTest = json.get(subeffect.AttackData,"CritTest")]
	[h:attack.CritFailTest = json.get(subeffect.AttackData,"CritFailTest")]

	[h:subeffect.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",subeffect.RerollData,ParentToken)]
	[h:subeffect.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",subeffect.RerollData,ParentToken)]
[h:"<!-- TODO: Will need to reorganize reroll link positioning to collect all info -->"]

	[h:ToHitTableLine = json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,if(attack.CritFailTest,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+json.get(subeffect.AttackData,"ToHit")+"</span>",
		"RulesContents",json.get(subeffect.AttackData,"RulesStr")+" = ",
		"RollContents",json.get(subeffect.AttackData,"ToHitStr")+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	)]

	[h,if(json.get(subeffect.AttackData,"AdvantageBalance")==0):
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","Reroll: <a href = '"+subeffect.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+subeffect.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>");
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","(Roll #1: "+(roll1+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+" / Roll #2: "+(roll2+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+")")
	]
	
	[h:abilityTable = json.append(abilityTable,ToHitTableLine)]
	[h:thisEffectData = json.set(thisEffectData,"Attack",subeffect.AttackData)]
};{
	[h,if(UseParentCrit),CODE:{
		[h:attack.CritTest = json.path.read(subeffect.ParentEffectData,"['Attack']['CritTest']")]
		[h:thisEffectData = json.set(thisEffectData,"ParentCrit",attack.CritTest)]
	};{
		[h:attack.CritTest = 0]
	}]
}]

[h,if(json.contains(SubeffectData,"SaveData")),CODE:{
	[h:thisSubeffectSaveData = json.get(SubeffectData,"SaveData")]
	[h,switch(json.get(thisSubeffectSaveData,"DCMethod")),CODE:
		case "SpellSave":{
			[h:"<!-- TODO: Will need method of choosing spell class for non-spell things using the spell save DC -->"]
			[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + PrimeStatMod]

			[h:pm.PassiveFunction("SpellSaveDC")]
		};
		case "Stat":{
			[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + json.get(getProperty("a5e.stat.AtrMods"),json.get(thisSubeffectSaveData,"DCStat"))]
		};
		case "SetValue":{
			[h:subeffect.SaveDC = json.get(thisSubeffectSaveData,"DC")]
		};
		default:{
			[h:"<!-- TODO: This is here temporarily while finding a better way to route the Spellcasting macro to here -->"]
			[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + PrimeStatMod]

			[h:pm.PassiveFunction("SpellSaveDC")]
		}
	]

	[h:subeffect.SaveDCData = json.set(thisSubeffectSaveData,"DC",subeffect.SaveDC)]
	[h:thisEffectData = json.set(thisEffectData,"SaveDC",subeffect.SaveDCData)]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Saving Throw",
		"FalseHeader","",
		"FullContents",pm.GetDisplayName(json.get(thisSubeffectSaveData,"SaveType"),"sb.Attributes")+" Save",
		"RulesContents","DC "+subeffect.SaveDC+" ",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:SubeffectNonDamageProperties = json.set("",
	"IsSpell",pm.a5e.OverarchingContext=="Spell",
	"IsWeapon",pm.a5e.OverarchingContext=="Attack",
	"IsAttack",subeffect.IsAttack,
	"Modifier",1,
	"ScalingBase",AHLTier,
	"PrimeStat",PrimeStat
)]

[h:"<!-- TODO: Add resolution of the isMissileSameDamageRoll key, eventually -->"]
[h:subeffect.DamageInfo = "[]"]
[h,foreach(tempDamageInstance,json.get(SubeffectData,"Damage")),CODE:{
	[h:thisDamageTypeInfo = pm.a5e.DamageRoll(tempDamageInstance,SubeffectNonDamageProperties,SubeffectFunctionPrefixes)]

	[h:subeffect.DamageInfo = json.append(subeffect.DamageInfo,thisDamageTypeInfo)]

	[h:tempDamageType = json.get(thisDamageTypeInfo,"DamageType")]

	[h,switch(tempDamageType):
		case "Healing": DamageTypeDisplay = "Healing";
		case "TempHP": DamageTypeDisplay = "Temporary HP";
		default: DamageTypeDisplay = pm.GetDisplayName(tempDamageType,"sb.DamageTypes")
	]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",DamageTypeDisplay+if(or(tempDamageType=="Healing",tempDamageType=="TempHP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(attack.CritTest,json.get(thisDamageTypeInfo,"CritTotal"),json.get(thisDamageTypeInfo,"Total"))+"</span>",
		"RulesContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritFormula"),json.get(thisDamageTypeInfo,"Formula"))+" = ",
		"RollContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritString"),json.get(thisDamageTypeInfo,"String"))+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,if(!json.isEmpty(subeffect.DamageInfo)): thisEffectData = json.set(thisEffectData,"Damage",subeffect.DamageInfo)]

[h,if(json.contains(SubeffectData,"ConditionInfo")),CODE:{
	[h:tempConditionInfo = json.get(SubeffectData,"ConditionInfo")]
	[h,if(json.contains(SubeffectData,"ConditionOptionsNumber")),CODE:{
		[h:subeffect.ConditionChoiceNumber = json.get(SubeffectData,"ConditionOptionsNumber")]
		[h,if(json.get(SubeffectData,"ConditionOptionsNumberAHLScaling") > 0): subeffect.ConditionChoiceNumber = subeffect.ConditionChoiceNumber + (json.contains(SubeffectData,"ConditionOptionsNumberAHL") * floor(AHLTier/json.get(SubeffectData,"ConditionOptionsNumberAHLScaling")))]
	};{
		[h:subeffect.ConditionChoiceNumber = 0]
	}]

	[h:subeffect.Conditions = pm.a5e.ChooseCondition(json.get(tempConditionInfo,"Conditions"),subeffect.ConditionChoiceNumber)]
	[h:subeffect.Conditions = json.path.set(subeffect.Conditions,"[*][?(@.HasTiers == 1)]['Level']",AHLTier + 1)]

	[h:subeffect.ConditionEndInfo = json.get(tempConditionInfo,"EndInfo")]
	[h,if(json.get(subeffect.ConditionEndInfo,"UseMainDuration") == 1): subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"Duration",DurationValue,"DurationUnits",lower(DurationUnits))]
	[h:subeffect.ConditionEndInfo = json.remove(subeffect.ConditionEndInfo,"UseMainDuration")]

	[h:"<!-- TODO: Should make sure that the following path is always null if there are no EndTriggers with a save - need to see if this is due to messy data or flaws in json.path -->"]
	[h:hasSaveDCTest = json.path.read(subeffect.ConditionEndInfo,"[*][?(@.EndTriggers.*.SaveType!=null && @.EndTriggers.*.SaveType!='')]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:hasSaveDCTest = json.difference(hasSaveDCTest,json.append("","{}"))]
	[h:hasSaveDCTest = !json.isEmpty(hasSaveDCTest)]

	[h,if(hasSaveDCTest && !json.contains(SubeffectData,"SaveData")),CODE:{
		[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + PrimeStatMod]
		[h:pm.PassiveFunction("SpellSaveDC")]
	};{}]
	
	[h,if(hasSaveDCTest): subeffect.ConditionEndInfo = json.path.put(subeffect.ConditionEndInfo,"['EndTriggers'][*][?(@.SaveType!=null)]","DC",subeffect.SaveDC)]

	[h:"<!-- TODO: Fix to allow selection of AdvancePoint manually; Temporary solution for now -->"]
	[h,if(json.get(subeffect.ConditionEndInfo,"DurationUnits")=="round"):
		subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"AdvancePoint","StartofTurn");
		subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"AdvancePoint","EndofTurn")
	]

	[h:thisEffectData = json.set(thisEffectData,"ConditionInfo",json.set("","Conditions",subeffect.Conditions,"EndInfo",subeffect.ConditionEndInfo))]

	[h:subeffect.ConditionNames = pm.a5e.CreateDisplayList(json.path.read(subeffect.Conditions,"[*]['DisplayName']"),"and")]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Conditions Applied",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",subeffect.ConditionNames,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,if(json.contains(subeffectData,"TargetConditionLimits")),CODE:{
	[h:TargetConditionLimitsData = json.get(subeffectData,"TargetConditionLimits")]

	[h:subeffect.TargetConditionOptions = pm.a5e.TargetConditionFiltering(subeffect.ThisMissileTargets,TargetConditionLimitsData)]
	
	[h,if(json.get(TargetConditionLimitsData,"Number")=="" && json.get(TargetConditionLimitsData,"MustTargetAll")==1):
		subeffect.ConditionTargets = subeffect.TargetConditionOptions;
		subeffect.ConditionTargets = pm.a5e.TargetConditionTargeting(subeffect.TargetConditionOptions,json.get(TargetConditionLimitsData,"Number"))
	]

	[h:thisEffectData = json.set(thisEffectData,"TargetedConditions",subeffect.ConditionTargets)]
};{}]

[h,if(json.contains(subeffectData,"ConditionModificationInfo")),CODE:{
	[h:thisEffectData = json.set(thisEffectData,"ConditionModificationInfo",json.get(subeffectData,"ConditionModificationInfo"))]
};{}]

[h,if(json.contains(SubeffectData,"Summon")),CODE:{
	[h:subeffect.SummonData = json.get(SubeffectData,"Summon")]
	
	[h:subeffect.SummonCRMax = json.get(subeffect.SummonData,"SummonCRMax")]
	[h:subeffect.SummonCRMaxAHLScaling = json.get(subeffect.SummonData,"SummonCRMaxAHLScaling")]
	[h,if(subeffect.SummonCRMaxAHLScaling==""): subeffect.SummonCRMaxAHLScaling = 0]

	[h,if(subeffect.SummonCRMaxAHLScaling > 0),CODE:{
		[h:subeffect.SummonCRMaxAHL = json.get(subeffect.SummonData,"SummonCRMaxAHL")]
		[h:subeffect.SummonCRMaxAHLScalingMethod = json.get(subeffect.SummonData,"SummonCRMaxAHLScalingMethod")]
		[h,if(subeffect.SummonCRMaxAHLScalingMethod=="Add"):
			subeffect.SummonCRMax = subeffect.SummonCRMax + (subeffect.SummonCRMaxAHL * floor(AHLTier/subeffect.SummonCRMaxAHLScaling));
			subeffect.SummonCRMax = subeffect.SummonCRMax * (subeffect.SummonCRMaxAHL + floor(AHLTier/subeffect.SummonCRMaxAHLScaling))
		]
	}]
	
	[h:subeffect.SummonNumber = json.get(subeffect.SummonData,"SummonNumber")]
	[h:subeffect.SummonNumberAHLScaling = json.get(subeffect.SummonData,"SummonNumberAHLScaling")]
	[h,if(subeffect.SummonNumberAHLScaling==""): subeffect.SummonNumberAHLScaling = 0]
	[h:subeffect.SummonNumberMultiplierAHL = 1]
	[h:subeffect.SummonNumberBonusAHL = 0]

	[h,if(subeffect.SummonNumberAHLScaling > 0),CODE:{
		[h:subeffect.SummonNumberAHL = json.get(subeffect.SummonData,"SummonNumberAHL")]
		[h:subeffect.SummonNumberAHLScalingMethod = json.get(subeffect.SummonData,"SummonNumberAHLScalingMethod")]

		[h,if(subeffect.SummonNumberAHLScalingMethod=="Add"):
			subeffect.SummonNumberBonusAHL = subeffect.SummonNumberAHL * floor(AHLTier/subeffect.SummonNumberAHLScaling);
			subeffect.SummonNumberMultiplierAHL = subeffect.SummonNumberAHL + floor(AHLTier/subeffect.SummonNumberAHLScaling)
		]
	}]

	[h:subeffect.SummonData = json.set("",
		"SummonName",json.get(subeffect.SummonData,"SummonName"),
		"SummonOptions",json.get(subeffect.SummonData,"SummonOptions"),
		"SummonCRMax",subeffect.SummonCRMax,
		"SummonNumberCRBased",json.get(subeffect.SummonData,"SummonNumberCRBased"),
		"SummonNumber",json.get(subeffect.SummonData,"SummonNumber"),
		"SummonNumberMultiplier",subeffect.SummonNumberMultiplierAHL,
		"SummonNumberBonus",subeffect.SummonNumberBonusAHL,
		"SummonCreatureType",json.get(subeffect.SummonData,"SummonCreatureType"),
		"ParentToken",ParentToken
	)]

	[h:SummonCustomization = json.set("",
		"ForcedName",ForcedSummonName,
		"ForcedImage",ForcedImage,
		"ForcedPortrait",ForcedPortrait,
		"ForcedHandout",ForcedHandout
	)]
	
	[h:pm.Summons(subeffect.SummonData,SummonCustomization)]
}]

[h,if(json.contains(SubeffectData,"Movement")),CODE:{
	[h:subeffect.MovementData = json.get(SubeffectData,"Movement")]

	[h:subeffect.MovementValue = json.get(subeffect.MovementData,"Value")]
	[h,if(json.get(subeffect.MovementData,"AHLScaling") != 0 && AHLTier != 0),CODE:{
		[h:subeffect.MovementValue = subeffect.MovementValue + json.get(subeffect.MovementData,"AHLValue") * floor(AHLTier / json.get(subeffect.MovementData,"AHLScaling"))]
	};{}]

	[h,switch(json.get(subeffect.MovementData,"Direction")),CODE:
		case "Choice":{
			[h:subeffect.MovementDirection = "Any"]
			[h,switch(json.get(subeffect.MovementData,"Type")):
				case "Physical": subeffect.MovementDirectionMessage = "";
				case "Teleportation": subeffect.MovementDirectionMessage = "Teleport";
				case "Extraplanar": subeffect.MovementDirectionMessage = "Extraplanar Teleport";
			]
		};
		case "Away":{
			[h:subeffect.MovementDirection = "Away"]
			[h:subeffect.MovementDirectionMessage = "Push"]
		};
		case "Towards":{
			[h:subeffect.MovementDirection = "Towards"]
			[h:subeffect.MovementDirectionMessage = "Pull"]
		};
		case "Random4":{
			[h:RandomDirection = eval("1d4")]
			[h:subeffect.MovementDirection = table("Direction",RandomDirection)]
			[h:subeffect.MovementDirectionMessage = subeffect.MovementDirection]
		};
		case "Random8":{
			[h:RandomDirection = eval("1d8")]
			[h:subeffect.MovementDirection = table("Direction",RandomDirection)]
			[h:subeffect.MovementDirectionMessage = subeffect.MovementDirection]
		}
	]

	[h:subeffect.MovementMessage = if(subeffect.MovementDirectionMessage != "",subeffect.MovementDirectionMessage+" ","") + if(subeffect.MovementValue != "",subeffect.MovementValue+" "+json.get(subeffect.MovementData,"Units"),"")]

	[h:subeffect.FinalMovementData = json.set("",
		"Value",subeffect.MovementValue,
		"Units",json.get(subeffect.MovementData,"Units"),
		"Type",json.get(subeffect.MovementData,"Type"),
		"Direction",subeffect.MovementDirection
	)]

	[h:thisEffectData = json.set(thisEffectData,"Movement",subeffect.FinalMovementData)]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Movement",
		"FalseHeader","",
		"FullContents",subeffect.MovementMessage,
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h:pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffectData)]