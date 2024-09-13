[h:pm.ResourceInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:"<!-- TODO: MaxResource fix -->"]
[h:featureOptionsFixed = ""]
[h:backupFeatureOptionsFixed = ""]
[h,if(json.get(pm.ResourceInfo,"Feature") != ""),CODE:{
	[h:tempResource = json.get(pm.ResourceInfo,"Feature")]
	[h,if(json.get(tempResource,"ResourceKey") != ""):
		tempIdentifier = json.set(json.get(tempResource,"Resource"),"Resource",json.get(tempResource,"ResourceKey"));
		tempIdentifier = json.remove(json.get(tempResource,"Resource"),"Resource")
	]
	[h:tempResource = json.set(tempResource,
		"Type",if(json.get(tempResource,"ResourceSource") == "","Feature",json.get(tempResource,"ResourceSource")),
		"Identifier",tempIdentifier
	)]
	[h:tempResource = json.remove(tempResource,"Resource")]
	[h,if(json.get(tempResource,"Increment") == ""): tempResource = json.set(tempResource,"Increment",1)]
	[h,if(json.get(tempResource,"ResourceUsedMax") == ""): tempResource = json.set(tempResource,"ResourceUsedMax",json.get(tempResource,"ResourceUsed"))]

	[h:featureOptionsFixed = json.append(featureOptionsFixed,tempResource)]
};{}]

[h,if(json.get(pm.ResourceInfo,"FeatureBackup") != ""),CODE:{
	[h:tempResource = json.get(pm.ResourceInfo,"FeatureBackup")]
	[h,if(json.get(tempResource,"ResourceKey") != ""):
		tempIdentifier = json.set(json.get(tempResource,"Resource"),"Resource",json.get(tempResource,"ResourceKey"));
		tempIdentifier = json.remove(json.get(tempResource,"Resource"),"Resource")
	]
	[h:tempResource = json.set(tempResource,
		"Type",if(json.get(tempResource,"ResourceSource") == "","Feature",json.get(tempResource,"ResourceSource")),
		"Identifier",tempIdentifier
	)]
	[h:tempResource = json.remove(tempResource,"Resource")]
	[h,if(json.get(tempResource,"Increment") == ""): tempResource = json.set(tempResource,"Increment",1)]
	[h,if(json.get(tempResource,"ResourceUsedMax") == ""): tempResource = json.set(tempResource,"ResourceUsedMax",json.get(tempResource,"ResourceUsed"))]

	[h:backupFeatureOptionsFixed = json.append(backupFeatureOptionsFixed,tempResource)]
};{}]

[h,if(json.get(pm.ResourceInfo,"HitDice") != ""),CODE:{
	[h:tempResource = json.get(pm.ResourceInfo,"HitDice")]
	[h:tempResource = json.set(tempResource,"Type","HitDice")]
	[h,if(json.get(tempResource,"Increment") == ""): tempResource = json.set(tempResource,"Increment",1)]
	[h,if(json.get(tempResource,"ResourceUsedMax") == ""): tempResource = json.set(tempResource,"ResourceUsedMax",json.get(tempResource,"ResourceUsed"))]

	[h,if(json.get(tempResource,"Option") == 1):
		featureOptionsFixed = json.append(featureOptionsFixed,tempResource);
		backupFeatureOptionsFixed = json.append(backupFeatureOptionsFixed,tempResource)
	]
};{}]

[h,if(json.get(pm.ResourceInfo,"SpellSlots") != ""),CODE:{
	[h:tempResource = json.get(pm.ResourceInfo,"SpellSlots")]
	[h:tempResource = json.set(tempResource,"Type","SpellSlot")]
	[h,if(json.get(tempResource,"SpellLevelMin") == ""): tempResource = json.set(tempResource,"SpellLevelMin",1)]
	[h,if(json.get(tempResource,"SpellLevelMax") == ""): tempResource = json.set(tempResource,"SpellLevelMax",9)]

	[h,if(json.get(tempResource,"Option") == 1):
		featureOptionsFixed = json.append(featureOptionsFixed,tempResource);
		backupFeatureOptionsFixed = json.append(backupFeatureOptionsFixed,tempResource)
	]
};{}]

[h:finalResourceOptions = json.append("",featureOptionsFixed)]
[h,if(backupFeatureOptionsFixed != ""): finalResourceOptions = json.append(finalResourceOptions,backupFeatureOptionsFixed)]

[h,if(IsTooltip),CODE:{
	[h:resourceData = js.a5e.UseResourceTooltip(finalResourceOptions,a5e.UnifiedAbilities,ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(resourceData,"Table"))]
	[h:return(0)]
};{
	[h:resourceData = pm.a5e.UseResource(finalResourceOptions,a5e.UnifiedAbilities,ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(resourceData,"Table"))]
	[h:effectsToMerge = json.append("",json.set("","Resource",json.get(resourceData,"Data")))]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:return(0,pm.a5e.EffectData)]
}]