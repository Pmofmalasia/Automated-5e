[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]

[h:allCreatureTags = pm.a5e.GetCoreData("sb.CreatureTags","Name","json")]
[h:allCreatureTags = json.unique(json.merge(pm.a5e.GetCoreData("sb.Races","Name","json"),pm.a5e.GetCoreData("sb.Subraces","Name","json"),allCreatureTags))]
[h:selectedCreatureTags = "[]"]
[h,foreach(creatureTag,allCreatureTags),CODE:{
	[h,if(json.contains(inputData,"CreatureTagLimits"+IDSuffix+creatureTag)): selectedCreatureTags = json.append(selectedCreatureTags,creatureTag)]
	[h:inputData = json.remove(inputData,"CreatureTagLimits"+IDSuffix+creatureTag)]
}]

[h:return(0,json.set("","InputData",inputData,"CreatureTags",selectedCreatureTags))]