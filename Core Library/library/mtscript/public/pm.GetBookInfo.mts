[h,if(argCount()==0),CODE:{
	[h:macro.return = json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"[?(@.Banned==0)]")]
};{
	[h,if(argCount() > 1): pm.Delim = arg(1) ; pm.Delim = ","]

	[h:sa.Sourcebooks = json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"[?(@.Banned==0)]['"+arg(0)+"']")]
	[h,if(pm.Delim=="json"): macro.return = json.sort(sa.Sourcebooks,"a"); macro.return = listSort(json.toList(sa.Sourcebooks,pm.Delim),"A+",pm.Delim)]
}]