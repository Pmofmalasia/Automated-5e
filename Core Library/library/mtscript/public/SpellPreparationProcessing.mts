[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:SpellFeaturesForPrep = base64.decode(json.get(SpellPrepData,"PriorSpellFeatureData"))]
[h:closeDialog("Spell Preparation")]

[h,foreach(tempFeature,SpellFeaturesForPrep),CODE:{
    [h:thisFeatureSpellsChosen = "[]"]
    [h:outerCounter = 0]
    [h,foreach(selectionInstance,json.get(tempFeature,"SpellOptions")),CODE:{
        [h:thisInstanceSpellsChosen = "[]"]
        [h:selectionNumber = evalMacro(json.get(selectionInstance,"Number"))]
        [h,count(selectionNumber): thisInstanceSpellsChosen = json.append(thisInstanceSpellsChosen,json.get(SpellPrepData,"choice"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+outerCounter+roll.count))]
        [h:thisFeatureSpellsChosen = json.append(thisFeatureSpellsChosen,thisInstanceSpellsChosen)]
        [h:outerCounter = outerCounter + 1]
    }]

    [h:PreviousSpellsSelected = json.get(tempFeature,"SpellsSelected")]
    [h:thisFeaturePriorSpellSelections = "[]"]
    [h,if(json.contains(tempFeature,"SpellsSelected")),CODE:{
        [h:setProperty("a5e.stat.AllFeatures",json.path.setcarefully(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+json.get(tempFeature,"Name")+"' && @.Class == '"+json.get(tempFeature,"Class")+"' && @.Subclass == '"+json.get(tempFeature,"Subclass")+"')]['SpellsSelected']",thisFeatureSpellsChosen))]
        
        [h,if(PreviousSpellsSelected==""): PreviousSpellsSelected = "[]"]
        [h,foreach(spellInstance,PreviousSpellsSelected): thisFeaturePriorSpellSelections = json.merge(thisFeaturePriorSpellSelections,spellInstance)]
    };{
        [h:setProperty("a5e.stat.AllFeatures",json.path.putcarefully(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+json.get(tempFeature,"Name")+"' && @.Class == '"+json.get(tempFeature,"Class")+"' && @.Subclass == '"+json.get(tempFeature,"Subclass")+"')]","SpellsSelected",thisFeatureSpellsChosen))]
        [h:PreviousSpellsSelected = "[]"]
    }]
    
    [h:SpellsChosenMerged = "[]"]
    [h,count(json.length(thisFeatureSpellsChosen)): SpellsChosenMerged = json.merge(SpellsChosenMerged,json.get(thisFeatureSpellsChosen,roll.count))]
    [h:"<!-- Note: If a spell is chosen twice, it comes up twice in UnchangedSpells. It doesn't affect macro creation, but if weird things happen it may be why. -->"]
    [h:UnchangedSpells = json.intersection(thisFeaturePriorSpellSelections,SpellsChosenMerged)]
    [h:NewSpells = json.difference(SpellsChosenMerged,UnchangedSpells)]
    [h:OldSpells = json.difference(thisFeaturePriorSpellSelections,UnchangedSpells)]
    [h,MACRO("RefreshSpellMacroButtons@Lib:pm.a5e.Core"): json.set("","Add",NewSpells,"Remove",OldSpells,"ParentToken",ParentToken,"Source",json.get(tempFeature,"MagicSource"))]
}]