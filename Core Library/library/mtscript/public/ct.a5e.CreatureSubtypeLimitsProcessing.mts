[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]

[h:allCreatureSubtypes = pm.a5e.GetCoreData("sb.CreatureSubtypes","Name","json")]
[h:allCreatureSubtypes = json.unique(json.merge(pm.a5e.GetCoreData("sb.Races","Name","json"),allCreatureSubtypes))]
[h:selectedCreatureSubtypes = "[]"]
[h,foreach(creatureSubtype,allCreatureSubtypes),CODE:{
	[h,if(json.contains(inputData,"CreatureSubtypeLimits"+IDSuffix+creatureSubtype)): selectedCreatureSubtypes = json.append(selectedCreatureSubtypes,creatureSubtype)]
	[h:inputData = json.remove(inputData,"CreatureSubtypeLimits"+IDSuffix+creatureSubtype)]
}]

[h:return(0,json.set("","InputData",inputData,"CreatureSubtypes",selectedCreatureSubtypes))]