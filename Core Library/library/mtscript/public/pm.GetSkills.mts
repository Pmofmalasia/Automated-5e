[h,if(argCount()>1): pm.Skills = json.path.read(getLibProperty("sb.Skills","Lib:pm.a5e.Core"),"."+arg(1)) ; pm.Skills = getLibProperty("sb.Skills","Lib:pm.a5e.Core")]

[h,if(argCount() > 0): pm.Delim = arg(0) ; pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(argCount()>1): macro.return = json.sort(pm.Skills,"a") ; macro.return = json.sort(pm.Skills,"a","DisplayName")]
};{
	[h:pm.Skills=listSort(json.toList(pm.Skills,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.Skills]
}]