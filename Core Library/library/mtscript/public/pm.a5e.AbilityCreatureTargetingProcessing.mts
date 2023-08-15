[h,if(IsTooltip),CODE:{};{
	[h:pm.AbilityTargets = TargetInfo]
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.path.setcarefully(pm.a5e.BaseEffectData,"GeneralData.ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]

	[h,if(json.get(thisEffect,"Targets")==""),CODE:{
		[h:thisEffect = json.set(thisEffect,"Targets",pm.AbilityTargets)]
	};{
		[h:thisEffect = json.set(thisEffect,"Targets",json.merge(json.get(thisEffect,"Targets"),pm.AbilityTargets))]
	}]

	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]
}]