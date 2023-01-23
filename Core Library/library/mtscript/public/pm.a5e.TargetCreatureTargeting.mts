[h:validTargets = arg(0)]
[h:targetNum = arg(1)]
[h,if(argCount()>2): separateInstances = arg(2); separateInstances = 1]

[h,switch(getProperty("a5e.stat.TargetingStyle")),CODE:
	case "Impersonate":{
		[h:TargetChoice = pm.a5e.ImpersonatedTargeting(validTargets)]
	};
	case "Input":{
		[h:TargetChoice = pm.a5e.InputTargeting(json.set("","ValidTargets",validTargets,"SingleTarget",if(targetNum==1,1,0),"TargetingInstances",separateInstances))]
	};
	default:{[h:TargetChoice = "[]"]}
]