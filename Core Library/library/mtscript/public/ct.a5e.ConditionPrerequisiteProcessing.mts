[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]
[h:ConditionData = "{}"]

[h:ConditionLimitHow = json.get(inputData,"ConditionPrereqHow"+IDSuffix)]
[h:inputData = json.remove(inputData,"ConditionPrereqHow"+IDSuffix)]
[h,if(ConditionLimitHow == ""): return(0,json.set("","Input",inputData,"Conditions",ConditionData))]

[h:inclusiveConditions = "[]"]
[h:exclusiveConditions = "[]"]
[h:baseConditions = pm.a5e.GetBaseConditions("Name","json")]
[h,foreach(condition,baseConditions),CODE:{
	[h,if(json.contains(inputData,"ConditionPrereqInclusive"+IDSuffix+condition)),CODE:{
		[h:inclusiveConditions = json.append(inclusiveConditions,condition)]
		[h:inputData = json.remove(inputData,"ConditionPrereqInclusive"+IDSuffix+condition)]
	};{}]
	
	[h,if(json.contains(inputData,"ConditionPrereqExclusive"+IDSuffix+condition)),CODE:{
		[h:exclusiveConditions = json.append(exclusiveConditions,condition)]
		[h:inputData = json.remove(inputData,"ConditionPrereqExclusive"+IDSuffix+condition)]
	};{}]
}]

[h,if(json.contains(inputData,"ConditionPrereqInclusive"+IDSuffix+"NonBaseCondition")),CODE:{
	[h:inputData = json.remove(inputData,"ConditionPrereqInclusive"+IDSuffix+"NonBaseCondition")]
	[h:nonBaseNumber = json.get(inputData,"ConditionPrereqNonBaseInclusive"+IDSuffix+"Number")]
	[h:inputData = json.remove(inputData,"ConditionPrereqNonBaseInclusive"+IDSuffix+"Number")]

	[h:safeCounter = 0]
	[h,count(nonBaseNumber),CODE:{
		[h:thisFeatureInfo = ct.a5e.AutocompletedFeatureProcessing(inputData,"ConditionPrereqNonBaseInclusive"+IDSuffix+safeCounter)]
		[h:inputData = json.get(thisFeatureInfo,"InputData")]
		[h:inclusiveConditions = json.append(inclusiveConditions,json.get(thisFeatureInfo,"Feature"))]
		
		[h:safeCounter = safeCounter + 1]
	}]
}]

[h,if(json.contains(inputData,"ConditionPrereqExclusive"+IDSuffix+"NonBaseCondition")),CODE:{
	[h:inputData = json.remove(inputData,"ConditionPrereqExclusive"+IDSuffix+"NonBaseCondition")]
	[h:nonBaseNumber = json.get(inputData,"ConditionPrereqNonBaseExclusive"+IDSuffix+"Number")]
	[h:inputData = json.remove(inputData,"ConditionPrereqNonBaseExclusive"+IDSuffix+"Number")]

	[h:safeCounter = 0]
	[h,count(nonBaseNumber),CODE:{
		[h:thisFeatureInfo = ct.a5e.AutocompletedFeatureProcessing(inputData,"ConditionPrereqNonBaseExclusive"+IDSuffix+safeCounter)]
		[h:inputData = json.get(thisFeatureInfo,"InputData")]
		[h:exclusiveConditions = json.append(exclusiveConditions,json.get(thisFeatureInfo,"Feature"))]
		
		[h:safeCounter = safeCounter + 1]
	}]
}]

[h:setByUserType = json.get(inputData,"isConditionPrereqSetByUser"+IDSuffix)]
[h:inputData = json.remove(inputData,"isConditionPrereqSetByUser"+IDSuffix)]

[h,if(!json.isEmpty(inclusiveConditions)),CODE:{
	[h,switch(json.get(inputData,"ConditionPrereqCombineInclusive"+IDSuffix)),CODE:
		case "All":{
			[h:NumberRequired = "All"]
		};
		case "One":{
			[h:NumberRequired = 1]
		};
		case "OtherNum":{
			[h:NumberRequired = json.get(inputData,"ConditionPrereqCombineNumberInclusive"+IDSuffix)]
			[h:inputData = json.remove(inputData,"ConditionPrereqCombineNumberInclusive"+IDSuffix)]
		};
		case "Other":{
			[h:"<!-- TODO: Will need a more detailed implementation for how to combine things with and/or (e.g. requries CHA 13 AND (STR 13 OR DEX 13)) -->"]
			[h:NumberRequired = "All"]
		}
	]
	[h:inputData = json.remove(inputData,"ConditionPrereqCombineInclusive"+IDSuffix)]

	[h:inclusiveConditionsFinal = json.set("","Names",inclusiveConditions,"AllorOne",NumberRequired,"isSetByRequired",setByUserType)]
	[h:ConditionData = json.set(ConditionData,"IncludeConditions",inclusiveConditionsFinal)]
};{}]

[h,if(!json.isEmpty(exclusiveConditions)),CODE:{
	[h,switch(json.get(inputData,"ConditionPrereqCombineExclusive"+IDSuffix)),CODE:
		case "All":{
			[h:NumberRequired = "All"]
		};
		case "One":{
			[h:NumberRequired = 1]
		};
		case "OtherNum":{
			[h:NumberRequired = json.get(inputData,"ConditionPrereqCombineNumberExclusive"+IDSuffix)]
			[h:inputData = json.remove(inputData,"ConditionPrereqCombineNumberExclusive"+IDSuffix)]
		};
		case "Other":{
			[h:"<!-- TODO: Will need a more detailed implementation for how to combine things with and/or (e.g. requries CHA 13 AND (STR 13 OR DEX 13)) -->"]
			[h:NumberRequired = "All"]
		}
	]
	[h:inputData = json.remove(inputData,"ConditionPrereqCombineExclusive"+IDSuffix)]
	
	[h:exclusiveConditionsFinal = json.set("","Names",exclusiveConditions,"AllorOne",NumberRequired,"isSetByRequired",setByUserType)]
	[h:ConditionData = json.set(ConditionData,"ExcludeConditions",exclusiveConditionsFinal)]
};{}]

[h:return(0,json.set("","Input",inputData,"Conditions",ConditionData))]