[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h: pm.Classes = data.getData("addon:","pm.a5e.core","sb.Classes")]
};{
	[h: pm.Classes = json.path.read(data.getData("addon:","pm.a5e.core","sb.Classes"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""):
		return(0,json.sort(pm.Classes,"a"));
		return(0,json.sort(pm.Classes,"a","DisplayName"))
	]
};{
	[h:return(0,listSort(json.toList(pm.Classes,pm.Delim),"A+",pm.Delim))]
}]