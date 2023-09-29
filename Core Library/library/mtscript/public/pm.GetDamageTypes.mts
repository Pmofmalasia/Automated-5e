[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.DamageTypes = data.getData("addon:","pm.a5e.core","sb.DamageTypes")]
};{
	[h:pm.DamageTypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.DamageTypes"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.DamageTypes)]
};{
	[h:return(0,json.toList(pm.DamageTypes,pm.Delim))]
}]