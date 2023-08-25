[h:ResourcesToCheck = arg(0)]
[h,if(argCount() > 1): switchToken(arg(1))]

[h,if(json.type(ResourcesToCheck) == "OBJECT"): ResourcesToCheck = json.append("",ResourcesToCheck)]

[h:AnyResourceTest = 0]
[h,foreach(resource,ResourcesToCheck),CODE:{
	[h,MACRO("ResourceRemaining@Lib:pm.a5e.Core"): json.set(resource,"ParentToken",currentToken())]
	[h,if(macro.return > 0): AnyResourceTest = 1]
}]

[h:return(0,AnyResourceTest)]