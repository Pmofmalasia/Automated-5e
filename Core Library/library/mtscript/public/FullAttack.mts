[h:AttackData = macro.args]
[h:ParentToken = json.get(AttackData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:WeaponData = json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),json.get(AttackData,"Hand")))]
[h:pm.a5e.EffectData = "[]"]

[h:AttackData = json.set(AttackData,
	"WeaponData",WeaponData,
	"ThrowWeapon",0,
	"AttackNum",1,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"ParentToken",ParentToken
)]

[h,macro("Attack@Lib:pm.a5e.Core") : AttackData]
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
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:BorderData = json.set("",
	"Flavor",json.get(WeaponData,"Flavor"),
	"Name",json.get(WeaponData,"Name")+"Attack",
	"DisplayName",json.get(WeaponData,"DisplayName")+" Attack",
	"FalseName","Weapon Attack",
	"DisplayClass","zzWeaponAttack",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","WeaponAttack","Attack"),
	"OutputTargets","",
	"Description",base64.decode(json.get(WeaponData,"Description")),
	"AbridgedDescription",base64.decode(json.get(WeaponData,"AbridgedDescription"))
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]