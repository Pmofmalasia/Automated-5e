[h:pm.Schools = getLibProperty("sb.SpellSchools","Lib:pm.a5e.Core")]

[h,if(argCount() > 0): pm.Delim = arg(0); pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h:macro.return = pm.Schools]
};{
	[h:macro.return = json.toList(pm.Schools,pm.Delim)]
}]