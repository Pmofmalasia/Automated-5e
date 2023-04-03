[h:TypeOfThingToGet = arg(0)]
[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.ThingsGotten = getLibProperty(TypeOfThingToGet,"Lib:pm.a5e.Core")]
};{
	[h:pm.ThingsGotten = json.path.read(getLibProperty(TypeOfThingToGet,"Lib:pm.a5e.Core"),"."+pm.KeyChoice)]
}]

[h,if(argCount()>2):
	pm.Delim = arg(2);
	pm.Delim = if(pm.KeyChoice=="","json",",")
]

[h,if(pm.Delim == "json"),CODE:{
	[h:broadcast(pm.ThingsGotten)]
	[h:return(0,pm.ThingsGotten)]
};{
	[h:return(0,json.toList(pm.ThingsGotten,pm.Delim))]
}]