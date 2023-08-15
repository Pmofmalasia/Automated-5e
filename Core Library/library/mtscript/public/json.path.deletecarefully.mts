[h:JSONToRead = arg(0)]
[h:JSONPath = arg(1)]

[h,if(json.type(JSONPath) == "ARRAY"),CODE:{
	[h:JSONOnlyNode = json.get(JSONPath,0)]
	[h,if(isNumber(JSONOnlyNode) || JSONOnlyNode == "*"):
		JSONPath = "\$["+JSONOnlyNode+"]";
		JSONPath = "\$['"+JSONOnlyNode+"']"
	]
}]

[h:validEndpoints = json.path.read(JSONToRead,JSONPath)]

[h,if(json.isEmpty(validEndpoints)):
	finalJSON = JSONToRead;
	finalJSON = json.path.delete(JSONToRead,JSONPath)
]

[h:return(0,finalJSON)]