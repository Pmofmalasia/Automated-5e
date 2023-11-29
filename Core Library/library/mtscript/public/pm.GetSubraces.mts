[h:pm.Race = arg(0)]
[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Subraces = json.path.read(data.getData("addon:","pm.a5e.core","sb.Subraces"),"\$[*][?(@.Race=='"+pm.Race+"')]")]
};{
	[h:pm.Subraces = json.path.read(data.getData("addon:","pm.a5e.core","sb.Subraces"),"\$[*][?(@.Race=='"+pm.Race+"')]['"+
pm.KeyChoice+"']")]
}]

[h,if(argCount() > 2): pm.Delim = if(pm.KeyChoice=="","json",arg(2)); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice==""): return(0,json.sort(pm.Subraces,"a","DisplayName")); return(0,json.sort(pm.Subraces,"a"))]
};{
	[h:pm.Subraces=listSort(json.toList(pm.Subraces,pm.Delim),"A+",pm.Delim)]
	[h:return(0,pm.Subraces)]
}]