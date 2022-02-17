[h:ch.Type = json.get(macro.args,"Type")]
[h,switch(ch.Type),CODE:
	case "Initiative": {[h,MACRO("Initiative@Lib:pm.a5e.Core"): macro.args]};
	case "Check": {[h,MACRO("Check@Lib:pm.a5e.Core"): macro.args]};
	default: {[h,MACRO("Check@Lib:pm.a5e.Core"): macro.args]}
]