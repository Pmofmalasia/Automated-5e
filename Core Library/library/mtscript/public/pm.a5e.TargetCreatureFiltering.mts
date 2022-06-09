[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]
[h:pm.TargetNum = json.get(arg(0),"Number")]
[h:pm.TargetAllyFoe = json.get(arg(0),"AllyFoe")]
[h:pm.TargetSelf = json.get(arg(0),"Self")]
[h:pm.TargetOrigin = json.get(arg(0),"Origin")]
[h:pm.RangeNum = json.get(json.get(arg(0),"Range"),"Value")]
[h:pm.RangeUnits = pm.StandardRange(json.get(json.get(arg(0),"Range"),"Units"))]
[h:pm.RangeNumFinal = if(pm.RangeUnits=="Other","",if(pm.RangeUnits=="Miles",pm.RangeNum*5280,pm.RangeNum))]
[h:pm.AoEInfo = json.get(arg(0),"AoE")]
[h:pm.MultiTargetRange = json.get(arg(0),"MultiTargetRange")]

[h,if(json.type(pm.AoEInfo)=="OBJECT"),CODE:{
	[h:pm.AoEShape = if(json.get(pm.AoEInfo,"Shape")]
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

[h:pm.TargetSize = json.get(arg(1),"Size")]
[h:pm.TargetSizeMax = json.get(arg(1),"SizeMax")]
[h:pm.TargetSizeMin = json.get(arg(1),"SizeMin")]
[h:pm.TargetTypeInclusive = json.get(arg(1),"TypeInclusive")]
[h:pm.TargetSubtypeInclusive = json.get(arg(1),"SubtypeInclusive")]
[h:pm.TargetTypeExclusive = json.get(arg(1),"TypeExclusive")]
[h:pm.TargetSubtypeExclusive = json.get(arg(1),"SubtypeExclusive")]
[h:pm.TargetSight = if(json.get(arg(1),"Sight")=="",0,json.get(arg(1),"Sight"))]
[h:pm.TargetHearing = if(json.get(arg(1),"Hearing")=="",0,json.get(arg(1),"Hearing"))]
[h:pm.TargetUnderstand = if(json.get(arg(1),"Understand")=="",0,json.get(arg(1),"Understand"))]
[h:pm.TargetIntMin = if(json.get(arg(1),"IntMin")=="",0,json.get(arg(1),"IntMin"))]
[h:pm.TargetIntMax = if(json.get(arg(1),"IntMax")=="",999999,json.get(arg(1),"IntMax"))]

[h:pm.TargetsInRange = getTokens("json",json.set("","range",json.set("","token",pm.TargetOrigin,"upto",pm.RangeNumFinal,"distancePerCell",1)))]
[h,if(pm.TargetSelf!=0): pm.TargetsInRange = json.append(pm.TargetsInRange,ParentToken)]
[h:pm.ValidTargets = "[]"]

[h,foreach(target,pm.TargetsInRange),CODE:{
	[h,switch(pm.TargetAllyFoe):
		case "Ally": pm.AllyFoeTest = (getProperty("whichTeam") == getProperty("whichTeam",target));
		case "Foe": pm.AllyFoeTest = (getProperty("whichTeam") != getProperty("whichTeam",target));
		case "Any": pm.AllyFoeTest = 1;
		default: pm.AllyFoeTest = 1
	]
	
	[h,switch(pm.TargetSelf):
		case 1: pm.SelfTest = (target==currentToken());
		case 0: pm.SelfTest = (target!=currentToken());
		default: pm.SelfTest = 1
	]
	
	[h,if(json.type(pm.TargetSize) == "UNKNOWN"):
		pm.SizeTest = if(or(pm.TargetSize=="",pm.TargetSize==getSize(target)),1,0);
		pm.SizeTest = json.contains(pm.SizeTest,getSize(target))
	]
	
	[h,if(pm.TargetSizeMax != ""):
		pm.SizeTest = if(pm.a5e.CompareSizes(pm.TargetSizeMax,getSize(target)) > 0, 0, pm.SizeTest)
	]
	
	[h,if(pm.TargetSizeMin != ""):
		pm.SizeTest = if(pm.a5e.CompareSizes(pm.TargetSizeMin,getSize(target)) < 0, 0, pm.SizeTest)
	]
	
	[h,if(json.type(pm.TargetTypeInclusive) == "UNKNOWN"):
		pm.TypeTest = if(or(pm.TargetTypeInclusive==getProperty("CreatureType",target),pm.TargetTypeInclusive=="Any",pm.TargetTypeInclusive==""),1,0);
		pm.TypeTest = if(json.contains(pm.TargetTypeInclusive,getProperty("CreatureType",target)),1,0)
	]
	
	[h,if(json.type(pm.TargetSubtypeInclusive) == "UNKNOWN"):
		pm.SubtypeTest = if(or(pm.TargetSubtypeInclusive==getProperty("Race",target),pm.TargetSubtypeInclusive=="Any",pm.TargetSubtypeInclusive==""),1,0);
		pm.SubtypeTest = if(json.contains(pm.TargetSubtypeInclusive,pm.RemoveSpecial(getProperty("Race",target))),1,0)
	]
	 
	[h,if(json.type(pm.TargetTypeExclusive) == "UNKNOWN"):
		pm.TypeTest = if(or(pm.TargetTypeExclusive!=getProperty("CreatureType",target),pm.TargetTypeExclusive==""),pm.TypeTest,0);
		pm.TypeTest = if(json.contains(pm.TargetTypeExclusive,getProperty("CreatureType",target)),0,pm.TypeTest)
	]
	
	[h,if(json.type(pm.TargetSubtypeExclusive) == "UNKNOWN"):
		pm.SubtypeTest = if(or(pm.TargetSubtypeExclusive!=getProperty("Race",target),pm.TargetSubtypeExclusive==""),pm.SubtypeTest,0);
		pm.SubtypeTest = if(json.contains(pm.TargetSubtypeExclusive,pm.RemoveSpecial(getProperty("Race",target))),0,pm.SubtypeTest)
	]
	 
	[h:pm.IntTest = if(and(json.get(getProperty("Attributes",target),"Intelligence")>pm.TargetIntMin,json.get(getProperty("Attributes",target),"Intelligence")<pm.TargetIntMax),1,0)]
   
	[h:pm.ValidTargets = if(and(pm.AllyFoeTest,pm.TypeTest,pm.SubtypeTest,pm.IntTest,pm.SelfTest),json.append(pm.ValidTargets,target),pm.ValidTargets)]
}]

[h,switch(getProperty("TargetingStyle")),CODE:
	case "Impersonate":{
		[h:TargetChoice = pm.a5e.ImpersonatedTargeting(pm.ValidTargets)]
	};
	case "Input":{
		[h:TargetChoice = pm.a5e.InputTargeting(json.set("","ValidTargets",pm.ValidTargets,"SingleTarget",if(pm.TargetNum==1,1,0)))]
	};
	default:{[h:TargetChoice = "[]"]}
]

[h:macro.return = TargetChoice]