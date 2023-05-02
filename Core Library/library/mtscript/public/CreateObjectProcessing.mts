[h:objectData = macro.args]
[h:objectData = pm.a5e.KeyStringsToNumbers(objectData)]
[h:ObjectName = pm.RemoveSpecial(json.get(objectData,"DisplayName"))]
[h:objectData = json.set(objectData,"Name",ObjectName)]
[h:newTemplateTest = 0]

[h,if(json.get(objectData,"Type")=="Weapon"),CODE:{
	[h,if(json.contains(objectData,"isNewWeaponTemplate")),CODE:{
		[h:newTemplateTest = 1]
		[h:newTemplateDisplayName = json.get(objectData,"NewWeaponTypeName")]
		[h:newTemplateName = pm.RemoveSpecial(newTemplateDisplayName)]
		[h:objectData = json.set(objectData,"WeaponType",newTemplateName)]
		[h:objectData = json.remove(objectData,"NewWeaponTypeName")]
		[h:objectData = json.remove(objectData,"isNewWeaponTemplate")]
	};{
		[h,if(json.get(objectData,"WeaponType")=="@@NewType"): objectData = json.set(objectData,"WeaponType",pm.RemoveSpecial(json.get(objectData,"NewWeaponTypeName")))]
		[h:objectData = json.remove(objectData,"NewWeaponTypeName")]
	}]

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
	[h,count(json.get(objectData,"weaponDamageInstanceNumber")),CODE:{
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
	[h:objectData = json.remove(objectData,"weaponDamageInstanceNumber")]
	[h:objectData = json.remove(objectData,"addDamageType")]
	[h:objectData = json.remove(objectData,"removeDamageType")]
};{}]

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
	"isStackable",json.contains(objectData,"isStackable")
)]

[h:closeDialog("ObjectCreation")]
[h,if(!json.contains(objectData,"HasPassiveEffects") && !json.contains(objectData,"HasActiveEffects")),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+json.get(objectData,"Type")+"Types",json.append(getLibProperty("sb."+json.get(objectData,"Type")+"Types","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
	};{}]

	[h:ObjectID = encode(json.get(objectData,"Name"))+eval(d1000000)]
	[h:objectData = json.set(objectData,"ObjectID",ObjectID)]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(objectData,"Library")),objectData),"Lib:"+json.get(objectData,"Library"))]
};{
	[h,if(json.contains(objectData,"HasPassiveEffects")),CODE:{
		[h:"<!-- Shuttle data to CreatePassiveEffect here (or create feature core) -->"]
	};{
		[h:"<!-- Shuttle data to CreateEffect here -->"]
	}]
}]