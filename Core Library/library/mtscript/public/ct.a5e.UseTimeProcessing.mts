[h:subeffectData = arg(0)]
[h,if(argCount()>1): idSuffix = arg(1); idSuffix = ""]

[h,switch(json.get(subeffectData,"UseTime"+idSuffix)),CODE:
	case "Action":{
		[h:castTimeInfo = json.set("","Value",1,"Units","action")]
	};
	case "Bonus Action":{
		[h:castTimeInfo = json.set("","Value",1,"Units","bonus")]
	};
	case "Reaction":{
		[h:castTimeInfo = json.set("","Value",1,"Units","reaction")]
		[h:castTimeInfo = json.set(castTimeInfo,"ReactionDescription",base64.encode(pm.EvilChars(json.get(subeffectData,"ReactionDescription"+idSuffix))))]
		[h:subeffectData = json.remove(subeffectData,"UseTimeReactionDescription"+idSuffix)]
	};
	case "Item Interaction":{
		[h:castTimeInfo = json.set("","Value",1,"Units","interaction")]
	};
	case "Free":{
		[h:castTimeInfo = "{}"]
	};
	case "1 Minute":{
		[h:castTimeInfo = json.set("","Value",1,"Units","minute")]
	};
	case "10 Minutes":{
		[h:castTimeInfo = json.set("","Value",10,"Units","minute")]
	};
	case "1 Hour":{
		[h:castTimeInfo = json.set("","Value",1,"Units","hour")]
	};
	case "8 Hours":{
		[h:castTimeInfo = json.set("","Value",8,"Units","hour")]
	};
	case "12 Hours":{
		[h:castTimeInfo = json.set("","Value",12,"Units","hour")]
	};
	case "24 Hours":{
		[h:castTimeInfo = json.set("","Value",24,"Units","hour")]
	};
	case "Custom":{
		[h:castTimeInfo = json.set("","Value",json.get(subeffectData,"customUseTime"+idSuffix+"Value"),"Units",pm.StandardDuration(json.get(subeffectData,"customUseTime"+idSuffix+"Units")))]
		[h:subeffectData = json.remove(subeffectData,"customUseTime"+idSuffix+"Value")]
		[h:subeffectData = json.remove(subeffectData,"customUseTime"+idSuffix+"Units")]
	};
	default:{
		[h:castTimeInfo = "{}"]
	}
]
[h:subeffectData = json.remove(subeffectData,"UseTime"+idSuffix)]

[h:returnData = json.set("",
	"Subeffect",subeffectData,
	"UseTime",castTimeInfo
)]
[h:return(0,returnData)]