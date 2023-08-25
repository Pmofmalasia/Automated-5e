[h:abort(input(
	" sp.Name |  | School name ",
	" sp.Rarity | Standard,Exotic,Secret | School rarity | LIST | VALUE=STRING ",
	" sp.Source | "+pm.GetBookInfo("DisplayName","json")+" | Which sourcebook is the school from | LIST | VALUE=STRING DELIMITER=JSON "
))]

[h:sp.SchoolData = json.set("",
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Rarity",sp.Rarity
)]

[h:sp.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.SpellSchools",json.append(getLibProperty("sb.SpellSchools","Lib:"+sp.SourcebookLib),sp.SchoolData),"Lib:"+sp.SourcebookLib)]

[r:sp.Name+" spell school from the sourcebook "+sp.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]