[h:abilityTable = json.append(abilityTable,json.get(ConditionInfo,"Table"))]

[h,if(IsTooltip),CODE:{};{
	[h:pm.ConditionsToSet = json.get(ConditionInfo,"ConditionInfo")]
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(abilityEffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(abilityEffectData,whichEffect)]

	[h:thisEffect = json.set(thisEffect,"ConditionInfo",pm.ConditionsToSet)]

	[h,if(whichEffect >= json.length(abilityEffectData)): abilityEffectData = json.append(abilityEffectData,thisEffect); abilityEffectData = json.set(abilityEffectData,whichEffect,thisEffect)]
}]