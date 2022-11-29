[h:pm.TempLevel=0]
[h,foreach(TempClass,pm.GetClasses("Name")): pm.TempLevel = if(json.get(getProperty("a5e.stat.ClassLevels"),TempClass)=="",pm.TempLevel,pm.TempLevel+json.get(getProperty("a5e.stat.ClassLevels"),TempClass))]
[h:macro.return = pm.TempLevel]