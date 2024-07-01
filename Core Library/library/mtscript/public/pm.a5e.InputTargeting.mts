[h:AllTargetingData = arg(0)]
[h:pm.ValidTargets = json.get(AllTargetingData,"ValidTargets")]
[h:pm.TargetNumber = json.get(AllTargetingData,"TargetNumber")]
[h:pm.TargetingInstances = json.get(AllTargetingData,"TargetingInstances")]
[h:ParentToken = json.get(AllTargetingData,"ParentToken")]
[h:targetingOrigin = json.get(AllTargetingData,"Origin")]
[h:pm.SingleTarget = if(pm.TargetNumber==1,1,0)]

[h:finalValidTargets = "[]"]
[h,if(pm.SingleTarget),CODE:{
	[h:pm.TargetOptions = "[]"]
	[h,foreach(target,pm.ValidTargets),CODE:{
		[h:AmountTargetIsVisible = canSeeToken(target,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest): pm.TargetOptions = json.append(pm.TargetOptions,getName(target)+" "+getTokenImage("",target))]
		[h,if(CanSeeTest): finalValidTargets = json.append(finalValidTargets,target)]
	}]
	[h,if(!isGMAdjustTarget): 
		pm.TargetOptions = json.append(pm.TargetOptions,"No Target");
		pm.TargetOptions = json.append(pm.TargetOptions,"Target Not on List")
	]

	[h:sameTarget = 1]
	[h:tInput = if(pm.TargetingInstances==1,""," sameTarget | 1 | Use First Target for All Attacks | CHECK ")]
	[h,count(pm.TargetingInstances),CODE:{
		[h:tInput = listAppend(tInput," pm.TargetChoice"+roll.count+" | "+pm.TargetOptions+" | Choose a Target"+if(pm.TargetingInstances==1,""," for Attack # "+(roll.count+1))+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]
	}]
};{
	[h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]
	[h,foreach(target,pm.ValidTargets),CODE:{
		[h:AmountTargetIsVisible = canSeeToken(target,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest): tInput = listAppend(tInput," choice"+target+" |  | "+getName(target)+" | CHECK ","##")]
		[h,if(CanSeeTest): finalValidTargets = json.append(finalValidTargets,target)]
	}]

	[h,if(!isGMAdjustTarget): tInput = listAppend(tInput," choiceUnseen |  | Target(s) Not on List | CHECK ","##")]
}]

[h:abort(input(tInput))]

[h,if(pm.SingleTarget),CODE:{
	[h:allTargets = ""]
	[h,count(pm.TargetingInstances),CODE:{
		[h:tempChoice = eval("pm.TargetChoice"+if(sameTarget,"0",roll.count))]
		[h,if(tempChoice >= json.length(finalValidTargets)):
			allTargets = json.append(allTargets,json.append("",if(isGMAdjustTarget,"","x")));
			allTargets = json.append(allTargets,json.append("",json.get(finalValidTargets,tempChoice)))
		]
	}]

	[h:instanceCount = 0]
	[h,foreach(instance,allTargets),if(json.contains(instance,"x")),CODE:{
		[h,macro("GMSelectTargeting@Lib:pm.a5e.Core"): json.set(AllTargetingData,
			"ValidTargets",json.set("","Creature",pm.ValidTargets),
			"isGMAdjustTarget",1
		)]
		[h:newTarget = macro.return]
		[h,if(json.isEmpty(newTarget)):
			newTarget = json.append("","");
			newTarget = json.get(newTarget,0)
		]
		[h:allTargets = json.set(allTargets,instanceCount,newTarget)]
		[h:instanceCount = instanceCount + 1]
	}]

	[h:return(0,allTargets)]
};{
	[h:pm.TargetsChosen = "[]"]
	[h,foreach(target,finalValidTargets): pm.TargetsChosen = if(eval("choice"+target),json.append(pm.TargetsChosen,target),pm.TargetsChosen)]

	[h,if(choiceUnseen),CODE:{
		[h,MACRO("GMSelectTargeting@Lib:pm.a5e.Core"): json.set(AllTargetingData,
			"ValidTargets",json.set("","Creature",pm.ValidTargets),
			"isGMAdjustTarget",1
		)]
		[h:pm.TargetsChosen = json.unique(json.merge(pm.TargetsChosen,macro.return))]
	}]

	[h:return(0,pm.TargetsChosen)]
}]