[h:FeatureInfo = macro.args]
[h:EffectType = json.get(FeatureInfo,"EffectType")]

[h:CurrentFeatureData = data.getData("addon:","pm.a5e.core","ct.New"+EffectType)]
[h:thisPlayerCurrentFeatureData = json.get(CurrentFeatureData,getPlayerName())]
 
[h:tempAllConditions = json.path.read(thisPlayerCurrentFeatureData,"\$['Effects'][*]['Subeffects'][*][?(@.Conditions!=null)]['Conditions']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:allConditions = "[]"]
[h,foreach(tempConditions,tempAllConditions): allConditions = json.merge(allConditions,tempConditions)]
[h:"<!-- End section -->"]

[h,if(!json.isEmpty(allConditions)):
	UniqueConditions = json.path.read(allConditions,"\$[?(@.Name=='"+FeatureName+"' && @.Class=='Spell')]");
	UniqueConditions = "[]"
]

[h,if(json.length(UniqueConditions)<=1),CODE:{
	[h,MACRO("Create"+EffectType+"End@Lib:pm.a5e.Core"): json.set(json.get(FeatureInfo,"ExtraData"),"ParentToken",json.get(FeatureInfo,"ParentToken"))]
	[h:return(0,json.set(json.get(FeatureInfo,"ExtraData"),"ParentToken",json.get(FeatureInfo,"ParentToken")))]
};{
    [h:"<!-- TODO: Test to see if more input is needed above, if yes then come here, otherwise just go to the end. Only thing now is if multiple unique conditions are made, must designate separate names (if needed) -->"]
}]