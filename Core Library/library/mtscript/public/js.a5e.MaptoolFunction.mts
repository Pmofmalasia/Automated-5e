[h:functionToExecute = arg(0)]
[h:functionArgs = arg(1)]
[h:broadcast(functionArgs)]
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
[h:broadcast(functionArgsString)]

[h:functionResult = evalMacro("[r:"+functionToExecute+"("+functionArgsString+")]")]
[h:return(0,json.append("",functionResult))]