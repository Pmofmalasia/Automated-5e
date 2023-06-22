[h:pm.ValidTargets = json.get(arg(0),"ValidTargets")]
[h:pm.TargetNumber = json.get(arg(0),"TargetNumber")]
[h:pm.TargetingInstances = json.get(arg(0),"TargetingInstances")]
[h:pm.SingleTarget = if(pm.TargetNumber==1,1,0)]

[h,if(pm.SingleTarget),CODE:{
    [h:pm.TargetOptions = "[]"]
    [h,foreach(target,pm.ValidTargets),CODE:{
        [h:pm.TargetOptions = json.append(pm.TargetOptions,getName(target)+" "+getTokenImage("",target))]
    }]
    [h:pm.TargetOptions = json.append(pm.TargetOptions,"Target Not on List")]

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
        [h,if(pm.TargetChoice0 >= json.length(pm.ValidTargets)):
            return(0,json.append("",""));
            return(0,json.append("",json.get(pm.ValidTargets,pm.TargetChoice0)))
        ]
    };{}]

    [h:allTargets = ""]
    [h,count(pm.TargetingInstances),CODE:{
        [h:tempChoice = eval("pm.TargetChoice"+if(sameTarget,"0",roll.count))]
        [h,if(tempChoice >= json.length(pm.ValidTargets)):
            allTargets = json.append(allTargets,json.append("",""));
            allTargets = json.append(allTargets,json.append("",json.get(pm.ValidTargets,tempChoice)))
        ]
    }]
    [h:macro.return = allTargets]
};{
    [h:pm.TargetsChosen = ""]
    [h,foreach(target,pm.ValidTargets): pm.TargetsChosen = if(eval("choice"+target),json.append(pm.TargetsChosen,target),pm.TargetsChosen)]
    [h:macro.return = pm.TargetsChosen]
}]