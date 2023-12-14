[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:"<!-- Note: Possible option - have addon: option to use the slow version or the unreliable version. Make this either do the new method OR set these specific properties back to default (use the old version) -->"]

[h:DisplaySheetStats = "{}"]

[h:AttributeData = a5e.AttributeCalc(ParentToken,a5e.UnifiedAbilities)]
[h:TotalLevel = a5e.TotalLevel(ParentToken)]
[h:DisplaySheetStats = json.set("",
	"Attributes",json.get(AttributeData,"Attributes"),
	"AtrMods",json.get(AttributeData,"Modifiers"),
	"Level",TotalLevel,
	"Proficiency",ceiling(TotalLevel/4) + 1,
	"Languages",a5e.Languages(ParentToken,a5e.UnifiedAbilities),
	"MaxHP",a5e.MaxHP(ParentToken,a5e.UnifiedAbilities),
	"AllSpeeds",a5e.Speed(ParentToken,a5e.UnifiedAbilities),
	"AC",a5e.AC(ParentToken,a5e.UnifiedAbilities),
	"DamageModifiers",pm.a5e.DamageModifiers(json.set("","ParentToken",ParentToken),a5e.UnifiedAbilities),
	"Saves",a5e.SaveProficiency(ParentToken,a5e.UnifiedAbilities),
	"Skills",a5e.SkillProficiency(ParentToken,a5e.UnifiedAbilities),
	"Tools",a5e.ToolProficiency(ParentToken,a5e.UnifiedAbilities)
)]

[h:setProperty("a5e.stat.DisplaySheetStats",DisplaySheetStats)]

[h:return(0,"")]