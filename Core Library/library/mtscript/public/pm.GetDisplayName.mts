[h:InitialSearch = json.path.read(getLibProperty(arg(1),"Lib:pm.a5e.Core"),"\$[*][?(@.Name=='"+arg(0)+"')]['DisplayName']")]

[h,if(json.isEmpty(InitialSearch)):
	return(0,arg(0));
	return(0,json.get(InitialSearch,0))
]