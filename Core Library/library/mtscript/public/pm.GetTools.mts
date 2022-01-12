[h:pm.SourcebookLibs = pm.GetBookInfo("Library","json")]

[h:pm.Tools="[]"]
[h,foreach(book,pm.SourcebookLibs),CODE:{
	[h,if(getLibProperty("sb.Tools","Lib:"+book)!=""),CODE:{
		[h,if(argCount()>1): pm.Tools = json.merge(json.path.read(getLibProperty("sb.Tools","Lib:"+book),"[?(@."+arg(1)+"!='')]['"+arg(1)+"']"),pm.Tools) ; pm.Tools = json.merge(pm.Tools,getLibProperty("sb.Tools","Lib:"+book))]
	};{}]
}]

[h,if(argCount() > 0): pm.Delim = arg(0) ; pm.Delim = ","]
[h,if(pm.Delim == "json"),CODE:{
	[h,if(argCount()>1): macro.return = json.sort(pm.Tools,"a") ; macro.return = json.sort(pm.Tools,"a","DisplayName")]
};{
	[h:pm.Tools=listSort(json.toList(pm.Tools,pm.Delim),"A+",pm.Delim)]
	[h:macro.return = pm.Tools]
}]