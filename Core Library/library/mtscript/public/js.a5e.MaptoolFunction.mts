[h:functionToExecute = arg(0)]
[h:functionArgs = arg(1)]

[h,if(json.type(functionArgs) == "ARRAY"),CODE:{
	[h:functionArgsString = ""]
	[h,foreach(arg,functionArgs),CODE:{
		[h:set("tempVar"+roll.count,arg)]
		[h:functionArgsString = listAppend(functionArgsString,'eval("tempVar'+roll.count+'")')]
	}]
};{
	[h:tempVar0 = functionArgs]
	[h:functionArgsString = 'eval("tempVar0")']
}]

[h:functionResult = evalMacro("[r:"+functionToExecute+"("+functionArgsString+")]")]

[h:return(0,json.append("",functionResult))]