[h:TypeOfThingToGet = arg(0)]
[h,if(argCount()>1): pm.KeyChoice = arg(1); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.ThingsGotten = data.getData("addon:","pm.a5e.core",TypeOfThingToGet)]
};{
	[h:pm.ThingsGotten = json.path.read(data.getData("addon:","pm.a5e.core",TypeOfThingToGet),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>2):
	pm.Delim = arg(2);
	pm.Delim = if(pm.KeyChoice=="","json",",")
]

[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,pm.ThingsGotten)]
};{
	[h:return(0,json.toList(pm.ThingsGotten,pm.Delim))]
}]