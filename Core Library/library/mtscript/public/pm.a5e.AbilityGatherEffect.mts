[h:hasEffectsTest = pm.a5e.EffectData != json.append("",json.set("","Class",abilityClass))]
[h,if(hasEffectsTest),CODE:{
	[h:sendToResolveEffectsLink = macroLinkText("Resolve Effects@Lib:pm.a5e.Core","gm",json.get(pm.a5e.EffectData,0),ParentToken)]
	
	[h:broadcast("<a href='"+sendToResolveEffectsLink+"'>Click here to apply the effects to all targets</a>")]
};{}]