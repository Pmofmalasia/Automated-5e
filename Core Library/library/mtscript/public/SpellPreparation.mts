[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:SpellPrepDisplay = "<input type='hidden' name='ParentToken' value='"+ParentToken+"'>"]
[h:SpellFeaturesForPrep = json.path.read(a5e.UnifiedAbilities,"[*][?(@.SpellOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(tempFeature,SpellFeaturesForPrep),CODE:{
    [h,MACRO("SpellSelectionInputCreation@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken,"Feature",tempFeature,"InputType","Dialog")]
    [h:SpellPrepDisplay = SpellPrepDisplay + macro.return]
}]

[h:html.dialog5("Spell Preparation","lib://pm.a5e.core/SpellPreparation.html?cachelib=false","value="+base64.encode(SpellPrepDisplay)+"; closebutton=0; width=675; height=1050")]