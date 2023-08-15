[h,if(IsTooltip):
	abilityTable = json.append(abilityTable,json.get(WeaponAttackInfo,"Table"));
	abilityTable = json.merge(abilityTable,json.get(WeaponAttackInfo,"Table"))
]

[h:return(!IsTooltip)]
	
[h:"<!-- Possibly add option for tighter control by putting an array that corresponds to which effect each attack corresponds to (e.g. [0,2] for 3 effects with 2 attacks with the attack applying to the 3rd effect instead of sequentially.) -->"]
[h:allAttacks = json.get(WeaponAttackInfo,"Effect")]

[h,if(argCount()>0): startEffect = arg(0); startEffect = 0]
[h,foreach(attack,allAttacks),CODE:{
	[h:whichEffect = startEffect + roll.count]
	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.path.setcarefully(pm.a5e.BaseEffectData,"GeneralData.ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]
	
	[h:thisEffect = json.set(thisEffect,"Attack",json.get(attack,"Attack"))]
	
	[h:allEffectDamage = if(json.get(thisEffect,"Damage")=="","{}",json.get(thisEffect,"Damage"))]
	[h:allNewDamage = json.get(attack,"Damage")]
	[h,foreach(damageType,json.fields(allNewDamage)),CODE:{
		[h:priorDamage = json.get(allEffectDamage,damageType)]
		[h,if(priorDamage==""):
			allEffectDamage = json.set(allEffectDamage,damageType,json.get(allNewDamage,damageType));
			allEffectDamage = json.set(allEffectDamage,damageType,json.get(allNewDamage,damageType)+priorDamage)
		]
	}]
	[h:thisEffect = json.set(thisEffect,"Damage",allEffectDamage)]

	[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]
}]