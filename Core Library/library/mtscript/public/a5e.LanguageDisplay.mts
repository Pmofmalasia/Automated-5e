[h,if(argCount() > 0):
	allLanguages = arg(0);
	allLanguages = getProperty("a5e.stat.Languages")
]
[h:pm.LanguageList = ""]
[h:allLanguageNames = json.fields(allLanguages)]
[h,foreach(language,allLanguageNames): pm.LanguageList = if(json.get(allLanguages,language)==1,json.append(pm.LanguageList,pm.GetDisplayName(language,"sb.Languages")),pm.LanguageList)]
[h:macro.return = pm.a5e.CreateDisplayList(json.sort(pm.LanguageList,"a"),"and")]