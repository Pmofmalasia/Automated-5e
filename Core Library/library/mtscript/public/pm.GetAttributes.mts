[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Attributes = data.getData("addon:","pm.a5e.core","sb.Attributes")]
};{
	[h:pm.Attributes = json.path.read(data.getData("addon:","pm.a5e.core","sb.Attributes"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.Attributes)]
};{
	[h:return(0,json.toList(pm.Attributes,pm.Delim))]
}]