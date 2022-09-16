[h:AttackData = macro.args]
[h:ParentToken = json.get(AttackData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:WeaponData = json.get(Weapon,json.get(Weapon,json.get(AttackData,"Hand")))]
[h:pm.a5e.EffectData = "[]"]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(WeaponData,"Flavor"),
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class","zzWeaponAttack",
	"Name",json.get(WeaponData,"Name")+" Attack",
	"FalseName","Weapon Attack",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:AttackData = json.set(AttackData,
	"WeaponData",WeaponData,
	"Throw Weapon",0,
	"AttackNum",-1,
	"DMOnly",0
)]

[macro("Attack@Lib:pm.a5e.Core") : AttackData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:effectsToMerge = json.get(macro.return,"Effect")]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzWeaponAttack",
	"DisplayName",json.get(WeaponData,"Name")+" Attack",
	"Type","Attack",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,foreach(effect,pm.a5e.EffectData),CODE:{
    [h:setLibProperty("gd.Effects",json.append(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),effect),"Lib:pm.a5e.Core")]
}]
[h,MACRO("OpenEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]