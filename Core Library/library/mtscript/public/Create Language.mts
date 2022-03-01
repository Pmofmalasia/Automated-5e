[h:abort(input(
	" lg.Name | -- Name Here -- | Enter language name ",
	" lg.Script |  | Enter script type ",
	" lg.Rarity | Standard,Exotic,Monstrous,Secret | Choose language rarity | RADIO | VALUE=STRING ",
	" lg.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the language from | LIST | VALUE=STRING "
	))]

[h:lg.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(lg.Source)+"')]['Library']"),0)]

[h:lg.Data = json.set("",
			"Name",pm.RemoveSpecial(lg.Name),
			"DisplayName",lg.Name,
			"Script",lg.Script,
			"Rarity",lg.Rarity,
			"Library",lg.SourcebookLib
			)]

[h:setLibProperty("sb.Languages",json.append(getLibProperty("sb.Languages","Lib:"+lg.SourcebookLib),lg.Data),"Lib:"+lg.SourcebookLib)]

[r:lg.Name+" language from the sourcebook "+lg.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]