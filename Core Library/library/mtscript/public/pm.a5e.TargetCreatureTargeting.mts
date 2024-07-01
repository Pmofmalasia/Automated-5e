[h:validTargets = json.get(arg(0),"ValidTargets")]
[h:targetNum = json.get(arg(0),"TargetNumber")]
[h,if(argCount()>1): separateInstances = arg(1); separateInstances = 1]
[h:"<!-- Note: In the future, a blank string for targetNum will be considered unlimited. -->"]

[h,switch(getProperty("a5e.stat.TargetingStyle")),CODE:
	case "Impersonate":{
		[h:TargetChoice = pm.a5e.ImpersonatedTargeting(validTargets)]
	};
	case "Input":{
		[h:TargetChoice = pm.a5e.InputTargeting(json.set(arg(0),"TargetingInstances",separateInstances))]
	};
	default:{[h:TargetChoice = "[]"]}
]