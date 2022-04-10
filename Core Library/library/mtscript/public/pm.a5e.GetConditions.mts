[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Conditions = getLibProperty("sb.Conditions","Lib:pm.a5e.Core")]
};{
	[h:pm.Conditions = json.path.read(getLibProperty("sb.Conditions","Lib:pm.a5e.Core"),"[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.Conditions,"a"); macro.return = json.sort(pm.Conditions,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.Conditions,pm.Delim),"A+",pm.Delim)]
}]