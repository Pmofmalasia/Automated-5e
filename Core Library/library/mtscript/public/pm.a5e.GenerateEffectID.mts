[h:effectID = eval("1d1000000") + json.get(getInfo("client"),"timeInMs")]
[h:priorEffectIDs = json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*]['ID']")]
[h,while(json.contains(priorEffectIDs,effectID)): effectID = eval("1d1000000") + json.get(getInfo("client"),"timeInMs")]
[h:macro.return = effectID]