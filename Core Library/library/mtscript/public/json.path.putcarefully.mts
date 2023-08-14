[h:JSONToRead = arg(0)]
[h:JSONPath = arg(1)]

[h,if(argCount() > 4): 
	validEndpoints = json.path.read(JSONToRead,JSONPath,arg(4));
	validEndpoints = json.path.read(JSONToRead,JSONPath)
]

[h,if(json.isEmpty(validEndpoints)):
	finalJSON = JSONToRead;
	finalJSON = json.path.put(JSONToRead,JSONPath,arg(2),arg(3),arg(4))
]

[h:return(0,finalJSON)]