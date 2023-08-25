[h:abort(input(
	" wea.Name |  | Weapon Property Name ",
	" wea.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the weapon property from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:wea.TypeData = json.set("",
	"Name",pm.RemoveSpecial(wea.Name),
	"DisplayName",wea.Name
)]

[h:wea.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(wea.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.WeaponProperties",json.append(getLibProperty("sb.WeaponProperties","Lib:"+wea.SourcebookLib),wea.TypeData),"Lib:"+wea.SourcebookLib)]

[r:wea.Name+" weapon property from the sourcebook "+wea.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]