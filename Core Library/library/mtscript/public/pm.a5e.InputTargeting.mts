[h:pm.ValidTargets = json.get(arg(0),"ValidTargets")]
[h:pm.SingleTarget = json.get(arg(0),"SingleTarget")]
[h:pm.TargetingInstances = json.get(arg(0),"TargetingInstances")]

[h,if(pm.SingleTarget),CODE:{
    [h:pm.TargetOptions = "[]"]
    [h,foreach(target,pm.ValidTargets),CODE:{
        [h:pm.TargetOptions = json.append(pm.TargetOptions,getName(target)+" "+getTokenImage("",target))]
    }]
    
    [h:sameTarget = 1]
    [h:tInput = if(pm.TargetingInstances==1,""," sameTarget | 1 | Use First Target for All Attacks | CHECK ")]
    [h,count(pm.TargetingInstances): tInput = listAppend(tInput," pm.TargetChoice"+roll.count+" | "+pm.TargetOptions+" | Choose a Target"+if(pm.TargetingInstances==1,""," for Attack # "+(roll.count+1))+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]
};{
    [h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]
    [h,foreach(target,pm.ValidTargets): tInput = listAppend(tInput," choice"+target+" |  | "+getName(target)+" | CHECK ","##")]
}]

[h:abort(input(tInput))]

[h,if(pm.SingleTarget),CODE:{
    [h,if(pm.TargetingInstances==1),CODE:{
        [h:macro.return = json.append("",json.get(pm.ValidTargets,pm.TargetChoice))]
    };{
        [h:allTargets = ""]
        [h,count(pm.TargetingInstances): allTargets = json.append(allTargets,json.append("",json.get(pm.ValidTargets,eval("pm.TargetChoice"+if(sameTarget,"0",roll.count)))))]
    }]    
};{
    [h:pm.TargetsChosen = ""]
    [h,foreach(target,pm.ValidTargets): pm.TargetsChosen = if(eval("choice"+target),json.append(pm.TargetsChosen,target),pm.TargetsChosen)]
    [h:macro.return = pm.TargetsChosen]
}]