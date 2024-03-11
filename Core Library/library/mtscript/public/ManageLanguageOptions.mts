[h:lg.SourcebookLibs = pm.GetBookInfo()]
[h:priorLangaugeSourcebookData = data.getData("addon:","pm.a5e.core","LanguageSourcebooks")]
[h:lg.Input = " junkVar | ------------------------- Choose Sourcebooks to Use Languages From ------------------------- |  | LABEL | SPAN=TRUE "]
[h,foreach(book,lg.SourcebookLibs),CODE:{
	[h:thisBookLanguages = getLibProperty("sb.Languages","Lib:"+json.get(book,"Library"))]
	[h,if(thisBookLanguages != ""),CODE:{
		[h:lg.Input = listAppend(lg.Input," lg."+json.get(book,"Name")+"Allowed | "+if(json.get(priorLangaugeSourcebookData,json.get(book,"Library"))=="",1,json.get(priorLangaugeSourcebookData,json.get(book,"Library")))+" | "+json.get(book,"DisplayName")+" | CHECK ","##")]
	};{}]
}]

[h:abort(input(
	" junkVar | ------------------ Choose Language Rarities Allowed at Character Creation ------------------ |  | LABEL | SPAN=TRUE ",
	" lg.Standard | 1 | Standard | CHECK",
	" lg.Exotic | 1 | Exotic | CHECK",
	" lg.Monstrous | 0 | Monstrous | CHECK",
	" lg.Secret | 0 | Secret | CHECK",
	lg.Input
	))]

[h:lg.ChoicesFinal = "{}"]
[h,foreach(book,lg.SourcebookLibs),CODE:{
	[h:lg.HasLanguages = getLibProperty("sb.Languages","Lib:"+json.get(book,"Library"))]
	[h,if(lg.HasLanguages!=""): lg.ChoicesFinal = json.set(lg.ChoicesFinal,json.get(book,"Library"),eval("lg."+json.get(book,"Name")+"Allowed"))]
}]
[h:data.setData("addon:","pm.a5e.core","LanguageSourcebooks",lg.ChoicesFinal)]
[h:data.setData("addon:","pm.a5e.core","LanguageOptions",json.set("","Standard",lg.Standard,"Exotic",lg.Exotic,"Monstrous",lg.Monstrous,"Secret",lg.Secret))]
[h:broadcast("Language Settings Updated.")]