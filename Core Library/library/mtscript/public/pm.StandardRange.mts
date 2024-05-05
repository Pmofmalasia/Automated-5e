[h:pm.RangeStringArg = lower(arg(0))]
[h,switch(pm.RangeStringArg),CODE:
	case "foot": {[h:macro.return = "Feet"]};
	case "feet": {[h:macro.return = "Feet"]};
	case "miles": {[h:macro.return = "Miles"]};
	case "mile": {[h:macro.return = "Miles"]};
	case "self": {[h:macro.return = "Self"]};
	case "touch": {[h:macro.return = "Touch"]};
	default: {[h:macro.return = arg(0)]}
]