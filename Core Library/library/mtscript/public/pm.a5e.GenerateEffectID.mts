[h:effectID = eval("1d10000") + "a5e" + json.get(getInfo("client"),"timeInMs")]
[h:priorEffectIDs = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*]['ID']")]
[h,while(json.contains(priorEffectIDs,effectID)): effectID = eval("1d10000") + json.get(getInfo("client"),"timeInMs")]
[h:macro.return = effectID]