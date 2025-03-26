[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]

[h:allSpeedTypes = json.append("","Walking","Burrow","Fly","Climb","Swim","All","Any")]
[h:SpeedData = "{}"]
[h:prereqType = json.get(inputData,"SpeedPrereqs"+IDSuffix)]
[h:inputData = json.remove(inputData,"SpeedPrereqs"+IDSuffix)]
[h,switch(prereqType),CODE:
	case "Inclusive":{
		[h:speedLimits = ""]
		[h,foreach(speedType,allSpeedTypes),if(json.contains(inputData,"SpeedChoice"+IDSuffix+speedType)),CODE:{
			[h:speedLimits = json.set(speedLimits,speedType,json.set("","Minimum",1))]
			[h:inputData = json.remove(inputData,"SpeedChoice"+IDSuffix+speedType)]
		}]

		[h:SpeedData = json.set(SpeedData,"Speed",speedLimits)]
	};
	case "Exclusive":{
		[h:speedLimits = ""]
		[h,foreach(speedType,allSpeedTypes),if(json.contains(inputData,"SpeedChoice"+IDSuffix+speedType)),CODE:{
			[h:speedLimits = json.set(speedLimits,speedType,json.set("","Maximum",0))]
			[h:inputData = json.remove(inputData,"SpeedChoice"+IDSuffix+speedType)]
		}]

		[h:SpeedData = json.set(SpeedData,"Speed",speedLimits)]
	};
	case "Range":{
		[h:rangeData = "{}"]
		[h,if(json.contains(inputData,"SpeedPrereqsRangeMinimum"+IDSuffix)): rangeData = json.set("Minimum",json.get(inputData,"SpeedPrereqsRangeMinimum"+IDSuffix))]
		[h,if(json.contains(inputData,"SpeedPrereqsRangeMaximum"+IDSuffix)): rangeData = json.set("Maximum",json.get(inputData,"SpeedPrereqsRangeMaximum"+IDSuffix))]

		[h:speedType = json.get(inputData,"SpeedPrereqsRangeType"+IDSuffix)]
		[h:SpeedData = json.set(SpeedData,speedType,rangeData)]

		[h:inputData = json.remove(inputData,"SpeedPrereqsRangeType"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SpeedPrereqsRangeMinimum"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SpeedPrereqsRangeMaximum"+IDSuffix)]
	};
	case "Relative":{
		[h,switch(json.get(inputData,"SpeedPrereqsRange"+IDSuffix)):
			case "LessThan": rangeData = json.set("","Maximum","relative");
			case "GreaterThan": rangeData = json.set("","Minimum","relative")
		]
		[h:speedType = json.get(inputData,"SpeedPrereqsRangeType"+IDSuffix)]
		[h:SpeedData = json.set(SpeedData,speedType,rangeData)]

		[h:inputData = json.remove(inputData,"SpeedPrereqsRange"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SpeedPrereqsRangeType"+IDSuffix)]
	};
	default:{}
]

[h:return(0,json.set("","InputData",inputData,"SpeedData",SpeedData))]