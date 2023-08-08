[h:subeffectData = macro.args]
[h:EffectType = json.get(subeffectData,"EffectType")]
[h:EffectsNumber = json.get(subeffectData,"EffectsNumber")]
[h:subeffectData = json.remove(subeffectData,"EffectsNumber")]
[h:subeffectData = json.remove(subeffectData,"EffectType")]
[h:isPersistentEffect = json.contains(subeffectData,"isPersistentEffect")]

[h:CurrentFeatureData = getLibProperty("ct.New"+if(isPersistentEffect,"Persistent","")+EffectType,"pm.a5e.Core")]
[h,if(CurrentFeatureData == ""): CurrentFeatureData = "{}"]
[h:thisPlayerCurrentFeatureData = json.get(CurrentFeatureData,getPlayerName())]
[h,if(thisPlayerCurrentFeatureData == ""): thisPlayerCurrentFeatureData = "{}"]

[h:allEffectData = json.get(thisPlayerCurrentFeatureData,"Effects")]
[h,if(allEffectData!=""):
	currentEffectData = json.get(allEffectData,json.length(allEffectData)-1);
	currentEffectData = "{}"
]
[h:FeatureName = json.get(thisPlayerCurrentFeatureData,"Name")]
[h:FeatureDisplayName = json.get(thisPlayerCurrentFeatureData,"DisplayName")]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h,if(json.contains(subeffectData,"UseTime")),CODE:{
	[h,if(json.contains(subeffectData,"EffectDisplayName")),CODE:{
		[h:EffectDisplayName = json.get(subeffectData,"EffectDisplayName")]
		[h:baseEffectData = json.set("",
			"DisplayName",EffectDisplayName,
			"Name",pm.RemoveSpecial(EffectDisplayName)
		)]

		[h:subeffectData = json.remove(subeffectData,"EffectDisplayName")]
	};{
		[h:baseEffectData = "{}"]
	}]

	[h,switch(json.get(subeffectData,"UseTime")),CODE:
		case "Action":{
			[h:castTimeInfo = json.set("","Value",1,"Units","action")]
		};
		case "Bonus Action":{
			[h:castTimeInfo = json.set("","Value",1,"Units","bonus")]
		};
		case "Reaction":{
			[h:castTimeInfo = json.set("","Value",1,"Units","reaction")]
		};
		case "1 Minute":{
			[h:castTimeInfo = json.set("","Value",1,"Units","minute")]
		};
		case "10 Minutes":{
			[h:castTimeInfo = json.set("","Value",10,"Units","minute")]
		};
		case "1 Hour":{
			[h:castTimeInfo = json.set("","Value",1,"Units","hour")]
		};
		case "8 Hours":{
			[h:castTimeInfo = json.set("","Value",8,"Units","hour")]
		};
		case "12 Hours":{
			[h:castTimeInfo = json.set("","Value",12,"Units","hour")]
		};
		case "24 Hours":{
			[h:castTimeInfo = json.set("","Value",24,"Units","hour")]
		};
		case "Custom":{
			[h:castTimeInfo = json.set("","Value",json.get(subeffectData,"customUseTimeValue"),"Units",pm.StandardDuration(json.get(subeffectData,"customUseTimeUnits")))]
			[h:subeffectData = json.remove(subeffectData,"customUseTimeValue")]
			[h:subeffectData = json.remove(subeffectData,"customUseTimeUnits")]
		}
	]
	[h:baseEffectData = json.set(baseEffectData,"UseTime",castTimeInfo)]
	[h:subeffectData = json.remove(subeffectData,"UseTime")]

	[h,if(json.contains(subeffectData,"UseTimeReactionDescription")): subeffectData = json.set(subeffectData,"ReactionDescription",base64.encode(pm.EvilChars(json.get(subeffectData,"ReactionDescription"))))]
	[h:subeffectData = json.remove(subeffectData,"UseTimeReactionDescription")]

	[h:durationInfo = "{}"]
	[h,switch(json.get(subeffectData,"Duration")),CODE:
		case "Instantaneous":{
			
		};
		case "1 Round":{
			[h:durationInfo = json.set("","Value",1,"Units","round")]
		};
		case "1 Minute":{
			[h:durationInfo = json.set("","Value",1,"Units","minute")]
		};
		case "10 Minutes":{
			[h:durationInfo = json.set("","Value",10,"Units","minute")]
		};
		case "1 Hour":{
			[h:durationInfo = json.set("","Value",1,"Units","hour")]
		};
		case "8 Hours":{
			[h:durationInfo = json.set("","Value",8,"Units","hour")]
		};
		case "24 Hours":{
			[h:durationInfo = json.set("","Value",24,"Units","hour")]
		};
		case "10 Days":{
			[h:durationInfo = json.set("","Value",10,"Units","day")]
		};
		case "Until Dispelled":{
			
		};
		case "Custom":{
			[h:durationInfo = json.set("","Value",json.get(subeffectData,"customDurationValue"),"Units",json.get(subeffectData,"customDurationUnits"))]
			[h:subeffectData = json.remove(subeffectData,"customDurationValue")]
			[h:subeffectData = json.remove(subeffectData,"customDurationUnits")]
		}
	]
	[h:baseEffectData = json.set(baseEffectData,"Duration",durationInfo)]

	[h,if(json.contains(subeffectData,"AHLDuration")),CODE:{
		[h:tempSpellLevel = json.get(subeffectData,"ExtraDataSpellLevel")]
		[h:AHLDurationCountAmount = 9-tempSpellLevel]
		[h:baseEffectData = json.set(baseEffectData,"AHLDuration",1)]
		[h:subeffectData = json.remove(subeffectData,"AHLDuration")]

		[h,count(AHLDurationCountAmount),switch(json.get(subeffectData,"AHLDurationLevel"+roll.count)):
			case "Instantaneous": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,"{}");
			case "1 Round": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Round"));
			case "1 Minute": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Minute"));
			case "10 Minutes": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",10,"Units","Minute"));
			case "1 Hour": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",1,"Units","Hour"));
			case "8 Hours": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",8,"Units","Hour"));
			case "24 Hours": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",24,"Units","Hour"));
			case "10 Days": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,json.set("","Value",10,"Units","Day"));
			case "Until Dispelled": baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,"{}");
			default: baseEffectData = json.set(baseEffectData,"AHLDurationLevel"+roll.count,durationInfo)
		]

		[h,count(AHLDurationCountAmount): subeffectData = json.remove(subeffectData,"AHLDurationLevel"+roll.count)]
	}]

	[h:baseEffectData = json.set(baseEffectData,"isConcentration",json.contains(baseEffectData,"isConcentration"))]
	[h:subeffectData = json.remove(subeffectData,"isConcentration")]

	[h,if(json.contains(subeffectData,"isConcentrationLost")),CODE:{
		[h:subeffectData = json.remove(subeffectData,"isConcentrationLost")]
		[h:baseEffectData = json.set(baseEffectData,"ConcentrationLostLevel",json.get(subeffectData,"ConcentrationLostLevel"))]
		[h:subeffectData = json.remove(subeffectData,"ConcentrationLostLevel")]
	};{}]
}]

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
		[h,if(json.get("PriorDamageType"+whichType) == "TotalDamage"):
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
	case "Feature": ConditionIdentificationInfo = json.set("","Class",json.get(thisPlayerCurrentFeatureData,"Class"),"Subclass",json.get(thisPlayerCurrentFeatureData,"Subclass"));
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
	[h:"<!-- TODO: Note - The below loop will likely be temporary, as the 'conditional' portion will likely need to be customized to each instance once completed. But for now, it's easier to just loop it. -->"]
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
		[h:"<!-- TODO: later -->"]
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

[h,if(json.contains(subeffectData,"isUseResource")),CODE:{
	[h:ResourceData = "{}"]
	[h:subeffectData = json.remove(subeffectData,"isUseResource")]

	[h,if(json.get(subeffectData,"isUseUniqueResource") > 0),CODE:{
		[h:UniqueResourceIdentificationData = json.set("",
			"Name",FeatureName,
			"Class",json.get(thisPlayerCurrentFeatureData,"Class"),
			"Subclass",json.get(thisPlayerCurrentFeatureData,"Subclass")
		)]

		[h,switch(EffectType):
			case "Object": UniqueResourceIdentificationData = json.set(UniqueResourceIdentificationData,"ResourceSource","Item");
			case "Weapon": UniqueResourceIdentificationData = json.set(UniqueResourceIdentificationData,"ResourceSource","Item");
			case "Condition": UniqueResourceIdentificationData = json.set(UniqueResourceIdentificationData,"ResourceSource","Condition");
			default: UniqueResourceIdentificationData = json.set(UniqueResourceIdentificationData,"ResourceSource","Feature")
		]

		[h:UniqueResourceData = json.set("",
			"Resource",UniqueResourceIdentificationData,
			"ResourceUsed",json.get(subeffectData,"UseUniqueResourceMin"),
			"Increment",json.get(subeffectData,"UseUniqueResourceIncrements")
		)]
		[h:subeffectData = json.remove(subeffectData,"UseUniqueResourceMin")]
		[h:subeffectData = json.remove(subeffectData,"UseUniqueResourceIncrements")]

		[h,if(json.contains(subeffectData,"isNoUniqueResourceUseLimit")):
			UniqueResourceData = json.set(UniqueResourceData,"ResourceUsedMax",99999);
			UniqueResourceData = json.set(UniqueResourceData,"ResourceUsedMax",json.get(subeffectData,"UseUniqueResourceMax"))
		]
		[h:subeffectData = json.remove(subeffectData,"isNoUniqueResourceUseLimit")]
		[h:subeffectData = json.remove(subeffectData,"UseUniqueResourceMax")]

		[h,if(json.contains(subeffectData,"UseUniqueResourceKey")): UniqueResourceData = json.set(UniqueResourceData,"ResourceKey",json.get(subeffectData,"UseUniqueResourceKey"))]
		[h:subeffectData = json.remove(subeffectData,"UseUniqueResourceKey")]

		[h,if(json.get(subeffectData,"isUseUniqueResource") == 1):
			ResourceData = json.set(ResourceData,"Feature",UniqueResourceData);
			ResourceData = json.set(ResourceData,"FeatureBackup",UniqueResourceData)
		]
		[h:subeffectData = json.remove(subeffectData,"isUseUniqueResource")]
	};{}]

	[h,if(json.get(subeffectData,"isUseSpellSlots") > 0),CODE:{
		[h:SpellResourceData = json.set("",
			"Option",json.get(subeffectData,"isUseSpellSlots"),
			"SpellLevelMin",json.get(subeffectData,"UseSpellSlotMin")
		)]
		[h:subeffectData = json.remove(subeffectData,"UseSpellSlotMin")]
		[h:subeffectData = json.remove(subeffectData,"isUseSpellSlots")]

		[h,if(!json.contains(subeffectData,"isNoSpellSlotUseLimit")): SpellResourceData = json.set(SpellResourceData,"SpellLevelMax",json.get(subeffectData,"UseSpellSlotMax"))]
		[h:subeffectData = json.remove(subeffectData,"isNoSpellSlotUseLimit")]
		[h:subeffectData = json.remove(subeffectData,"UseSpellSlotMax")]

		[h:ResourceData = json.set(ResourceData,"SpellSlots",SpellResourceData)]
	};{}]

	[h,if(json.get(subeffectData,"isUseHitDice") > 0),CODE:{
		[h:HitDiceData = json.set("",
			"Option",json.get(subeffectData,"isUseHitDice"),
			"ResourceUsed",json.get(subeffectData,"UseHitDiceMin"),
			"Increment",json.get(subeffectData,"UseHitDiceIncrements")
		)]
		[h:subeffectData = json.remove(subeffectData,"isUseHitDice")]
		[h:subeffectData = json.remove(subeffectData,"UseHitDiceMin")]
		[h:subeffectData = json.remove(subeffectData,"UseHitDiceIncrements")]

		[h,if(json.contains(subeffectData,"isNoHitDiceUseLimit")):
			HitDiceData = json.set(HitDiceData,"ResourceUsedMax",99999);
			HitDiceData = json.set(HitDiceData,"ResourceUsedMax",json.get(subeffectData,"UseHitDiceMax"))
		]
		[h:subeffectData = json.remove(subeffectData,"isNoHitDiceUseLimit")]
		[h:subeffectData = json.remove(subeffectData,"UseHitDiceMax")]

		[h:ResourceData = json.set(ResourceData,"HitDice",HitDiceData)]
	};{}]

	[h:"<!-- TODO: Add resource selection from feature other than the one being created -->"]

	[h:subeffectData = json.set(subeffectData,"UseResource",ResourceData)]
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

[h:"<!-- TODO: Add this stuff here -->"]
[h:subeffectData = json.remove(subeffectData,"isAffectSpell")]

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

[h:subeffectData = json.remove(subeffectData,"isMissiles")]

[h:targetData = "{}"]
[h:AllTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"TargetType")]
[h:subeffectData = json.get(AllTargetingData,"Subeffect")]
[h:targetData = json.get(AllTargetingData,"Targeting")]

[h:"<!-- TODO: Incorporate isSight (can you see the target) into targetData - or maybe not? Since it's kinda info on the caster? Will consider. Maybe store in both locations (caster can see, target can be seen). -->"]
[h:subeffectData = json.set(subeffectData,"TargetLimits",targetData)]
[h:subeffectData = json.remove(subeffectData,"MaxCover")]

[h,if(howMitigate == "Save"): subeffectData = json.set(subeffectData,"SaveData",SaveData)]

[h:subeffectData = pm.a5e.KeyStringsToNumbers(subeffectData)]

[h:NeedsNewSubeffect = json.contains(subeffectData,"NeedsNewSubeffect")]
[h:subeffectData = json.remove(subeffectData,"NeedsNewSubeffect")]
[h:thisSubeffectNum = number(json.get(subeffectData,"WhichSubeffect"))]
[h:ParentToken = json.get(subeffectData,"ParentToken")]
[h:subeffectData = json.set(subeffectData,"WhichIntrinsicSubeffect",thisSubeffectNum - 1)]
[h:subeffectData = json.remove(subeffectData,"WhichSubeffect")]
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


[h:ExtraDataKeys = json.fromList(json.get(subeffectData,"ExtraDataKeys"))]
[h:extraData = ""]
[h,foreach(tempKey,ExtraDataKeys),CODE:{
	[h:extraData = json.set(extraData,tempKey,json.get(subeffectData,"ExtraData"+tempKey))]
	[h:subeffectData = json.remove(subeffectData,"ExtraData"+tempKey)]
}]
[h:subeffectData = json.remove(subeffectData,"ExtraDataKeys")]

[h,if(json.contains(subeffectData,"EffectDisplayName")),CODE:{
	[h:EffectDisplayName = json.get(subeffectData,"EffectDisplayName")]
	[h:currentEffectData = json.set(currentEffectData,
		"Name",pm.RemoveSpecial(EffectDisplayName),
		"DisplayName",EffectDisplayName
	)]
}]

[h,if(needsPersistentEffect == "Same"): subeffectData = json.set(subeffectData,"PersistentEffects",1)]

[h:thisEffectSubeffectData = json.get(currentEffectData,"Subeffects")]
[h:thisEffectSubeffectData = json.append(thisEffectSubeffectData,subeffectData)]

[h:currentEffectData = json.set(currentEffectData,"Subeffects",thisEffectSubeffectData)]

[h,if(thisSubeffectNum == 1):
	allEffectData = json.append(allEffectData,currentEffectData);
	allEffectData = json.set(allEffectData,json.length(allEffectData)-1,currentEffectData)
]

[h:thisPlayerCurrentFeatureData = json.set(thisPlayerCurrentFeatureData,"Effects",allEffectData)]

[h:setLibProperty("ct.New"+if(isPersistentEffect,"Persistent","")+EffectType,json.set(CurrentFeatureData,getPlayerName(),thisPlayerCurrentFeatureData),"Lib:pm.a5e.Core")]
[h:baseFeatureData = thisPlayerCurrentFeatureData]
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

	[h:initialFeatureData = json.set("",
		"Name",FeatureName,
		"DisplayName",FeatureDisplayName,
		"Class",json.get(thisPlayerCurrentFeatureData,"Class"),
		"Subclass",json.get(thisPlayerCurrentFeatureData,"Subclass")
	)]

	[h:setLibProperty("ct.NewPersistent"+EffectType,json.set(getLibProperty("ct.NewPersistent"+EffectType,"Lib:pm.a5e.Core"),getPlayerName(),initialFeatureData),"Lib:pm.a5e.Core")]
};{
	[h,if(isPersistentEffect): baseFeatureData = json.set(baseFeatureData,
		"isPersistentEffect",1,
		"MainEffectsNumber",MainEffectsNumber,
		"MainNeedsNewSubeffect",MainNeedsNewSubeffect
	)]
}]

[h:broadcast("Main needs subeff"+ MainNeedsNewSubeffect)]

[h:broadcast(lastEffectTest)]
[h:broadcast(NeedsNewSubeffect)]
[h,if(lastEffectTest && !NeedsNewSubeffect),CODE:{
	[h:broadcast("last and no new subeff")]
	[h,if(isPersistentEffect),CODE:{
		[h:broadcast("persistent")]
		[h:MainFeatureData = getLibProperty("ct.New"+EffectType,"pm.a5e.Core")]
		[h,if(MainFeatureData == ""): MainFeatureData = "{}"]
		[h:thisPlayerMainFeatureData = json.get(MainFeatureData,getPlayerName())]

		[h:allMainEffectData = json.get(thisPlayerMainFeatureData,"Effects")]
		[h:currentMainEffectData = json.get(allMainEffectData,json.length(allMainEffectData)-1)]

		[h:currentMainSubeffectData = json.get(currentMainEffectData,json.length(currentMainEffectData)-1)]

		[h:currentMainEffectData = json.set(currentMainSubeffectData,"PersistentEffects",allEffectData)]

		[h:lastEffectTest = (json.length(allMainEffectData) >= MainEffectsNumber)]
		[h:NeedsNewSubeffect = json.get(subeffectData,"MainNeedsNewSubeffect")]

		[h:baseFeatureData = json.set(baseFeatureData,
			"EffectsNumber",MainEffectsNumber,
			"WhichSubeffect",if(NeedsNewSubeffect,json.length(currentMainSubeffectData),1)
			"isPersistentEffect",0,
			"MainEffectsNumber",0,
			"MainNeedsNewSubeffect",0
		)]
	};{}]

	[h:closeDialog("SubeffectCreation")]
	[h,if(lastEffectTest && !MainNeedsNewSubeffect && !needsPersistentEffect),CODE:{
		[h:broadcast("done")]
		[h,MACRO("CreateFeatureCoreFinalInput@Lib:pm.a5e.Core"): json.set("","EffectType",EffectType,"ExtraData",extraData,"ParentToken",ParentToken)]
	};{
		[h:broadcast("back to main")]
		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): baseFeatureData]
	}]
};{
	[h:broadcast("new eff or subeff")]
	[h:closeDialog("SubeffectCreation")]
	[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): baseFeatureData]
}]