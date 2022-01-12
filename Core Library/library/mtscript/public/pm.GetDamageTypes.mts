[h:pm.DamageTypes = getLibProperty("sb.DamageTypes","Lib:pm.a5e.Core")]

[h,if(argCount() > 0): pm.Delim = arg(0); pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h:macro.return = pm.DamageTypes]
};{
	[h:macro.return = json.toList(pm.DamageTypes,pm.Delim)]
}]