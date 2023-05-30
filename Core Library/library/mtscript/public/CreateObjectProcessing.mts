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

[h,if(json.contains(objectData,"isActivatable")),CODE:{
	[h:objectData = json.set(objectData,"isActivatable",json.contains(objectData,"isActivatable"))]
	[h,switch(json.get(objectData,"ActivationUseTime")):
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

[h:ObjectID = base64.encode(json.get(objectData,"Name"))+eval("1d1000000")]
[h:objectData = json.set(objectData,"ObjectID",ObjectID)]

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
		[h:"<!-- TODO: May want to add flag to mark effects as part of the random choice to allow for some effects to be randomly chosen, others to be selected. Likely more complex to have an entirely different key ('RandomEffects') due to sorting/searching. -->"]
		[h:ActiveEffectsNumber = json.get(objectData,"ActiveEffectsNumber")]
		[h:objectData = json.remove(objectData,"ActiveEffectsNumber")]
	
		[h:objectData = json.set(objectData,"NewTemplate",newTemplateTest)]

		[h:setLibProperty("ct.NewObject",json.set(getLibProperty("ct.NewObject","Lib:pm.a5e.Core"),getPlayerName(),objectData),"Lib:pm.a5e.Core")]

		[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
			"WhichSubeffect",1,
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