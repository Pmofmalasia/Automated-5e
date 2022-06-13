[h:abilityTable = json.append(abilityTable,json.get(ConditionInfo,"Table"))]

[h,if(IsTooltip),CODE:{};{
	[h:pm.ConditionsToSet = json.get(ConditionInfo,"ConditionInfo")]
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]
    
    [h:noPriorConditionsTest = json.isEmpty(json.get(thisEffect,"ConditionInfo"))]
    [h,if(noPriorConditionsTest),CODE:{
        [h:thisEffect = json.set(thisEffect,"ConditionInfo",json.append("",pm.ConditionsToSet))]
    };{
        [h:sameGroupTest = -1]
        
        [h,foreach(conditionGroup,json.get(thisEffect,"ConditionInfo")): sameGroupTest = if(json.equals(json.get(pm.ConditionsToSet,"EndInfo"),json.get(json.get(thisEffect,"ConditionInfo"),"EndInfo")),roll.count,sameGroupTest)]
        
        [h,if(sameGroupTest>=0): thisEffectNewConditions = json.merge(json.get(json.get(json.get(thisEffect,"ConditionInfo"),sameGroupTest),"Conditions"),json.get(pm.ConditionsToSet,"Conditions"))]
        
        [h,if(sameGroupTest>=0): 
            thisEffect = json.path.set(thisEffect,"['ConditionInfo']["+sameGroupTest+"]['Conditions']",thisEffectNewConditions);
            thisEffect = json.set(thisEffect,"ConditionInfo",json.append(json.get(thisEffect,"ConditionInfo"),pm.ConditionsToSet)
        ]
    }]

	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]
}]