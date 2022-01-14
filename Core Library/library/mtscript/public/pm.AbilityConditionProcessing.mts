[h,if(json.get(pm.ConditionData,"Toggle")),CODE:{
    [h:abilityTable = json.append(abilityTable,json.get(pm.ConditionData,"Table"))]
};{
    [h:abilityTable = json.append(abilityTable,json.get(pm.ConditionData,"Table"))]
    [h,if(pm.Tooltip),CODE:{};{
        [h:pm.ConditionsToSet = json.get(pm.ConditionData,"Conditions")]
    }]
}]