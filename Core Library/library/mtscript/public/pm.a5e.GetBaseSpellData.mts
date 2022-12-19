[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:pm.Spells = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][0]")]
};{
	[h:pm.Spells = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][0]['"+pm.KeyChoice+"']")]
}]

[h,if(argCount()>1): pm.Delim = arg(1) ; pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h:return(0,json.sort(pm.Spells,"a","DisplayName"))]
};{
	[h:return(0,json.toList(pm.Spells,pm.Delim))]
}]