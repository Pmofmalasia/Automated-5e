[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.ToolTypes = data.getData("addon:","pm.a5e.core","sb.ToolTypes")]
};{
	[h:pm.ToolTypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.ToolTypes"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): return(0,json.sort(pm.ToolTypes,"a")); return(0,json.sort(pm.ToolTypes,"a","DisplayName"))]
};{
	[h:return(0,listSort(json.toList(pm.ToolTypes,pm.Delim),"A+",pm.Delim))]
}]