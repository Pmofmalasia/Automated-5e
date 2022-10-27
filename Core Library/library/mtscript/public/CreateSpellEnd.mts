[h:thisSpellData = json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName())]
[h:baseSpellData = json.get(thisSpellData,0)]
[h:SpellName = json.get(baseSpellData,"Name")]
[h:classesWithSpell = json.get(baseSpellData,"ClassesWithSpell")]
[h:spellSourcebook = json.get(baseSpellData,"spellSourcebook")]

[h:baseSpellData = json.remove(baseSpellData,"spellSourcebook")]
[h:baseSpellData = json.remove(baseSpellData,"multiEffects")]

[h:"<!-- Need to add a method of checking for multiple unnamed spell-specific effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. --> "]

[h:thisSpellData = json.set(thisSpellData,0,baseSpellData)]

[h:UniqueSpellListFeatures = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.UniqueSpellList==1)]")]
[h,foreach(tempFeature,UniqueSpellListFeatures),CODE:{
    [h:onListTest = json.contains(classesWithSpell,json.set("","Name",json.get(tempFeature,"Name"),"Class",json.get(tempFeature,"Class"),"Subclass",json.get(tempFeature,"Subclass")))]
    [h:sameBookTest = (spellSourcebook==json.get(tempFeature,"Library"))]

    [h,switch(onListTest+""+sameBookTest),CODE:
        case "11":{
            [h:updatedFeature = json.set(tempFeature,"SpellList",json.append(json.get(tempFeature,"SpellList"),SpellName))]
            [h:setLibProperty("sb.Abilities",json.path.set(getLibProperty("sb.Abilities","Lib:"+spellSourcebook),"[*][?(@.Name=='"+json.get(tempFeature,"Name")+"' && @.Class=='"+json.get(tempFeature,"Class")+"' && @.Subclass=='"+json.get(tempFeature,"Subclass")+"')]",updatedFeature),"Lib:"+spellSourcebook)]
        };
        case "10":{
            [h:spellLibPriorUpdateFeature = json.path.read(getLibProperty("sb.Abilities","Lib:"+spellSourcebook),"[*][?(@.Name=='"+json.get(tempFeature,"Name")+"' && @.Class=='"+json.get(tempFeature,"Class")+"' && @.Subclass=='"+json.get(tempFeature,"Subclass")+"' && @.CreatedForMerging==1)]")]
            [h:spellLibHasPriorUpdate = !json.isEmpty(spellLibPriorUpdateFeature)]
            [h,if(spellLibHasPriorUpdate):
                updatedFeature = json.set(json.get(spellLibPriorUpdateFeature,0),"SpellList",json.append(json.get(json.get(spellLibPriorUpdateFeature,0),"SpellList"),SpellName));
                updatedFeature = json.set("","Name",json.get(tempFeature,"Name"),"Class",json.get(tempFeature,"Class"),"Subclass",json.get(tempFeature,"Subclass"),"SpellList",json.append("",SpellName),"CreatedForMerging",1)
            ]
            [h,if(spellLibHasPriorUpdate): 
                setLibProperty("sb.Abilities",json.path.set(getLibProperty("sb.Abilities","Lib:"+spellSourcebook),"[*][?(@.Name=='"+json.get(tempFeature,"Name")+"' && @.Class=='"+json.get(tempFeature,"Class")+"' && @.Subclass=='"+json.get(tempFeature,"Subclass")+"')]",updatedFeature),"Lib:"+spellSourcebook);
                setLibProperty("sb.Abilities",json.append(getLibProperty("sb.Abilities","Lib:"+spellSourcebook),updatedFeature),"Lib:"+spellSourcebook)
            ]
        };
        default:{}
    ]
}]

[h:setLibProperty("sb.Spells",json.append(getLibProperty("sb.Spells","Lib:"+spellSourcebook),thisSpellData),"Lib:"+spellSourcebook)]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]