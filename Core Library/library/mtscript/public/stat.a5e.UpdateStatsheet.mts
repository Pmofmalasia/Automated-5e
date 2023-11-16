[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note: Possible option - have addon: option to use the slow version or the unreliable version. Make this either do the new method OR set these specific properties back to default (use the old version) -->"]

[h:AttributeData = a5e.AttributeCalc(ParentToken,a5e.UnifiedAbilities)]
[h:setProperty("a5e.stat.Attributes",json.get(AttributeData,"Attributes"))]
[h:setProperty("a5e.stat.AtrMods",json.get(AttributeData,"Modifiers"))]

[h:TotalLevel = a5e.TotalLevel(ParentToken)]
[h:setProperty("a5e.stat.Level",TotalLevel)]
[h:setProperty("a5e.stat.Proficiency",ceiling(TotalLevel/4) + 1)]

[h:setProperty("a5e.stat.Languages",a5e.Languages(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.MaxHP",a5e.MaxHP(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.AllSpeeds",a5e.Speed(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.AC",a5e.AC(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.DamageModifiers",pm.a5e.DamageModifiers(json.set("","ParentToken",ParentToken),a5e.UnifiedAbilities))]

[h:setProperty("a5e.stat.Saves",a5e.SaveProficiency(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.Skills",a5e.SkillProficiency(ParentToken,a5e.UnifiedAbilities))]
[h:setProperty("a5e.stat.Tools",a5e.ToolProficiency(ParentToken,a5e.UnifiedAbilities))]

[h:macro.return = ""]