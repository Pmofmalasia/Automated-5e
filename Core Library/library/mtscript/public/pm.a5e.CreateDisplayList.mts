[h:inputList = arg(0)]
[h:insertWord = arg(1)]
[h,if(argCount() > 2):
	options = arg(2);
	options = "{}"
]
[h:isVariableDelimiter = number(json.get(options,"isVariableDelimiter"))]

[h,if(json.type(inputList) == "UNKNOWN"): inputList = json.fromList(inputList)]

[h,switch(json.length(inputList)):
	case 0:  displayText = "";
	case 1:  displayText = json.get(inputList, 0);
	case 2:  displayText = json.toList(inputList, " "+insertWord+" ");
	default: displayText = json.toList(json.get(inputList, 0, -2), if(isVariableDelimiter,"%{VerticalListFormat}",", ")) + if(isVariableDelimiter,"%{VerticalListFormat}",", ")+insertWord+" " + json.get(json.get(inputList, -1, -1), 0)
]

[h:macro.return = displayText]