[h:sp.Data = macro.args]
[h:sLevel = json.get(sp.Data,"ForcedLevel")]
[h:sSource = json.get(sp.Data,"Source")]

[h:ClassFeatureData = json.set("",
    "ParentToken",currentToken(),
    "DMOnly",0,
    "Class","zzSpell",
    "ColorSubtype",json.set("","Source",sSource,"Level",sLevel),
    "Name",json.get(sp.Data,"SpellDisplayName")+": Full Description",
    "FalseName","",
    "OnlyRules",1
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