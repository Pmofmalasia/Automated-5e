[h:functionToExecute = arg(0)]
[h:functionArgs = arg(1)]

[h:"<!-- For debugging -->"]
[h:link = macroLinkText("js.a5e.MaptoolFunction@Lib:pm.a5e.Core","gm",json.append("",functionToExecute,functionArgs))]

[h,if(json.type(functionArgs) == "ARRAY"),CODE:{
	[h:functionArgsString = ""]
	[h,foreach(arg,functionArgs),CODE:{
		[h,if(json.type(arg) == "UNKNOWN"):
			functionArgsString = functionArgsString + '"'+arg+'"';
			functionArgsString = functionArgsString + arg
		]
		[h,if(roll.count < json.length(functionArgs) - 1): functionArgsString = functionArgsString + ","]
	}]
};{
	[h:functionArgsString = '"'+functionArgs+'"']
}]

[h:functionResult = evalMacro("[r:"+functionToExecute+"("+functionArgsString+")]")]

[h:return(0,json.append("",functionResult))]