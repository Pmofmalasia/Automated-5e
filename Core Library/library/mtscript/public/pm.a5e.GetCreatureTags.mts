[h:argsNum = argCount()]
[h,if(argsNum>0): creatureType = arg(0); creatureType = ""]
[h,if(creatureType == ""): filter = ""; filter = "[?(@.CreatureType=='"+creatureType+"' || @.CreatureType=='')]"]
[h,if(argsNum>1): keyChoice = arg(1); keyChoice = ""]
[h,if(keyChoice==""),CODE:{
	[h:creatureTags = json.path.read(data.getData("addon:","pm.a5e.core","sb.CreatureTags"),"\$[*]"+filter)]
};{
	[h:creatureTags = json.path.read(data.getData("addon:","pm.a5e.core","sb.CreatureTags"),"\$[*]"+filter+"['"+keyChoice+"']")]
}]

[h,if(argsNum > 2): delim = if(keyChoice=="","json",arg(2)); delim = if(keyChoice=="","json",",")]
[h,if(delim == "json"),CODE:{
	[h,if(keyChoice==""): return(0,json.sort(creatureTags,"a","DisplayName")); return(0,json.sort(creatureTags,"a"))]
};{
	[h:creatureTags=listSort(json.toList(creatureTags,delim),"A+",delim)]
	[h:return(0,creatureTags)]
}]