[h:TypeOfThingToGet = arg(0)]

[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.DamageTypes = getLibProperty(TypeOfThingToGet,"Lib:pm.a5e.Core")]
};{
	[h:pm.DamageTypes = json.path.read(getLibProperty(TypeOfThingToGet,"Lib:pm.a5e.Core"),"."+pm.KeyChoice)]
}]

[h,if(argCount()>2): pm.Delim = arg(2) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.DamageTypes)]
};{
	[h:return(0,json.toList(pm.DamageTypes,pm.Delim))]
}]