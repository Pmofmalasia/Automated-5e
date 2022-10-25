[h:thisSpellData = json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName())]
[h:baseSpellData = json.get(thisSpellData,0)]
[h:classesWithSpell = json.get(baseSpellData,"ClassesWithSpell")]
[h:spellSourcebook = json.get(baseSpellData,"spellSourcebook")]

[h:baseSpellData = json.remove(baseSpellData,"spellSourcebook")]
[h:baseSpellData = json.remove(baseSpellData,"multiEffects")]

[h:"<!-- Need to add a method of checking for multiple unnamed spell-specific effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. --> "]

[h:thisSpellData = json.set(thisSpellData,0,baseSpellData)]
[h,foreach(tempClass,classesWithSpell),CODE:{
    [h:"<!-- If spell sourcebook is same as class spell feature sourcebook, add spell name directly to class spell feature SpellList key. Else, create/check for a feature on spell sourcebook that updates the class spell feature. Will need to ensure that update feature does not interfere with marked 'MainSpellcastingClass' feature key or whatever it is -->"]
}]
[h:setLibProperty("sb.Spells",json.append(getLibProperty("sb.Spells","Lib:"+spellSourcebook),thisSpellData),"Lib:"+spellSourcebook)]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]