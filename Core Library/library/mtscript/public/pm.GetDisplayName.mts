[h,if(arg(1)=="sb.Spells"),CODE:{
    [h:InitialSearch = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][0][?(@.Name=='"+arg(0)+"')]['DisplayName']")]
};{
    [h:InitialSearch = json.path.read(getLibProperty(arg(1),"Lib:pm.a5e.Core"),"[*][?(@.Name=='"+arg(0)+"')]['DisplayName']")]
}] 

[h,if(json.isEmpty(InitialSearch)): macro.return = arg(0); macro.return = json.get(InitialSearch,0)]