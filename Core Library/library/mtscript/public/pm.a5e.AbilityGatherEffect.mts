[h:hasEffectsTest = abilityEffectData != json.append("",json.set("","Class",abilityClass))]
[h,if(hasEffectsTest),CODE:{
	[h:sendToResolveEffectsLink = macroLinkText("Resolve Effects@Lib:pm.a5e.Core","gm",json.get(abilityEffectData,0),ParentToken)]
	
	[h:broadcast("<a href='"+sendToResolveEffectsLink+"'>Click here to apply the effects to all targets</a>")]
};{}]