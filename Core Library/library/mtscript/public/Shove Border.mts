[h:ShoveData = macro.args]
[h:Flavor = json.get(ShoveData,"Flavor")]
[h:ParentToken = json.get(ShoveData,"ParentToken")]
[h:outputTargets = "not-gm"]
[h:pm.a5e.EffectData = "[]"]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","Shove",
	"Type","Check",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:ShoveData = json.set(ShoveData,"BaseEffect",pm.a5e.BaseEffectData)]

[h,MACRO("Shove@Lib:pm.a5e.Core"): ShoveData]
[h:ShoveInfo = macro.return]
[h:effectsToMerge = json.get(ShoveInfo,"Effect")]
[h:abilityTable = json.get(ShoveInfo,"Table")]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): data.setData("addon:","pm.a5e.core","gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData))]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Shove",
	"DisplayName","Shove",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Shove","OtherCombatActions"),
	"OutputTargets",outputTargets,
	"Description","Using the Attack action, you can make a special melee attack to shove a creature, either to knock it prone or push it away from you. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.<br><br>The target of your shove must be no more than one size larger than you, and it must be within your reach. You make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you either knock the target prone or push it 5 feet away from you.",
	"AbridgedDescription","When you take the Attack action, you can replace attacks with a special melee attack, shoving a creature within your reach no more than one size larger than you. You make an Athletics contested by the target's choice of Athletics or Acrobatics, succeeding automatically if the target is incapacitated. If you succeed, you either knock the target prone or push it 5 feet away from you."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]