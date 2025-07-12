[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(argCount()>2): includeHealing = arg(2); includeHealing = 0]

[h:pm.DamageTypes = data.getData("addon:","pm.a5e.core","sb.DamageTypes")]
[h,if(!includeHealing): pm.DamageTypes = json.path.read(pm.DamageTypes,"\$[*][?('Healing' nin @.Tags)]")]
[h,if(pm.KeyChoice!=""): pm.DamageTypes = json.path.read(data.getData("addon:","pm.a5e.core","sb.DamageTypes"),"\$[*]."+pm.KeyChoice)]

[h,if(argCount()>1): pm.Delim = arg(1); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"):
	return(0,pm.DamageTypes);
	return(0,json.toList(pm.DamageTypes,pm.Delim))
]