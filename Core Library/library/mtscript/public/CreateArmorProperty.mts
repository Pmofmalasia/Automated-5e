[h:abort(input(
	" arm.Name |  | Armor Property Name ",
	" arm.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the armor property from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:arm.TypeData = json.set("",
	"Name",pm.RemoveSpecial(arm.Name),
	"DisplayName",arm.Name
)]

[h:arm.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(arm.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.ArmorProperties",json.append(getLibProperty("sb.ArmorProperties","Lib:"+arm.SourcebookLib),arm.TypeData),"Lib:"+arm.SourcebookLib)]

[r:arm.Name+" armor property from the sourcebook "+arm.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]