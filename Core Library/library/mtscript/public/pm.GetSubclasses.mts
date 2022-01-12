[h:pm.Class = arg(0)]
[h:pm.Subclasses = json.get(getLibProperty("sb.Subclasses","Lib:pm.a5e.Core"),pm.Class)]

[h,if(argCount() > 1): pm.Delim = arg(1) ; pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h:macro.return = json.sort(pm.Subclasses,"a")]
};{
	[h:pm.Subclasses=listSort(json.toList(pm.Subclasses,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.Subclasses]
}]