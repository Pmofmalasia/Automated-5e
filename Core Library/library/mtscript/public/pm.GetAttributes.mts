[h:pm.Attributes = getLibProperty("sb.Attributes","Lib:pm.a5e.Core")]

[h,if(argCount() > 0): pm.Delim = arg(0); pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h:macro.return = pm.Attributes]
};{
	[h:macro.return = json.toList(pm.Attributes,pm.Delim)]
}]