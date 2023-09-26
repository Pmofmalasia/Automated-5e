[h:abort(input(
	" obj.Name |  | Object type name ",
	" obj.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the object type from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:obj.TypeData = json.set("",
	"Name",pm.RemoveSpecial(obj.Name),
	"DisplayName",obj.Name
)]

[h:obj.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(obj.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.ObjectTypes",json.append(getLibProperty("sb.ObjectTypes","Lib:"+obj.SourcebookLib),obj.TypeData),"Lib:"+obj.SourcebookLib)]

[r:obj.Name+" type from the sourcebook "+obj.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]