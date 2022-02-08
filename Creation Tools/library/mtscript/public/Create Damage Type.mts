[h:abort(input(
	" sp.Name |  | Enter damage type name ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the damage type from | LIST | VALUE=STRING "
	))]

[h:sp.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.DamageTypes",json.append(getLibProperty("sb.DamageTypes","Lib:"+sp.SourcebookLib),sp.Name),"Lib:"+sp.SourcebookLib)]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]