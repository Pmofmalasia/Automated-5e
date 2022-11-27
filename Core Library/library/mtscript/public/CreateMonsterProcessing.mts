[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:SpellName = json.get(json.get(thisPlayerCurrentSpellData,0),"Name")]








[h:currentSpellData = getLibProperty("ct.NewSpell","pm.a5e.Core")]
[h:thisPlayerCurrentSpellData = json.get(currentSpellData,getPlayerName())]
[h:currentEffectData = json.get(thisPlayerCurrentSpellData,json.length(thisPlayerCurrentSpellData)-1)]