[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Languages = data.getData("addon:","pm.a5e.core","sb.Languages")]
};{
	[h:pm.Languages = json.path.read(data.getData("addon:","pm.a5e.core","sb.Languages"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.Languages,"a"); macro.return = json.sort(pm.Languages,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.Languages,pm.Delim),"A+",pm.Delim)]
}]