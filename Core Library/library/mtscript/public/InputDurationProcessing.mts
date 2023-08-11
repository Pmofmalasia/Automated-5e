[h:DurationData = macro.args]
[h:InputData = json.get(DurationData,"InputData")]
[h:Prefix = json.get(DurationData,"Prefix")]

[h:durationInfo = "{}"]
[h,switch(json.get(InputData,Prefix)),CODE:
	case "Instantaneous":{
		
	};
	case "1 Round":{
		[h:durationInfo = json.set("","Value",1,"Units","round")]
	};
	case "1 Minute":{
		[h:durationInfo = json.set("","Value",1,"Units","minute")]
	};
	case "10 Minutes":{
		[h:durationInfo = json.set("","Value",10,"Units","minute")]
	};
	case "1 Hour":{
		[h:durationInfo = json.set("","Value",1,"Units","hour")]
	};
	case "8 Hours":{
		[h:durationInfo = json.set("","Value",8,"Units","hour")]
	};
	case "24 Hours":{
		[h:durationInfo = json.set("","Value",24,"Units","hour")]
	};
	case "10 Days":{
		[h:durationInfo = json.set("","Value",10,"Units","day")]
	};
	case "Until Dispelled":{
		
	};
	case "Custom":{
		[h:durationInfo = json.set("","Value",json.get(InputData,"custom"+Prefix+"Value"),"Units",json.get(InputData,"custom"+Prefix+"Units"))]
		[h:InputData = json.remove(InputData,"custom"+Prefix+"Value")]
		[h:InputData = json.remove(InputData,"custom"+Prefix+"Units")]
	}
]
[h:InputData = json.remove(InputData,Prefix)]

[h:return(0,json.set("","OutputData",InputData,"DurationInfo",durationInfo))]