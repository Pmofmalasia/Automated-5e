[h:abort(input(
	" sp.Name |  | Enter Attribute Name ",
	" sp.Type | Mental,Physical | Type of Attribute | RADIO | VALUE=STRING ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the attribute from | LIST | VALUE=STRING "
))]

[h:AbilityScoreObject = json.set("",
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Type",sp.Type
)]

[h:sp.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.Attributes",json.append(getLibProperty("sb.Attributes","Lib:"+sp.SourcebookLib),AbilityScoreObject),"Lib:"+sp.SourcebookLib)]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]