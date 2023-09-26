[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.CreatureTypes = data.getData("addon:","pm.a5e.core","sb.CreatureTypes")]
};{
	[h:pm.CreatureTypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.CreatureTypes"),"."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.CreatureTypes)]
};{
	[h:return(0,json.toList(pm.CreatureTypes,pm.Delim))]
}]