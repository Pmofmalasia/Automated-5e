[h:sp.Data = macro.args]
[h:sLevel = json.get(sp.Data,"ForcedLevel")]
[h:sSource = json.get(sp.Data,"Source")]

[h:DefaultDisplayData = pm.SpellColors(json.set("","Level",sLevel,"Source","Arcane"))]
[h:BorderColor = json.get(DefaultDisplayData,"Border")]
[h:TextColor = json.get(DefaultDisplayData,"Title")]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(sp.Data,"Flavor"),
	"ParentToken",json.get(sp.Data,"ParentToken"),
	"DMOnly",json.get(sp.Data,"DMOnly"),
	"BorderColorOverride",if(json.get(sp.Data,"BorderColorOverride")=="",BorderColor,json.get(sp.Data,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(sp.Data,"TitleFontColorOverride")=="",TextColor,json.get(sp.Data,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(sp.Data,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(sp.Data,"AccentTextOverride"),
	"TitleFont",json.get(sp.Data,"TitleFont"),
	"BodyFont",json.get(sp.Data,"BodyFont"),
	"Class","zzSpell",
	"Name",json.get(sp.Data,"SpellDisplayName")+" - Full Description",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]
[h:abilityTable = ""]

[h:output.GM = output.GM + json.get(sp.Data,"Description")+"</div></div>"]
[h:broadcastAsToken(output.GM,if(json.get(sp.Data,"DMOnly"),"gm","all"))]
[h:"<!-- Will probably need to improve on broadcast targets later -->"]