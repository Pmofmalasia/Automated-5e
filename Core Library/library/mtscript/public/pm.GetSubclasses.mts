[h:pm.Class = arg(0)]
[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Subclasses = json.path.read(data.getData("addon:","pm.a5e.core","sb.Subclasses"),"\$[*][?(@.Class=='"+pm.Class+"')]")]
};{
	[h:pm.Subclasses = json.path.read(data.getData("addon:","pm.a5e.core","sb.Subclasses"),"\$[*][?(@.Class=='"+pm.Class+"')]['"+
pm.KeyChoice+"']")]
}]

[h,if(argCount() > 2): pm.Delim = if(pm.KeyChoice=="","json",arg(2)); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice==""): return(0,json.sort(pm.Subclasses,"a","DisplayName")); return(0,json.sort(pm.Subclasses,"a"))]
};{
	[h:pm.Subclasses=listSort(json.toList(pm.Subclasses,pm.Delim),"A+",pm.Delim)]
	[h:return(0,pm.Subclasses)]
}]