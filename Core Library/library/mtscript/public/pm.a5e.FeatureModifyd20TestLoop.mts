[h:RollType = json.get(EffectData,"OverallType")]
[h:RollData = EffectData]
[h:EffectTarget = json.get(RollData,"Target")]

[h,if(json.type(EffectModificationData)=="ARRAY"),CODE:{
    [h:thisEffectModificationData = json.get(EffectModificationData,roll.count)]
    [h:RerollInfo = json.get(thisEffectModificationData,"RerollInfo")]
    [h:NewBonus = json.get(thisEffectModificationData,"NewBonus")]
    [h:ForcedRoll = json.get(thisEffectModificationData,"ForcedRoll")]
};{}]

[h,switch(RollType),CODE:
    case "Check":{
        [h,if(json.get(RollData,"ID")!=""),CODE:{
            [h:effectID = json.get(RollData,"ID")]
            [h:RollData = json.get(json.merge(
                json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+" && @.ParentToken=='"+EffectTarget+"')]['ToResolve']['CheckDC']['DC']"),
                json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+EffectTarget+"']"))
            ,0)]
        };{
            [h:effectID = ""]
        }]
    };
    case "Save":{
        [h,if(json.get(RollData,"ID")!=""),CODE:{
            [h:effectID = json.get(RollData,"ID")]
            [h:RollData = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+EffectTarget+"']"),0)]
        };{
            [h:effectID = ""]
        }]
    };
    case "Attack":{
        [h,if(json.get(RollData,"ID")!=""),CODE:{
            [h:effectID = json.get(RollData,"ID")]
            [h:RollData = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+" && @.ParentToken=='"+EffectTarget+"')]['ToResolve']['Attack']"),0)]
        };{
            [h:effectID = ""]
        }]
    };
    default :{[h:return(0)]}
]

[h:ModifyRollData = json.set(RollData,
    "RerollData",RerollInfo,
    "NewBonus",NewBonus,
    "ForcedRoll",ForcedRoll
)]

[h,if(EffectTarget!=""): ModifyRollData = json.set(ModifyRollData,"ParentToken",EffectTarget)]

[h,switch(RollType),CODE:
    case "Check":{
        [h,MACRO("Modify Check@Lib:pm.a5e.Core"): ModifyRollData]
        [h:ReturnData = macro.return]
        [h:abilityTable = json.merge(abilityTable,json.get(ReturnData,"Table"))]
        [h,if(effectID==""),CODE:{};{
            [h:"<!-- TODO: Add contested check data from the token setting the DC to the effect data -->"]
            [h,if(json.get(ReturnData,"Contested")==1): 
                rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['DC']",json.remove(ReturnData,"EffectID"));
                rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+EffectTarget+"']",json.remove(ReturnData,"EffectID"))
            ]
            [h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
        }]
    };
    case "Save":{
        [h,MACRO("Modify Save@Lib:pm.a5e.Core"): ModifyRollData]
        [h:ReturnData = macro.return]
        [h:abilityTable = json.merge(abilityTable,json.get(ReturnData,"Table"))]
        [h,if(effectID==""),CODE:{};{
            [h:rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+EffectTarget+"']",json.remove(ReturnData,"EffectID"))]
            [h:setLibProperty("gd.Effects",rerolledEffect,"Lib:pm.a5e.Core")]
        }]
    };
    case "Attack":{
        
    }
]