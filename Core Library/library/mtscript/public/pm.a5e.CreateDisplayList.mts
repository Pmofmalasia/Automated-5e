[h:inputList = arg(0)]
[h:insertWord = arg(1)]

[h,if(json.type(inputList) == "UNKNOWN"): inputList = json.fromList(inputList)]

[h,switch(json.length(inputList)):
	case 1:  displayText = json.get(inputList, 0);
	case 2:  displayText = json.toList(inputList, " "+insertWord+" ");
	default: displayText = json.toList(json.get(inputList, 0, -2), ", ") + ", "+insertWord+" " + json.get(json.get(inputList, -1, -1), 0)
]

[h:macro.return = displayText]