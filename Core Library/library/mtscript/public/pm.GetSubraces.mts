[h:pm.Race = arg(0)]
[h,if(argCount()>2): pm.KeyChoice = arg(2); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Subraces = json.path.read(getLibProperty("sb.Subraces","Lib:pm.a5e.Core"),"[?(@.Race=='"+pm.Race+"')]")]
};{
	[h:pm.Subraces = json.path.read(getLibProperty("sb.Subraces","Lib:pm.a5e.Core"),"[?(@.Race=='"+pm.Race+"')]['"+
pm.KeyChoice+"']")]
}]

[h,if(argCount() > 1): pm.Delim = if(pm.KeyChoice=="","json",arg(1)); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice==""): macro.return = json.sort(pm.Subraces,"a","DisplayName"); macro.return = json.sort(pm.Subraces,"a")]
};{
	[h:pm.Subraces=listSort(json.toList(pm.Subraces,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.Subraces]
}]