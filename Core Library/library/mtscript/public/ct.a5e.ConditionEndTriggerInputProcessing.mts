[h:subeffectData = arg(0)]
[h:instanceNumber = json.get(subeffectData,"conditionEndInstanceNumber")]
[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceNumber")]
[h:endInfo = "{}"]

[h,count(instanceNumber),CODE:{
	[h:thisInstanceType = json.get(subeffectData,"conditionNonDurationEndInstance"+roll.count)]

	[h:thisInstanceSuccessRequired = json.get(subeffectData,"conditionEndInstanceSuccessRequired"+roll.count)]
	[h,switch(thisInstanceSuccessRequired),CODE:
		case "Check":{
			[h:thisInstanceResolutionType = json.get(subeffectData,"conditionEndInstanceResolution"+roll.count)]

			[h,if(thisInstanceResolutionType == "AthleticsAcrobatics"): thisInstanceResolutionType = json.append("","Athletics","Acrobatics")]

			[h:resolutionInfo = json.set("","CheckType",thisInstanceResolutionType)]
		};
		case "Save":{
			[h:thisInstanceResolutionType = json.get(subeffectData,"conditionEndInstanceResolution"+roll.count)]

			[h:resolutionInfo = json.set("","SaveType",thisInstanceResolutionType)]
		};
		default:{
			[h:resolutionInfo = ""]
		}
	]

	[h,if(resolutionInfo != ""),CODE:{

	};{

	}]

	[h:subeffectData = json.remove(subeffectData,"conditionNonDurationEndInstance"+roll.count)]
	[h:subeffectData = json.remove(subeffectData,"isConditionEndInstanceConditional"+roll.count)]
	[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceSuccessRequired"+roll.count)]
	[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceResolution"+roll.count)]
}]

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