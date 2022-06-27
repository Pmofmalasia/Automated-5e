[h:allEffectData = macro.args]
[h:currentEffectData = json.get(allEffectData,"CurrentEffects")]
[h:baseEffectData = json.get(allEffectData,"BaseEffect")]
[h:effectsToMerge = json.get(allEffectData,"ToMerge")]
[h:whichEffect = json.get(allEffectData,"WhichEffect")]
[h,if(whichEffect == ""): whichEffect = 0]
[h:"<!-- whichEffect array allows for choosing effects to merge with in a non-sequential order -->"]
[h,foreach(effect,effectsToMerge),CODE:{
    
    [h,if(json.type(whichEffect) == "ARRAY"),CODE:{
        [h,if((roll.count+1)>json.length(whichEffect)):
            whichEffect = json.length(currentEffectData);
            whichEffect = json.get(whichEffect,roll.count)
        ]
    };{}]
    
    [h:checkDCData = json.get(effect,"CheckDC")]
    [h:saveDCData = json.get(effect,"SaveDC")]
    [h:attackData = json.get(effect,"Attack")]
    [h:targetData = json.get(effect,"Targets")]
    [h:damageData = json.get(effect,"Damage")]
    [h:conditionData = json.get(effect,"ConditionInfo")]
    [h,if(checkDCData!=""),CODE:{
        [h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]

        [h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"CheckDC",checkDCData))]

        [h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(saveDCData!=""),CODE:{
        [h,if(whichEffect==""): whichEffect = 0]
        [h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]
        
        [h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"SaveDC",saveDCData))]

        [h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(attackData!=""),CODE:{
        [h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]

        [h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"Attack",attackData))]
        
	    [h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(targetData!=""),CODE:{
        [h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]

        [h,if(json.get(thisEffect,"Targets")==""):
            thisEffect = json.set(thisEffect,"Targets",targetData);
            thisEffect = json.set(thisEffect,"Targets",json.merge(json.get(thisEffect,"Targets"),targetData))
        ]
    
        [h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(damageData!=""),CODE:{
        [h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]
        
        [h:tempToResolve = if(json.get(thisEffect,"ToResolve")=="","{}",json.get(thisEffect,"ToResolve"))]
        [h:tempToResolve = pm.a5e.BuildEffectMergeDamage(tempToResolve,damageData)]
        [h:thisEffect = json.set(thisEffect,"ToResolve",tempToResolve)]
    
        [h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(conditionData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,".ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(currentEffectData,whichEffect)]
		
        [h:tempToResolve = json.get(thisEffect,"ToResolve")]
		[h,if(tempToResolve==""):
            noPriorConditionsTest = 1;
            noPriorConditionsTest = json.isEmpty(json.get(tempToResolve,"ConditionInfo"))
        ]

		[h,if(noPriorConditionsTest):
            tempToResolve = json.set(tempToResolve,"ConditionInfo",json.append("",conditionData));
            tempToResolve = pm.a5e.BuildEffectMergeConditions(tempToResolve,conditionData)
        ]

        [h:thisEffect = json.set(thisEffect,"ToResolve",tempToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
    };{}]
    
    [h,if(json.type(whichEffect) == "UNKNOWN"): whichEffect = whichEffect+1]
}]

[h:macro.return = currentEffectData]