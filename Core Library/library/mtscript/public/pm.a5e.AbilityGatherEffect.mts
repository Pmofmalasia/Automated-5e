[h:hasEffectsTest = pm.a5e.EffectData != json.append("",json.set("","Class",abilityClass))]
[h,if(hasEffectsTest),CODE:{
	[h,foreach(effect,pm.a5e.EffectData),CODE:{
		[h:effectID = 1d10000000000000 + json.get(getInfo("client"),"timeInMs")]
		[h:priorEffectIDs = json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*]['ID']")]
		[h,while(json.contains(priorEffectIDs,effectID)): effectID = 1d10000000000000 + json.get(getInfo("client"),"timeInMs")]
		[h:setLibProperty("gd.Effects",json.append(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),json.set(effect,"ID",effectID,"ParentToken",ParentToken)),"Lib:pm.a5e.Core")]
	}]

	[h:sendToResolveEffectsLink = macroLinkText("Resolve Effects@Lib:pm.a5e.Core","gm",json.get(pm.a5e.EffectData,0),ParentToken)]
	
	[h:broadcast("<a href='"+sendToResolveEffectsLink+"'>Click here to apply the effects to all targets</a>","gm")]
};{}]