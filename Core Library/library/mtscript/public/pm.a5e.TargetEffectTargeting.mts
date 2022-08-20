[h:effectOptions = arg(0)]
[h,if(argCount()>1),CODE:{
    [h:miscCheckAllowed = if(json.get(arg(1),"MiscCheck")=="",0,json.get(arg(1),"MiscAttack"))]
    [h:miscSaveAllowed = if(json.get(arg(1),"MiscSave")=="",0,json.get(arg(1),"MiscSave"))]
    [h:miscAttackAllowed = if(json.get(arg(1),"MiscAttack")=="",0,json.get(arg(1),"MiscAttack"))]
};{
    [h:miscCheckAllowed = 0]
    [h:miscSaveAllowed = 0]
    [h:miscAttackAllowed = 0]
}]

[h:effectOptionsDisplay = ""]
[h,foreach(effect,effectOptions),CODE:{
    [h,if(json.get(effect,"ParentToken")==json.get(effect,"tempThisTarget")),CODE:{
        [h:targetList = json.get(effect,"Targets")]
        [h:targetNamesArray = ""]
        [h,foreach(target,targetList): targetNamesArray = json.append(targetNamesArray,getName(target))]
        [h:targetNames = pm.a5e.CreateDisplayList(targetNamesArray,"and")]
        [h,switch(json.get(effect,"tempEffectType")):
            case "Check": choiceDisplay = getName(json.get(effect,"tempThisTarget"))+"'s Check for "+json.get(effect,"DisplayName")+" vs. "+targetNames;
            case "Attack": choiceDisplay = "Attack: "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")+" vs. "+getName(json.get(effect,"tempThisTarget"));
            case "Damage": choiceDisplay = "Damage Dealt: "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")+" to "+targetNames;
            case "Condition": choiceDisplay = "Conditions Inflicted by "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")+" on "+targetNames;
            default: choiceDisplay = getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")+" vs. "+targetNames
        ]
        [h:effectOptionsDisplay = json.append(effectOptionsDisplay,choiceDisplay)]
    };{
        [h,switch(json.get(effect,"tempEffectType")):
            case "Check": choiceDisplay = getName(json.get(effect,"tempThisTarget"))+"'s Check vs. "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName");
            case "Save": choiceDisplay = getName(json.get(effect,"tempThisTarget"))+"'s Save vs. "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName");
            case "Attack": choiceDisplay = getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")+" attack targeting "+getName(json.get(effect,"tempThisTarget"));
            case "Damage": choiceDisplay = "Damage Dealt to "+getName(json.get(effect,"tempThisTarget"))+" by "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName");
            case "Condition": choiceDisplay = "Conditions Inflicted on "+getName(json.get(effect,"tempThisTarget"))+" by "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName");
            default: choiceDisplay = getName(json.get(effect,"tempThisTarget"))+" vs. "+getName(json.get(effect,"ParentToken"))+"'s "+json.get(effect,"DisplayName")
        ]
        [h:effectOptionsDisplay = json.append(effectOptionsDisplay,choiceDisplay)]
    }]
}]

[h,if(miscCheckAllowed): effectOptionsDisplay = json.append(effectOptionsDisplay,"Other Check")]
[h,if(miscSaveAllowed): effectOptionsDisplay = json.append(effectOptionsDisplay,"Other Save")]
[h,if(miscAttackAllowed): effectOptionsDisplay = json.append(effectOptionsDisplay,"Other Attack")]

[h:abort(input(
    "junkVar | --------------------------- Choose an Effect --------------------------- | | LABEL | SPAN=TRUE ",
    "effectChoiceIndex | "+effectOptionsDisplay+" | Effect Options | RADIO | DELIMITER=JSON SPAN=TRUE"
))]

[h:"<!-- TODO: Need to add conditions and in the future, active spell effects. Distinguish using the 'type' key. -->"]

[h,if(effectChoiceIndex + 1 > json.length(effectOptions)),CODE:{
    [h:effectChoice = json.get(effectOptionsDisplay,effectChoice)]
    [h,switch(effectChoice):
        case "Other Check": tempEffectType = "Check";
        case "Other Save": tempEffectType = "Save";
        case "Other Attack": tempEffectType = "Attack"
    ]

    [h:macro.return = json.set("","Type",tempEffectType)]
};{
    [h:effectChoice = json.get(effectOptions,effectChoice)]

    [h:macro.return = json.set("","ID",json.get(effectChoice,"ID"),"Target",json.get(effectChoice,"tempThisTarget"),"Type",json.get(effectChoice,"tempEffectType"))]
}]