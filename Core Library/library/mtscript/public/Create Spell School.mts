[h:abort(input(
	" sp.Name |  | Enter school name ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the school from | LIST | VALUE=STRING "
	))]

[h:sp.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]
[h:setLibProperty("sb.SpellSchools",json.append(getLibProperty("sb.SpellSchools","Lib:"+sp.SourcebookLib),sp.Name),"Lib:"+sp.SourcebookLib)]

[r:sp.Name+" spell school from the sourcebook "+sp.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]