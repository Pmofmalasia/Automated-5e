[h:subeffectData = arg(0)]
[h:instanceNumber = json.get(subeffectData,"conditionEndInstanceNumber")]
[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceNumber")]
[h:endInfo = "{}"]

[h:currentInstanceNumber = 0]
[h,count(instanceNumber),CODE:{
	[h:thisInstanceType = json.get(subeffectData,"conditionNonDurationEndInstance"+currentInstanceNumber)]

	[h:thisInstanceSuccessRequired = json.get(subeffectData,"conditionEndInstanceSuccessRequired"+currentInstanceNumber)]
	[h,switch(thisInstanceSuccessRequired),CODE:
		case "Check":{
			[h:thisInstanceResolutionType = json.get(subeffectData,"conditionEndInstanceResolution"+currentInstanceNumber)]

			[h,if(thisInstanceResolutionType == "AthleticsAcrobatics"): thisInstanceResolutionType = json.append("","Athletics","Acrobatics")]

			[h:resolutionInfo = json.set("","CheckType",thisInstanceResolutionType)]
		};
		case "Save":{
			[h:thisInstanceResolutionType = json.get(subeffectData,"conditionEndInstanceResolution"+currentInstanceNumber)]

			[h:resolutionInfo = json.set("","SaveType",thisInstanceResolutionType)]
		};
		default:{
			[h:resolutionInfo = "{}"]
		}
	]

	[h:isConditionalEndInstance = json.get(subeffectData,"isConditionEndInstanceConditional"+currentInstanceNumber)]
	[h,if(isConditionalEndInstance),CODE:{
		[h:resolutionInfo = json.set(resolutionInfo,"Prereqs",1)]
	};{}]

	[h,if(json.isEmpty(resolutionInfo)): resolutionInfo = 1]

	[h:endInfo = json.set(endInfo,
		thisInstanceType,resolutionInfo
	)]

	[h:subeffectData = json.remove(subeffectData,"conditionNonDurationEndInstance"+currentInstanceNumber)]
	[h:subeffectData = json.remove(subeffectData,"isConditionEndInstanceConditional"+currentInstanceNumber)]
	[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceSuccessRequired"+currentInstanceNumber)]
	[h:subeffectData = json.remove(subeffectData,"conditionEndInstanceResolution"+currentInstanceNumber)]

	[h:currentInstanceNumber = currentInstanceNumber + 1]
}]

[h:finalData = json.set("",
	"Subeffect",subeffectData,
	"EndInfo",endInfo
)]
[h:return(0,finalData)]