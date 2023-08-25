[h:CurrentActiveEffects = getProperty("a5e.stat.ActiveEffects")]
[h:NoEffectsTest = json.isEmpty(CurrentActiveEffects)]
[h:assert(!NoEffectsTest,"<br>You do not have any active effects!",0)]

[h:EffectOptions = "[]"]
[h:EffectOptionsWhichEffect = "[]"]
[h:FeatureIndexCounter = 0]
[h,foreach(Feature,CurrentActiveEffects),CODE:{
	[h:EffectIndexCounter = 0]
	[h,foreach(effect,json.get(Feature,"Effects")),CODE:{
		[h,if(json.get(effect,"DisplayName") == ""):
			EffectOptions = json.append(EffectOptions,json.get(Feature,"DisplayName"));
			EffectOptions = json.append(EffectOptions,json.get(Feature,"DisplayName")+": "+json.get(effect,"DisplayName"))]
		[h:EffectOptionsWhichEffect = json.append(EffectOptionsWhichEffect,json.set("","Feature",FeatureIndexCounter,"Effect",EffectIndexCounter))]
		[h:EffectIndexCounter = EffectIndexCounter + 1]
	}]
	[h:FeatureIndexCounter = FeatureIndexCounter + 1]
}]

[h:abort(input(
	"effectSelection | "+EffectOptions+" | Which effect is being used | RADIO | DELIMITER=JSON ",
	"deleteTest | | Remove effect from list once used? | CHECK"
))]

[h:IndexData = json.get(EffectOptionsWhichEffect,effectSelection)]
[h:ChosenFeature = json.get(CurrentActiveEffects,json.get(IndexData,"Feature"))]
[h:FeatureEffects = json.get(ChosenFeature,"Effects")]
[h:ChosenEffect = json.get(FeatureEffects,json.get(IndexData,"Effect"))]
[h:FinalEffectData = json.remove(ChosenFeature,"Effects")]
[h:FinalEffectData = json.set(FinalEffectData,
	"Effect",ChosenEffect,
	"ParentToken",currentToken()
)]

[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): FinalEffectData]

[h,if(deleteTest),CODE:{
	[h:setProperty("a5e.stat.ActiveEffects",json.remove(getProperty("a5e.stat.ActiveEffects"),json.get(IndexData,"Effect")))]
};{}]