[h:ct.LevelOptions = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:abort(input(
	" ct.Name | -- Name Here -- | Enter creature type name ",
	" ct.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the creature type from | LIST | VALUE=STRING "
	))]

[h:ct.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(ct.Source)+"')]['Library']"),0)]

[h:ct.Data = json.set("",
			"Name",pm.RemoveSpecial(ct.Name),
			"DisplayName",ct.Name,
			"Library",ct.SourcebookLib
			)]

[h:setLibProperty("sb.CreatureTypes",json.append(getLibProperty("sb.CreatureTypes","Lib:"+ct.SourcebookLib),ct.Data),"Lib:"+ct.SourcebookLib)]

[r:ct.Name+" creature type from the sourcebook "+ct.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]