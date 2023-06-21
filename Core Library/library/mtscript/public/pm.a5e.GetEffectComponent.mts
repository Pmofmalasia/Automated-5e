[h:allEffectData = arg(0)]
[h,if(json.type(allEffectData)=="OBJECT"),CODE:{
    [h:allEffectData = json.append("",allEffectData)]
    [h:whichEffect = 0]
};{
    [h,if(argCount()>2): whichEffect = arg(2); whichEffect = 0]
}]

[h:componentToGetData = arg(1)]
[h,if(json.type(componentToGetData)=="OBJECT"):
    componentToGet = json.get(componentToGetData,"Main");
    componentToGet = componentToGetData
]

[h,switch(componentToGet),CODE:
    case "SaveDC":{
        [h:SaveDCData = json.get(json.get(json.get(allEffectData,whichEffect),"ToResolve"),"SaveDC")]
        [h,if(json.type(componentToGetData)=="OBJECT"):
            macro.return = json.get(SaveDCData,json.get(componentToGetData,"SecondaryKey"));
            macro.return = SaveDCData
        ]
    };
    case "Check":{
        
    };
    case "Attack":{
        
    };
    case "Targets":{
        [h:targetData = json.get(json.get(allEffectData,whichEffect),"Targets")]
        [h:macro.return = targetData]
    };
    case "TargetOptions":{
        [h:targetOptionData = json.get(json.get(allEffectData,whichEffect),"TargetOptions")]
        [h:macro.return = targetOptionData]
    };
    case "Range":{
        [h:rangeData = json.get(json.get(allEffectData,whichEffect),"Range")]
        [h,if(json.type(componentToGetData)=="OBJECT"): rangeData = json.get(rangeData,json.get(componentToGetData,"SecondaryKey"))]
        [h:macro.return = rangeData]
    };
    case "Duration":{
        [h:durationData = json.get(json.get(allEffectData,whichEffect),"Duration")]
        [h,if(json.type(componentToGetData)=="OBJECT"): durationData = json.get(durationData,json.get(componentToGetData,"SecondaryKey"))]
        [h:macro.return = durationData]
    };
    case "Resource":{
        [h:resourceData = json.get(json.get(allEffectData,whichEffect),"Resource")]
        [h,switch(json.get(componentToGetData,"SecondaryKey")),CODE:
            case "":{
                [h:macro.return = resourceData]
            };
            case "SpellLevel":{
                [h,if(json.isEmpty(resourceData)):
                    macro.return = 1;
                    macro.return = if(json.get(resourceData,"SpellLevel")=="",0,json.get(resourceData,"SpellLevel"))
                ]
            };
            case "ResourceName":{
                [h,if(json.isEmpty(resourceData)):
                    macro.return = "";
                    macro.return = if(json.get(resourceData,"ResourceName")=="","",json.get(resourceData,"ResourceName"))
                ]
            };
            case "Used":{
                [h,if(json.isEmpty(resourceData)):
                    macro.return = 0;
                    macro.return = if(json.get(resourceData,"Used")=="",0,json.get(resourceData,"Used"))
                ]
            };
            case "HitDieSize":{
                [h,if(json.isEmpty(resourceData)):
                    macro.return = 6;
                    macro.return = if(json.get(resourceData,"HitDieSize")=="",6,json.get(resourceData,"HitDieSize"))
                ]
            }
        ]
    };
    case "Roll":{
        [h:rollData = json.get(json.get(allEffectData,whichEffect),"Roll")]
        [h,if(json.type(componentToGetData)=="OBJECT"): rollData = json.get(rollData,json.get(componentToGetData,"SecondaryKey"))]
        [h:macro.return = rollData]
    };
    case "Damage":{
        [h,if(json.type(componentToGetData)=="OBJECT"),CODE:{
            [h:"<-- May need extra code blocks to have option to get multiple damage types totaled up (needs looping) AND have option to return all damage types dealt. Might be able to just do it by having blank one be set to blank array and be 'ignored' -->"]
        };{
            [h:damageData = json.get(json.get(allEffectData,whichEffect),"Damage")]
            [h:totalDamage = 0]
            [h,foreach(damageType,json.fields(damageData,"json")): totalDamage = totalDamage + if(damageType!="Healing" && damageType!="TempHP",json.get(damageData,damageType),0)]
            [h:macro.return = totalDamage]
        }]
    };
    case "Condition":{
        
    };
    case "TargetedConditions":{
		[h,if(json.type(componentToGetData)=="UNKNOWN"): return(0,json.get(json.get(allEffectData,whichEffect),"TargetedConditions"))]
		
		[h,switch(json.get(componentToGetData,"SecondaryKey")),CODE:
			case "Separate":{
				[h:macro.return = json.get(json.get(allEffectData,whichEffect),"TargetedConditions")]
			};
			case "Combined":{
				[h:AllConditionGroups = "[]"]
				[h:tempConditionTargets = json.get(json.get(allEffectData,whichEffect),"TargetedConditions")]
				[h,foreach(target,json.fields(tempConditionTargets)): AllConditionGroups = json.merge(AllConditionGroups,json.get(tempConditionTargets,target))]
				[h:macro.return = AllConditionGroups]
			}
		]
    };
    case "TargetedEffects":{
        [h:macro.return = json.get(json.get(allEffectData,whichEffect),"TargetedEffects")]
    };
    case "TargetedEffectOptions":{
        [h:macro.return = json.get(json.get(allEffectData,whichEffect),"TargetedEffectOptions")]
    }
]