[h:abilityTable = json.append(abilityTable,json.get(DamageInfo,"Table"))]

[h:return(!IsTooltip)]

[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.set("","Class",abilityClass); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]

[h,if(json.get(thisEffect,"Damage")==""),CODE:{
	[h:thisEffect = json.set(thisEffect,"Damage",json.set("","DamageDealt",json.set("",json.get(DamageInfo,"DamageType"),json.get(DamageInfo,"Amount"))))]
};{
   [h:"<!-- Should not need an additional check on the DamageDealt key since it should always be set if there is damage, but may be wrong? Probably not though. -->"]
	[h:priorDamage = json.get(json.get(json.get(thisEffect,"Damage"),"DamageDealt"),json.get(DamageInfo,"DamageType"))]
	[h,if(priorDamage==""):
      thisEffect = json.path.put(thisEffect,"['Damage']['DamageDealt']",json.get(DamageInfo,"DamageType"),json.get(DamageInfo,"Amount"));
      thisEffect = json.path.set(thisEffect,"['Damage']['DamageDealt']['"+json.get(DamageInfo,"DamageType")+"']",json.get(DamageInfo,"Amount")+priorDamage)
   ]
}]

[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]