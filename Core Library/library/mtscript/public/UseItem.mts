[h:UseItemData = macro.args]
[h:ItemEffects = json.get(UseItemData,"Effects")]
[h:EffectsNumber = json.length(ItemEffects)]

[h,if(EffectsNumber==1),CODE:{
	[h:ChosenEffect = json.get(ItemEffects,0)]
};{
	[h,if(json.get(UseItemData,"isEffectRandom")==1),CODE:{
		[h:ChosenEffectIndex = eval("1d"+EffectsNumber) - 1]
		[h:ChosenEffect = json.get(ItemEffects,ChosenEffectIndex)]
	};{
		[h:EffectOptions = ""]
		[h,foreach(tempEffect,ItemEffects): EffectOptions = json.append(EffectOptions,json.get(tempEffect,"DisplayName"))]
		[h:abort(input(
			" ChosenEffectIndex | "+EffectOptions+" | Choose an Effect | LIST | DELIMITER=JSON "
		))]
		[h:ChosenEffect = json.get(ItemEffects,ChosenEffectIndex)]
	}]
}]

[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set(UseItemData,"Effect",ChosenEffect)]

[h,MACRO("ShowInventory@Lib:pm.a5e.Core"): json.set("","ParentToken",json.get(UseItemData,"ParentToken"))]