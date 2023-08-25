[h:AllEffectData = arg(1)]
[h,if(json.type(AllEffectData)=="OBJECT"): AllEffectData = json.append("",AllEffectData)]

[h:EffectModificationData = arg(2)]
[h,if(json.type(EffectModificationData)=="OBJECT"),CODE:{
    [h:RerollInfo = json.get(EffectModificationData,"RerollInfo")]
    [h:NewBonus = json.get(EffectModificationData,"NewBonus")]
    [h:ForcedRoll = json.get(EffectModificationData,"ForcedRoll")]
};{}]

[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]
[h,foreach(EffectData,AllEffectData),CODE:{
    [h:pm.a5e.FeatureModifyd20TestLoop()]
}]