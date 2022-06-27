[h:baseConditionsTemp = json.path.read(pm.a5e.GetConditions(),"[*][?(@.Class=='Condition')]")]

[h,if(argCount()>0): pm.KeyChoice = arg(0); pm.KeyChoice = ""]
[h,if(pm.KeyChoice==""),CODE:{
	[h:baseConditions = baseConditionsTemp]
};{
	[h:baseConditions = json.path.read(baseConditionsTemp,"[*]."+pm.KeyChoice)]
}]

[h,if(argCount()>1): pm.Delim = arg(1); pm.Delim = if(pm.KeyChoice=="","json",",")]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(pm.KeyChoice!=""): macro.return = json.sort(baseConditions,"a"); macro.return = json.sort(baseConditions,"a","DisplayName")]
};{
	[h:macro.return = listSort(json.toList(baseConditions,pm.Delim),"A+",pm.Delim)]
}]