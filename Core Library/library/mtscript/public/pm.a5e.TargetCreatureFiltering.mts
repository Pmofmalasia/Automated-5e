[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]
[h:pm.TargetNum = json.get(arg(0),"Number")]
[h:pm.TargetAllegiance = if(json.get(arg(0),"Allegiance")=="",json.set("","Any",1),json.get(arg(0),"Allegiance"))]
[h:pm.TargetOrigin = json.get(arg(0),"Origin")]
[h:pm.RangeNum = json.get(json.get(arg(0),"Range"),"Value")]
[h:pm.RangeUnits = pm.StandardRange(json.get(json.get(arg(0),"Range"),"Units"))]
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

[h,switch(pm.RangeNumFinal):
	case "": pm.TargetsInRange = "[]";
	case "Unlimited": pm.TargetsInRange = getTokens("json");
	default: pm.TargetsInRange = getTokens("json",json.set("","range",json.set("","token",pm.TargetOrigin,"upto",pm.RangeNumFinal,"distancePerCell",1)))
]
[h:"<!-- Return self without going through targeting input ONLY if the ability is ALWAYS incapable of targeting anything other than self. -->"]
[h,if(json.get(pm.TargetAllegiance,"Self")==1 || json.get(pm.TargetAllegiance,"Any")==1),CODE:{
	[h:pm.TargetSelf = 1]
	[h:pm.TargetsInRange = json.append(pm.TargetsInRange,ParentToken)]
	[h:pm.TargetAllegiance = json.remove(pm.TargetAllegiance,"Self")]

	[h:pm.SelfOnlyTest = 1]
	[h,foreach(allegianceType,json.fields(pm.TargetAllegiance)): pm.SelfOnlyTest = if(json.get(pm.TargetAllegiance,allegianceType)==1,0,pm.SelfOnlyTest)]
	[h:return(!pm.SelfOnlyTest,json.append("",ParentToken))]
};{
	[h:pm.TargetSelf = 0]
}]

[h:pm.ValidTargets = "[]"]
[h,foreach(target,pm.TargetsInRange),CODE:{
	[h,if(json.get(pm.TargetAllegiance,"Any")==1 || json.get(pm.TargetAllegiance,"NotSelf")==1),CODE:{
		[h,if(json.get(pm.TargetAllegiance,"NotSelf")==1 && json.get(pm.TargetAllegiance,"Any")!=1): pm.AllegianceTest = target != ParentToken; pm.AllegianceTest = 1]
	};{
		[h:pm.AllegianceTest = 0]
		[h,if(json.get(pm.TargetAllegiance,"Neutral")==1): pm.AllegianceTest = if(getProperty("whichTeam",target) == 0,1,pm.AllegianceTest)]
		[h,if(json.get(pm.TargetAllegiance,"Ally")==1): pm.AllegianceTest = if(getProperty("whichTeam",target) == getProperty("whichTeam"),1,pm.AllegianceTest)]
		[h,if(json.get(pm.TargetAllegiance,"Foe")==1): pm.AllegianceTest = if(and(getProperty("whichTeam",target) != getProperty("whichTeam"),getProperty("whichTeam",target) != 0),1,pm.AllegianceTest)]
	}]
	
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
		pm.SizeTest = if(pm.a5e.CompareSizes(pm.TargetSizeMax,getSize(target)) < 0, 0, pm.SizeTest)
	]
	
	[h,if(pm.TargetSizeMin != ""):
		pm.SizeTest = if(pm.a5e.CompareSizes(pm.TargetSizeMin,getSize(target)) > 0, 0, pm.SizeTest)
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
   
	[h:pm.ValidTargets = if(and(pm.AllegianceTest,pm.TypeTest,pm.SubtypeTest,pm.IntTest,pm.SelfTest,pm.SizeTest),json.append(pm.ValidTargets,target),pm.ValidTargets)]
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