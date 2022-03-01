[h:pm.LanguageList = ""]
[h,foreach(language,json.fields(Languages)): pm.LanguageList = if(json.get(Languages,language)==1,json.append(pm.LanguageList,pm.GetDisplayName(language,"sb.Languages")),pm.LanguageList)]
[h:macro.return = listSort(json.toList(pm.LanguageList,", "),"A+",", ")]