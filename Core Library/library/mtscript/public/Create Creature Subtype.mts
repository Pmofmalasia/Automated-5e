[h:abort(input(
	" ct.Name | -- Name Here -- | Enter creature subtype name ",
	" ct.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the creature subtype from | LIST | VALUE=STRING "
	))]

[h:ct.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(ct.Source)+"')]['Library']"),0)]

[h:ct.Data = json.set("",
			"Name",pm.RemoveSpecial(ct.Name),
			"DisplayName",ct.Name,
			"Library",ct.SourcebookLib
			)]

[h:setLibProperty("sb.CreatureSubtypes",json.append(getLibProperty("sb.CreatureSubtypes","Lib:"+ct.SourcebookLib),ct.Data),"Lib:"+ct.SourcebookLib)]

[r:ct.Name+" creature subtype from the sourcebook "+ct.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]