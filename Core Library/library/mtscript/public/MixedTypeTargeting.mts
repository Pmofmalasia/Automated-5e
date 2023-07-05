[h:MixedTypeTargets = json.get(macro.args,"ValidTargets")]
[h:TargetNumber = json.get(macro.args,"TargetNumber")]
[h:TargetingInstances = json.get(macro.args,"TargetingInstances")]
[h,if(TargetingInstances==""): TargetingInstances = 1]
[h:SingleTarget = if(TargetNumber==1,1,0)]

[h:PriorTargetOptionArray = json.get(MixedTypeTargets,"PriorTargets")]
[h:CreatureTargetOptionArray = json.get(MixedTypeTargets,"Creature")]
[h:ObjectTargetOptionArray = json.get(MixedTypeTargets,"Object")]
[h:EffectTargetOptionArray = json.get(MixedTypeTargets,"Effect")]

[h:PriorTargetOptionNumber = json.length(PriorTargetOptionArray)]
[h:CreatureTargetOptionNumber = json.length(CreatureTargetOptionArray)]
[h:ObjectTargetOptionNumber = json.length(ObjectTargetOptionArray)]
[h:EffectTargetOptionNumber = json.length(EffectTargetOptionArray)]

[h:"<!-- TODO: Incorporate PriorTargets and Effects somehow (though less likely to be needed?). Will also need to add to multiselection resolution as well. Main issue with PriorTargets is distinguishing held object from effect (both stored as objects). Creature vs. object token should be easier since they're strings and it doesn't matter as much. -->"]
[h,if(SingleTarget),CODE:{
    [h:TargetOptions = "[]"]

    [h,foreach(target,CreatureTargetOptionArray): TargetOptions = json.append(TargetOptions,getName(target)+" "+getTokenImage("",target))]

    [h,foreach(object,ObjectTargetOptionArray),CODE:{
		[h:"<!-- Strings represent TokenIDs for objects on the map. -->"]
		[h,if(json.type(object) == "OBJECT"):
			TargetOptions = json.append(TargetOptions,getName(json.get(object,"HeldBy"))+"'s "+json.get(object,"DisplayName"));
			TargetOptions = json.append(TargetOptions,getName(object)+" "+getTokenImage("",object))
		]
	}]

    [h:TargetOptions = json.append(TargetOptions,"Target Not on List")]

    [h:sameTarget = 1]
    [h:tInput = if(TargetingInstances==1,""," sameTarget | 1 | Use First Target for All Attacks | CHECK ")]
    [h,count(TargetingInstances): tInput = listAppend(tInput," TargetChoice"+roll.count+" | "+TargetOptions+" | Choose a Target"+if(TargetingInstances==1,""," for Target # "+(roll.count+1))+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]
};{
    [h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]

	[h,foreach(target,CreatureTargetOptionArray): tInput = listAppend(tInput," choice"+target+" |  | "+getName(target)+" | CHECK ","##")]

    [h,foreach(item,ObjectTargetOptionArray): tInput = listAppend(tInput," choice"+json.get(item,"HeldBy")+json.get(item,"ItemID")+" |  | "+getName(json.get(item,"HeldBy"))+"'s "+json.get(item,"DisplayName")+" | CHECK ","##")]
}]

[h:abort(input(tInput))]

[h,if(SingleTarget),CODE:{
	[h:FinalTargetsChosen = "[]"]
	[h,count(TargetingInstances),CODE:{
		[h:TargetType = ""]
		[h:CumulativeTargetNum = PriorTargetOptionNumber]
		[h,if(eval("TargetChoice"+roll.count) < CumulativeTargetNum && TargetType == ""): TargetType = "PriorTarget"]
		[h:CumulativeTargetNum = CumulativeTargetNum + CreatureTargetOptionNumber]
		[h,if(eval("TargetChoice"+roll.count) < CumulativeTargetNum && TargetType == ""): TargetType = "Creature"]
		[h:CumulativeTargetNum = CumulativeTargetNum + ObjectTargetOptionNumber]
		[h,if(eval("TargetChoice"+roll.count) < CumulativeTargetNum && TargetType == ""): TargetType = "Object"]
		[h:CumulativeTargetNum = CumulativeTargetNum + EffectTargetOptionNumber]
		[h,if(eval("TargetChoice"+roll.count) < CumulativeTargetNum && TargetType == ""): TargetType = "Effect"]

		[h,switch(TargetType):
			case "PriorTarget": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(PriorTargetOptionArray,eval("TargetChoice"+roll.count))));
			case "Creature": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(CreatureTargetOptionArray,eval("TargetChoice"+roll.count))));
			case "Object": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(ObjectTargetOptionArray,eval("TargetChoice"+roll.count))));
			case "Effect": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",json.get(EffectTargetOptionArray,eval("TargetChoice"+roll.count))));
			case "": FinalTargetsChosen = json.append(FinalTargetsChosen,json.append("",""))
		]		
	}]

    [h:return(0,FinalTargetsChosen)]
};{
    [h:FinalTargetsChosen = "[]"]

    [h,foreach(target,CreatureTargetOptionArray): FinalTargetsChosen = if(eval("choice"+target),json.append(FinalTargetsChosen,target),FinalTargetsChosen)]

    [h,foreach(item,ObjectTargetOptionArray): FinalTargetsChosen = if(eval("choice"+json.get(item,"HeldBy")+json.get(item,"ItemID")),json.append(FinalTargetsChosen,item),FinalTargetsChosen)]

    [h:return(0,FinalTargetsChosen)]
}]