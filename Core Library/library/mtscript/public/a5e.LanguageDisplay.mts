[h:pm.LanguageList = ""]
[h:allLanguages = json.fields(getProperty("a5e.stat.Languages"))]
[h,foreach(language,allLanguages): pm.LanguageList = if(json.get(getProperty("a5e.stat.Languages"),language)==1,json.append(pm.LanguageList,pm.GetDisplayName(language,"sb.Languages")),pm.LanguageList)]
[h:macro.return = pm.a5e.CreateDisplayList(json.sort(pm.LanguageList,"a"),"and")]