[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]
[h:AttributeData = "{}"]

[h:prerequisiteNumber = json.get(inputData,"AbilityScorePrereq"+IDSuffix+"Number")]
[h:inputData = json.remove(inputData,"AbilityScorePrereq"+IDSuffix+"Number")]
[h:attributeList = "[]"]
[h,count(prerequisiteNumber),CODE:{
	[h:thisAttributeData = json.set("","Name",json.get(inputData,"AbilityScorePrereqAttribute"+IDSuffix+roll.count))]
	[h:inputData = json.remove(inputData,"AbilityScorePrereqAttribute"+IDSuffix+roll.count)]

	[h,switch(json.get(inputData,"AbilityScorePrereqType"+IDSuffix+roll.count)):
		case "Minimum": thisAttributeData = json.set(thisAttributeData,"Minimum",json.get(inputData,"AbilityScorePrereqMinimum"+IDSuffix+roll.count));
		case "Maximum": thisAttributeData = json.set(thisAttributeData,"Maximum",json.get(inputData,"AbilityScorePrereqMaximum"+IDSuffix+roll.count));
		case "Range": thisAttributeData = json.set(thisAttributeData,"Maximum",json.get(inputData,"AbilityScorePrereqMaximum"+IDSuffix+roll.count),"Minimum",json.get(inputData,"AbilityScorePrereqMinimum"+IDSuffix+roll.count))
	]
	[h:inputData = json.remove(inputData,"AbilityScorePrereqType"+IDSuffix+roll.count)]
	[h:inputData = json.remove(inputData,"AbilityScorePrereqMinimum"+IDSuffix+roll.count)]
	[h:inputData = json.remove(inputData,"AbilityScorePrereqMaximum"+IDSuffix+roll.count)]

	[h:attributeList = json.append(attributeList,thisAttributeData)]
}]

[h:AttributeData = json.set(AttributeData,"Attributes",attributeList)]
[h,switch(json.get(inputData,"AbilityScorePrereqCombineHow"+IDSuffix)),CODE:
	case "All":{
		[h:AttributeData = json.set(AttributeData,"NumberRequired","All")]
	};
	case "One":{
		[h:AttributeData = json.set(AttributeData,"NumberRequired",1)]
	};
	case "OtherNum":{
		[h:AttributeData = json.set(AttributeData,"NumberRequired",json.get(inputData,"AbilityScorePrereqCombineNumber"+IDSuffix))]
		[h:inputData = json.remove(inputData,"AbilityScorePrereqCombineNumber"+IDSuffix)]
	};
	case "Other":{
		[h:"<!-- TODO: Will need a more detailed implementation for how to combine things with and/or (e.g. requries CHA 13 AND (STR 13 OR DEX 13)) -->"]
	}
]
[h:inputData = json.remove(inputData,"AbilityScorePrereqCombineHow"+IDSuffix)]

[h:prereqLocation = json.get(inputData,"isAbilityScore"+IDSuffix)]
[h:finalData = json.set("","Attributes"+prereqLocation,AttributeData)]

[h:return(0,json.set("","Input",inputData,"Attributes",finalData))]