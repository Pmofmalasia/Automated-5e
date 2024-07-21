[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]

[h:SizeData = "{}"]
[h:prereqType = json.get(inputData,"SizePrereqs"+IDSuffix)]
[h:inputData = json.remove(inputData,"SizePrereqs"+IDSuffix)]
[h,switch(prereqType),CODE:
	case "Relative":{
		[h:magnitude = json.get(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]

		[h:SizeData = json.set(SizeData,"SizeMinimum",-magnitude)]
		[h:SizeData = json.set(SizeData,"SizeMaximum",magnitude)]

		[h:inputData = json.remove(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]
	};
	case "RelativeMaximum":{
		[h:direction = json.get(inputData,"SizePrereqsRelativeDirection"+IDSuffix)]
		[h:magnitude = json.get(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]

		[h:SizeData = json.set(SizeData,"SizeMaximum",if(direction == "Larger",1,-1)*magnitude)]
		
		[h:inputData = json.remove(inputData,"SizePrereqsRelativeDirection"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]
	};
	case "RelativeMinimum":{
		[h:direction = json.get(inputData,"SizePrereqsRelativeDirection"+IDSuffix)]
		[h:magnitude = json.get(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]

		[h:SizeData = json.set(SizeData,"SizeMinimum",if(direction == "Larger",1,-1)*magnitude)]
		
		[h:inputData = json.remove(inputData,"SizePrereqsRelativeDirection"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SizePrereqsRelativeMagnitude"+IDSuffix)]
	};
	case "Range":{
		[h,if(json.get(inputData,"SizePrereqsMinimum"+IDSuffix) != ""): SizeData = json.set(SizeData,"SizeMinimum",json.get(inputData,"SizePrereqsMinimum"+IDSuffix))]
		[h,if(json.get(inputData,"SizePrereqsMaximum"+IDSuffix) != ""): SizeData = json.set(SizeData,"SizeMaximum",json.get(inputData,"SizePrereqsMaximum"+IDSuffix))]
		
		[h:inputData = json.remove(inputData,"SizePrereqsMinimum"+IDSuffix)]
		[h:inputData = json.remove(inputData,"SizePrereqsMaximum"+IDSuffix)]
	};
	default:{
		[h:allSizes = json.append("","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal")]
		[h:selectedSizes = "[]"]
		[h,foreach(size,allSizes),CODE:{
			[h,if(json.contains(inputData,"SizePrereqsChoice"+size+IDSuffix)): selectedSizes = json.append(selectedSizes,size)]
			[h:inputData = json.remove(inputData,"SizePrereqsChoice"+size+IDSuffix)]
		}]

		[h,if(prereqType == "Inclusive"):
			SizeData = json.set(SizeData,"SizeInclusive",selectedSizes);
			SizeData = json.set(SizeData,"SizeExclusive",selectedSizes)
		]
	}
]

[h:return(0,json.set("","InputData",inputData,"SizeData",SizeData))]