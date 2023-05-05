[h,if(arg(1)=="sb.Spells"),CODE:{
    [h:InitialSearch = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][0][?(@.Name=='"+arg(0)+"')]['DisplayName']")]
};{
    [h:InitialSearch = json.path.read(getLibProperty(arg(1),"Lib:pm.a5e.Core"),"[*][?(@.Name=='"+arg(0)+"')]['DisplayName']")]
}] 

[h,if(json.isEmpty(InitialSearch)):
	return(0,arg(0));
	return(0,json.get(InitialSearch,0))
]