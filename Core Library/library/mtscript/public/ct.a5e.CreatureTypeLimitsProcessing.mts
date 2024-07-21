[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]

[h:allCreatureTypes = pm.GetCreatureTypes("Name","json")]
[h:selectedCreatureTypes = "[]"]
[h,foreach(creatureType,allCreatureTypes),CODE:{
	[h,if(json.contains(inputData,"CreatureTypeLimits"+IDSuffix+creatureType)): selectedCreatureTypes = json.append(selectedCreatureTypes,creatureType)]
	[h:inputData = json.remove(inputData,"CreatureTypeLimits"+IDSuffix+creatureType)]
}]

[h:return(0,json.set("","InputData",inputData,"CreatureTypes",selectedCreatureTypes))]