[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:SpellFeaturesForPrep = json.path.read(a5e.UnifiedAbilities,"[*][?(@.SpellOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:SpellPrepDisplay = "<input type='hidden' name='ParentToken' value='"+ParentToken+"'><input type='hidden' name='PriorSpellFeatureData' value='"+base64.encode(SpellFeaturesForPrep)+"'>"]
[h,foreach(tempFeature,SpellFeaturesForPrep),CODE:{
    [h,MACRO("SpellSelectionInputCreation@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken,"Feature",tempFeature,"InputType","Dialog")]
    [h:SpellPrepDisplay = SpellPrepDisplay + macro.return]
}]

[h:SpellPrepDisplay = SpellPrepDisplay + "</tr><tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Spell Preparation","lib://pm.a5e.core/SpellPreparation.html?cachelib=false","value="+base64.encode(SpellPrepDisplay)+"; closebutton=0; width=500; height=500")]