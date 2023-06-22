[h:ValidItemsByCreature = json.get(arg(0),"ValidTargets")]
[h:TargetNumber = json.get(arg(0),"TargetNumber")]
[h:TargetingInstances = json.get(arg(0),"TargetingInstances")]
[h,if(TargetingInstances==""): TargetingInstances = 1]

[h:ValidCreatures = json.fields(ValidItemsByCreature)]
[h:SingleTarget = if(TargetNumber==1,1,0)]

[h,if(SingleTarget),CODE:{
    [h:TargetOptions = "[]"]
	[h:AllTargetItems = "[]"]
    [h,foreach(target,ValidCreatures),CODE:{
		[h:thisCreatureItems = json.get(ValidItemsByCreature,target)]
		[h:AllTargetItems = json.merge(AllTargetItems,json.path.put(thisCreatureItems,"[*]","tempHoldingCreature",target))]
        [h,foreach(item,thisCreatureItems): TargetOptions = json.append(TargetOptions,json.get(item,"DisplayName")+" Held By "+getName(target))]
    }]
    [h:TargetOptions = json.append(TargetOptions,"Target Not on List")]

    [h:sameTarget = 1]
    [h:tInput = if(TargetingInstances==1,""," sameTarget | 1 | Use First Target for All Attacks | CHECK ")]
    [h,count(TargetingInstances): tInput = listAppend(tInput," pm.TargetChoice"+roll.count+" | "+TargetOptions+" | Choose a Target"+if(TargetingInstances==1,""," for Target # "+(roll.count+1))+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]
};{
    [h:tInput = " junkVar | ----------- Choose Your Targets ----------- |  | LABEL | SPAN=TRUE "]
    [h,foreach(target,ValidCreatures),CODE:{
        [h,foreach(item,json.get(ValidItemsByCreature,target)): tInput = listAppend(tInput," choice"+target+json.get(item,"ItemID")+" |  | "+json.get(item,"DisplayName")+" Held By "+getName(target)+" | CHECK ","##")]
    }]
}]

[h:abort(input(tInput))]

[h,if(SingleTarget),CODE:{
	[h:ItemsChosenByCreature = "{}"]
	[h,count(TargetingInstances),CODE:{
        [h:tempChoice = eval("pm.TargetChoice"+if(sameTarget,"0",roll.count))]
        [h,if(tempChoice >= json.length(ValidItemsByCreature)):
            ItemsChosenByCreature = json.set(ItemsChosenByCreature,"UnknownTarget",json.append(json.get(ItemsChosenByCreature,"UnknownTarget"),""));
            ItemsChosenByCreature = json.set(ItemsChosenByCreature,json.get(json.get(ValidItemsByCreature,tempChoice),"tempHoldingCreature"),json.append(json.get(ItemsChosenByCreature,"tempHoldingCreature"),json.remove(json.get(ValidItemsByCreature,tempChoice),"tempHoldingCreature")))
        ]
	}]

    [h:macro.return = ItemsChosenByCreature]
};{
    [h:ItemsChosenByCreature = ""]
    [h,foreach(target,ValidCreatures),CODE:{
        [h:thisCreatureItemsChosen = ""]
        [h,foreach(item,json.get(ValidItemsByCreature,target)): thisCreatureItemsChosen = if(eval("choice"+target+json.get(item,"ItemID")),json.append(thisCreatureItemsChosen,item),thisCreatureItemsChosen)]
        [h,if(!json.isEmpty(thisCreatureItemsChosen)): ItemsChosenByCreature = json.set(ItemsChosenByCreature,target,thisCreatureItemsChosen)]
    }]
    [h:macro.return = ItemsChosenByCreature]
}]