[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Schools = data.getData("addon:","pm.a5e.core","sb.SpellSchools")]
};{
	[h:pm.Schools = json.path.read(data.getData("addon:","pm.a5e.core","sb.SpellSchools"),"\$[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(pm.Schools,"a"); macro.return = json.sort(pm.Schools,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(pm.Schools,pm.Delim),"A+",pm.Delim)]
}]