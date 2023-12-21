[h:GrappleData = macro.args]
[h:Flavor = json.get(GrappleData,"Flavor")]
[h:ParentToken = json.get(GrappleData,"ParentToken")]
[h:outputTargets = "not-gm"]
[h:pm.a5e.EffectData = "[]"]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class","zzChecksAndSaves",
	"DisplayName","Grapple",
	"Type","Check",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:GrappleData = json.set(GrappleData,"BaseEffect",pm.a5e.BaseEffectData)]

[h,MACRO("Grapple@Lib:pm.a5e.Core"): GrappleData]
[h:GrappleInfo = macro.return]
[h:effectsToMerge = json.get(GrappleInfo,"Effect")]
[h:abilityTable = json.get(GrappleInfo,"Table")]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name","Grapple",
	"DisplayName","Grapple",
	"FalseName","",
	"DisplayClass","zzOtherCombatActions",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Grapple","OtherCombatActions","ChecksAndSaves"),
	"OutputTargets","",
	"Description","When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you're able to make multiple attacks with the Attack action, this attack replaces one of them. The target of your grapple must be no more than one size larger than you, and it must be within your reach.<br><br>Using at least one free hand, you try to seize the target by making a grapple check, a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you subject the target to the grappled condition (see the appendix). The condition specifies the things that end it, and you can release the target whenever you like (no action required).<br><br>When you move, you can drag or carry the grappled creature with you, but your speed is halved, unless the creature is two or more sizes smaller than you.",
	"AbridgedDescription","As one of your attacks using the Attack action, you use a free hand to make a special melee attack against a target no more than one size larger than you within your reach. Make an Athletics check contested by the target's choice of Athletics or Acrobatics check. You succeed automatically if the target is incapacitated. If you succeed, the target is grappled.<br><br>You can release the target whenever you like. When you move, you can move the grappled creature with you, but your speed is halved unless the creature is at least two sizes smaller than you."
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]