[h:abilityTable = json.append(abilityTable,json.get(SaveDCInfo,"Table"))]

[h:return(!IsTooltip)]

[h,if(argCount()>0): whichEffect = arg(0); whichEffect = 0]
[h,if(whichEffect >= json.length(pm.a5e.EffectData)): thisEffect = json.path.setcarefully(pm.a5e.BaseEffectData,"GeneralData.ID",pm.a5e.GenerateEffectID()); thisEffect = json.get(pm.a5e.EffectData,whichEffect)]

[h:thisEffect = json.set(thisEffect,"Save",json.get(SaveDCInfo,"SaveData"))]

[h,if(whichEffect >= json.length(pm.a5e.EffectData)): pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffect); pm.a5e.EffectData = json.set(pm.a5e.EffectData,whichEffect,thisEffect)]