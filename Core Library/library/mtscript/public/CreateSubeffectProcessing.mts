[h:subeffectData = macro.args]
[h:EffectType = json.get(subeffectData,"EffectType")]
[h:subeffectData = json.remove(subeffectData,"EffectType")]
[h:CurrentFeatureData = getLibProperty("ct.New"+EffectType,"pm.a5e.Core")]
[h:thisPlayerCurrentFeatureData = json.get(CurrentFeatureData,getPlayerName())]

[h,switch(EffectType),CODE:
	case "Spell":{
		[h:currentEffectData = json.get(thisPlayerCurrentFeatureData,json.length(thisPlayerCurrentFeatureData)-1)]
		[h:FeatureName = json.get(json.get(thisPlayerCurrentFeatureData,0),"Name")]
		[h:FeatureDisplayName = json.get(json.get(thisPlayerCurrentFeatureData,0),"DisplayName")]
	};
	default:{
		[h:currentEffectData = thisPlayerCurrentFeatureData]
		[h:FeatureName = json.get(thisPlayerCurrentFeatureData,"Name")]
		[h:FeatureDisplayName = json.get(thisPlayerCurrentFeatureData,"DisplayName")]
	}
]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h,if(json.get(subeffectData,"ParentSubeffect")!="" && json.get(subeffectData,"ParentSubeffect")!=0),CODE:{
	[h:subeffectData = json.set(subeffectData,"ParentSubeffect",json.get(subeffectData,"ParentSubeffect")-1)]
	[h,switch(json.get(subeffectData,"ParentPrereqs")),CODE:
		case "AttackHit":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Attack",
				"Result","Hit",
				"Margin",json.get(subeffectData,"PrereqAttackHitMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqAttackHitMargin")]
		};
		case "AttackMiss":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Attack",
				"Result","Miss",
				"Margin",json.get(subeffectData,"PrereqAttackMissMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqAttackHitMargin")]
		};
		case "SaveSucceed":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Save",
				"Result","Pass",
				"Margin",json.get(subeffectData,"PrereqSaveSucceedMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqSaveSucceedMargin")]
		};
		case "SaveFail":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Save",
				"Result","Fail",
				"Margin",json.get(subeffectData,"PrereqSaveFailMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqSaveFailMargin")]
		};
		case "CheckSucceed":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Check",
				"Result","Pass",
				"Margin",json.get(subeffectData,"PrereqCheckSucceedMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqCheckSucceedMargin")]
		};
		case "CheckFail":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","Check",
				"Result","Fail",
				"Margin",json.get(subeffectData,"PrereqCheckFailMargin")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqCheckFailMargin")]
		};
		case "ConditionApplied":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement","ConditionApplied",
				"Result",json.get(subeffectData,"PrereqConditionsApplied")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqConditionsApplied")]
		};
		default:{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement",json.get(subeffectData,"ParentPrereqs")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
		}
	]
};{
	[h:subeffectData = json.remove(subeffectData,"ParentSubeffect")]
}]

[h:howMitigate = json.get(subeffectData,"howMitigate")]
[h:subeffectData = json.remove(subeffectData,"howMitigate")]
[h,if(howMitigate == "Save"),CODE:{
	[h:SaveData = json.set("","SaveType",json.get(subeffectData,"SaveType"))]
	[h:subeffectData = json.remove(subeffectData,"SaveType")]
}]

[h,if(howMitigate == "Attack"),CODE:{
	[h:AttackData = json.set("",
		"MeleeRanged",json.get(subeffectData,"MeleeRanged"),
		"CritThresh",number(json.get(subeffectData,"CritThresh"))
	)]
	[h:subeffectData = json.remove(subeffectData,"MeleeRanged")]
	[h:subeffectData = json.remove(subeffectData,"CritThresh")]
	[h:subeffectData = json.set(subeffectData,"Attack",AttackData)]
}]

[h:damageTypeNumber = max(0,number(json.get(subeffectData,"differentTypes")))]
[h:subeffectData = json.remove(subeffectData,"isDamage")]
[h:subeffectData = json.remove(subeffectData,"differentTypes")]
[h:damageInfo = "[]"]
[h:SaveDamageModifier = "{}"]
[h,count(damageTypeNumber),CODE:{
	[h:whichType = roll.count + 1]
	[h:thisDamageTypeInfo = "{}"]

	[h,if(json.get(subeffectData,"DamageType"+whichType) == "Multiple Options"),CODE:{
		[h:thisDamageTypeInfo = json.remove(thisDamageTypeInfo,"DamageType")]
		[h:allDamageTypes = pm.GetDamageTypes("Name","json")]
		[h:DamageTypeOptions = "[]"]
		[h,foreach(tempType,allDamageTypes): DamageTypeOptions = if(json.contains(subeffectData,"DamageTypeOptions"+tempType+whichType),json.append(DamageTypeOptions,tempType),DamageTypeOptions)]
		[h,foreach(tempType,DamageTypeOptions): subeffectData = json.remove(subeffectData,"DamageTypeOptions"+tempType+whichType)]
		[h:thisDamageTypeInfo = json.set(thisDamageTypeInfo,"DamageTypeOptions",DamageTypeOptions)]
	};{
		[h:thisDamageTypeInfo = json.set(thisDamageTypeInfo,"DamageType",json.get(subeffectData,"DamageType"+whichType))]
	}]
	
	[h,if(json.contains(subeffectData,"DamageDieNum"+whichType)):
		thisDamageTypeInfo = json.set(thisDamageTypeInfo,
			"DamageDieNumber",number(json.get(subeffectData,"DamageDieNum"+whichType)),
			"DamageDieSize",number(json.get(subeffectData,"DamageDieSize"+whichType)),
			"DamageFlatBonus",number(json.get(subeffectData,"DamageFlatBonus"+whichType)),
			"IsModBonus",json.contains(subeffectData,"ModBonus"+whichType));
		thisDamageTypeInfo = json.set(thisDamageTypeInfo,
			"PriorDamagePercent",(json.get(subeffectData,"PriorDamagePercent"+whichType)/100),
			"PriorDamageType",json.get(subeffectData,"PriorDamageType"+whichType))
	]

	[h,if(json.get(subeffectData,"isAHL"+whichType)!=0 && json.contains(subeffectData,"isAHL"+whichType)):
		thisDamageTypeInfo = json.set(thisDamageTypeInfo,
			"AHLScaling",number(json.get(subeffectData,"isAHL"+whichType)),
			"AHLDieSize",number(json.get(subeffectData,"AHLDieSize"+whichType)),
			"AHLDieNum",number(json.get(subeffectData,"AHLDieNum"+whichType)),
			"AHLFlatBonus",number(json.get(subeffectData,"AHLFlatBonus"+whichType))
	)]
	
	[h:"<!-- TODO: This will introduce a disconnect between the input and what happens in the code - need to create the ability to apply DamageHalved to each individual type? As it stands now a spell that halves one type and completely reduces another on save will just have all damage types that are reduced completely nullified. Super low priority because why would you do that anyway. -->"]
	[h,if(howMitigate == "Save"),CODE:{
		[h,if(json.get(SaveDamageModifier,"DamageHalved")==""):
			SaveDamageModifier = json.set(SaveDamageModifier,"DamageHalved",number(json.get(subeffectData,"saveMitigation"+whichType)));
			SaveDamageModifier = json.set(SaveDamageModifier,"DamageHalved",max(number(json.get(subeffectData,"saveMitigation"+whichType)),json.get(SaveDamageModifier,"DamageHalved")))
		]

		[h,if(json.get(subeffectData,"saveMitigation"+whichType)!=0): SaveDamageModifier = json.set(SaveDamageModifier,"TypesInclusive",json.append(json.get(SaveDamageModifier,"TypesInclusive"),json.get(subeffectData,"DamageType"+whichType)))]

		[h:SaveData = json.set(SaveData,"DamageModifier",SaveDamageModifier)]
		
		[h:subeffectData = json.remove(subeffectData,"saveMitigation"+whichType)]
	}]

	[h:subeffectData = json.remove(subeffectData,"DamageType"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"DamageDieNum"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"DamageDieSize"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"DamageFlatBonus"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"ModBonus"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"PriorDamagePercent"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"PriorDamageType"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"AHLDieSize"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"AHLDieNum"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"AHLFlatBonus"+whichType)]
	[h:subeffectData = json.remove(subeffectData,"isAHL"+whichType)]

	[h:damageInfo = json.append(damageInfo,thisDamageTypeInfo)]
}]

[h,if(!json.isEmpty(damageInfo)): subeffectData = json.set(subeffectData,"Damage",damageInfo)]

[h,switch(EffectType):
	case "Spell": ConditionIdentificationInfo = json.set("","Class","Spell","Subclass",FeatureName);
	default: ConditionIdentificationInfo = json.set("","Class","","Subclass","")
]

[h:isCondition = json.get(subeffectData,"isCondition")]
[h:subeffectData = json.remove(subeffectData,"isCondition")]
[h:allBaseConditions = pm.a5e.GetBaseConditions()]
[h:conditionsAlwaysAdded = "[]"]
[h:EffectSpecificConditions = "[]"]
[h,if(isCondition == "All" || isCondition == "Mixture"),CODE:{
	[h:conditionsAlwaysAdded = "[]"]
	[h,foreach(tempCondition,allBaseConditions),CODE:{
		[h,if(json.contains(subeffectData,"AlwaysAdded"+tempCondition)): conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set("","Name",json.get(tempCondition,"Name"),"DisplayName",json.get(tempCondition,"DisplayName"),"Class","Condition","AlwaysAdded",1))]
		[h:subeffectData = json.remove(subeffectData,"AlwaysAdded"+tempCondition)]
	}]
	
	[h,switch(json.contains(subeffectData,"AlwaysAddedEffectSpecific")+""+json.contains(subeffectData,"isEffectSpecificAlwaysAddedMultiple")),CODE:
		case "10":{
			[h:conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
			[h:EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
		};
		case "11":{
			[h:conditionNames = json.fromList(encode(json.get(subeffectData,"AlwaysAddedEffectSpecificNames")),"%0A")]
			[h,foreach(tempCondition,conditionNames): conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(tempCondition),"DisplayName",tempCondition))]
			[h,foreach(tempCondition,conditionNames): EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(tempCondition),"DisplayName",tempCondition))]
			[h:subeffectData = json.remove(subeffectData,"isEffectSpecificAlwaysAddedMultiple")]
			[h:subeffectData = json.remove(subeffectData,"AlwaysAddedEffectSpecificNames")]
		};
		default:{};
	]
	[h:subeffectData = json.remove(subeffectData,"AlwaysAddedEffectSpecific")]
}]

[h:conditionOptions = "[]"]
[h,if(isCondition == "Choose" || isCondition == "Mixture"),CODE:{
	[h,foreach(tempCondition,allBaseConditions),CODE:{
		[h,if(json.contains(subeffectData,"ConditionOption"+tempCondition)): conditionOptions = json.append(conditionOptions,json.set("","Name",json.get(tempCondition,"Name"),"DisplayName",json.get(tempCondition,"DisplayName"),"Condition","AlwaysAdded",0))]
		[h:subeffectData = json.remove(subeffectData,"ConditionOption"+tempCondition)]
	}]

	[h,switch(json.contains(subeffectData,"ConditionOptionEffectSpecific")+""+json.contains(subeffectData,"isEffectSpecificConditionOptionMultiple")),CODE:
		case "10":{
			[h:conditionOptions = json.append(conditionOptions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
			[h:EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
		};
		case "11":{
			[h:conditionNames = json.fromList(encode(json.get(subeffectData,"ConditionOptionEffectSpecificNames")),"%0A")]
			[h,foreach(tempCondition,conditionNames): conditionOptions = json.append(conditionOptions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(tempCondition),"DisplayName",tempCondition))]
			[h,foreach(tempCondition,conditionNames): EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(tempCondition),"DisplayName",tempCondition))]
			[h:subeffectData = json.remove(subeffectData,"isEffectSpecificConditionOptionMultiple")]
			[h:subeffectData = json.remove(subeffectData,"ConditionOptionEffectSpecificNames")]
		};
		default:{}
	]
	[h:subeffectData = json.remove(subeffectData,"ConditionOptionEffectSpecific")]
}]

[h,if(isCondition != "None"),CODE:{
	[h,if(json.contains(subeffectData,"isConditionSameDuration")),CODE:{
		[h:conditionEndInfo = json.set("","UseMainDuration",1)]
		[h:subeffectData = json.remove(subeffectData,"isConditionSameDuration")]
	};{
		[h:"<!-- Note: Alternate duration works as the 'main' duration for things that apply conditions but don't have another 'main duration -->"]
		[h:conditionEndInfo = json.set("","Duration",json.get(subeffectData,"conditionAlternateDuration"),"DurationUnits",lower(json.get(subeffectData,"conditionAlternateDurationUnits")))]
		[h:subeffectData = json.remove(subeffectData,"conditionAlternateDuration")]
		[h:subeffectData = json.remove(subeffectData,"conditionAlternateDurationUnits")]
	}]

	[h:subeffectData = json.remove(subeffectData,"isConditionNonDurationEnd")]
	[h,if(json.contains(subeffectData,"isEndConditionTempHPLost")): ConditionEndTriggers = json.set("","TempHPLost",1); ConditionEndTriggers = "{}"]
	[h:subeffectData = json.remove(subeffectData,"TempHPLost")]
	[h:"<!-- TODO/Note: The below loop will likely be temporary, as the 'conditional' portion will likely need to be customized to each instance once completed. But for now, it's easier to just loop it. -->"]
	[h:conditionEndInstances = json.append("","Action","StartTurn","EndTurn","AfterAttack","AfterSpell","AfterForceSave","AfterDamage","AfterMoving","AfterAttacked","AfterDamaged","AfterShortRest","AfterLongRest","AfterGainCondition","AfterEndCondition","AfterChangeEquipment")]
	[h,foreach(tempInstance,conditionEndInstances): ct.a5e.ConditionEndTriggerInputProcessing(tempInstance)]
	[h:conditionEndInfo = json.set(conditionEndInfo,"EndTriggers",ConditionEndTriggers)]

	[h:allConditionInfo = json.set("",
		"Conditions",json.merge(conditionsAlwaysAdded,conditionOptions),
		"EndInfo",conditionEndInfo
	)]
	
	[h:subeffectData = json.set(subeffectData,"ConditionInfo",allConditionInfo)]
};{}]

[h,switch(json.get(subeffectData,"conditionSaveEffect")),CODE:
	case "": {};
	case "0": {
		[h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive","[]"))]
	};
	case "1": {
		[h:conditionsNullified = "[]"]
		[h,foreach(tempCondition,allBaseConditions),CODE:{
			[h,if(json.contains(subeffectData,"SaveNullify"+tempCondition)): conditionsNullified = json.append(conditionsNullified,json.set("","Name",json.get(tempCondition,"Name"),"DisplayName",json.get(tempCondition,"DisplayName"),"Class","Condition"))]
			[h:subeffectData = json.remove(subeffectData,"SaveNullify"+tempCondition)]
		}]
		[h,if(json.contains(subeffectData,"SaveNullifyEffectSpecific")): conditionsNullified = json.merge(conditionsNullified,EffectSpecificConditions)]
		[h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive",conditionsNullified))]
		[h:subeffectData = json.remove(subeffectData,"SaveNullifyEffectSpecific")]
	};
	case "2": {
		[h:SaveData = json.set(SaveData,"ConditionsResisted",json.set("","Inclusive","All"))]
	};
	case "Different": {
		[h:"<!-- TODO later -->"]
	}
]
[h:subeffectData = json.remove(subeffectData,"conditionSaveEffect")]

[h:isSummons = json.get(subeffectData,"isSummons")]
[h:subeffectData = json.remove(subeffectData,"isSummons")]
[h,if(isSummons != "No"),CODE:{
	[h,switch(isSummons),CODE:
		case "UniqueEffect":{
			[h:SummonData = json.set("",
				"SummonName",FeatureName
			)]
		};
		case "Single":{
			[h:SummonData = json.set("",
				"SummonName",json.get(subeffectData,"singleSummon")
			)]
			[h:subeffectData = json.remove(subeffectData,"singleSummon")]
			[h:subeffectData = json.remove(subeffectData,"singleSummon")]
		};
		case "Options":{
			[h:SummonOptions = json.fromList(encode(json.get(subeffectData,"summonOptions")),"%0A")]
			[h:SummonData = json.set("",
				"SummonOptions",SummonOptions
			)]
			[h:subeffectData = json.remove(subeffectData,"summonOptions")]
		};
		case "Criteria":{
			[h:CreatureTypeNameArray = pm.GetCreatureTypes("Name","json")]
			[h:summonCreatureTypesAllowed = ""]
			[h,foreach(tempCreatureType,CreatureTypeNameArray): summonCreatureTypesAllowed = if(json.contains(subeffectData,"summonCreatureType"+tempCreatureType),json.append(summonCreatureTypesAllowed,tempCreatureType),summonCreatureTypesAllowed)]

			[h:"<!-- TODO: Add processing of creature subtypes when finished -->"]

			[h:SummonData = json.set("",
				"SummonCRMax",json.get(subeffectData,"summonCrMax"),
				"SummonCreatureType",summonCreatureTypesAllowed
			)]

			[h,if(json.contains(subeffectData,"summonCrMaxAHLNum")): SummonData = json.set(SummonData,
				"SummonCRMaxAHL",json.get(subeffectData,"summonCrMaxAHLNum"),
				"SummonCRMaxAHLScaling",json.get(subeffectData,"summonCrMaxAHLScaling"),
				"SummonCRMaxAHLScalingMethod",json.get(subeffectData,"summonCrMaxAHLScaleHow")
			)]

			[h,foreach(tempCreatureType,CreatureTypeNameArray): subeffectData = json.remove(subeffectData,"summonCreatureType"+tempCreatureType)]
			[h:subeffectData = json.remove(subeffectData,"summonCrMax")]
			[h:subeffectData = json.remove(subeffectData,"summonCrMaxAHLNum")]
			[h:subeffectData = json.remove(subeffectData,"summonCrMaxAHLScaling")]
			[h:subeffectData = json.remove(subeffectData,"summonCrMaxAHLScaleHow")]
		};
		default:{[h:SummonData = "{}"]}
	]

	[h,if(json.contains(subeffectData,"summonNumber")):
		SummonData = json.set(SummonData,"SummonNumber",json.get(subeffectData,"summonNumber"));
		SummonData = json.set(SummonData,"SummonNumberCRBased",1)
	]
	[h:subeffectData = json.remove(subeffectData,"summonNumber")]
	[h:subeffectData = json.remove(subeffectData,"summonNumberCRBased")]

	[h,if(json.contains(subeffectData,"summonNumberAHL")): SummonData = json.set(SummonData,
		"SummonNumberAHL",json.get(subeffectData,"summonNumberAHL"),
		"SummonNumberAHLScaling",json.get(subeffectData,"summonNumberAHLScaling"),
		"SummonNumberScalingMethod",json.get(subeffectData,"summonNumberAHLScaleHow")
	)]
	[h:subeffectData = json.remove(subeffectData,"summonNumberAHL")]
	[h:subeffectData = json.remove(subeffectData,"summonNumberAHLScaling")]
	[h:subeffectData = json.remove(subeffectData,"summonNumberAHLScaleHow")]

	[h:subeffectData = json.set(subeffectData,"Summon",SummonData)]
};{}]

[h:ConditionModificationData = ""]
[h:TargetConditionData = ""]
[h,if(json.get(subeffectData,"isAffectCondition")!="No" && json.get(subeffectData,"isAffectCondition")!=""),CODE:{
	[h,if(!json.contains(subeffectData,"affectConditionNumberUnlimited")): TargetConditionData = json.set(TargetConditionData,
		"Number",json.get(subeffectData,"affectConditionNumber"),
		"NumberAHL",json.get(subeffectData,"affectConditionNumberAHL"),
		"NumberAHLScaling",json.get(subeffectData,"affectConditionNumberAHLScaling"))
	]

	[h:subeffectData = json.remove(subeffectData,"affectConditionNumberUnlimited")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionNumber")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionNumberAHL")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionNumberAHLScaling")]

	[h:TargetConditionData = json.set(TargetConditionData,"MustTargetAll",json.contains(subeffectData,"affectConditionAffectsAll"))]
	[h:subeffectData = json.remove(subeffectData,"affectConditionAffectsAll")]

	[h:tempNameData = ""]
	[h,if(json.get(subeffectData,"affectConditionNameFilterType")=="Inclusive" || json.get(subeffectData,"affectConditionNameFilterType")=="Mixture"),CODE:{
		[h:tempConditionList = pm.a5e.GetBaseConditions("Name","json")]
		[h:inclusiveConditionTargetNames = ""]
		[h,foreach(tempCondition,tempConditionList): inclusiveConditionTargetNames = if(json.contains(subeffectData,"affectConditionNameFilterInclusive"+tempCondition),json.append(inclusiveConditionTargetNames,tempCondition),inclusiveConditionTargetNames)]
		[h,foreach(tempCondition,tempConditionList): subeffectData = json.remove(subeffectData,"affectConditionNameFilterInclusive"+tempCondition)]
		[h,if(inclusiveConditionTargetNames!=""): tempNameData = json.set(tempNameData,"Inclusive",inclusiveConditionTargetNames)]
	};{}]
	
	[h,if(json.get(subeffectData,"affectConditionNameFilterType")=="Exclusive" || json.get(subeffectData,"affectConditionNameFilterType")=="Mixture"),CODE:{
		[h:tempConditionList = pm.a5e.GetBaseConditions("Name","json")]
		[h:inclusiveConditionTargetNames = ""]
		[h,foreach(tempCondition,tempConditionList): inclusiveConditionTargetNames = if(json.contains(subeffectData,"affectConditionNameFilterExclusive"+tempCondition),json.append(inclusiveConditionTargetNames,tempCondition),inclusiveConditionTargetNames)]
		[h,foreach(tempCondition,tempConditionList): subeffectData = json.remove(subeffectData,"affectConditionNameFilterExclusive"+tempCondition)]
		[h,if(inclusiveConditionTargetNames!=""): tempNameData = json.set(tempNameData,"Exclusive",inclusiveConditionTargetNames)]
	};{}]

	[h,if(tempNameData!=""): TargetConditionData = json.set(TargetConditionData,"ConditionNames",tempNameData)]

	[h:tempTagData = ""]
	[h,if(json.get(subeffectData,"affectConditionTagFilterType")=="Inclusive" || json.get(subeffectData,"affectConditionTagFilterType")=="Mixture"),CODE:{
		[h:allConditionTags = pm.a5e.GetCoreData("sb.ConditionTags","Name","json")]
		[h:inclusiveConditionTargetTags = ""]
		[h,foreach(tempConditionTag,allConditionTags): inclusiveConditionTargetTags = if(json.contains(subeffectData,"affectConditionTagFilterInclusive"+tempConditionTag),json.append(inclusiveConditionTargetTags,tempConditionTag),inclusiveConditionTargetTags)]
		[h,foreach(tempConditionTag,allConditionTags): subeffectData = json.remove(subeffectData,"affectConditionTagFilterInclusive"+tempConditionTag)]
		[h,if(inclusiveConditionTargetTags!=""): tempTagData = json.set(tempTagData,"Inclusive",inclusiveConditionTargetTags)]
	};{}]
	
	[h,if(json.get(subeffectData,"affectConditionTagFilterType")=="Exclusive" || json.get(subeffectData,"affectConditionTagFilterType")=="Mixture"),CODE:{
		[h:allConditionTags = pm.a5e.GetCoreData("sb.ConditionTags","Name","json")]
		[h:inclusiveConditionTargetTags = ""]
		[h,foreach(tempConditionTag,allConditionTags): inclusiveConditionTargetTags = if(json.contains(subeffectData,"affectConditionTagFilterExclusive"+tempConditionTag),json.append(inclusiveConditionTargetTags,tempConditionTag),inclusiveConditionTargetTags)]
		[h,foreach(tempConditionTag,allConditionTags): subeffectData = json.remove(subeffectData,"affectConditionTagFilterExclusive"+tempConditionTag)]
		[h,if(inclusiveConditionTargetTags!=""): tempTagData = json.set(tempTagData,"Exclusive",inclusiveConditionTargetTags)]
	};{}]
	
	[h,if(tempTagData!=""): TargetConditionData = json.set(TargetConditionData,"ConditionTypes",tempTagData)]

	[h,if(json.contains(subeffectData,"affectConditionCombineFiltersHow")): TargetConditionData = json.set(TargetConditionData,"CombineFiltersHow",json.get(subeffectData,"affectConditionCombineFiltersHow"))]
	[h:TargetConditionData = json.set(TargetConditionData,"Tier",json.get(subeffectData,"affectConditionTier"))]

	[h:subeffectData = json.remove(subeffectData,"affectConditionCombineFiltersHow")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionTier")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionNameFilterType")]
	[h:subeffectData = json.remove(subeffectData,"affectConditionTagFilterType")]

	[h,switch(json.get(subeffectData,"isAffectCondition")),CODE:
		case "End":{
			[h:ConditionModificationData = json.set(ConditionModificationData,"Method","End")]
		};
		case "Suppress":{
			[h:ConditionModificationData = json.set(ConditionModificationData,"Method","Suppress")]
		};
		case "Prolong":{
			[h:ConditionModificationData = json.set(ConditionModificationData,"Method","Prolong")]
		};
		case "Shorten":{
			[h:ConditionModificationData = json.set(ConditionModificationData,"Method","Shorten")]
		}
	]
};{}]
[h:subeffectData = json.remove(subeffectData,"isAffectCondition")]

[h,if(TargetConditionData != ""): subeffectData = json.set(subeffectData,"TargetConditionLimits",TargetConditionData)]
[h,if(ConditionModificationData != ""): subeffectData = json.set(subeffectData,"ConditionModificationInfo",ConditionModificationData)]

[h,switch(json.get(subeffectData,"lightType")),CODE:
	case "None":{};
	case "":{};
	case "BrightDim":{
		[h:lightData = json.set("",
			"LightType",json.get(subeffectData,"lightType"),
			"IsSunlight",json.contains(subeffectData,"isSunlight"),
			"CanBlock",json.contains(subeffectData,"lightCanBlock")
		)]

		[h,if(json.contains(subeffectData,"isLightUseAoESize")):
			lightData = json.set(lightData,
				"UseAoESize",1,
				"Units",json.get(subeffectData,"lightDistanceUnits"),
				"SecondaryValue",json.get(subeffectData,"secondaryLightDistanceValue"));
			lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"),
				"Units",json.get(subeffectData,"lightDistanceUnits"),
				"SecondaryValue",json.get(subeffectData,"lightDistanceValue")+json.get(subeffectData,"secondaryLightDistanceValue"))
		]

		[h:subeffectData = json.set(subeffectData,"Light",lightData)]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceValue")]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits")]
		[h:subeffectData = json.remove(subeffectData,"secondaryLightDistanceValue")]
		[h:subeffectData = json.remove(subeffectData,"isSunlight")]
		[h:subeffectData = json.remove(subeffectData,"isLightUseAoESize")]
	};
	default:{
		[h:lightData = json.set("",
			"LightType",json.get(subeffectData,"lightType"),
			"IsSunlight",json.contains(subeffectData,"isSunlight"),
			"CanBlock",json.contains(subeffectData,"lightCanBlock")
		)]

		[h,if(json.contains(subeffectData,"isLightUseAoESize")):
			lightData = json.set(lightData,"UseAoESize",1);
			lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"),
				"Units",json.get(subeffectData,"lightDistanceUnits"))
		]

		[h:subeffectData = json.set(subeffectData,"Light",lightData)]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceValue")]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits")]
		[h:subeffectData = json.remove(subeffectData,"isSunlight")]
		[h:subeffectData = json.remove(subeffectData,"isLightUseAoESize")]
		[h:subeffectData = json.remove(subeffectData,"lightCanBlock")]
	}
]
[h:subeffectData = json.remove(subeffectData,"lightType")]

[h,if(json.contains(subeffectData,"isMoveTarget")),CODE:{
	[h,if(json.get(subeffectData,"moveTargetUnits")=="Unlimited"):
		moveTargetData = json.set("",
			"Direction",json.get(subeffectData,"moveTargetDirection"),
			"Type",json.get(subeffectData,"moveTargetType"));
		moveTargetData = json.set("",
			"Value",number(json.get(subeffectData,"moveTargetValue")),
			"Units",json.get(subeffectData,"moveTargetUnits"),
			"Direction",json.get(subeffectData,"moveTargetDirection"),
			"Type",json.get(subeffectData,"moveTargetType"))
	]

	[h,if(json.get(subeffectData,"moveTargetAHLScaling") != "0" && json.contains(subeffectData,"moveTargetAHLScaling")):
		moveTargetData = json.set(moveTargetData,
			"AHLScaling",number(json.get(subeffectData,"moveTargetAHLScaling")),
			"AHLValue",number(json.get(subeffectData,"moveTargetAHLValue")));
		moveTargetData = json.set(moveTargetData,
			"AHLScaling",0,
			"AHLValue",0)
	]
	
	[h:subeffectData = json.remove(subeffectData,"isMoveTarget")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetValue")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetUnits")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetDirection")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetType")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetAHLScaling")]
	[h:subeffectData = json.remove(subeffectData,"moveTargetAHLValue")]
	[h:subeffectData = json.set(subeffectData,"Movement",moveTargetData)]
}]

[h,if(json.get(subeffectData,"savePreventMove") != ""): SaveData = json.set(SaveData,"MoveResisted",json.get(subeffectData,"savePreventMove"))]
[h:subeffectData = json.remove(subeffectData,"savePreventMove")]

[h,if(json.contains(subeffectData,"isSetHP")),CODE:{
	[h,if(json.contains(subeffectData,"savePreventSetHP")): SaveData = json.set(SaveData,"SetHPResisted",1)]

	[h:subeffectData = json.remove(subeffectData,"isSetHP")]
	[h:subeffectData = json.remove(subeffectData,"savePreventSetHP")]
};{}]

[h,if(json.contains(subeffectData,"InstantKill")),CODE:{
	[h,if(json.contains(subeffectData,"savePreventInstantKill")): SaveData = json.set(SaveData,"InstantKillResisted",1)]

	[h:subeffectData = json.set(subeffectData,"InstantKill",1)]
	[h:subeffectData = json.remove(subeffectData,"savePreventInstantKill")]
};{}]

[h:subeffectData = json.set(subeffectData,"IgnoreCoverBenefit",json.contains(subeffectData,"IgnoreCoverBenefit"))]

[h:subeffectData = json.set(subeffectData,"UsePriorOrigin",json.contains(subeffectData,"UsePriorOrigin"))]

[h,if(json.get(subeffectData,"RangeType") == "SelfRanged" || json.get(subeffectData,"RangeType") == "Ranged"),CODE:{
	[h:rangeData = json.set("",
		"Value",number(json.get(subeffectData,"RangeValue")),
		"Units",json.get(subeffectData,"RangeUnits")
	)]
	[h,if(json.get(subeffectData,"RangeScalingAHL") != "0" && json.contains(subeffectData,"RangeScalingAHL")):
		rangeData = json.set(rangeData,
			"AHLScaling",number(json.get(subeffectData,"RangeScalingAHL")),
			"AHLValue",number(json.get(subeffectData,"RangeValueAHL")));
			rangeData = json.set(rangeData,
			"AHLScaling",0,
			"AHLValue",0)
	]
	[h:subeffectData = json.remove(subeffectData,"RangeValue")]
	[h:subeffectData = json.remove(subeffectData,"RangeUnits")]
	[h:subeffectData = json.remove(subeffectData,"RangeScalingAHL")]
	[h:subeffectData = json.remove(subeffectData,"RangeValueAHL")]
	[h:subeffectData = json.set(subeffectData,"Range",rangeData)]
};{}]

[h:subeffectData = json.set(subeffectData,"MustTargetAll",json.contains(subeffectData,"MustTargetAll"))]

[h,switch(json.get(subeffectData,"aoeShape")),CODE:
	case "None":{};
	case "":{};
	case "Choose":{
		[h:AoEShapes = json.append("","Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall")]
		[h:AoEShapeOptions = "[]"]
		[h,foreach(tempShape,AoEShapes),CODE:{
			[h:isOptionTest = json.contains(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti")]
			[h,if(isOptionTest): AoEShapeData = ct.a5e.AoEDataProcessing(tempShape)]
			[h,if(isOptionTest): AoEShapeOptions = json.append(AoEShapeOptions,json.set(AoEShapeData,"Shape",pm.RemoveSpecial(tempShape)))]
			[h:subeffectData = json.remove(subeffectData,"is"+pm.RemoveSpecial(tempShape)+"AOEMulti")]
		}]

		[h:subeffectData = json.set(subeffectData,"AoEOptions",AoEShapeOptions)]
	};
	default:{
		[h:AoEShapeData = ct.a5e.AoEDataProcessing(json.get(subeffectData,"aoeShape"))]

		[h:subeffectData = json.set(subeffectData,"AoE",json.set(AoEShapeData,"Shape",pm.RemoveSpecial(json.get(subeffectData,"aoeShape"))))]
	}
]
[h:subeffectData = json.remove(subeffectData,"aoeShape")]

[h:targetData = "{}"]
[h,switch(json.get(subeffectData,"TargetType")),CODE:
	case "AnyCreature":{
		[h:targetData = json.set(targetData,"Creature","{}")]
	};
	case "AnyOtherCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Self",0)))]
	};
	case "AlliedCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Ally",1,"Self",1)))]
	};
	case "SelfOnly":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Self",1)))]
	};
	case "EnemyCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Foe",1)))]
	};
	case "HumanoidCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","TypeInclusive","Humanoid"))]
	};
	case "Creature":{
		[h:CreatureTargetingData = ct.a5e.CreatureTargetingLimitProcessing(subeffectData,targetData)]
		[h:subeffectData = json.get(CreatureTargetingData,"Subeffect")]
		[h:creatureData = json.get(CreatureTargetingData,"Creature")]
		[h:targetData = json.set(targetData,"Creature",creatureData)]
		[h:subeffectData = json.remove(subeffectData,"MaxCover")]
	};
	case "Object":{

	};
	case "CreatureObject":{
		[h:targetData = json.set(targetData,"Creature","{}","Object","{}")]
	};
	case "Point":{

	};
	case "Effect":{

	};
	case "FreeHand":{

	};
	case "":{
		[h,if(json.contains(subeffectData,"PriorTargetAll")),CODE:{
			[h:PriorTargetsData = json.set("","TargetAll",1)]
		};{
			[h:PriorTargetsData = json.set("",
				"TargetAll",0,
				"TargetNumber",json.get(subeffectData,"PriorTargetNumber")
			)]
		}]
		[h:targetData = json.set(targetData,"PriorTargets",PriorTargetsData)]

		[h:subeffectData = json.remove(subeffectData,"UsePriorTargets")]
		[h:subeffectData = json.remove(subeffectData,"PriorTargetNumber")]
		[h:subeffectData = json.remove(subeffectData,"PriorTargetAll")]
	};
	default: {}
]
[h:subeffectData = json.remove(subeffectData,"TargetType")]
[h:"<!-- TODO: Incorporate isSight (can you see the target) into targetData - or maybe not? Since it's kinda info on the caster? Will consider. Maybe store in both locations (caster can see, target can be seen). -->"]
[h:subeffectData = json.set(subeffectData,"TargetLimits",targetData)]
[h:subeffectData = json.remove(subeffectData,"MaxCover")]

[h,if(howMitigate == "Save"): subeffectData = json.set(subeffectData,"SaveData",SaveData)]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h:totalSubeffects = number(json.get(subeffectData,"TotalSubeffects"))]
[h:thisSubeffectNum = number(json.get(subeffectData,"WhichSubeffect"))]
[h:ParentToken = json.get(subeffectData,"ParentToken")]
[h:subeffectData = json.set(subeffectData,"WhichIntrinsicSubeffect",thisSubeffectNum - 1)]
[h:subeffectData = json.remove(subeffectData,"TotalSubeffects")]
[h:subeffectData = json.remove(subeffectData,"WhichSubeffect")]
[h:subeffectData = json.remove(subeffectData,"PriorSubeffects")]
[h:subeffectData = json.remove(subeffectData,"ParentToken")]

[h:thisEffectSubeffectData = json.get(currentEffectData,"Subeffects")]
[h:thisEffectSubeffectData = json.append(thisEffectSubeffectData,subeffectData)]
[h:currentEffectData = json.set(currentEffectData,"Subeffects",thisEffectSubeffectData)]

[h,switch(EffectType),CODE:
	case "Spell":{
		[h:spellLevel = json.get(subeffectData,"SpellLevel")]
		[h:subeffectData = json.remove(subeffectData,"SpellLevel")]

		[h:thisPlayerCurrentFeatureData = json.set(thisPlayerCurrentFeatureData,json.length(thisPlayerCurrentFeatureData)-1,currentEffectData)]
		[h:setLibProperty("ct.NewSpell",json.set(CurrentFeatureData,getPlayerName(),thisPlayerCurrentFeatureData),"Lib:pm.a5e.Core")]

		[h:baseFeatureData = json.get(thisPlayerCurrentFeatureData,0)]
		[h:lastSubeffectTest = (thisSubeffectNum >= totalSubeffects)]
		[h:lastEffectTest = json.length(thisPlayerCurrentFeatureData) >= json.get(baseFeatureData,"multiEffects")]

		[h:extraData = json.set("","SpellLevel",spellLevel)]
	};
	default:{
		[h:"<!-- Note: Currently, I think this allows for only one effect to be made - it stores the effect as an object instead of an array of multiple effects -->"]
		[h:thisPlayerCurrentFeatureData = currentEffectData]
		[h:setLibProperty("ct.New"+EffectType,json.set(CurrentFeatureData,getPlayerName(),thisPlayerCurrentFeatureData),"Lib:pm.a5e.Core")]

		[h:baseFeatureData = thisPlayerCurrentFeatureData]
		[h:lastSubeffectTest = (thisSubeffectNum>=totalSubeffects)]
		[h:lastEffectTest = 1]
		[h:extraData = ""]
	}
]

[h,switch(lastSubeffectTest+""+lastEffectTest),CODE:
	case "11":{
		[h:closeDialog("SubeffectCreation")]
		[h,MACRO("CreateFeatureCoreFinalInput@Lib:pm.a5e.Core"): json.set("","EffectType",EffectType,"ExtraData",extraData,"ParentToken",ParentToken)]
	};
	case "10":{
		[h:baseFeatureData = json.set(baseFeatureData,"WhichEffect",json.length(thisPlayerCurrentFeatureData)+1)]
		[h,MACRO("CreateSpellCore@Lib:pm.a5e.Core"): baseFeatureData]
	};
	default:{
		[h:closeDialog("SubeffectCreation")]
		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("","TotalSubeffects",totalSubeffects,"WhichSubeffect",thisSubeffectNum+1,"EffectType",EffectType,"ExtraData",extraData,"ParentToken",ParentToken)]        
	}
]