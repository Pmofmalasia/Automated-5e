[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]
[h:ProvidedList = json.get(arg(0),"List")]
[h:pm.TargetOrigin = json.get(arg(0),"Origin")]
[h,if(pm.TargetOrigin == ""): pm.TargetOrigin = ParentToken]
[h:rangeData = json.get(arg(0),"Range")]

[h,if(json.type(rangeData)=="OBJECT"),CODE:{
	[h:pm.RangeNum = json.get(json.get(arg(0),"Range"),"Value")]
	[h:pm.RangeUnits = pm.StandardRange(json.get(json.get(arg(0),"Range"),"Units"))]
};{
	[h:pm.RangeNum = rangeData]
	[h:pm.RangeUnits = ""]
}]
[h,switch(pm.RangeNum):
	case "Unlimited": pm.RangeNumFinal = "Unlimited";
	case "": pm.RangeNumFinal = "";
	default: pm.RangeNumFinal = if(pm.RangeUnits=="Other","",if(pm.RangeUnits=="Miles",pm.RangeNum*5280,pm.RangeNum))
]

[h:pm.AoEInfo = json.get(arg(0),"AoE")]
[h:pm.MultiTargetRange = json.get(arg(0),"MultiTargetRange")]

[h,if(json.type(pm.AoEInfo)=="OBJECT"),CODE:{
	[h:pm.AoEShape = json.get(pm.AoEInfo,"Shape")]
	[h:pm.AoENumber = if(json.get(pm.AoEInfo,"Number")=="",1,json.get(pm.AoEInfo,"Number"))]
	[h:pm.AoESize = if(json.get(pm.AoEInfo,"Size")=="",0,json.get(pm.AoEInfo,"Size"))]
	[h:pm.AoEUnits = json.get(pm.AoEInfo,"Units")]
	[h:pm.AoESize2 = if(json.get(pm.AoEInfo,"Size2")=="",0,json.get(pm.AoEInfo,"Size2"))]
	[h:pm.AoEUnits2 = json.get(pm.AoEInfo,"Units2")]
};{
	[h:pm.AoEShape = ""]
	[h:pm.AoENumber = 0]
	[h:pm.AoESize = 0]
	[h:pm.AoEUnits = ""]
	[h:pm.AoESize2 = 0]
	[h:pm.AoEUnits2 = ""]
}]

[h:targetFilteringData = arg(1)]
[h:pm.TargetAllegiance = if(json.get(targetFilteringData,"Allegiance")=="",json.set("","Any",1),json.get(targetFilteringData,"Allegiance"))]

[h,if(ProvidedList == ""),CODE:{
	[h,switch(pm.RangeNumFinal):
		case "": pm.TargetsInRange = "[]";
		case "Unlimited": pm.TargetsInRange = getTokens("json",json.set("","propertyType","A5ECreature"));
		default: pm.TargetsInRange = getTokens("json",json.set("","propertyType","A5ECreature","range",json.set("","token",pm.TargetOrigin,"upto",pm.RangeNumFinal,"distancePerCell",1)))
	]
};{
	[h,if(pm.RangeNumFinal != "" && pm.RangeNumFinal != "Unlimited"),CODE:{
		[h:pm.TargetsInRange = "[]"]
		[h,foreach(tempTarget,ProvidedList): pm.TargetsInRange = if(getDistance(tempTarget,1,pm.TargetOrigin) <= pm.RangeNumFinal,json.append(pm.TargetsInRange,tempTarget),pm.TargetsInRange)]
	};{
		[h:pm.TargetsInRange = ProvidedList]
	}]
}]

[h,if(json.get(pm.TargetAllegiance,"Self")==1 || json.get(pm.TargetAllegiance,"Any")==1),CODE:{
	[h,if(ProvidedList == ""),CODE:{
		[h:pm.TargetSelf = 1]
		[h:pm.TargetsInRange = json.append(pm.TargetsInRange,ParentToken)]
		[h:pm.TargetAllegiance = json.remove(pm.TargetAllegiance,"Self")]

		[h:pm.SelfOnlyTest = 1]
		[h,foreach(allegianceType,json.fields(pm.TargetAllegiance)): pm.SelfOnlyTest = if(json.get(pm.TargetAllegiance,allegianceType)==1,0,pm.SelfOnlyTest)]
		[h:return(!pm.SelfOnlyTest,json.set("","ValidTargets",json.append("",ParentToken),"SelfOnly",1))]		
	}]

};{
	[h:pm.TargetSelf = 0]
}]
   
[h:"<!-- TODO: May want to include options for which prereqs to apply now and which to apply after targeting, to allow things to fizzle (e.g. things the user might not know, like creature type). Would allow these to be changed based on user preference in settings. Maybe include a 'deferredPrereqs' key or something. -->"]
[h:pm.ValidTargets = "[]"]
[h,foreach(target,pm.TargetsInRange),CODE:{
	[h:isTargetValid = pm.a5e.CreaturePrereqs(target,targetFilteringData,ParentToken)]
	[h,if(isTargetValid): pm.ValidTargets = json.append(pm.ValidTargets,target)]
}]

[h:macro.return = json.set("","ValidTargets",pm.ValidTargets,"SelfOnly",0)]