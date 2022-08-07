[h:EffectData = arg(1)]
[h:RollType = json.get(EffectData,"RollType")]
[h:RollData = json.get(EffectData,"RollData")]
[h:RerollInfo = json.get(EffectData,"RerollInfo")]
[h:NewBonus = json.get(EffectData,"NewBonus")]
[h:ForcedRoll = json.get(EffectData,"ForcedRoll")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]

[h,switch(RollType),CODE:
    case "Check":{
        [h,if(json.type(RollData)=="UNKNOWN"),CODE:{
            [h:effectID = RollData]
            [h:rerolledEffect = json.get(json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+ParentToken+"']"),0)]
        };{
            [h:effectID = json.get(RollData,"ID")]
        }]
    };
    case "Save":{
        [h,if(json.type(RollData)=="UNKNOWN"),CODE:{
            [h:effectID = RollData]
            [h:rerolledEffect = json.get(json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+ParentToken+"']"),0)]
        };{
            [h:effectID = json.get(RollData,"ID")]
        }]
    };
    case "Attack":{
        [h,if(json.type(RollData)=="UNKNOWN"),CODE:{
            [h:effectID = RollData]
            [h:rerolledEffect = json.get(json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effectID+")]['ToResolve']['Attack']['"+ParentToken+"']"),0)]
        };{
            [h:effectID = json.get(RollData,"ID")]
        }]
    }
]

[h,if(RerollInfo==""),CODE:{
    [h:IsReroll = ""]
};{
    [h:IsReroll = 1]

    [h,if(json.get(RerollInfo,"ForcedAdvantage")=="" || json.get(RerollInfo,"ForcedAdvantage")==0),CODE:{
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:RollData = json.set(RollData,
            "Advantage",json.get(RollData,"Advantage")+NewAdvantage,
            "Disadvantage",json.get(RollData,"Disadvantage")+NewDisadvantage
        )]
    };{
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:RollData = json.set(RollData,
            "Advantage",NewAdvantage,
            "Disadvantage",NewDisadvantage,
            "ForcedAdvantage",1
        )]
    }]

    [h,if(json.get(RerollInfo,"ReplacePrevious")==1): RollData = json.set(RollData,"PreviousRoll","")]
}]

[h:ModifyRollData = json.set(RollData,
    "NewRoll",IsReroll,
    "NewBonus",NewBonus,
    "ForcedRoll",ForcedRoll
)]

[h,switch(RollType),CODE:
    case "Check":{
        [h,MACRO("Modify Check@Lib:pm.a5e.Core"): ModifyRollData]
        [h:ReturnData = macro.return]
        [h:abilityTable = json.merge(abilityTable,json.get(ReturnData,"Table"))]
        [h,if(effectID==""),CODE:{};{
            [h:"<!-- TODO: Add contested check data from the token setting the DC to the effect data -->"]
            [h:rerolledEffect = json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+ParentToken+"']",json.remove(ReturnData,"EffectID"))]
            [h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
        }]
    };
    case "Save":{
        [h,MACRO("Modify Save@Lib:pm.a5e.Core"): ModifyRollData]
        [h:ReturnData = macro.return]
        [h:abilityTable = json.merge(abilityTable,json.get(ReturnData,"Table"))]
        [h,if(effectID==""),CODE:{};{
            [h:rerolledEffect = json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+ParentToken+"']",json.remove(ReturnData,"EffectID"))]
            [h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
        }]
    };
    case "Attack":{
        
    }
]