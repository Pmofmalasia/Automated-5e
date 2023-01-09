[h:tempAllConditions = json.path.read(json.get(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"[*]['Subeffects'][*][?(@.Conditions!=null)]['Conditions']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:allConditions = "[]"]
[h,foreach(tempConditions,tempAllConditions): allConditions = json.merge(allConditions,tempConditions)]
[h,if(!json.isEmpty(allConditions)): SpellConditions = json.path.read(allConditions,"[?(@.Name=='"+FeatureName+"' && @.Class=='Spell')]"); SpellConditions = "[]"]

[h,if(json.length(SpellConditions)<=1),CODE:{
    [h,MACRO("CreateSpellEnd@Lib:pm.a5e.Core"): ""]
};{
    [h:"<!-- Test to see if more input is needed above, if yes then come here, otherwise just go to the end. Only thing now is if multiple unique conditions are made, must designate separate names (if needed) -->"]
}]