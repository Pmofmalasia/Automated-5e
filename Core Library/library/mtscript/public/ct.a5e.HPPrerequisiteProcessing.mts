[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]
[h:allHPData = "{}"]

[h,switch(json.get(inputData,"HPPrereqType"+IDSuffix)),CODE:
	case "":{};
	case "Comparison":{
		[h:HPLimitData = json.set("",
			"Type","Comparison",
			"Target",json.get(inputData,"HPPrereqTarget"+IDSuffix),
			"Comparitor",json.get(inputData,"HPPrereqComparitor"+IDSuffix)
		)]
		[h:inputData = json.remove(inputData,"HPPrereqTarget"+IDSuffix)]
		[h:inputData = json.remove(inputData,"HPPrereqComparitor"+IDSuffix)]
		[h:inputData = json.remove(inputData,"HPPrereqTargetType"+IDSuffix)]
		[h:allHPData = json.set(allHPData,"HP",HPLimitData)]
	};
	default:{
		[h:allHPData = json.set(allHPData,"HP",json.set("","Type",json.get(inputData,"HPPrereqType"+IDSuffix)))]
	}
]
[h:inputData = json.remove(inputData,"HPPrereqType"+IDSuffix)]

[h:return(0,json.set("","Input",inputData,"HP",allHPData))]