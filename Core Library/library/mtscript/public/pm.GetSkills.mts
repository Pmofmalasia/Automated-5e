[h,if(argCount()>0): pm.Skills = json.path.read(getLibProperty("sb.Skills","Lib:pm.a5e.Core"),"."+arg(0)) ; pm.Skills = getLibProperty("sb.Skills","Lib:pm.a5e.Core")]

[h,if(argCount() > 1): pm.Delim = arg(1) ; pm.Delim = if(argCount(),",","json")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(argCount()>0):
		return(0,json.sort(pm.Skills,"a"));
		return(0,json.sort(pm.Skills,"a","DisplayName"))]
};{
	[h:return(0,listSort(json.toList(pm.Skills,pm.Delim),"A+",pm.Delim))]
}]