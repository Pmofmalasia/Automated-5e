[h:pm.CastingClasses = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.CasterType!=null && @.SharedSpellSlots == 1 && @.IsActive>0)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.CastingLevel = 0]
[h,foreach(TempClass,pm.CastingClasses): pm.CastingLevel = pm.CastingLevel + (json.get(TempClass,"Level")*json.get(TempClass,"CasterType"))]

[h:macro.return = ceiling(pm.CastingLevel)]
