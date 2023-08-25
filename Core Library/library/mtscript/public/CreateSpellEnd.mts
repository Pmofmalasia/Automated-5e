[h:thisSpellData = json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName())]
[h:SpellName = json.get(thisSpellData,"Name")]
[h:classesWithSpell = json.get(thisSpellData,"ClassesWithSpell")]
[h:spellSourcebook = json.get(thisSpellData,"spellSourcebook")]

[h:thisSpellData = json.remove(thisSpellData,"spellSourcebook")]
[h:thisSpellData = json.remove(thisSpellData,"EffectsNumber")]

[h:"<!-- Need to add a method of checking for multiple unnamed spell-specific effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. --> "]

[h:UniqueSpellListFeatures = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.UniqueSpellList==1)]")]
[h:"<!-- Note: The below method defaults to storing class spell lists on the same library as the spell. Created classes should store their spell lists on their libraries during creation. Some messiness of what gets stored where is inevitable. -->"]
[h,foreach(tempFeature,UniqueSpellListFeatures),CODE:{
    [h:onListTest = json.contains(classesWithSpell,json.set("","Name",json.get(tempFeature,"Name"),"Class",json.get(tempFeature,"Class"),"Subclass",json.get(tempFeature,"Subclass")))]
    [h:sameBookTest = (spellSourcebook==json.get(tempFeature,"Library"))]

    [h,if(onListTest),CODE:{
        [h,if(getLibProperty("sb.SpellLists","Lib:"+spellSourcebook)==""):
            CurrentList = "[]";
            CurrentList = json.get(getLibProperty("sb.SpellLists","Lib:"+spellSourcebook),json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"))
        ]
        [h:NewList = json.sort(json.unique(json.append(CurrentList,SpellName)))]

        [h:setLibProperty("sb.SpellLists",json.set(getLibProperty("sb.SpellLists","Lib:"+spellSourcebook),json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"),NewList),"Lib:"+spellSourcebook)]
    };{}]
}]

[h:setLibProperty("sb.Spells",json.sort(json.append(getLibProperty("sb.Spells","Lib:"+spellSourcebook),thisSpellData),"a","DisplayName"),"Lib:"+spellSourcebook)]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]

[h:broadcast("Spell "+json.get(thisSpellData,"DisplayName")+" created.")]
