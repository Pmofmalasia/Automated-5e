[h,if(argCount()>0): pm.Skills = json.path.read(data.getData("addon:","pm.a5e.core","sb.Skills"),"."+arg(0)) ; pm.Skills = data.getData("addon:","pm.a5e.core","sb.Skills")]

[h,if(argCount() > 1): pm.Delim = arg(1) ; pm.Delim = if(argCount(),",","json")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(argCount()>0):
		return(0,json.sort(pm.Skills,"a"));
		return(0,json.sort(pm.Skills,"a","DisplayName"))]
};{
	[h:return(0,listSort(json.toList(pm.Skills,pm.Delim),"A+",pm.Delim))]
}]