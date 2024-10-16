[h:subeffectData = macro.args]
[h:EffectType = json.get(subeffectData,"EffectType")]
[h:EffectsNumber = json.get(subeffectData,"EffectsNumber")]
[h:subeffectData = json.remove(subeffectData,"EffectsNumber")]
[h:isPersistentEffect = json.contains(subeffectData,"isPersistentEffect")]
[h:subeffectData = json.remove(subeffectData,"isPersistentEffect")]
[h:FeatureData = json.get(subeffectData,"FeatureData")]
[h,if(FeatureData == ""): FeatureData = "{}"; FeatureData = base64.decode(FeatureData)]
[h:subeffectData = json.remove(subeffectData,"FeatureData")]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h:thisSubeffectNum = number(json.get(subeffectData,"WhichSubeffect"))]
[h:subeffectData = json.remove(subeffectData,"WhichSubeffect")]

[h,if(isPersistentEffect),CODE:{
	[h:allMainEffectData = json.get(FeatureData,"Effects")]
	[h:MainEffectsLastIndex = json.length(allMainEffectData)-1]
	[h:allMainSubeffectsData = json.get(json.get(allMainEffectData,MainEffectsLastIndex),"Subeffects")]
	[h:MainSubeffectsLastIndex = json.length(allMainSubeffectsData)-1]

	[h:allEffectData = json.get(json.get(allMainSubeffectsData,MainSubeffectsLastIndex),"PersistentEffects")]
};{
	[h:allEffectData = json.get(FeatureData,"Effects")]
}]
[h,if(allEffectData!=""),CODE:{
	[h,if(thisSubeffectNum > 1):
		currentEffectData = json.get(allEffectData,json.length(allEffectData)-1);
		currentEffectData = "{}"
	]
};{
	[h:currentEffectData = "{}"]
}]

[h:FeatureName = json.get(FeatureData,"Name")]
[h:FeatureDisplayName = json.get(FeatureData,"DisplayName")]

[h,if(json.contains(subeffectData,"UseTime")),CODE:{
	[h,if(json.contains(subeffectData,"EffectDisplayName")),CODE:{
		[h:EffectDisplayName = json.get(subeffectData,"EffectDisplayName")]
		[h:currentEffectData = json.set(currentEffectData,
			"DisplayName",EffectDisplayName,
			"Name",pm.RemoveSpecial(EffectDisplayName)
		)]

		[h:subeffectData = json.remove(subeffectData,"EffectDisplayName")]
	};{
		[h:currentEffectData = "{}"]
	}]

	[h,switch(json.get(subeffectData,"EffectChoiceMethod")),CODE:
		case "Random":{

		};
		case "Target":{

		};
		case "StoredValue":{

		};
		case "OutsideRoll":{

		};
		case "ResourceType":{

		};
		case "ItemActivationState":{
			[h:"<!-- TODO: Add multiple activation states in the future -->"]
			[h:currentEffectData = json.set(currentEffectData,"ValidActivationState",json.get(subeffectData,"ValidActivationState"))]
			[h:subeffectData = json.remove(subeffectData,"ValidActivationState")]
		};
		default: {
			
		}
	]

	[h:UseTimeData = ct.a5e.UseTimeProcessing(subeffectData,"")]
	[h:subeffectData = json.get(UseTimeData,"Subeffect")]
	[h:currentEffectData = json.set(currentEffectData,"UseTime",json.get(UseTimeData,"UseTime"))]

	[h,MACRO("InputDurationProcessing@Lib:pm.a5e.Core"): json.set("","InputData",subeffectData,"Prefix","Duration")]
	[h:ReturnDurationData = macro.return]
	[h:subeffectData = json.get(ReturnDurationData,"OutputData")]
	[h:currentEffectData = json.set(currentEffectData,"Duration",json.get(ReturnDurationData,"DurationInfo"))]

	[h,if(json.contains(subeffectData,"AHLDuration")),CODE:{
		[h:tempSpellLevel = json.get(subeffectData,"ExtraDataSpellLevel")]
		[h:AHLDurationCountAmount = 9-tempSpellLevel]
		[h:currentEffectData = json.set(currentEffectData,"AHLDuration",1)]
		[h:subeffectData = json.remove(subeffectData,"AHLDuration")]

		[h,count(AHLDurationCountAmount),switch(json.get(subeffectData,"AHLDurationLevel"+roll.count)):
			case "Instantaneous": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,"{}");
			case "1 Round": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Round"));
			case "1 Minute": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Minute"));
			case "10 Minutes": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",10,"Units","Minute"));
			case "1 Hour": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Hour"));
			case "8 Hours": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",8,"Units","Hour"));
			case "24 Hours": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",24,"Units","Hour"));
			case "10 Days": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",10,"Units","Day"));
			case "Until Dispelled": currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,"{}");
			default: currentEffectData = json.set(currentEffectData,"AHLDurationLevel"+roll.count,durationInfo)
		]

		[h,count(AHLDurationCountAmount): subeffectData = json.remove(subeffectData,"AHLDurationLevel"+roll.count)]
	}]

	[h:currentEffectData = json.set(currentEffectData,"isConcentration",json.contains(subeffectData,"isConcentration"))]
	[h:subeffectData = json.remove(subeffectData,"isConcentration")]

	[h,if(json.contains(subeffectData,"isConcentrationLost")),CODE:{
		[h:subeffectData = json.remove(subeffectData,"isConcentrationLost")]
		[h:currentEffectData = json.set(currentEffectData,"ConcentrationLostLevel",json.get(subeffectData,"ConcentrationLostLevel"))]
		[h:subeffectData = json.remove(subeffectData,"ConcentrationLostLevel")]
	};{}]
}]

[h,if(json.get(subeffectData,"ParentSubeffect")!="" && json.get(subeffectData,"ParentSubeffect")!=0),CODE:{
	[h:subeffectData = json.set(subeffectData,"ParentSubeffect",json.get(subeffectData,"ParentSubeffect")-1)]
	[h,switch(json.get(subeffectData,"ParentPrereqs")),CODE:
		case "AttackHit":{
			[h:subeffectRequirements = json.set("",
				"Requirement","Attack",
				"Result","Hit",
				"Margin",json.get(subeffectData,"PrereqAttackHitMargin")
			)]
			[h,if(json.contains(subeffectData,"PrereqAttackCrits")): subeffectRequirements = json.set(subeffectRequirements,"MustCrit",1)]

			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",subeffectRequirements)]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqAttackHitMargin")]
			[h:subeffectData = json.remove(subeffectData,"PrereqAttackCrits")]
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
		case "Damage":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement",json.get(subeffectData,"ParentPrereqs"),
				"DamageType",json.get(subeffectData,"PrereqDamageDealtType"),
				"Minimum",json.get(subeffectData,"PrereqDamageDealtMinimum")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqDamageDealtMinimum")]
			[h:subeffectData = json.remove(subeffectData,"PrereqDamageDealtType")]
		};
		case "Healing":{
			[h:subeffectData = json.set(subeffectData,"ParentSubeffectRequirements",json.set("",
				"Requirement",json.get(subeffectData,"ParentPrereqs"),
				"Minimum",json.get(subeffectData,"PrereqHealingMinimum")
			))]

			[h:subeffectData = json.remove(subeffectData,"ParentPrereqs")]
			[h:subeffectData = json.remove(subeffectData,"PrereqHealingMinimum")]
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
	[h:SaveData = json.set("",
		"SaveType",json.get(subeffectData,"SaveType"),
		"DCMethod",json.get(subeffectData,"SaveDCMethod")
	)]

	[h,switch(json.get(subeffectData,"SaveDCMethod")):
		case "Stat": SaveData = json.set(SaveData,"DCStat",json.get(subeffectData,"SaveDCStat"));
		case "SetValue": SaveData = json.set(SaveData,"DC",json.get(subeffectData,"SaveDC"));
		default: ""
	]

	[h,if(json.contains(subeffectData,"isChooseFailure")): subeffectData = json.set(subeffectData,"isChooseFailure",1)]

	[h,if(json.contains(subeffectData,"IgnoreCoverBenefit")),CODE:{
		[h:SaveData = json.set(SaveData,"IgnoreCover",1)]
		[h:subeffectData = json.remove(subeffectData,"IgnoreCoverBenefit")]
	};{}]

	[h:subeffectData = json.remove(subeffectData,"SaveType")]
	[h:subeffectData = json.remove(subeffectData,"SaveDCMethod")]
	[h:subeffectData = json.remove(subeffectData,"SaveDCStat")]
	[h:subeffectData = json.remove(subeffectData,"SaveDC")]
	[h:subeffectData = json.remove(subeffectData,"isChooseFailure")]
}]

[h,if(howMitigate == "Attack"),CODE:{
	[h:AttackData = json.set("",
		"MeleeRanged",json.get(subeffectData,"MeleeRanged"),
		"CritThresh",number(json.get(subeffectData,"CritThresh")),
		"ToHitMethod",json.get(subeffectData,"ToHitMethod")
	)]

	[h,switch(json.get(subeffectData,"ToHitMethod")):
		case "Stat": AttackData = json.set(AttackData,"ToHitStat",json.get(subeffectData,"ToHitStat"));
		case "SetValue": AttackData = json.set(AttackData,"ToHitBonus",json.get(subeffectData,"ToHitBonus"));
		default: ""
	]

	[h,if(json.contains(subeffectData,"IgnoreCoverBenefit")),CODE:{
		[h:AttackData = json.set(AttackData,"IgnoreCover",1)]
		[h:subeffectData = json.remove(subeffectData,"IgnoreCoverBenefit")]
	};{}]

	[h:subeffectData = json.remove(subeffectData,"ToHitMethod")]
	[h:subeffectData = json.remove(subeffectData,"ToHitStat")]
	[h:subeffectData = json.remove(subeffectData,"ToHitBonus")]
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

	[h,if(json.contains(subeffectData,"DamageDieNum"+whichType)),CODE:{
		[h:thisDamageTypeInfo = json.set(thisDamageTypeInfo,
			"DamageDieNumber",number(json.get(subeffectData,"DamageDieNum"+whichType)),
			"DamageDieSize",number(json.get(subeffectData,"DamageDieSize"+whichType)),
			"DamageFlatBonus",number(json.get(subeffectData,"DamageFlatBonus"+whichType)),
			"IsModBonus",json.contains(subeffectData,"ModBonus"+whichType)
		)]
	};{
		[h,if(json.get(subeffectData,"PriorDamageType"+whichType) == "TotalDamage"):
			damageTypeToGet = "All";
			damageTypeToGet = json.append("",json.get(subeffectData,"PriorDamageType"+whichType))
		]

		[h:thisDamageTypeInfo = json.set(thisDamageTypeInfo,
			"PriorDamagePercent",(json.get(subeffectData,"PriorDamagePercent"+whichType)/100),
			"PriorDamageType",damageTypeToGet
		)]
	}]

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
	case "Weapon": ConditionIdentificationInfo = json.set("","Class","Item","Subclass",FeatureName);
	case "Object": ConditionIdentificationInfo = json.set("","Class","Item","Subclass",FeatureName);
	case "Feature": ConditionIdentificationInfo = json.set("","Class",json.get(FeatureData,"Class"),"Subclass",json.get(FeatureData,"Subclass"));
	default: ConditionIdentificationInfo = json.set("","Class","","Subclass","")
]

[h:isCondition = json.get(subeffectData,"isCondition")]
[h:subeffectData = json.remove(subeffectData,"isCondition")]

[h:allBaseConditions = pm.a5e.GetBaseConditions()]
[h:conditionsAlwaysAdded = "[]"]
[h:EffectSpecificConditions = "[]"]
[h,if(isCondition == "All" || isCondition == "Mixture"),CODE:{
	[h,foreach(tempCondition,allBaseConditions),CODE:{
		[h:tempConditionName = json.get(tempCondition,"Name")]
		[h,if(json.contains(subeffectData,"AlwaysAdded"+tempConditionName)): conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set("","Name",tempConditionName,"DisplayName",json.get(tempCondition,"DisplayName"),"Class","Condition","AlwaysAdded",1))]
		[h:subeffectData = json.remove(subeffectData,"AlwaysAdded"+tempConditionName)]
	}]

	[h,switch(json.contains(subeffectData,"AlwaysAddedEffectSpecific")+""+json.contains(subeffectData,"isEffectSpecificAlwaysAddedMultiple")),CODE:
		case "10":{
			[h:conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
			[h:EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
		};
		case "11":{
			[h:conditionNames = json.fromList(encode(json.get(subeffectData,"AlwaysAddedEffectSpecificNames")),"%0A")]
			[h,foreach(tempCondition,conditionNames): conditionsAlwaysAdded = json.append(conditionsAlwaysAdded,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(pm.EvilChars(decode(tempCondition))),"DisplayName",decode(tempCondition)))]
			[h,foreach(tempCondition,conditionNames): EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(tempCondition),"DisplayName",decode(tempCondition)))]
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
		[h:tempConditionName = json.get(tempCondition,"Name")]
		[h,if(json.contains(subeffectData,"ConditionOption"+tempConditionName)): conditionOptions = json.append(conditionOptions,json.set("","Name",tempConditionName,"DisplayName",json.get(tempCondition,"DisplayName"),"Condition","AlwaysAdded",0))]
		[h:subeffectData = json.remove(subeffectData,"ConditionOption"+tempConditionName)]
	}]

	[h,switch(json.contains(subeffectData,"ConditionOptionEffectSpecific")+""+json.contains(subeffectData,"isEffectSpecificConditionOptionMultiple")),CODE:
		case "10":{
			[h:conditionOptions = json.append(conditionOptions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
			[h:EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",FeatureName,"DisplayName",FeatureDisplayName))]
		};
		case "11":{
			[h:conditionNames = json.fromList(encode(json.get(subeffectData,"ConditionOptionEffectSpecificNames")),"%0A")]
			[h,foreach(tempCondition,conditionNames): conditionOptions = json.append(conditionOptions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(pm.EvilChars(decode(tempCondition))),"DisplayName",decode(tempCondition)))]
			[h,foreach(tempCondition,conditionNames): EffectSpecificConditions = json.append(EffectSpecificConditions,json.set(ConditionIdentificationInfo,"Name",pm.RemoveSpecial(pm.EvilChars(decode(tempCondition))),"DisplayName",decode(tempCondition)))]
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
		[h:mainDuration = json.get(currentEffectData,"Duration")]
		[h,if(!json.isEmpty(mainDuration)): conditionEndInfo = json.set(conditionEndInfo,"AdvancePoint",json.get(subeffectData,"ConditionAdvancePoint"))]
	};{
		[h:"<!-- Note: Alternate duration works as the 'main' duration for things that apply conditions but don't have another 'main' duration -->"]

		[h,MACRO("InputDurationProcessing@Lib:pm.a5e.Core"): json.set("","InputData",subeffectData,"Prefix","ConditionDuration")]
		[h:ReturnDurationData = macro.return]
		[h:subeffectData = json.get(ReturnDurationData,"OutputData")]
		[h:conditionDurationInfo = json.get(ReturnDurationData,"DurationInfo")]
		[h:conditionEndInfo = json.set("","Duration",conditionDurationInfo)]
		[h,if(!json.isEmpty(conditionDurationInfo)): conditionEndInfo = json.set(conditionEndInfo,"AdvancePoint",json.get(subeffectData,"ConditionAdvancePoint"))]
	}]
	[h:subeffectData = json.remove(subeffectData,"ConditionAdvancePoint")]

	[h,if(json.contains(subeffectData,"isConditionNonDurationEnd")),CODE:{
		[h:conditionEndInfoProcessingData = ct.a5e.ConditionEndTriggerInputProcessing(subeffectData)]
		[h:subeffectData = json.get(conditionEndInfoProcessingData,"Subeffect")]
		[h:conditionEndInfo = json.set(conditionEndInfo,"EndTriggers",json.get(conditionEndInfoProcessingData,"EndTriggers"))]
	};{}]
	[h:subeffectData = json.remove(subeffectData,"isConditionNonDurationEnd")]

	[h:allConditionInfo = json.set("",
		"Conditions",json.merge(conditionsAlwaysAdded,conditionOptions),
		"EndInfo",conditionEndInfo
	)]

	[h,if(json.contains(subeffectData,"isConditionTiered")),CODE:{
		[h:conditionTierData = json.set("","Tier",json.get(subeffectData,"ConditionTier"))]
		[h:conditionAHLScaling = number(json.get(subeffectData,"ConditionTierAHLScaling"))]
		[h,if(conditionAHLScaling != 0):
			conditionTierData = json.set(conditionTierData,"AHL",json.get(subeffectData,"ConditionTierAHL"),"AHLScaling",conditionAHLScaling);
			conditionTierData = json.set(conditionTierData,"AHL",0,"AHLScaling",0)
		]
		[h:subeffectData = json.remove(subeffectData,"ConditionTier")]
		[h:subeffectData = json.remove(subeffectData,"ConditionTierAHL")]
		[h:subeffectData = json.remove(subeffectData,"ConditionTierAHLScaling")]
		[h:subeffectData = json.remove(subeffectData,"isConditionTiered")]

		[h:allConditionInfo = json.set(allConditionInfo,"Tier",conditionTierData)]
	}]

	[h,if(json.contains(subeffectData,"isAura")),CODE:{
		[h:GeneralTargetingReturn = ct.a5e.GeneralTargetingProcessing(subeffectData,"Aura")]
		[h:subeffectData = json.get(GeneralTargetingReturn,"Subeffect")]
		[h:AuraGeneralTargetingData = json.get(GeneralTargetingReturn,"Targeting")]

		[h:AllTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,"{}","TargetType","Aura")]
		[h:subeffectData = json.get(AllTargetingData,"Subeffect")]
		[h:targetData = json.get(AllTargetingData,"Targeting")]

		[h:AuraTargetingData = json.set(AuraGeneralTargetingData,"TargetLimits",targetData)]
		[h:allConditionInfo = json.set(allConditionInfo,"Aura",AuraTargetingData)]
	};{}]
	
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
		[h:"<!-- TODO: later -->"]
	}
]
[h:subeffectData = json.remove(subeffectData,"conditionSaveEffect")]

[h:isSummons = json.get(subeffectData,"isSummons")]
[h,if(isSummons != "No"),CODE:{
	[h:summonReturnData = ct.a5e.SummonsInputProcessing(subeffectData)]
	[h:subeffectData = json.get(summonReturnData,"Input")]
	[h:SummonData = json.get(summonReturnData,"Summon")]

	[h:subeffectData = json.set(subeffectData,"Summon",SummonData)]
};{}]
[h:subeffectData = json.remove(subeffectData,"isSummons")]

[h,if(json.contains(subeffectData,"isUseResource")),CODE:{
	[h:subeffectData = json.remove(subeffectData,"isUseResource")]
	[h:UseResourceData = ct.a5e.UseResourceProcessing(subeffectData)]
	[h:subeffectData = json.get(UseResourceData,"InputData")]
	[h:subeffectData = json.set(subeffectData,"UseResource",json.get(UseResourceData,"Resource"))]
};{}]

[h:subeffectData = json.remove(subeffectData,"isUncommonEffects")]

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

[h:"<!-- TODO: Add affect spell stuff -->"]
[h:subeffectData = json.remove(subeffectData,"isAffectSpell")]

[h,if(json.contains(subeffectData,"isLight")),CODE:{
	[h:returnLightData = ct.a5e.LightDataProcessing(subeffectData,"Type")]
	[h:lightData = json.get(returnLightData,"Light")]
	[h:subeffectData = json.get(returnLightData,"Subeffect")]
	[h:subeffectData = json.set(subeffectData,"Lights",lightData)]
};{}]
[h:subeffectData = json.remove(subeffectData,"isLight")]

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

[h,if(json.get(subeffectData,"isTransform") != ""),CODE:{
	[h:TransformReturnData = ct.a5e.TransformInputProcessing(subeffectData,FeatureData)]
	[h:subeffectData = json.get(TransformReturnData,"Input")]
	[h:TransformData = json.get(TransformReturnData,"Transform")]
	[h:subeffectData = json.set(subeffectData,"Transform",TransformData)]

	[h,if(json.contains(subeffectData,"PreventTransform")): SaveData = json.set(SaveData,"TransformResisted",1)]
	[h:subeffectData = json.remove(subeffectData,"PreventTransform")]
};{}]

[h,if(json.contains(subeffectData,"isSetHP")),CODE:{
	[h:"<!-- Note: SetHPAmount key is used for SetHP data and is already set from input -->"]
	[h,if(json.contains(subeffectData,"savePreventSetHP")): SaveData = json.set(SaveData,"SetHPResisted",1)]

	[h:subeffectData = json.remove(subeffectData,"isSetHP")]
	[h:subeffectData = json.remove(subeffectData,"savePreventSetHP")]
};{}]

[h,if(json.contains(subeffectData,"isDropItems")),CODE:{
	[h,if(json.contains(subeffectData,"isSavePreventDrop")): SaveData = json.set(SaveData,"DropItemsResisted",1)]

	[h:subeffectData = json.remove(subeffectData,"isSavePreventDrop")]
};{}]

[h,if(json.contains(subeffectData,"InstantKill")),CODE:{
	[h,if(json.contains(subeffectData,"savePreventInstantKill")): SaveData = json.set(SaveData,"InstantKillResisted",1)]

	[h:subeffectData = json.set(subeffectData,"InstantKill",1)]
	[h:subeffectData = json.remove(subeffectData,"savePreventInstantKill")]
};{}]

[h,if(json.contains(subeffectData,"isDifficultTerrain")),CODE:{
	[h,if(json.contains(subeffectData,"isDifficultTerrainUseAoESize")):
		DifficultTerrainData = json.set("","UseAoESize",1);
		DifficultTerrainData = json.set("",
			"Value",json.get(subeffectData,"DifficultTerrainDistanceValue"),
			"Units",json.get(subeffectData,"DifficultTerrainDistanceUnits"))
	]

	[h:DifficultTerrainData = json.set(DifficultTerrainData,"Multiplier",json.get(subeffectData,"DifficultTerrainMultiplier"))]

	[h:subeffectData = json.set(subeffectData,"DifficultTerrain",DifficultTerrainData)]

	[h:subeffectData = json.remove(subeffectData,"isDifficultTerrain")]
	[h:subeffectData = json.remove(subeffectData,"isDifficultTerrainUseAoESize")]
	[h:subeffectData = json.remove(subeffectData,"DifficultTerrainDistanceValue")]
	[h:subeffectData = json.remove(subeffectData,"DifficultTerrainDistanceUnits")]
	[h:subeffectData = json.remove(subeffectData,"DifficultTerrainMultiplier")]
};{}]

[h,switch(json.get(subeffectData,"isCreateObject")),CODE:
	case "Unique":{

	};
	case "Specific":{
		
	};
	case "Type":{
		
	};
	default: {}
]
[h:subeffectData = json.remove(subeffectData,"isCreateObject")]

[h,if(json.get(subeffectData,"isActivateItem") == ""): subeffectData = json.remove(subeffectData,"isActivateItem")]
[h:GeneralTargetingReturn = ct.a5e.GeneralTargetingProcessing(subeffectData,"")]
[h:subeffectData = json.get(GeneralTargetingReturn,"Subeffect")]
[h:GeneralTargetingData = json.get(GeneralTargetingReturn,"Targeting")]
[h:subeffectData = json.merge(subeffectData,GeneralTargetingData)]

[h:targetData = "{}"]
[h:AllTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"TargetType")]
[h:subeffectData = json.get(AllTargetingData,"Subeffect")]
[h:targetData = json.get(AllTargetingData,"Targeting")]

[h:"<!-- TODO: Incorporate isSight (can you see the target) into targetData - or maybe not? Since it's kinda info on the caster? Will consider. Maybe store in both locations (caster can see, target can be seen). This would be more easily solvable if updates allowing more detailed invisibility/sight rules are made to MT. -->"]
[h:subeffectData = json.set(subeffectData,"TargetLimits",targetData)]
[h:subeffectData = json.remove(subeffectData,"MaxCover")]

[h,if(howMitigate == "Save"): subeffectData = json.set(subeffectData,"SaveData",SaveData)]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h:NeedsNewSubeffect = json.contains(subeffectData,"NeedsNewSubeffect")]
[h:subeffectData = json.remove(subeffectData,"NeedsNewSubeffect")]
[h:ParentToken = json.get(subeffectData,"ParentToken")]
[h:subeffectData = json.set(subeffectData,"WhichIntrinsicSubeffect",thisSubeffectNum - 1)]
[h:subeffectData = json.remove(subeffectData,"PriorSubeffects")]
[h:subeffectData = json.remove(subeffectData,"ParentToken")]

[h:needsPersistentEffect = json.get(subeffectData,"needsPersistentEffect")]
[h:MainEffectsNumber = number(json.get(subeffectData,"MainEffectsNumber"))]
[h:MainNeedsNewSubeffect = json.get(subeffectData,"MainNeedsNewSubeffect")]
[h:PersistentEffectsNumber = number(json.get(subeffectData,"PersistentEffectsNumber"))]
[h:subeffectData = json.remove(subeffectData,"needsPersistentEffect")]
[h:subeffectData = json.remove(subeffectData,"MainEffectsNumber")]
[h:subeffectData = json.remove(subeffectData,"MainNeedsNewSubeffect")]
[h:subeffectData = json.remove(subeffectData,"PersistentEffectsNumber")]
[h:subeffectData = json.remove(subeffectData,"EffectType")]

[h:ExtraDataKeys = json.fromList(json.get(subeffectData,"ExtraDataKeys"))]
[h:extraData = ""]
[h,foreach(tempKey,ExtraDataKeys),CODE:{
	[h:extraData = json.set(extraData,tempKey,json.get(subeffectData,"ExtraData"+tempKey))]
	[h:subeffectData = json.remove(subeffectData,"ExtraData"+tempKey)]
}]
[h:subeffectData = json.remove(subeffectData,"ExtraDataKeys")]

[h,if(needsPersistentEffect == "Same"),CODE:{
	[h:subeffectData = json.set(subeffectData,"PersistentEffects",1)]
	[h:needsPersistentEffect = 0]
};{
	[h,if(needsPersistentEffect == "Different"): needsPersistentEffect = 1]
}]

[h:thisEffectSubeffectData = json.get(currentEffectData,"Subeffects")]
[h:thisEffectSubeffectData = json.append(thisEffectSubeffectData,subeffectData)]

[h:currentEffectData = json.set(currentEffectData,"Subeffects",thisEffectSubeffectData)]

[h,if(thisSubeffectNum == 1):
	allEffectData = json.append(allEffectData,currentEffectData);
	allEffectData = json.set(allEffectData,json.length(allEffectData)-1,currentEffectData)
]

[h:FeatureData = json.set(FeatureData,"Effects",allEffectData)]
[h:baseFeatureData = json.set("","FeatureData",FeatureData)]
[h:lastEffectTest = json.length(allEffectData) == EffectsNumber]

[h,if(NeedsNewSubeffect),CODE:{
	[h:baseFeatureData = json.set("",
		"WhichSubeffect",thisSubeffectNum+1,
		"EffectType",EffectType,
		"EffectsNumber",EffectsNumber,
		"ExtraData",extraData,
		"ParentToken",ParentToken
	)]
};{
	[h:baseFeatureData = json.set(baseFeatureData,
		"EffectsNumber",EffectsNumber,
		"WhichSubeffect",1,
		"EffectType",EffectType,
		"ExtraData",extraData,
		"ParentToken",ParentToken
	)]
}]

[h,if(needsPersistentEffect == "Different"),CODE:{
	[h:baseFeatureData = json.set(baseFeatureData,
		"isPersistentEffect",1,
		"MainEffectsNumber",EffectsNumber,
		"MainNeedsNewSubeffect",NeedsNewSubeffect,
		"EffectsNumber",PersistentEffectsNumber,
		"WhichSubeffect",1
	)]
};{
	[h,if(isPersistentEffect): baseFeatureData = json.set(baseFeatureData,
		"isPersistentEffect",1,
		"MainEffectsNumber",MainEffectsNumber,
		"MainNeedsNewSubeffect",MainNeedsNewSubeffect
	)]
}]

[h:closeDialog("SubeffectCreation")]
[h,if(lastEffectTest && !NeedsNewSubeffect),CODE:{
	[h,if(isPersistentEffect),CODE:{
		[h:allMainEffectData = json.get(FeatureData,"Effects")]
		[h:MainEffectsLastIndex = json.length(allMainEffectData)-1]
		[h:allMainSubeffectsData = json.get(json.get(allMainEffectData,MainEffectsLastIndex),"Subeffects")]
		[h:MainSubeffectsLastIndex = json.length(allMainSubeffectsData)-1]
	
		[h:FeatureData = json.path.put(FeatureData,"\$['Effects']["+MainEffectsLastIndex+"]['Subeffects']["+MainSubeffectsLastIndex+"]","PersistentEffects",allEffectData)]
	
		[h:lastEffectTest = (json.length(allMainEffectData) >= MainEffectsNumber)]
		[h:baseFeatureData = json.set(baseFeatureData,
			"EffectsNumber",MainEffectsNumber,
			"WhichSubeffect",if(MainNeedsNewSubeffect,MainSubeffectsLastIndex+1,1),
			"isPersistentEffect",0,
			"MainEffectsNumber",0,
			"MainNeedsNewSubeffect",0
		)]
	};{}]

	[h,if(lastEffectTest && !MainNeedsNewSubeffect && !needsPersistentEffect),CODE:{
		[h,MACRO("CreateFeatureCoreFinalInput@Lib:pm.a5e.Core"): json.set("","EffectType",EffectType,"ExtraData",extraData,"ParentToken",ParentToken,"FeatureData",FeatureData)]
		[h:return(0,macro.return)]
	};{
		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): baseFeatureData]
	}]
};{
	[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): baseFeatureData]
}]