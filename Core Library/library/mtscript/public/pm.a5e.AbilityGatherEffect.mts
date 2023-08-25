
[h:"<!-- Any data set outside of the 'ToResolve' key may be important but does not affect the target on its own, e.g. range, ParentToken. -->"]
[h,foreach(effect,pm.a5e.EffectData),CODE:{
	[h,if(json.get(effect,"ToResolve")!=""): setLibProperty("gd.Effects",json.append(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),effect),"Lib:pm.a5e.Core")]
}]

[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]