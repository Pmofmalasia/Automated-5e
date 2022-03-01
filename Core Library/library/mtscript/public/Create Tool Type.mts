[h:abort(input(
	" typeName |   | Input Tool Type Name ",
	" typeSource | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the tool type from | LIST | VALUE=STRING "
))]
	
[h:tool.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(typeSource)+"')]['Library']"),0)]

[h:toolData = json.set("",
	"Name",pm.RemoveSpecial(typeName),
	"DisplayName",typeName,
	"Library",tool.SourcebookLib
)]

[h:setLibProperty("sb.ToolTypes",json.append(getLibProperty("sb.ToolTypes","Lib:"+tool.SourcebookLib),toolData),"Lib:"+tool.SourcebookLib)]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]