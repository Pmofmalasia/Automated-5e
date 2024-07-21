[h,switch(argCount()),CODE:
	case 1:{
		[h:returnData = getProperty(arg(0))]
	};
	case 2:{
		[h:tokenRef = arg(1)]
		[h,if(json.type(tokenRef) == "UNKNOWN"):
			returnData = getProperty(arg(0),tokenRef);
			returnData = json.get(tokenRef,arg(0))
		]
	};
	case 3:{
		[h:tokenRef = arg(1)]
		[h,if(json.type(tokenRef) == "UNKNOWN"):
			returnData = getProperty(arg(0),tokenRef,arg(2));
			returnData = json.get(tokenRef,arg(0))
		]
	};
	default:{
		[h:assert(0,"Function getPropertyFlexible() requires 1-3 arguments, "+argCount()+" were received.")]
	}
]

[h:return(0,returnData)]