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
        [h,if(json.type(componentToGetData)=="OBJECT"),CODE:{
			[h,if(json.type(rangeData)=="OBJECT"):
				rangeData = json.get(rangeData,json.get(componentToGetData,"SecondaryKey"));
				rangeData = json.set("","Units","Variable")
			]
		};{}]
        [h:macro.return = rangeData]
    };
    case "Duration":{
        [h:durationData = json.get(json.get(allEffectData,whichEffect),"Duration")]
        [h,if(json.type(componentToGetData)=="OBJECT"),CODE:{
			[h,if(json.type(durationData)=="OBJECT"):
				durationData = json.get(durationData,json.get(componentToGetData,"SecondaryKey"));
				durationData = json.set("","Units","Variable")
			]
		};{}]
        [h:macro.return = durationData]
    };
    case "Resource":{
        [h:resourceData = json.get(json.get(allEffectData,whichEffect),"Resource")]
		[h,if(json.type(resourceData)!="OBJECT"),CODE:{
			[h,if(json.get(componentToGetData,"SecondaryKey") == "HitDieSize"):
				return(0,6);
				return(0,0)
			]
		};{}]
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
        [h,if(json.type(componentToGetData)=="OBJECT"),CODE:{
			[h,if(json.type(rollData)=="OBJECT"):
				rollData = json.get(rollData,json.get(componentToGetData,"SecondaryKey"));
				rollData = 0
			]
		};{}]
        [h:macro.return = rollData]
    };
    case "Damage":{
		[h:damageData = json.get(json.get(allEffectData,whichEffect),"Damage")]
        [h,if(json.type(componentToGetData)=="OBJECT"),CODE:{
			[h:typesToGet = json.get(componentToGetData,"Types")]
			[h:tempDamageData = "{}"]
			[h,foreach(allowedType,typesToGet): tempDamageData = json.set(tempDamageData,allowedType,json.get(damageData,allowedType))]
			[h:damageData = tempDamageData]
        };{}]
		[h:damageData = json.remove(damageData,"Healing")]
		[h:damageData = json.remove(damageData,"TempHP")]

		[h:totalDamage = 0]
		[h,foreach(damageType,json.fields(damageData,"json")): totalDamage = totalDamage + json.get(damageData,damageType)]
		[h:return(0,totalDamage)]	
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