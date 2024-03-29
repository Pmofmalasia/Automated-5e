[h:validTargets = arg(0)]
[h:targetNum = arg(1)]
[h,if(argCount()>2): separateInstances = arg(2); separateInstances = 1]
[h:"<!-- Note: In the future, a blank string for targetNum will be considered unlimited. -->"]

[h,switch(getProperty("a5e.stat.TargetingStyle")),CODE:
	case "Impersonate":{
		[h:TargetChoice = pm.a5e.ImpersonatedTargeting(validTargets)]
	};
	case "Input":{
		[h:TargetChoice = pm.a5e.InputTargeting(json.set("","ValidTargets",validTargets,"TargetNumber",targetNum,"TargetingInstances",separateInstances))]
	};
	default:{[h:TargetChoice = "[]"]}
]