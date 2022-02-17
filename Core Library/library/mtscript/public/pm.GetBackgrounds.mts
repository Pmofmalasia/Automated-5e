[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h: pm.Backgrounds = getLibProperty("sb.Backgrounds","Lib:pm.a5e.Core")]
};{
	[h: pm.Backgrounds = json.path.read(getLibProperty("sb.Backgrounds","Lib:pm.a5e.Core"),"[*]['"+pm.KeyChoice+"']","DEFAULT_PATH_LEAF_TO_NULL"))]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.Backgrounds,"a"); macro.return = json.sort(pm.Backgrounds,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.Backgrounds,pm.Delim),"A+",pm.Delim)]
}]