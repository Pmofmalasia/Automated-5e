[h,if(argCount()>0): pm.Tools = json.path.read(data.getData("addon:","pm.a5e.core","sb.Tools"),"."+arg(0)) ; pm.Tools = data.getData("addon:","pm.a5e.core","sb.Tools")]

[h,if(argCount() > 1): pm.Delim = arg(1) ; pm.Delim = if(argCount(),",","json")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(argCount()>0):
		return(0,json.sort(pm.Tools,"a"));
		return(0,json.sort(pm.Tools,"a","DisplayName"))
	]
};{
	[h:pm.Tools = listSort(json.toList(pm.Tools,pm.Delim),"A+",pm.Delim)]
	[h:return(0,pm.Tools)]
}]