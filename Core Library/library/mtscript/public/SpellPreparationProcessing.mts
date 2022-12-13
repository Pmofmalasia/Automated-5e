[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:SpellFeaturesForPrep = base64.decode(json.get(SpellPrepData,"PriorSpellFeatureData"))]
[h:closeDialog("Spell Preparation")]

[h,foreach(tempFeature,SpellFeaturesForPrep),CODE:{
    [h:thisFeatureSpellsChosen = "[]"]
    [h:outerCounter = 0]
    [h,foreach(selectionInstance,json.get(tempFeature,"SpellOptions")),CODE:{
        [h,count(json.get(selectionInstance,"Number")): thisFeatureSpellsChosen = json.append(thisFeatureSpellsChosen,json.get(SpellPrepData,"choice"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+outerCounter+roll.count))]
        [h:outerCounter = outerCounter + 1]
    }]

    [h:PreviousSpellChoice = json.get(tempFeature,"SpellsSelected")]
    [h,if(json.contains(tempFeature,"SpellsSelected")):
        setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+json.get(tempFeature,"Name")+"' && @.Class == '"+json.get(tempFeature,"Class")+"' && @.Subclass == '"+json.get(tempFeature,"Subclass")+"')]['SpellsSelected']",thisFeatureSpellsChosen));
        setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+json.get(tempFeature,"Name")+"' && @.Class == '"+json.get(tempFeature,"Class")+"' && @.Subclass == '"+json.get(tempFeature,"Subclass")+"')]","SpellsSelected",thisFeatureSpellsChosen))
    ]
    [h:"<!-- Note: If a spell is chosen twice, it comes up twice in UnchangedSpells. It doesn't affect macro creation, but if weird things happen it may be why. -->"]
    [h:UnchangedSpells = json.intersection(PreviousSpellChoice,thisFeatureSpellsChosen)]
    [h:NewSpells = json.difference(thisFeatureSpellsChosen,UnchangedSpells)]
    [h:OldSpells = json.difference(PreviousSpellChoice,UnchangedSpells)]

    [h,MACRO("RefreshSpellMacroButtons@Lib:pm.a5e.Core"): json.set("","Add",NewSpells,"Remove",OldSpells,"ParentToken",ParentToken,"Source",json.get(tempFeature,"MagicSource"))]
}]