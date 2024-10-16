[h:AllSpellData = macro.args]
[h:ParentToken = json.get(AllSpellData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:Flavor = json.get(AllSpellData,"Flavor")]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:pm.a5e.EffectData = "[]"]
[h:needsSplitGMOutput = (getProperty("a5e.stat.Allegiance") == "Enemy")]

[h:AllSpellData = json.set(AllSpellData,"SpellData",SpellData)]
[h,macro("Spellcasting@Lib:pm.a5e.Core"): AllSpellData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:effectsToMerge = json.get(macro.return,"Effect")]
[h:SpellSource = json.get(macro.return,"Source")]
[h:SpellSlot = json.get(macro.return,"Slot")]
[h:ShowFullRules = json.get(macro.return,"ShowFullRules")]
[h:SpellDescription = json.get(macro.return,"Description")]
[h:FinalSpellData = json.get(macro.return,"SpellData")]

[h:pm.a5e.BaseEffectData = json.set("",
    "Class","Spell",
    "DisplayClass","zzSpell",
	"DisplayName",json.get(SpellData,"DisplayName"),
    "ColorSubtype",json.set("","Source",SpellSource,"Level",SpellSlot),
    "FalseName","Spellcasting",
	"Type","Spell",
	"SpellData",FinalSpellData,
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:BorderData = json.set("",
	"Flavor",Flavor,
	"Name",json.get(SpellData,"Name"),
	"DisplayName",json.get(SpellData,"DisplayName"),
	"FalseName","Spellcasting",
	"DisplayClass","zzSpell",
	"ColorSubtype",json.set("","Source",SpellSource,"Level",SpellSlot)
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",needsSplitGMOutput,
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Spell"),
	"OutputTargets","",
	"Description",SpellDescription,
	"AbridgedDescription",SpellDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): data.setData("addon:","pm.a5e.core","gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData))]

[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]