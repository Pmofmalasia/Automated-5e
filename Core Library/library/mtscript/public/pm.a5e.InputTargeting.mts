[h:pm.ValidTargets = json.get(arg(0),"ValidTargets")]
[h:pm.SingleTarget = json.get(arg(0),"SingleTarget")]

[h,if(pm.SingleTarget),CODE:{
    [h:pm.TargetOptions = "[]"]
    [h,foreach(target,pm.ValidTargets),CODE:{
        [h:pm.TargetOptions = json.append(pm.TargetOptions,getName(target)+" "+getTokenImage("",target))]
    }]
    
    [h:tInput = " pm.TargetChoice | "+pm.TargetOptions+" | Choose a Target | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "]
};{
    [h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]
    [h,foreach(target,pm.ValidTargets): tInput = listAppend(tInput," choice"+target+" |  | "+getName(target)+" | CHECK ","##")]
}]

[h:abort(input(tInput))]

[h,if(pm.SingleTarget),CODE:{
    [h:macro.return = json.append("",json.get(pm.ValidTargets,pm.TargetChoice))]
};{
    [h:pm.TargetsChosen = ""]
    [h,foreach(target,pm.ValidTargets): pm.TargetsChosen = if(eval("choice"+target),json.append(pm.TargetsChosen,target),pm.TargetsChosen)]
    [h:macro.return = pm.TargetsChosen]
}]