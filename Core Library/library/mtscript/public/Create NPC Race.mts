[h:abort(input(
	" nr.Name | -- Name Here -- | Enter NPC race name ",
	" nr.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the NPC race from | LIST | VALUE=STRING "
	))]

[h:nr.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(nr.Source)+"')]['Library']"),0)]

[h:nr.Data = json.set("",
			"Name",pm.RemoveSpecial(nr.Name),
			"DisplayName",nr.Name,
			"Library",nr.SourcebookLib
			)]

[h:setLibProperty("sb.NPCRaces",json.append(getLibProperty("sb.NPCRaces","Lib:"+nr.SourcebookLib),nr.Data),"Lib:"+nr.SourcebookLib)]

[r:nr.Name+" NPC race from the sourcebook "+nr.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]