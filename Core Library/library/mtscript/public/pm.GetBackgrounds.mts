[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Backgrounds = data.getData("addon:","pm.a5e.core","sb.Backgrounds")]
};{
	[h:pm.Backgrounds = json.path.read(data.getData("addon:","pm.a5e.core","sb.Backgrounds"),"\$[*]['"+pm.KeyChoice+"']","DEFAULT_PATH_LEAF_TO_NULL")]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): return(0,json.sort(pm.Backgrounds,"a")); return(0,json.sort(pm.Backgrounds,"a","DisplayName"))]
};{
	[h:return(0,listSort(json.toList(pm.Backgrounds,pm.Delim),"A+",pm.Delim))]
}]