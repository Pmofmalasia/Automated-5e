[h:SpellCoreData = macro.args]

[h:currentSpellData = getLibProperty("ct.NewSpell","pm.a5e.Core")]
[h:thisPlayerCurrentSpellData = json.get(currentSpellData,getPlayerName())]
[h:setLibProperty("ct.NewSpell",json.set(currentSpellData,getPlayerName(),json.append(thisPlayerCurrentSpellData,SpellCoreData)))]

[h:closeDialog("Spell Creation")]

[h,MACRO("CreateSpellSubeffect@Lib:pm.a5e.Core"): json.set("","Total",json.get(SpellCoreData,"multiSubeffects"),"WhichEffect",1,"SpellLevel",json.get(SpellCoreData,"SpellLevel"))]