[h:thisInstance = arg(0)]
[h,switch(json.get(subeffectData,"isEndCondition"+thisInstance)),CODE:
    case "No":{

    };
    case "Conditional":{
		[h:"<!-- Temporarily set to 0 to make it easier to edit old spells once implemented -->"]
        [h:ConditionEndTriggers = json.set(ConditionEndTriggers,thisInstance,if(json.get(subeffectData,"isEndCondition"+thisInstance+"Save")=="None",0,json.set("","SaveType",json.get(subeffectData,"isEndCondition"+thisInstance+"Save"))))]
    };
    case "Always":{
        [h:ConditionEndTriggers = json.set(ConditionEndTriggers,thisInstance,if(json.get(subeffectData,"isEndCondition"+thisInstance+"Save")=="None",1,json.set("","SaveType",json.get(subeffectData,"isEndCondition"+thisInstance+"Save"))))]
    };
    default:{}
]
[h:subeffectData = json.remove(subeffectData,"isEndCondition"+thisInstance)]
[h:subeffectData = json.remove(subeffectData,"isEndCondition"+thisInstance+"Save")]