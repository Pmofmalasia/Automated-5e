[h:abilityTable = json.merge(abilityTable,json.get(GrappleInfo,"Table"))]

[h:return(!IsTooltip)]

[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.path.set(pm.a5e.BaseEffectData,"GeneralData.ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]

[h:thisGrappleEffectData = json.get(json.get(GrappleInfo,"Effect"),0)]
[h:thisEffect = json.set(thisEffect,"Check",json.get(thisGrappleEffectData,"Check"))]

[h,if(json.get(thisEffect,"Targets")==""),CODE:{
	[h:thisEffect = json.set(thisEffect,"Targets",json.get(thisGrappleEffectData,"Targets"))]
};{
	[h:thisEffect = json.set(thisEffect,"Targets",json.merge(json.get(thisEffect,"Targets"),json.get(thisGrappleEffectData,"Targets")))]
}]

[h:noPriorConditionsTest = json.isEmpty(json.get(thisEffect,"ConditionInfo"))]
[h:pm.ConditionsToSet = json.get(thisGrappleEffectData,"ConditionInfo")]
[h,if(noPriorConditionsTest),CODE:{
	[h:thisEffect = json.set(thisEffect,"ConditionInfo",json.append("",pm.ConditionsToSet))]
};{
	[h:sameGroupTest = -1]
	
	[h,foreach(conditionGroup,json.get(thisEffect,"ConditionInfo")): sameGroupTest = if(json.equals(json.get(pm.ConditionsToSet,"EndInfo"),json.get(json.get(thisEffect,"ConditionInfo"),"EndInfo")),roll.count,sameGroupTest)]
	
	[h,if(sameGroupTest>=0): thisEffectNewConditions = json.merge(json.get(json.get(json.get(thisEffect,"ConditionInfo"),sameGroupTest),"Conditions"),json.get(pm.ConditionsToSet,"Conditions"))]
	
	[h,if(sameGroupTest>=0): 
		thisEffect = json.path.set(thisEffect,"['ConditionInfo']["+sameGroupTest+"]['Conditions']",thisEffectNewConditions);
		thisEffect = json.set(thisEffect,"ConditionInfo",json.append(json.get(thisEffect,"ConditionInfo"),pm.ConditionsToSet))
	]
}]

[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]