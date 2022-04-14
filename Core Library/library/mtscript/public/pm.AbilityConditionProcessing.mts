[h:abilityTable = json.append(abilityTable,json.get(ConditionInfo,"Table"))]

[h,if(IsTooltip),CODE:{};{
	[h:pm.ConditionsToSet = json.get(ConditionInfo,"ConditionInfo")]
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]

	[h:thisEffect = json.set(thisEffect,"ConditionInfo",pm.ConditionsToSet)]

	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]
}]