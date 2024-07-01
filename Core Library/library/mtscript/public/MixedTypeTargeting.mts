[h:AllTargetingData = macro.args]
[h:MixedTypeTargets = json.get(AllTargetingData,"ValidTargets")]
[h:TargetNumber = json.get(AllTargetingData,"TargetNumber")]
[h:TargetingInstances = json.get(AllTargetingData,"TargetingInstances")]
[h:ParentToken = json.get(AllTargetingData,"ParentToken")]
[h:targetingOrigin = json.get(AllTargetingData,"Origin")]
[h:isGMAdjustTarget = json.contains(AllTargetingData,"isGMAdjustTarget")]
[h,if(TargetingInstances==""): TargetingInstances = 1]
[h:SingleTarget = if(TargetNumber==1,1,0)]

[h:PriorTargetOptionArray = json.get(MixedTypeTargets,"PriorTargets")]
[h:CreatureTargetOptionArray = json.get(MixedTypeTargets,"Creature")]
[h:ObjectTargetOptionArray = json.get(MixedTypeTargets,"Object")]
[h:EffectTargetOptionArray = json.get(MixedTypeTargets,"Effect")]

[h:"<!-- TODO: Incorporate PriorTargets and Effects somehow (though less likely to be needed?). Will also need to add to multiselection resolution as well. Main issue with PriorTargets is distinguishing held object from effect (both stored as objects). Creature vs. object token should be easier since they're strings and it doesn't matter as much. -->"]
[h,if(SingleTarget),CODE:{
    [h:TargetOptions = "[]"]
	[h:PriorTargetOptionNumber = json.length(PriorTargetOptionArray)]
	[h:CreatureTargetOptionNumber = 0]
	[h:ObjectTargetOptionNumber = 0]
	[h:EffectTargetOptionNumber = json.length(EffectTargetOptionArray)]

    [h,foreach(target,CreatureTargetOptionArray),CODE:{
		[h:AmountTargetIsVisible = canSeeToken(target,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest || isGMAdjustTarget): TargetOptions = json.append(TargetOptions,getName(target)+" "+getTokenImage("",target))]
		[h,if(CanSeeTest || isGMAdjustTarget): CreatureTargetOptionNumber = CreatureTargetOptionNumber + 1]
	}] 

    [h,foreach(object,ObjectTargetOptionArray),CODE:{
		[h:"<!-- Strings represent TokenIDs for objects on the map. -->"]
		[h,if(json.type(object) == "OBJECT"):
			thisTargetToken = json.get(object,"HeldBy");
			thisTargetToken = object
		]
		[h,if(json.type(object) == "OBJECT"):
			thisTargetDisplay = getName(thisTargetToken)+"'s "+json.get(object,"DisplayName");
			thisTargetDisplay = getName(thisTargetToken)+" "+getTokenImage("",thisTargetToken)
		]

		[h:AmountTargetIsVisible = canSeeToken(thisTargetToken,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest || isGMAdjustTarget): json.append(TargetOptions,thisTargetDisplay)]
		[h,if(CanSeeTest || isGMAdjustTarget): ObjectTargetOptionNumber = ObjectTargetOptionNumber + 1]
	}]

    [h,if(isGMAdjustTarget):
		TargetOptions = json.append(TargetOptions,"No Target");
		TargetOptions = json.append(TargetOptions,"Target Not on List")
	]

    [h:sameTarget = 1]
    [h:tInput = if(TargetingInstances==1,""," sameTarget | 0 | Use First Target for All Attacks | CHECK ")]
    [h,count(TargetingInstances): tInput = listAppend(tInput," TargetChoice"+roll.count+" | "+TargetOptions+" | Choose a Target"+if(TargetingInstances==1,""," for Target # "+(roll.count+1))+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]
};{
    [h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]

	[h:finalCreatureTargetOptions = "[]"]
	[h,foreach(target,CreatureTargetOptionArray),CODE:{
		[h:AmountTargetIsVisible = canSeeToken(target,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest || isGMAdjustTarget): tInput = listAppend(tInput," choice"+target+" |  | "+getName(target)+" | CHECK ","##")]
		[h,if(CanSeeTest || isGMAdjustTarget): finalCreatureTargetOptions = json.append(finalCreatureTargetOptions,target)]
	}]

	[h:finalObjectTargetOptions = "[]"]
    [h,foreach(object,ObjectTargetOptionArray),CODE:{
		[h,if(json.type(object) == "OBJECT"):
			thisTargetToken = json.get(object,"HeldBy");
			thisTargetToken = object
		]
		[h,if(json.type(object) == "OBJECT"):
			thisTargetDisplay = getName(thisTargetToken)+"'s "+json.get(object,"DisplayName");
			thisTargetDisplay = getName(thisTargetToken)+" "+getTokenImage("",thisTargetToken)
		]
		[h,if(json.type(object) == "OBJECT"):
			thisTargetVarName = thisTargetToken+json.get(object,"ItemID");
			thisTargetVarName = thisTargetToken
		]
	
		[h:AmountTargetIsVisible = canSeeToken(thisTargetToken,targetingOrigin)]
		[h:CanSeeTest = !json.isEmpty(AmountTargetIsVisible)]
		[h,if(CanSeeTest || isGMAdjustTarget): tInput = listAppend(tInput," choice"+thisTargetVarName+" |  | "+thisTargetDisplay+" | CHECK ","##")]
		[h,if(CanSeeTest || isGMAdjustTarget): finalObjectTargetOptions = json.append(finalCreatureTargetOptions,object)]
	}]

	[h,if(!isGMAdjustTarget): tInput = listAppend(tInput," choiceUnseen |  | Target(s) Not on List | CHECK ","##")]
}]

[h:abort(input(tInput))]

[h,if(SingleTarget),CODE:{
	[h:FinalTargetsChosen = "[]"]

	[h,count(TargetingInstances),CODE:{
		[h:TargetType = ""]
		[h,if(sameTarget):
			thisTargetChoice = TargetChoice0;
			thisTargetChoice = eval("TargetChoice"+roll.count)
		]
		[h:CumulativeTargetNum = PriorTargetOptionNumber]
		[h,if(thisTargetChoice < CumulativeTargetNum && TargetType == ""): TargetType = "PriorTarget"]
		[h:CumulativeTargetNum = CumulativeTargetNum + CreatureTargetOptionNumber]
		[h,if(thisTargetChoice < CumulativeTargetNum && TargetType == ""): TargetType = "Creature"]
		[h:CumulativeTargetNum = CumulativeTargetNum + ObjectTargetOptionNumber]
		[h,if(thisTargetChoice < CumulativeTargetNum && TargetType == ""): TargetType = "Object"]
		[h:CumulativeTargetNum = CumulativeTargetNum + EffectTargetOptionNumber]
		[h,if(thisTargetChoice < CumulativeTargetNum && TargetType == ""): TargetType = "Effect"]
	
		[h:noTargetTest = 0]
		[h,switch(TargetType):
			case "PriorTarget": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(PriorTargetOptionArray,thisTargetChoice)));
			case "Creature": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(CreatureTargetOptionArray,thisTargetChoice)));
			case "Object": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(ObjectTargetOptionArray,thisTargetChoice)));
			case "Effect": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(EffectTargetOptionArray,thisTargetChoice)));
			case "": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",if(isGMAdjustTarget,"","x")))
		]
	}]

	[h:instanceCount = 0]
	[h,foreach(instance,FinalTargetsChosen),if(json.contains(instance,"x")),CODE:{
		[h,macro("GMSelectTargeting@Lib:pm.a5e.Core"): json.set(AllTargetingData,"isGMAdjustTarget",1)]
		[h:newTarget = macro.return]
		[h,if(json.isEmpty(newTarget)):
			newTarget = json.append("","");
			newTarget = json.get(newTarget,0)
		]
		[h:FinalTargetsChosen = json.set(FinalTargetsChosen,instanceCount,newTarget)]
		[h:instanceCount = instanceCount + 1]
	}]

    [h:return(0,FinalTargetsChosen)]
};{
    [h:FinalTargetsChosen = "[]"]

    [h,foreach(target,finalCreatureTargetOptions): FinalTargetsChosen = if(eval("choice"+target),json.append(FinalTargetsChosen,target),FinalTargetsChosen)]

    [h,foreach(object,finalObjectTargetOptions),CODE:{
		[h,if(json.type(object) == "OBJECT"):
			thisTargetVarName = json.get(object,"HeldBy")+json.get(object,"ItemID");
			thisTargetVarName = object
		]
		[h:FinalTargetsChosen = if(eval("choice"+thisTargetVarName),json.append(FinalTargetsChosen,item),FinalTargetsChosen)]
	}]

	[h,if(choiceUnseen),CODE:{
		[h,MACRO("GMSelectTargeting@Lib:pm.a5e.Core"): json.set(AllTargetingData,"isGMAdjustTarget",1)]
		[h:FinalTargetsChosen = json.unique(json.merge(FinalTargetsChosen,macro.return))]
	}]

    [h:return(0,FinalTargetsChosen)]
}]