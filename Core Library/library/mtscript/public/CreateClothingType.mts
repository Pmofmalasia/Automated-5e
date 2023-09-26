[h:abort(input(
	" cloth.Name |  | Clothing type name ",
	" cloth.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the clothing type from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:cloth.TypeData = json.set("",
	"Name",pm.RemoveSpecial(cloth.Name),
	"DisplayName",cloth.Name
)]

[h:cloth.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(cloth.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.ClothingTypes",json.append(getLibProperty("sb.ClothingTypes","Lib:"+cloth.SourcebookLib),cloth.TypeData),"Lib:"+cloth.SourcebookLib)]

[r:cloth.Name+" type from the sourcebook "+cloth.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]