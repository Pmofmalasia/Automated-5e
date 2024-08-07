[h:objectData = macro.args]
[h:objectData = pm.a5e.KeyStringsToNumbers(objectData)]
[h:ObjectName = pm.RemoveSpecial(json.get(objectData,"DisplayName"))]
[h:objectData = json.set(objectData,"Name",ObjectName)]
[h:objectType = json.get(objectData,"Type")]
[h:newTemplateTest = 0]
[h:objectData = json.set(objectData,
	"Class","Item",
	"Subclass","",
	"Level",0
)]

[h,if(json.contains(objectData,"isNewTemplate"+objectType)),CODE:{
	[h:newTemplateTest = 1]
	[h:newTemplateDisplayName = json.get(objectData,"NewTypeName"+objectType)]
	[h:newTemplateName = pm.RemoveSpecial(newTemplateDisplayName)]
	[h:objectData = json.set(objectData,objectType+"Type",newTemplateName)]
	[h:objectData = json.remove(objectData,"NewTypeName"+objectType)]
	[h:objectData = json.remove(objectData,"isNewTemplate"+objectType)]
};{
	[h,if(json.get(objectData,objectType+"Type")=="@@NewType"): objectData = json.set(objectData,objectType+"Type",pm.RemoveSpecial(json.get(objectData,"NewTypeName"+objectType)))]
	[h:objectData = json.remove(objectData,"NewTypeName"+objectType)]
}]

[h,if(objectType == "Wondrous"),CODE:{
	[h:objectData = json.set(objectData,"isWondrous",1)]
	[h,if(json.get(objectData,"TypeWondrous") != ""),CODE:{
		[h:objectType = json.get(objectData,"TypeWondrous")]
		[h:objectData = json.set(objectData,"Type",objectType)]
	};{}]
	[h:objectData = json.remove(objectData,"TypeWondrous")]
}]

[h,if(objectType=="Weapon"),CODE:{
	[h:objectData = ct.a5e.WeaponDataProcessing(objectData)]
};{}]

[h,if(json.contains(objectData,"isImprovisedWeapon")),CODE:{
	[h:objectData = ct.a5e.WeaponDataProcessing(objectData)]
	[h:objectData = json.set(objectData,"WeaponType","Improvised")]
	[h:objectData = json.set(objectData,"WeaponClass","Improvised")]
};{}]

[h,if(objectType=="Ammunition"),CODE:{
	[h:allAmmunitionDamage = "[]"]
	[h,count(json.get(objectData,"AmmunitionDamageInstanceNumber")),CODE:{
		[h:thisDamageObject = json.set("",
			"DamageType",json.get(objectData,"AmmunitionDamageType"+roll.count),
			"DamageDieNumber",number(json.get(objectData,"AmmunitionDamageDieNumber"+roll.count)),
			"DamageDieSize",number(json.get(objectData,"AmmunitionDamageDieSize"+roll.count)),
			"DamageFlatBonus",json.get(objectData,"AmmunitionDamageBonus"+roll.count),
			"IsModBonus",json.contains(objectData,"AmmunitionAddDmgMod"+roll.count)
		)]

		[h:allAmmunitionDamage = json.append(allAmmunitionDamage,thisDamageObject)]

		[h:objectData = json.remove(objectData,"AmmunitionDamageType"+roll.count)]
		[h:objectData = json.remove(objectData,"AmmunitionDamageDieNumber"+roll.count)]
		[h:objectData = json.remove(objectData,"AmmunitionDamageDieSize"+roll.count)]
		[h:objectData = json.remove(objectData,"AmmunitionDamageBonus"+roll.count)]
		[h:objectData = json.remove(objectData,"AmmunitionAddDmgMod"+roll.count)]
	}]
	[h:objectData = json.set(objectData,"AmmunitionDamage",allAmmunitionDamage)]
	[h:objectData = json.remove(objectData,"AmmunitionDamageInstanceNumber")]
}]

[h,if(objectType=="Armor" || objectType=="Shield"),CODE:{
	[h:objectData = json.set(objectData,"BaseAC",json.get(objectData,"ArmorBaseAC"))]
	[h:objectData = json.remove(objectData,"ArmorBaseAC")]

	[h,if(json.contains(objectData,"ArmorIsDexterityBonus")),CODE:{
		[h:objectData = json.set(objectData,
			"isDexterityBonus",1,
			"isDexterityCap",!json.contains(objectData,"ArmorNoDexCap")
		)]
		[h,if(!json.contains(objectData,"ArmorNoDexCap")): objectData = json.set(objectData,"DexterityCap",json.get(objectData,"ArmorDexCap"))]
	};{
		[h:objectData = json.set(objectData,"isDexterityBonus",0)]
	}]
	[h:objectData = json.remove(objectData,"ArmorIsDexterityBonus")]

	[h:objectData = json.set(objectData,
		"isStrengthRequirement",!json.contains(objectData,"ArmorNoStrengthReq"),
		"isStealthDisadvantage",json.contains(objectData,"ArmorStealthDisadvantage")
	)]

	[h,if(!json.contains(objectData,"ArmorNoDexCap")): objectData = json.set(objectData,"DexterityCap",json.get(objectData,"ArmorDexCap"))]
	[h,if(!json.contains(objectData,"ArmorNoStrengthReq")): objectData = json.set(objectData,"StrengthRequirement",json.get(objectData,"ArmorStrengthReq"))]
	
	[h:objectData = json.remove(objectData,"ArmorNoDexCap")]
	[h:objectData = json.remove(objectData,"ArmorNoStrengthReq")]
	[h:objectData = json.remove(objectData,"ArmorStealthDisadvantage")]
	[h:objectData = json.remove(objectData,"ArmorDexCap")]
	[h:objectData = json.remove(objectData,"ArmorStrengthReq")]
}]

[h,if(objectType=="Container"),CODE:{
	[h:objectData = json.set(objectData,"Contents","[]")]

	[h,if(!json.contains(objectData,"isContainterSolidVolumeCapacity")),CODE:{
		[h:objectData = json.set(objectData,"SolidCapacity",json.set("",
			"Value",json.get(objectData,"ContainterSolidVolumeCapacity"),
			"Units",json.get(objectData,"ContainterSolidVolumeCapacityUnits")
		))]
	};{}]
	[h:objectData = json.remove(objectData,"isContainterSolidVolumeCapacity")]
	[h:objectData = json.remove(objectData,"ContainterSolidVolumeCapacity")]
	[h:objectData = json.remove(objectData,"ContainterSolidVolumeCapacityUnits")]

	[h,if(!json.contains(objectData,"isContainterFluidVolumeCapacity")),CODE:{
		[h:objectData = json.set(objectData,"FluidCapacity",json.set("",
			"Value",json.get(objectData,"ContainterFluidVolumeCapacity"),
			"Units",json.get(objectData,"ContainterFluidVolumeCapacityUnits")
		))]
	};{}]
	[h:objectData = json.remove(objectData,"isContainterFluidVolumeCapacity")]
	[h:objectData = json.remove(objectData,"ContainterFluidVolumeCapacity")]
	[h:objectData = json.remove(objectData,"ContainterFluidVolumeCapacityUnits")]

	[h:objectData = json.set(objectData,"isContainerIgnoreWeight",json.contains(objectData,"isContainerIgnoreWeight"))]

	[h,switch(json.get(objectData,"ContainerStorageTime")),CODE:
		case "":{
			[h:objectData = json.set(objectData,"ContainerStorageTime",json.set("",
				"Store",json.set("","Value",1,"Units","interaction"),
				"Remove",json.set("","Value",1,"Units","interaction")
			))]
		};
		case "Action":{
			[h:objectData = json.set(objectData,"ContainerStorageTime",json.set("",
				"Store",json.set("","Value",1,"Units","action"),
				"Remove",json.set("","Value",1,"Units","action")
			))]
		};
		case "Custom":{
			[h,switch(json.get(objectData,"StorageAddToTime")):
				case "Free": addToStorageTimeData = json.set("","Value","","Units","free");
				case "Item Interaction": addToStorageTimeData = json.set("","Value",1,"Units","interaction");
				case "Action": addToStorageTimeData = json.set("","Value",1,"Units","action");
				case "Bonus Action": addToStorageTimeData = json.set("","Value",1,"Units","bonus");
				case "Reaction": addToStorageTimeData = json.set("","Value",1,"Units","reaction");
				case "1 Minute": addToStorageTimeData = json.set("","Value",1,"Units","minute");
				case "10 Minutes": addToStorageTimeData = json.set("","Value",10,"Units","minute");
				case "1 Hour": addToStorageTimeData = json.set("","Value",1,"Units","hour");
				case "8 Hours": addToStorageTimeData = json.set("","Value",8,"Units","hour");
				case "12 Hours": addToStorageTimeData = json.set("","Value",12,"Units","hour");
				case "24 Hours": addToStorageTimeData = json.set("","Value",24,"Units","hour");
				default: addToStorageTimeData = "{}"
			]
			[h:objectData = json.remove(objectData,"StorageCannotAddTo")]
			
			[h,switch(json.get(objectData,"StorageRemovalTime")):
				case "Free": removeFromStorageTimeData = json.set("","Value","","Units","free");
				case "Item Interaction": removeFromStorageTimeData = json.set("","Value",1,"Units","interaction");
				case "Action": removeFromStorageTimeData = json.set("","Value",1,"Units","action");
				case "Bonus Action": removeFromStorageTimeData = json.set("","Value",1,"Units","bonus");
				case "Reaction": removeFromStorageTimeData = json.set("","Value",1,"Units","reaction");
				case "1 Minute": removeFromStorageTimeData = json.set("","Value",1,"Units","minute");
				case "10 Minutes": removeFromStorageTimeData = json.set("","Value",10,"Units","minute");
				case "1 Hour": removeFromStorageTimeData = json.set("","Value",1,"Units","hour");
				case "8 Hours": removeFromStorageTimeData = json.set("","Value",8,"Units","hour");
				case "12 Hours": removeFromStorageTimeData = json.set("","Value",12,"Units","hour");
				case "24 Hours": removeFromStorageTimeData = json.set("","Value",24,"Units","hour");
				default: removeFromStorageTimeData = "{}"
			]
			[h:objectData = json.remove(objectData,"StorageCannotRemove")]

			[h:objectData = json.set(objectData,"ContainerStorageTime",json.set("",
				"Store",addToStorageTimeData,
				"Remove",removeFromStorageTimeData
			))]
		}
	]
};{}]

[h:objectData = json.set(objectData,"isMagical",json.contains(objectData,"isMagical"))]
[h,if(json.get(objectData,"isMagical")),CODE:{
	[h:objectData = json.set(objectData,"isCursed",json.contains(objectData,"isCursed"))]
};{}]

[h,if(objectType=="LightSource"),CODE:{
	[h:returnLightData = ct.a5e.LightDataProcessing(objectData,"Type")]
	[h:lightData = json.get(returnLightData,"Light")]
	[h:objectData = json.get(returnLightData,"Subeffect")]
	[h:objectData = json.set(objectData,"CallLights",lightData)]

	[h,switch(json.get(objectData,"LightFuel")),CODE:
		case "Oil":{
			[h:allObjects = pm.a5e.GetCoreData("sb.Objects")]
			[h:oilFlaskData = json.get(json.path.read(allObjects,"\$[*][?(@.Name == 'OilFlask')]"),0)]
			[h:oilFlaskID = json.get(oilFlaskData,"ObjectID")]
			[h:objectData = json.set(objectData,"TimeResourceRechargeItem",json.append("",oilFlaskID))]
		};
		case "None":{

		};
		default:{
			[h:"<!-- TODO: Add some resolution for looking up other specific items here -->"]
		}
	]

	[h:objectData = json.remove(objectData,"LightFuel")]

	[h,MACRO("InputDurationProcessing@Lib:pm.a5e.Core"): json.set("","InputData",objectData,"Prefix","LightDuration")]
	[h:lightDurationData = macro.return]
	[h:objectData = json.get(lightDurationData,"OutputData")]
	[h:lightDurationData = json.get(lightDurationData,"DurationInfo")]
	[h:lightTimeResource = json.set("",json.get(lightDurationData,"Units"),json.get(lightDurationData,"Value"))]
	[h:objectData = json.set(objectData,"TimeResourceMax",lightTimeResource,"TimeResource",lightTimeResource,"TimeResourceActive",0)]

	[h:objectData = json.set(objectData,"isPassiveFunction",1)]
	[h:lightActivationEffect = json.set("",
		"EffectDisplayName","Light "+json.get(objectData,"DisplayName"),
		"UseTime",json.set("","Value",1,"Units","interaction"),
		"Duration","{}",
		"isConcentration",0,
		"ValidActivationState",0,
		"Subeffects",json.append("",json.set("",
			"RangeType","Touch",
			"isActivateItem","Activate",
			"UseResource",json.set("",
				"TimeResource",json.set("",
					"isTimeActive",1,
					"Resource",json.set("",
						"Name",ObjectName,
						"Class","Item",
						"Subclass","",
						"ResourceSource","Item"
					)
				)
			)
		))
	)]
	[h:lightDeactivationEffect = json.set("",
		"EffectDisplayName","Extinguish "+json.get(objectData,"DisplayName"),
		"UseTime",json.set("","Value",1,"Units","interaction"),
		"Duration","{}",
		"isConcentration",0,
		"ValidActivationState",1,
		"Subeffects",json.append("",json.set("",
			"RangeType","Touch",
			"isActivateItem","Deactivate",
			"UseResource",json.set("",
				"TimeResource",json.set("",
					"isTimeActive",0,
					"Resource",json.set("",
						"Name",ObjectName,
						"Class","Item",
						"Subclass","",
						"ResourceSource","Item"
					)
				)
			)
		))
	)]

	[h,if(!json.get(objectData,"isMagical")): objectData = json.set(objectData,"tempLightEffects",json.append("",lightActivationEffect,lightDeactivationEffect))]
};{
	[h:lightActivationEffect = ""]
	[h:lightDeactivationEffect = ""]
}]

[h,if(objectType=="Tool"),CODE:{
	[h,if(json.contains(objectData,"isNewToolSubtypeTemplate")),CODE:{
		[h:newToolDisplayName = json.get(objectData,"NewToolTypeDisplayName")]
		[h:newToolName = pm.RemoveSpecial(newToolDisplayName)]
		[h:newToolData = json.set("",
			"Name",newToolName,
			"DisplayName",newToolDisplayName,
			"ToolType",json.get(objectData,"ToolType")
		)]
		[h:oldToolList = getLibProperty("sb.Tools","Lib:"+json.get(objectData,"Library"))]
		[h:newToolList = json.sort(json.append(oldToolList,newToolData),"a","DisplayName")]
		[h:setLibProperty("sb.Tools",newToolList,"Lib:"+json.get(objectData,"Library"))]

		[h:objectData = json.set(objectData,"ToolSubtype",newToolName)]

		[h:objectData = json.remove(objectData,"NewToolTypeDisplayName")]
		[h:objectData = json.remove(objectData,"isNewToolSubtypeTemplate")]
	}]
};{}]

[h,switch(json.get(objectData,"isAttunement")),CODE:
	case 1:{
		[h:objectData = json.set(objectData,"isAttunement",1)]
	};
	case 2:{
		[h:objectData = json.set(objectData,"isAttunement",1)]
		[h:allAttunementRequirements = ""]
		[h:requiredAttunementClasses = "[]"]
		[h,foreach(tempClass,pm.GetClasses("Name","json")),CODE:{
			[h,if(json.contains(objectData,"AttunementClass"+tempClass)): requiredAttunementClasses = json.append(requiredAttunementClasses,tempClass)]
			[h:objectData = json.remove(objectData,"AttunementClass"+tempClass)]
		}]
		[h,if(!json.isEmpty(requiredAttunementClasses)): allAttunementRequirements = json.set(allAttunementRequirements,"Class",requiredAttunementClasses)]

		[h:requiredAttunementRaces = "[]"]
		[h,foreach(tempRace,pm.GetRaces("Name","json")),CODE:{
			[h,if(json.contains(objectData,"AttunementRace"+tempRace)): requiredAttunementRaces = json.append(requiredAttunementRaces,tempRace)]
			[h:objectData = json.remove(objectData,"AttunementRace"+tempRace)]
		}]
		[h,if(!json.isEmpty(requiredAttunementRaces)): allAttunementRequirements = json.set(allAttunementRequirements,"Race",requiredAttunementRaces)]

		[h:requiredAttunementCreatureTypes = "[]"]
		[h,foreach(tempCreatureType,pm.GetCreatureTypes("Name","json")),CODE:{
			[h,if(json.contains(objectData,"AttunementCreatureType"+tempCreatureType)): requiredAttunementCreatureTypes = json.append(requiredAttunementCreatureTypes,tempCreatureType)]
			[h:objectData = json.remove(objectData,"AttunementCreatureType"+tempCreatureType)]
		}]
		[h,if(!json.isEmpty(requiredAttunementCreatureTypes)): allAttunementRequirements = json.set(allAttunementRequirements,"CreatureType",requiredAttunementCreatureTypes)]

		[h:objectData = json.set(objectData,"AttunementRequirements",allAttunementRequirements)]
	};
	default:{
		[h:objectData = json.set(objectData,"isAttunement",0)]
	}
]

[h,switch(json.get(objectData,"isNonstandardEquip")),CODE:
	case "":{
		[h:objectData = json.set(objectData,
			"DonTime",json.set("","Value",1,"Units","interaction"),
			"DoffTime",json.set("","Value",1,"Units","interaction"),
			"DropTime",json.set("","Value","","Units","free")
		)]
	};
	case "Custom":{
		[h:tempEquipTypeArray = json.append("","Don","Doff","Drop")]
		[h,foreach(equipType,tempEquipTypeArray),CODE:{
			[h,switch(json.get(objectData,equipType+"Time")):
				case "Free": thisEquipTypeData = json.set("","Value","","Units","free");
				case "Item Interaction": thisEquipTypeData = json.set("","Value",1,"Units","interaction");
				case "Action": thisEquipTypeData = json.set("","Value",1,"Units","action");
				case "Bonus Action": thisEquipTypeData = json.set("","Value",1,"Units","bonus");
				case "Reaction": thisEquipTypeData = json.set("","Value",1,"Units","reaction");
				case "1 Minute": thisEquipTypeData = json.set("","Value",1,"Units","minute");
				case "10 Minutes": thisEquipTypeData = json.set("","Value",10,"Units","minute");
				case "1 Hour": thisEquipTypeData = json.set("","Value",1,"Units","hour");
				case "8 Hours": thisEquipTypeData = json.set("","Value",8,"Units","hour");
				case "12 Hours": thisEquipTypeData = json.set("","Value",12,"Units","hour");
				case "24 Hours": thisEquipTypeData = json.set("","Value",24,"Units","hour")
			]
			[h:objectData = json.set(objectData,equipType+"Time",thisEquipTypeData)]
		}]
	};
	case "CannotDrop":{
		[h:objectData = json.set(objectData,"isNotDoffable",1)]
	}
]
[h:objectData = json.remove(objectData,"isNonstandardEquip")]

[h:objectData = json.remove(objectData,"isLeaveBehindContainer")]

[h,if(json.contains(objectData,"isActivatable")),CODE:{
	[h:objectData = json.set(objectData,"isActivatable",json.contains(objectData,"isActivatable"))]
	[h,switch(json.get(objectData,"ActivationUseTime")):
		case "Free": objectData = json.set(objectData,"ActivationTime","","ActivationTimeUnits","");
		case "Item Interaction": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","interaction");
		case "Action": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","action");
		case "Bonus Action": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","bonus");
		case "Reaction": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","reaction");
		case "1 Minute": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","minute");
		case "10 Minutes": objectData = json.set(objectData,"ActivationTime",10,"ActivationTimeUnits","minute");
		case "1 Hour": objectData = json.set(objectData,"ActivationTime",1,"ActivationTimeUnits","hour");
		case "8 Hours": objectData = json.set(objectData,"ActivationTime",8,"ActivationTimeUnits","hour");
		case "12 Hours": objectData = json.set(objectData,"ActivationTime",12,"ActivationTimeUnits","hour");
		case "24 Hours": objectData = json.set(objectData,"ActivationTime",24,"ActivationTimeUnits","hour")
	]
	[h:objectData = json.remove(objectData,"ActivationUseTime")]

	[h,switch(json.get(objectData,"ActivationComponents")):
		case "None": objectData = json.set(objectData,"ActivationVerbalComponent",0,"ActivationSomaticComponent",0);
		case "Verbal": objectData = json.set(objectData,"ActivationVerbalComponent",1,"ActivationSomaticComponent",0);
		case "Somatic": objectData = json.set(objectData,"ActivationVerbalComponent",0,"ActivationSomaticComponent",1);
		case "Both": objectData = json.set(objectData,"ActivationVerbalComponent",1,"ActivationSomaticComponent",1)
	]
	[h:objectData = json.remove(objectData,"ActivationComponents")]

	[h,if(json.get(objectData,"isMagical")),CODE:{
		[h:"<!-- TODO: Merge any already present activation effects here, if there's a light also. -->"]
		[h,if(lightActivationEffect != ""): objectData = json.set(objectData,"ActivationEffects",json.append("",lightActivationEffect))]
		[h,if(lightDeactivationEffect != ""): objectData = json.set(objectData,"DeactivationEffects",json.append("",lightDeactivationEffect))]
	};{}]
};{
	[h,if(json.get(objectData,"isMagical")),CODE:{
		[h,if(lightActivationEffect != ""): objectData = json.set(objectData,"ActivationEffects",json.append("",lightActivationEffect))]
		[h,if(lightDeactivationEffect != ""): objectData = json.set(objectData,"DeactivationEffects",json.append("",lightDeactivationEffect))]
	};{}]
}]

[h,switch(json.get(objectData,"isCharges")),CODE:
	case "None":{};
	case "One":{
		[h:objectData = json.set(objectData,"MaxResource","[r:"+json.get(objectData,"MaxResource")+"]")]
	};
	case "Multiple":{
		[h:MaxResourceString = "[r:json.set(''"]
		[h:ResourceDisplayNames = "{}"]
		[h,count(json.get(objectData,"MultiResourceNumber") + 1),CODE:{
			[h:tempResourceDisplayName = json.get(objectData,"ResourceDisplayName"+roll.count)]
			[h:tempResourceName = pm.RemoveSpecial(tempResourceDisplayName)]
			[h:MaxResourceString = MaxResourceString + ",'" + tempResourceName + "'," + json.get(objectData,"MaxResource"+roll.count)]
			[h:ResourceDisplayNames = json.set(ResourceDisplayNames,tempResourceName+ tempResourceDisplayName)]

			[h:objectData = json.remove(objectData,"ResourceDisplayName"+roll.count)]
			[h:objectData = json.remove(objectData,"MaxResource"+roll.count)]
		}]
		[h:MaxResourceString = MaxResourceString + ")]"]

		[h:objectData = json.set(objectData,
			"MaxResource",MaxResourceString,
			"ResourceDisplayName",ResourceDisplayNames
		)]
		[h:objectData = json.remove(objectData,"MultiResourceNumber")]
	}
]

[h,if(json.get(objectData,"isCharges") != "None"),CODE:{
	[h:RestoreInstances = json.append("","ShortRest","LongRest","Dawn","Dusk","StartTurn","Initiative","Item")]
	[h,foreach(instance,RestoreInstances),CODE:{
		[h,if(json.contains(objectData,"Restore"+instance)): objectData = json.set(objectData,"Restore"+instance,1)]	
	}]
};{}]

[h:"<!-- TODO: Add Depleted Effects here -->"]

[h,if(json.contains(objectData,"isDuration")),CODE:{
	[h:objectDuration = json.set("",json.get(objectData,"customDurationUnits"),json.get(objectData,"customDurationValue"))]
	[h:objectData = json.set(objectData,
		"Duration",objectDuration,
		"isPerishable",json.contains(objectData,"isPerishable")
	)]

	[h:objectData = json.remove(objectData,"customDurationUnits")]
	[h:objectData = json.remove(objectData,"customDurationUnits")]
};{}]

[h,if(json.contains(objectData,"isSpellcastingFocus")),CODE:{
	[h:thisSpellcastingFocusTypes = ""]
	[h:allSpellcastingFocusTypes = pm.a5e.GetCoreData("sb.SpellcastingFocusTypes","Name")]
	[h,foreach(focus,allSpellcastingFocusTypes),CODE:{
		[h,if(json.contains(objectData,"SpellcastingFocusType"+focus)): thisSpellcastingFocusTypes = json.set(thisSpellcastingFocusTypes,focus,1)]
		[h:objectData = json.remove(objectData,"SpellcastingFocusType"+focus)]
	}]

	[h:objectData = json.set(objectData,"SpellcastingFocusTypes",thisSpellcastingFocusTypes)]
	[h:objectData = json.remove(objectData,"isSpellcastingFocus")]
};{}]

[h:objectSpellsAllowed = "[]"]
[h:differentSpellsNumber = number(json.get(objectData,"CastSpellNumber"))]
[h,count(json.contains(objectData,"isCastSpells") * differentSpellsNumber),CODE:{
	[h:thisSpellLevel = json.get(objectData,"CastSpellLevel"+roll.count)]
	[h:thisSpellData = json.set("",
		"Name",pm.RemoveSpecial(json.get(objectData,"CastSpellName"+roll.count)),
		"Level",thisSpellLevel
	)]
	[h:thisSpellResourceUsed = json.get(objectData,"CastSpellResource"+roll.count)]

	[h:objectData = json.remove(objectData,"CastSpellResource"+roll.count)]
	[h:objectData = json.remove(objectData,"CastSpellName"+roll.count)]
	[h:objectData = json.remove(objectData,"CastSpellLevel"+roll.count)]

	[h,if(json.contains(objectData,"CanAHLSpell"+roll.count)):
		isAHLAllowed = json.get(objectData,"CanAHLSpell"+roll.count);
		isAHLAllowed = 0
	]

	[h:NoResourceUsedTest = or(json.get(objectData,"isCharges") == "None",and(thisSpellResourceUsed == 0,!isAHLAllowed))]
	[h,if(!NoResourceUsedTest),CODE:{
		[h:resourceIdentifiers = json.set("","Name",ObjectName,"Class","Item","Subclass","","ResourceSource","Item")]
		[h:thisSpellResource = json.set("",
			"Resource",resourceIdentifiers,
			"ResourceUsed",thisSpellResourceUsed
		)]

		[h,if(isAHLAllowed):
			thisSpellResource = json.set(thisSpellResource,
				"Increment",json.get(objectData,"SpellResourceAHL"+roll.count),
				"ResourceUsedMax",(9-thisSpellLevel)*json.get(objectData,"SpellResourceAHL"+roll.count) + thisSpellResourceUsed);
			thisSpellResource = json.set(thisSpellResource,
				"Increment",1,
				"ResourceUsedMax",thisSpellResourceUsed)
		]

		[h,if(json.contains(objectData,"CastSpellResourceKey"+roll.count)): thisSpellResource = json.set(thisSpellResource,"ResourceKey",pm.RemoveSpecial(json.get(objectData,"CastSpellResourceKey"+roll.count)))]

		[h:FinalResourceData = json.set("","Feature",thisSpellResource)]
		[h:thisSpellData = json.set(thisSpellData,"UseResource",FinalResourceData)]

		[h:objectData = json.remove(objectData,"SpellResourceAHL"+roll.count)]
		[h:objectData = json.remove(objectData,"CanAHLSpell"+roll.count)]
		[h:objectData = json.remove(objectData,"CastSpellResourceKey"+roll.count)]
	};{}]

	[h:objectSpellsAllowed = json.append(objectSpellsAllowed,thisSpellData)]
}]

[h,if(json.contains(objectData,"isCastSpells")),CODE:{
	[h:objectData = json.set(objectData,"ItemSpellcasting",objectSpellsAllowed)]
	[h:calcModifierHow = json.get(objectData,"CastSpellModifierHow")]
	[h:objectData = json.remove(objectData,"CastSpellModifierHow")]
	[h:objectData = json.set(objectData,"ItemSpellcastingModifierMethod",calcModifierHow)]
	[h,switch(calcModifierHow),CODE:
		case "SetValue":{
			[h:objectData = json.set(objectData,"ItemSpellcastingModifier",json.get(objectData,"CastSpellFlatModifier"))]
			[h:objectData = json.remove(objectData,"CastSpellFlatModifier")]
		};
		case "Stat":{
			[h:AllowedStats = "[]"]
			[h:AllStats = pm.GetAttributes("Name","json")]
			[h,foreach(stat,AllStats): AllowedStats = if(json.contains(objectData,"CastSpellStat"+stat),json.append(AllowedStats,stat),AllowedStats)]
			[h,foreach(stat,AllStats): objectData = json.remove(objectData,"CastSpellStat"+stat)]
			[h:objectData = json.set(objectData,"ItemSpellcastingPrimeStatOptions",AllowedStats)]
		};
		case "SpecificClass":{
			[h:AllowedClasses = "[]"]
			[h:AllClasses = pm.GetClasses("Name","json")]
			[h,foreach(tempClass,AllClasses): AllowedClasses = if(json.contains(objectData,"CastSpellClass"+tempClass),json.append(AllowedClasses,tempClass),AllowedClasses)]
			[h,foreach(tempClass,AllClasses): objectData = json.remove(objectData,"CastSpellClass"+tempClass)]
			[h:objectData = json.set(objectData,"ItemSpellcastingClassOptions",AllowedClasses)]
		};
		default:{}
	]
};{}]
[h:objectData = json.remove(objectData,"isCharges")]
[h:objectData = json.remove(objectData,"isCastSpells")]
[h:objectData = json.remove(objectData,"CastSpellNumber")]

[h:ChosenMaterials = "[]"]
[h:AllMaterials = pm.a5e.GetCoreData("sb.ObjectMaterials","Name","json")]
[h,foreach(tempMaterial,AllMaterials),CODE:{
	[h,if(json.contains(objectData,"objectMaterial"+tempMaterial)): ChosenMaterials = json.append(ChosenMaterials,tempMaterial)]
	[h:objectData = json.remove(objectData,"objectMaterial"+tempMaterial)]
}]

[h,switch(json.length(ChosenMaterials)),CODE:
	case 0:{
		[h:objectData = json.set(objectData,
			"Materials",ChosenMaterials,
			"MainMaterial","@@Variable"
		)]
	};
	case 1:{
		[h:objectData = json.set(objectData,
			"Materials",ChosenMaterials,
			"MainMaterial",json.get(ChosenMaterials,0)
		)]
	};
	default:{
		[h:objectData = json.set(objectData,"Materials",ChosenMaterials)]
	}
]

[h:"<!-- Note: Custom AC/HP values are already set to the correct key if needed, these remove unneeded keys in that path -->"]
[h:objectData = json.remove(objectData,"isCustomACHP")]
[h:objectData = json.remove(objectData,"isDefaultAC")]
[h:objectData = json.remove(objectData,"isDefaultMaxHP")]

[h:objectData = json.set(objectData,
	"isWearable",json.contains(objectData,"isWearable"),
	"isLockable",json.contains(objectData,"isLockable"),
	"NeedsLock",json.contains(objectData,"NeedsLock"),
	"isFlammable",json.contains(objectData,"isFlammable"),
	"isMagnetic",json.contains(objectData,"isMagnetic"),
	"isStackable",json.contains(objectData,"isStackable"),
	"isConsumable",json.contains(objectData,"isConsumable")
)]

[h:MaterialTags = pm.a5e.GetCoreData("sb.MaterialTags")]
[h:ObjectTags = pm.a5e.GetCoreData("sb.ObjectTags")]
[h:AllTags = json.sort(json.merge(MaterialTags,ObjectTags),"a","DisplayName")]
[h:ChosenTags = "[]"]
[h,foreach(tag,AllTags),CODE:{
	[h:tempName = json.get(tag,"Name")]
	[h:isChosenTest = json.contains(objectData,"objectMaterialTag"+tempName)]
	[h,if(isChosenTest),CODE:{
		[h:ChosenTags = json.append(ChosenTags,tempName)]
		[h:objectData = json.remove(objectData,"objectMaterialTag"+tempName)]
	}]
}]
[h:objectData = json.set(objectData,"ObjectTags",ChosenTags)]

[h:tempDescription = pm.EvilChars(json.get(objectData,"Description"))]
[h:tempDescription = replace(encode(tempDescription),"%0A","<br>")]
[h:tempDescription = decode(tempDescription)]
[h:objectData = json.set(objectData,"Description",base64.encode(tempDescription))]

[h:closeDialog("ObjectCreation")]

[h:ObjectID = base64.encode(json.get(objectData,"Name"))+eval("1d1000000")]
[h:objectData = json.set(objectData,"ObjectID",ObjectID)]

[h:"<!-- TODO: Make isWeaponEffect lead into creating a subeffect if present, for effects that specifically occur after weapon attacks. Route this to a key WeaponEffects, then change the result of HasActiveEffects back to the Effects key for weapons (for effects that can be activated independently of making attacks) -->"]
[h:objectData = json.remove(objectData,"isWeaponEffect")]
[h,if(!json.contains(objectData,"HasPassiveEffects") && !json.contains(objectData,"HasActiveEffects")),CODE:{
	[h,if(json.get(objectData,"tempLightEffects")!=""),CODE:{
		[h:objectData = json.set(objectData,"Effects",json.get(objectData,"tempLightEffects"))]
		[h:objectData = json.set(objectData,"EffectChoiceMethod","ItemActivationState")]
		[h:objectData = json.remove(objectData,"tempLightEffects")]
	};{}]

	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	};{}]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]

	[h:broadcast("Object "+json.get(objectData,"DisplayName")+" has been created.")]
	[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]
};{
	[h,if(json.contains(objectData,"HasPassiveEffects")),CODE:{
		[h:objectData = json.remove(objectData,"HasPassiveEffects")]
		[h:objectData = json.set(objectData,"isPassiveFunction",1)]
		[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",objectData,"PrereqsTest",0)]

		[h:objectData = json.get(macro.return,"Ability")]
	};{}]

	[h,if(json.contains(objectData,"HasActiveEffects")),CODE:{
		[h:objectData = json.remove(objectData,"HasActiveEffects")]
		[h:objectData = json.set(objectData,"isEffectRandom",json.contains(objectData,"isEffectRandom"))]
		[h:"<!-- TODO: May want to add flag to mark effects as part of the random choice to allow for some effects to be randomly chosen, others to be selected. Likely more complex to have an entirely different key (e.g. random effects in 'RandomEffects' and chosen in 'Effects') due to sorting/searching. -->"]
		[h:ActiveEffectsNumber = json.get(objectData,"ActiveEffectsNumber")]
		[h:objectData = json.remove(objectData,"ActiveEffectsNumber")]
	
		[h:objectData = json.set(objectData,"NewTemplate",newTemplateTest)]

		[h:setLibProperty("ct.NewObject",json.set(data.getData("addon:","pm.a5e.core","ct.NewObject"),getPlayerName(),objectData),"Lib:pm.a5e.Core")]

		[h:"<!-- TODO: Remove objectType==Weapon when the better system for implementing WeaponEffects is implemented -->"]
		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
			"WhichSubeffect",1+(objectType=="Weapon"),
			"WhichEffect",1,
			"EffectsNumber",ActiveEffectsNumber,
			"EffectChoiceMethod",json.get(objectData,"EffectChoiceMethod"),
			"EffectType","Object"
		)]
	};{
		[h,if(json.get(objectData,"tempLightEffects")!=""): objectData = json.set(objectData,"Effects",json.get(objectData,"tempLightEffects"))]
		[h,if(json.get(objectData,"tempLightEffects")!=""): objectData = json.set(objectData,"EffectChoiceMethod","ItemActivationState")]
		[h:objectData = json.remove(objectData,"tempLightEffects")]

		[h:"<!-- Copied here instead of just putting both after the if because eventually will need another solution once FeatureCore is made into a frame5 -->"]

		[h,if(newTemplateTest): setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]

		[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	
		[h:broadcast("Object "+json.get(objectData,"DisplayName")+" has been created.")]
		[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]
	}]
}]