[h,if(IsTooltip),CODE:{};{
	[h:pm.AbilityTargets = TargetInfo]
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(abilityEffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(abilityEffectData,whichEffect)]

	[h,if(json.get(thisEffect,"Targets")==""),CODE:{
		[h:thisEffect = json.set(thisEffect,"Targets",pm.AbilityTargets)]
	};{
		[h:thisEffect = json.set(thisEffect,"Targets",json.merge(json.get(thisEffect,"Targets"),pm.AbilityTargets))]
	}]

	[h,if(whichEffect >= json.length(abilityEffectData)): abilityEffectData = json.append(abilityEffectData,thisEffect); abilityEffectData = json.set(abilityEffectData,whichEffect,thisEffect)]
}]