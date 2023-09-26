[h:pm.CreatureType = arg(0)]
[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.CreatureSubtypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.CreatureSubtypes"),"\$[?(@.CreatureType=='"+pm.CreatureType+"')]")]
};{
	[h:pm.CreatureSubtypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.CreatureSubtypes"),"\$[?(@.CreatureType=='"+pm.CreatureType+"')]['"+pm.KeyChoice+"']")]
}]

[h,if(argCount() > 2): pm.Delim = if(pm.KeyChoice=="","json",arg(2)); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice==""): macro.return = json.sort(pm.CreatureSubtypes,"a","DisplayName"); macro.return = json.sort(pm.CreatureSubtypes,"a")]
};{
	[h:pm.CreatureSubtypes=listSort(json.toList(pm.CreatureSubtypes,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.CreatureSubtypes]
}]