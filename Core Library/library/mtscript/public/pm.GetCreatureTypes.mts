[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.CreatureTypes = getLibProperty("sb.CreatureTypes","Lib:pm.a5e.Core")]
};{
	[h:pm.CreatureTypes = json.path.read(getLibProperty("sb.CreatureTypes","Lib:pm.a5e.Core"),"."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.CreatureTypes)]
};{
	[h:return(0,json.toList(pm.CreatureTypes,pm.Delim))]
}]