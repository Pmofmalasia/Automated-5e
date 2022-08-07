[h:sv.Type = json.get(macro.args,"Type")]
[h,switch(sv.Type),CODE:
	case "Death": {[h,MACRO("Death Save@Lib:pm.a5e.Core"): macro.args]};
	case "Save": {[h,MACRO("Modify Save@Lib:pm.a5e.Core"): macro.args]};
	default: {[h,MACRO("Modify Save@Lib:pm.a5e.Core"): macro.args]}
]