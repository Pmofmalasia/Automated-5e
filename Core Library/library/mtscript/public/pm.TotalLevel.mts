[h:pm.TempLevel=0]
[h,foreach(TempClass,pm.GetClasses("Name")): pm.TempLevel = if(json.get(LClass,TempClass)=="",pm.TempLevel,pm.TempLevel+json.get(LClass,TempClass))]
[h:macro.return = pm.TempLevel]