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

[h,if(objectType=="Weapon"),CODE:{
	[h:allWeaponTags = pm.a5e.GetCoreData("sb.WeaponTags","Name","json")]
	[h:ChosenWeaponTagsArray = "[]"]
	[h,foreach(tempTag,allWeaponTags),CODE:{
		[h,if(json.contains(objectData,"weaponTag"+tempTag)): ChosenWeaponTagsArray = json.append(ChosenWeaponTagsArray,tempTag)]
		[h:objectData = json.remove(objectData,"weaponTag"+tempTag)]
	}]
	[h:objectData = json.set(objectData,"WeaponTags",ChosenWeaponTagsArray)]

	[h:allWeaponProperties = pm.a5e.GetCoreData("sb.WeaponProperties","Name","json")]
	[h:ChosenWeaponPropertiesArray = "[]"]
	[h,foreach(tempProperty,allWeaponProperties),CODE:{
		[h,if(json.contains(objectData,"weaponProperty"+tempProperty)): ChosenWeaponPropertiesArray = json.append(ChosenWeaponPropertiesArray,tempProperty)]
		[h:objectData = json.remove(objectData,"weaponProperty"+tempProperty)]
	}]
	[h:objectData = json.set(objectData,"WeaponProperties",ChosenWeaponPropertiesArray)]

	[h:allWeaponDamage = "[]"]
	[h,count(json.get(objectData,"WeaponDamageInstanceNumber")),CODE:{
		[h:thisDamageObject = json.set("",
			"DamageType",json.get(objectData,"WeaponDamageType"+roll.count),
			"DamageDieNumber",number(json.get(objectData,"WeaponDamageDieNumber"+roll.count)),
			"DamageDieSize",number(json.get(objectData,"WeaponDamageDieSize"+roll.count)),
			"DamageFlatBonus",json.get(objectData,"WeaponDamageBonus"+roll.count),
			"IsModBonus",json.contains(objectData,"WeaponAddDmgMod"+roll.count)
		)]

		[h:allWeaponDamage = json.append(allWeaponDamage,thisDamageObject)]

		[h:objectData = json.remove(objectData,"WeaponDamageType"+roll.count)]
		[h:objectData = json.remove(objectData,"WeaponDamageDieNumber"+roll.count)]
		[h:objectData = json.remove(objectData,"WeaponDamageDieSize"+roll.count)]
		[h:objectData = json.remove(objectData,"WeaponDamageBonus"+roll.count)]
		[h:objectData = json.remove(objectData,"WeaponAddDmgMod"+roll.count)]
	}]

	[h,if(json.get(objectData,"WeaponCritThreshMethod")=="Set"),CODE:{
		[h:objectData = json.set(objectData,"CritThresh",json.get(objectData,"WeaponCritThresh"))]
	};{
		[h:objectData = json.set(objectData,"CritThreshReduction",json.get(objectData,"WeaponCritThresh"))]
	}]
	[h:objectData = json.remove(objectData,"WeaponCritThreshMethod")]

	[h:objectData = json.set(objectData,"WeaponDamage",allWeaponDamage)]
	[h:objectData = json.remove(objectData,"WeaponDamageInstanceNumber")]
	[h:objectData = json.remove(objectData,"addDamageType")]
	[h:objectData = json.remove(objectData,"removeDamageType")]
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

	[h:objectData = json.set(objectData,
		"isDexterityCap",!json.contains(objectData,"ArmorNoDexCap"),
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

[h,if(json.contains(objectData,"isCharges")),CODE:{
	[h:"<!-- TODO: Charges data currently doesn't require any processing, but will need it when DepletedEffects are implemented. -->"]
};{}]
[h:objectData = json.remove(objectData,"isCharges")]

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
[h,if(!json.contains(objectData,"HasPassiveEffects") && !json.contains(objectData,"HasActiveEffects")),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	};{}]

	[h:ObjectID = base64.encode(json.get(objectData,"Name"))+eval("1d1000000")]
	[h:objectData = json.set(objectData,"ObjectID",ObjectID)]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]

	[h:broadcast("Object "+json.get(objectData,"DisplayName")+" has been created.")]
};{
	[h,if(json.contains(objectData,"HasPassiveEffects")),CODE:{
		[h:"<!-- Shuttle data to CreatePassiveEffect here (or create feature core) -->"]
	};{
		[h:"<!-- Shuttle data to CreateEffect here -->"]
	}]
}]