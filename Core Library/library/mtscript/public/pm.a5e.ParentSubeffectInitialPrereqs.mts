[h:ParentSubeffect = arg(0)]
[h:ParentSubeffectRequirements = arg(1)]

[h,switch(json.get(ParentSubeffectRequirements,"Requirement")),CODE:
	case "Attack":{
		[h:return(0,!number(json.get(ParentSubeffectRequirements,"MustCrit")))]
	};
	default:{
		[h:return(0,1)]
	}
]