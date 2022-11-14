[h:thisInstance = arg(0)]
[h,switch(json.get(subeffectData,"isEndCondition"+thisInstance)),CODE:
    case "No":{

    };
    case "Conditional":{
        
    };
    case "Always":{
        [h:conditionEndInfo = json.set(conditionEndInfo,thisInstance,if(json.get(subeffectData,"isEndCondition"+thisInstance+"Save")=="None",1,json.set("","SaveType",json.get(subeffectData,"isEndCondition"+thisInstance+"Save"))))]
    }
]
[h:subeffectData = json.remove(subeffectData,"isEndCondition"+thisInstance)]
[h:subeffectData = json.remove(subeffectData,"isEndCondition"+thisInstance+"Save")]