[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.ToolTypes = getLibProperty("sb.ToolTypes","Lib:pm.a5e.Core")]
};{
	[h:pm.ToolTypes = json.path.read(getLibProperty("sb.ToolTypes","Lib:pm.a5e.Core"),"."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.ToolTypes,"a"); macro.return = json.sort(pm.ToolTypes,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.ToolTypes,pm.Delim),"A+",pm.Delim)]
}]