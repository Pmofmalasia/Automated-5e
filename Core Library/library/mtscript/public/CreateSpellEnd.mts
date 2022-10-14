[h:thisSpellData = json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName())]

[h:baseSpellData = json.get(thisSpellData,0)]
[h:classesWithSpell = json.get(baseSpellData,"ClassesWithSpell")]
[h:spellSourcebook = json.get(baseSpellData,"spellSourcebook")]

[h:baseSpellData = json.remove(baseSpellData,"ClassesWithSpell")]
[h:baseSpellData = json.remove(baseSpellData,"spellSourcebook")]
[h:baseSpellData = json.remove(baseSpellData,"multiEffects")]

[h:thisSpellData = json.set(thisSpellData,0,baseSpellData)]

[h,foreach(tempClass,classesWithSpell),CODE:{
    [h:"<!-- Add name to casting ability here -->"]
}]
[h:setLibProperty("sb.Spells",json.append(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),thisSpellData))]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()))]