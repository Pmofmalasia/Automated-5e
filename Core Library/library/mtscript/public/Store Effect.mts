[h:finalEffectData = arg(0)]
[h:"<!-- Cosmetic data and general data are sent even if the feature doesn't have any effect to resolve. -->"]
[h,if(json.get(effect,"ToResolve")!=""),CODE:{
	[h,foreach(effect,finalEffectData): setLibProperty("gd.Effects",json.append(data.getData("addon:","pm.a5e.core","gd.Effects"),effect),"Lib:pm.a5e.Core")]
};{}]