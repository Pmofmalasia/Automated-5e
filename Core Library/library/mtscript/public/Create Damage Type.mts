[h:abort(input(
	" sp.Name |  | Enter damage type name ",
	" sp.Group | None,Arcane,Elemental,Mental,Physical,Other | Choose a grouping | LIST | VALUE=STRING ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the damage type from | LIST | VALUE=STRING "
	))]
	
[h:abort(input(
	if(sp.Group=="Other"," sp.Group |  | Enter a group name ","")
))]
[h:sp.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]

[h:damageData = json.set(""
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Type",pm.RemoveSpecial(sp.Group),
	"Library",sp.SourcebookLib
)]

[h:setLibProperty("sb.DamageTypes",json.append(getLibProperty("sb.DamageTypes","Lib:"+sp.SourcebookLib),damageData),"Lib:"+sp.SourcebookLib)]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]