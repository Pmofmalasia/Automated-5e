[h:ch.Type = json.get(macro.args,"Type")]
[h,switch(ch.Type),CODE:
	case "Initiative": {[h,MACRO("Initiative@Lib:pm.a5e.Core"): macro.args]};
	case "Check": {[h,MACRO("Modify Check@Lib:pm.a5e.Core"): macro.args]};
	default: {[h,MACRO("Modify Check@Lib:pm.a5e.Core"): macro.args]}
]