[h:pm.ResourceInfo = arg(0)]

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

[h,if(json.get(pm.ResourceInfo,"TimeResource") != ""),CODE:{
	[h:tempResource = json.get(pm.ResourceInfo,"TimeResource")]
	[h,if(json.get(tempResource,"ResourceKey") != ""):
		tempIdentifier = json.set(json.get(tempResource,"Resource"),"Resource",json.get(tempResource,"ResourceKey"));
		tempIdentifier = json.remove(json.get(tempResource,"Resource"),"Resource")
	]
	[h:tempResource = json.set(tempResource,
		"Type","Time",
		"Identifier",tempIdentifier,
		"Powering","this",
		"Activate",json.get(pm.ResourceInfo,"isTimeActive")
	)]
	[h:tempResource = json.remove(tempResource,"Resource")]

	[h:featureOptionsFixed = json.append(featureOptionsFixed,tempResource)]
};{}]

[h:finalResourceOptions = json.append("",featureOptionsFixed)]
[h,if(backupFeatureOptionsFixed != ""): finalResourceOptions = json.append(finalResourceOptions,backupFeatureOptionsFixed)]

[h:return(0,finalResourceOptions)]