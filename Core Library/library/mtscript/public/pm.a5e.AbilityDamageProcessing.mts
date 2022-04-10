[h:abilityTable = json.append(abilityTable,json.get(DamageInfo,"Table"))]

[h,if(IsTooltip),CODE:{};{
	[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
	[h,if(whichEffect >= json.length(abilityEffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(abilityEffectData,whichEffect)]

[h:broadcast(thisEffect)]
	[h,if(json.get(thisEffect,"Damage")==""),CODE:{
		[h:thisEffect = json.set(thisEffect,"Damage",json.set("",json.get(DamageInfo,"DamageType"),json.get(DamageInfo,"Amount")))]
	};{
		[h:priorDamage = json.get(json.get(thisEffect,"Damage"),json.get(DamageInfo,"DamageType"))]
		[h,if(priorDamage==""): 
			thisEffect = json.path.put(thisEffect,"['Damage']",json.get(DamageInfo,"DamageType"),json.get(DamageInfo,"Amount"));
			thisEffect = json.path.set(thisEffect,"['Damage']['"+json.get(DamageInfo,"DamageType")+"']",json.get(DamageInfo,"Amount")+priorDamage)
		]
	}]

	[h,if(whichEffect >= json.length(abilityEffectData)): abilityEffectData = json.append(abilityEffectData,thisEffect); abilityEffectData = json.set(abilityEffectData,whichEffect,thisEffect)]
}]