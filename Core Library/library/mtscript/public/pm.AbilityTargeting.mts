[h:pm.Ability = json.get(arg(0),"Name")]
[h:pm.Class = json.get(arg(0),"Class")]
[h:pm.Subclass = json.get(arg(0),"Subclass")]

[h:pm.TargetNum = json.get(arg(1),"Number")]
[h:pm.TargetAllyFoe = json.get(arg(1),"AllyFoe")]
[h:pm.TargetType = json.get(arg(1),"Type")]
[h:pm.TargetSubtype = json.get(arg(1),"Subtype")]
[h:pm.TargetSight = if(json.get(arg(1),"Sight")=="",0,json.get(arg(1),"Sight"))]
[h:pm.TargetHearing = if(json.get(arg(1),"Hearing")=="",0,json.get(arg(1),"Hearing"))]
[h:pm.TargetUnderstand = if(json.get(arg(1),"Understand")=="",0,json.get(arg(1),"Understand"))]
[h:pm.TargetIntMin = if(json.get(arg(1),"IntMin")=="",0,json.get(arg(1),"IntMin"))]
[h:pm.TargetIntMax = if(json.get(arg(1),"IntMax")=="",999999,json.get(arg(1),"IntMax"))]

[h:pm.TargetOrigin = json.get(arg(2),"Origin")]
[h:pm.RangeNum = json.get(json.get(arg(2),"Range"),"Value")]
[h:pm.RangeUnits = pm.StandardRange(json.get(json.get(arg(2),"Range"),"Units"))]
[h:pm.RangeNumFinal = if(pm.RangeUnits=="Other","",(if(pm.RangeUnits=="Miles",pm.RangeNum*5280,pm.RangeNum)/5))]
[h:pm.AoEInfo = json.get(arg(2),"AoE")]
[h:pm.MultiTargetRange = json.get(arg(2),"MultiTargetRange")]

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

[h:pm.TargetsInRange = getTokens("json","range",json.set("","token",pm.TargetOrigin,"upto",pm.RangeNumFinal))]
[h:pm.ValidTargets = "[]"]

[h,foreach(target,pm.TargetsInRange),CODE:{
	[h,switch(pm.TargetAllyFoe):
		case 0: pm.AllyFoeTest = if(getProperty("whichTeam") == getProperty("whichTeam",target),1,0);
		case 1: pm.AllyFoeTest = if(getProperty("whichTeam") == getProperty("whichTeam",target),0,1);
		case 2: pm.AllyFoeTest = 1;
		default: pm.AllyFoeTest = 1
	]
	[h,if(json.type(pm.TargetType) == "UNKNOWN"):
		pm.TypeTest = if(or(pm.TargetType==getProperty("CreatureType",target),pm.TargetType=="Any",pm.TargetType==""),1,0);
		pm.TypeTest = if(json.contains(pm.TargetType,getProperty("CreatureType",target)),1,0)
	]
	[h,if(json.type(pm.TargetSubtype) == "UNKNOWN"):
		pm.SubtypeTest = if(or(pm.TargetSubtype==getProperty("Race",target),pm.TargetSubtype=="Any",pm.TargetSubtype==""),1,0);
		pm.SubtypeTest = if(json.contains(pm.TargetSubtype,getProperty("Race",target)),1,0)
	]
	[h:pm.IntTest = if(and(getProperty("Intelligence",target)>pm.TargetIntMin,getProperty("Intelligence",target)<pm.TargetIntMax),1,0)]
	[h:pm.ValidTargets = if(and(pm.AllyFoeTest,pm.TypeTest,pm.SubtypeTest,pm.IntTest),json.append(pm.ValidTargets,target),pm.ValidTargets)]
}]

[h:pm.SelectedTargets = "[]"]
[h,if(getProperty("TargetingStyle")=="Impersonate"),CODE:{
	[h:pm.ImpersonatedTargeting(pm.ValidTargets)]
};{}]

[h,if(getProperty("TargetingStyle")=="Input"),CODE:{
	[h:pm.InputTargeting(pm.ValidTargets)]
};{}]