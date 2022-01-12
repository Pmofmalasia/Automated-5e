[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h: pm.Races = getLibProperty("sb.Races","Lib:pm.a5e.Core")]
};{
	[h: pm.Races = json.path.read(getLibProperty("sb.Races","Lib:pm.a5e.Core"),"[*]['"+pm.KeyChoice+"']","DEFAULT_PATH_LEAF_TO_NULL"))]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.Races,"a"); macro.return = json.sort(pm.Races,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.Races),"A+")]
}]