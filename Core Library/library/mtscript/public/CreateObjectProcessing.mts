[h:objectData = macro.args]
[h:objectData = pm.a5e.KeyStringsToNumbers(objectData)]
[h:ObjectName = pm.RemoveSpecial(json.get(objectData,"DisplayName"))]
[h:objectData = json.set(objectData,"Name",ObjectName)]
[h:objectType = json.get(objectData,"Type")]
[h:newTemplateTest = 0]

[h,if(json.contains(objectData,"isNewTemplate")),CODE:{
	[h:newTemplateTest = 1]
	[h:newTemplateDisplayName = json.get(objectData,"NewTypeName")]
	[h:newTemplateName = pm.RemoveSpecial(newTemplateDisplayName)]
	[h:objectData = json.set(objectData,objectType+"Type",newTemplateName)]
	[h:objectData = json.remove(objectData,"NewTypeName")]
	[h:objectData = json.remove(objectData,"isNewTemplate")]
};{
	[h,if(json.get(objectData,objectType+"Type")=="@@NewType"): objectData = json.set(objectData,objectType+"Type",pm.RemoveSpecial(json.get(objectData,"NewTypeName")))]
	[h:objectData = json.remove(objectData,"NewTypeName")]
}]

[h,if(objectType == "Wondrous"),CODE:{
	[h:objectData = json.set(objectData,"isWondrous",1)]
	[h,if(json.get(objectData,"WondrousType") != ""),CODE:{
		[h:objectType = json.get(objectData,"WondrousType")]
		[h:objectData = json.set(objectData,"Type",objectType)]
	};{}]
	[h:objectData = json.remove(objectData,"WondrousType")]
}]

[h,if(objectType=="Weapon"),CODE:{
	[h:objectData = ct.a5e.WeaponDataProcessing(objectData)]
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

[h:objectData = json.set(objectData,"isMagical",json.contains(objectData,"isMagical"))]
[h,if(json.get(objectData,"isMagical")),CODE:{
	[h:objectData = json.set(objectData,
		"isAttunement",json.contains(objectData,"isAttunement"),
		"isCursed",json.contains(objectData,"isCursed")
	)]
};{}]

[h,switch(json.get(objectData,"isNonstandardEquip")),CODE:
	case "":{
		[h:objectData = json.set(objectData,
			"DonTime",json.set("","Value",1,"Units","interaction"),
			"DoffTime",json.set("","Value",1,"Units","interaction"),
			"DropTime",json.set("","Value","","Units","instant")
		)]
	};
	case "Custom":{
		[h:tempEquipTypeArray = json.append("","Don","Doff","Drop")]
		[h,foreach(equipType,tempEquipTypeArray),CODE:{
			[h,switch(json.get(objectData,equipType+"Time")):
				case "Free": thisEquipTypeData = json.set("","Value","","Units","instant");
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
};{}]

[h,switch(json.get(objectData,"isCharges")),CODE:
	case "None":{};
	case "One":{
		[h:objectData = json.set(objectData,"MaxResource","[r:"+json.get(objectData,"MaxResource")+"]")]
	};
	case "Multiple":{
		[h:MaxResourceString = "[r:json.set(''"]
		[h:ResourceDisplayNameString = "[r:json.set(''"]
		[h,count(json.get(objectData,"MultiResourceNumber") + 1),CODE:{
			[h:tempResourceDisplayName = json.get(objectData,"ResourceDisplayName"+roll.count)]
			[h:tempResourceName = pm.RemoveSpecial(tempResourceDisplayName)]
			[h:MaxResourceString = MaxResourceString + ",'" + tempResourceName + "'," + json.get(objectData,"MaxResource"+roll.count)]
			[h:ResourceDisplayNameString = ResourceDisplayNameString + ",'" + tempResourceName + "','" + tempResourceDisplayName + "'"]

			[h:objectData = json.remove(objectData,"ResourceDisplayName"+roll.count)]
			[h:objectData = json.remove(objectData,"MaxResource"+roll.count)]
		}]
		[h:MaxResourceString = MaxResourceString + ")]"]
		[h:ResourceDisplayNameString = ResourceDisplayNameString + ")]"]

		[h:objectData = json.set(objectData,
			"MaxResource",MaxResourceString,
			"ResourceDisplayName",ResourceDisplayNameString
		)]
		[h:objectData = json.remove(objectData,"MultiResourceNumber")]
	}
]

[h,if(json.get(objectData,"isCharges") != "None"),CODE:{
	[h:RestoreInstances = json.append("","ShortRest","LongRest","Dawn","Dusk","StartTurn","Initiative")]
	[h,foreach(instance,RestoreInstances),CODE:{
		[h,if(json.contains(objectData,"Restore"+instance)): objectData = json.set(objectData,"Restore"+instance,1)]	
	}]
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
		[h:broadcast("Resource is used")]
		[h:resourceIdentifiers = json.set("","Name",ObjectName,"Class","Item","Subclass","")]
		[h:thisSpellResource = json.set("",
			"Resource",resourceIdentifiers,
			"ResourceUsed",thisSpellResourceUsed
		)]

		[h,if(isAHLAllowed):
			thisSpellResource = json.set(thisSpellResource,
				"Increment",json.get(objectData,"SpellResourceAHL"+roll.count),
				"ResourceMax",(9-SpellLevel)*json.get(objectData,"SpellResourceAHL"+roll.count) + thisSpellResourceUsed);
			thisSpellResource = json.set(thisSpellResource,
				"Increment",1,
				"ResourceMax",thisSpellResourceUsed)
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
	[h:broadcast("modifier stuff")]
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

[h:objectData = json.set(objectData,
	"isWearable",json.contains(objectData,"isWearable"),
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

[h:closeDialog("ObjectCreation")]

[h:ObjectID = base64.encode(json.get(objectData,"Name"))+eval("1d1000000")]
[h:objectData = json.set(objectData,"ObjectID",ObjectID)]

[h:"<!-- TODO: Make isWeaponEffect lead into creating a subeffect if present, for effects that specifically occur after weapon attacks. Route this to a key WeaponEffects, then change the result of HasActiveEffects back to the Effects key for weapons (for effects that can be activated independently of making attacks) -->"]
[h:objectData = json.remove(objectData,"isWeaponEffect")]

[h,if(!json.contains(objectData,"HasPassiveEffects") && !json.contains(objectData,"HasActiveEffects")),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	};{}]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]

	[h:broadcast("Object "+json.get(objectData,"DisplayName")+" has been created.")]
};{
	[h:objectData = json.set(objectData,
		"Class","Item",
		"Subclass","",
		"Level",0
	)]
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

		[h:setLibProperty("ct.NewObject",json.set(getLibProperty("ct.NewObject","Lib:pm.a5e.Core"),getPlayerName(),objectData),"Lib:pm.a5e.Core")]

		[h:"<!-- TODO: Remove objectType==Weapon when the better system for implementing WeaponEffects is implemented -->"]
		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
			"WhichSubeffect",1+(objectType=="Weapon"),
			"WhichEffect",1,
			"EffectsNumber",ActiveEffectsNumber,
			"EffectType","Object"
		)]
	};{
		[h:"<!-- Copied here instead of just putting both after the if because eventually will need another solution once FeatureCore is made into a frame5 -->"]

		[h,if(newTemplateTest): setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]

		[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	
		[h:broadcast("Object "+json.get(objectData,"DisplayName")+" has been created.")]
		[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]
	}]
}]