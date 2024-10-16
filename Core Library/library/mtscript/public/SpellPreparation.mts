[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:SpellFeaturesForPrep = json.path.read(a5e.UnifiedAbilities,"[*][?(@.SpellOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:SpellPrepDisplay = "<input type='hidden' name='ParentToken' value='"+ParentToken+"'><input type='hidden' name='PriorSpellFeatureData' value='"+base64.encode(SpellFeaturesForPrep)+"'>"]
[h,foreach(tempFeature,SpellFeaturesForPrep),CODE:{
	[h:thisFeatureSpellOptions = json.get(tempFeature,"SpellOptions")]

	[h:AddedSpellOptions = json.path.read(a5e.UnifiedAbilities,"[*][?(@.AddedSpellOptionsFeature.Name == '"+json.get(tempFeature,"Name")+"' && @.AddedSpellOptionsFeature.Class == '"+json.get(tempFeature,"Class")+"' && @.AddedSpellOptionsFeature.Subclass == '"+json.get(tempFeature,"Subclass")+"' && @.IsActive == 1)]")]

	[h,foreach(addedSpellList,AddedSpellOptions),CODE:{
		[h:filterToAddToIndex = json.get(json.get(addedSpellList,"AddedSpellOptionsFeature"),"WhichFilter")]
		[h:filterToAddTo = json.get(thisFeatureSpellOptions,filterToAddToIndex)]
		[h:additionalSpells = json.merge(json.get(filterToAddTo,"SpecificList"),json.get(addedSpellList,"AddedSpellOptions"))]
		[h:filterToAddTo = json.set(filterToAddTo,"SpecificList",additionalSpells)]
		[h:thisFeatureSpellOptions = json.set(thisFeatureSpellOptions,filterToAddToIndex,filterToAddTo)]
	}]
	
	[h:tempFeature = json.set(tempFeature,"SpellOptions",thisFeatureSpellOptions)]

    [h,MACRO("SpellSelectionInputCreation@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken,"Feature",tempFeature,"InputType","Dialog")]
    [h:SpellPrepDisplay = SpellPrepDisplay + macro.return]
}]

[h:SpellPrepDisplay = SpellPrepDisplay + "</tr><tr><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Spell Preparation","lib://pm.a5e.core/SpellPreparation.html?cachelib=false","value="+base64.encode(SpellPrepDisplay)+"; closebutton=0; width=500; height=500")]