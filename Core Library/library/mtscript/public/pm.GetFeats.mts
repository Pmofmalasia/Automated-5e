[h:pm.SourcebookLibs = pm.GetBookInfo("Library","json")]

[h:pm.Feats="[]"]
[h,foreach(book,pm.SourcebookLibs),CODE:{
	[h,if(getLibProperty("sb.Feats","Lib:"+book)!=""): pm.Feats = json.merge(pm.Feats,getLibProperty("sb.Feats","Lib:"+book))]
}]

[h,if(argCount() > 0): pm.Delim = arg(0) ; pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h:macro.return = json.sort(pm.Feats,"a")]
};{
	[h:pm.Feats=listSort(json.toList(pm.Feats,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.Feats]
}]