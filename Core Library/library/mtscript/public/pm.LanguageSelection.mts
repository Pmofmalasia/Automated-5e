[h:lg.LanguageArray = pm.GetLanguages()]

[h,if(argCount()>2): lg.New = arg(2); lg.New = "{}"]
[h:lg.Known = json.merge(getProperty("a5e.stat.Languages"),lg.New)]
[h:lg.Input = "junkVar | "+arg(1)+": Choose "+arg(0)+" Language"+if(arg(0)>1,"s","")+" |  | LABEL | SPAN=TRUE "]
[h:lg.ValidLanguages = ""]
[h,foreach(language,lg.LanguageArray): lg.ValidLanguages = if(json.get(data.getData("addon:","pm.a5e.core","LanguageOptions"),json.get(language,"Rarity")),json.append(lg.ValidLanguages,language),lg.ValidLanguages)]
[h,foreach(language,lg.ValidLanguages),CODE:{
	[h:IsKnownTest = json.get(lg.Known,json.get(language,"Name"))]
	[h,if(IsKnownTest==1),CODE:{
		[h:lg.Input = listAppend(lg.Input," junkVar | Known | "+json.get(language,"DisplayName")+" | LABEL ","##")]
		[h:set("lg."+json.get(language,"Name")+"Choice",0)]
	};{
		[h:lg.Input = listAppend(lg.Input," lg."+json.get(language,"Name")+"Choice |  | "+json.get(language,"DisplayName")+" | CHECK ","##")]
	}]
}]
[h:lg.CorrectNumTest = 0]
[h:abort(input(lg.Input))]
[h:lg.Chosen = ""]
[h,foreach(language,lg.ValidLanguages): lg.Chosen = if(eval("lg."+json.get(language,"Name")+"Choice"),json.set(lg.Chosen,json.get(language,"Name"),1),lg.Chosen)]
[h:macro.return = lg.Chosen]