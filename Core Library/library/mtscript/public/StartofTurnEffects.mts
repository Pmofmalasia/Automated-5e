[h:ParentToken = macro.args]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.EffectData = "[]"]
[h:effectsToMerge = "[]"]
[h:abilityTable = "[]"]
[h:whichEffect = 0]
[h:pm.a5e.OverarchingContext = "StartTurn"]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","Start of Turn Effect",
	"Type","Save",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:"<!-- TODO: MaxResource fix -->"]
[h:"<!-- TODO: Roll this in with EventResourceRestoration in the future when inputs are updated since it has restoration by chance as well -->"]
[h,foreach(feature,json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.RechargeRoll!=null)]","DEFAULT_PATH_LEAF_TO_NULL")),CODE:{
	[h:NeedsRecharge = (json.get(feature,"Resource") != evalMacro(json.get(feature,"MaxResource")))]
	[h,if(NeedsRecharge),CODE:{
		[h:RechargeRollData = pm.a5e.RechargeRoll(json.set("","ParentToken",ParentToken),feature)]
		[h:abilityTable = json.merge(abilityTable,json.get(RechargeRollData,"Table"))]
	};{}]
}]

[h:pm.a5e.EventResourceRestoration("StartTurn")]

[h:pm.a5e.StartAndEndTurnEffects("Start")]

[h:setState("Initiative", 0)]
[h:setState("ReactionUsed", 0)]
[h:macro.return = abilityTable]