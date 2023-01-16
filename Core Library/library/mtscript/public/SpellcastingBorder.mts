[h:AllSpellData = macro.args]
[h:ParentToken = json.get(AllSpellData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:Flavor = json.get(AllSpellData,"Flavor")]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:pm.a5e.EffectData = "[]"]
[h:DMOnly = 0]

[h:AllSpellData = json.set(AllSpellData,"SpellData",SpellData)]
[h,macro("Spellcasting@Lib:pm.a5e.Core"): AllSpellData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:effectsToMerge = json.get(macro.return,"Effect")]
[h:SpellSource = json.get(macro.return,"Source")]
[h:SpellSlot = json.get(macro.return,"Slot")]
[h:ShowFullRules = json.get(macro.return,"ShowFullRules")]
[h:SpellDescription = json.get(macro.return,"Description")]

[h:ClassFeatureData = json.set("",
    "Flavor",Flavor,
    "ParentToken",ParentToken,
    "DMOnly",DMOnly,
    "Class","zzSpell"+SpellSource,
    "ColorSubtype",SpellSlot,
    "Name",json.get(json.get(SpellData,0),"DisplayName"),
    "FalseName","Spellcasting",
    "OnlyRules",ShowFullRules
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,ShowFullRules)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")]
[h:output.GM = output.GM + json.get(output.Temp,"GM")]

[h:pm.a5e.BaseEffectData = json.set("",
    "Class","Spell",
    "ClassForDisplay","zzSpell"+SpellSource,
	"DisplayName",json.get(json.get(SpellData,0),"DisplayName"),
    "ColorSubtype",SpellSlot,
    "FalseName","Spellcasting",
	"Type","Spell",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:output.PC = output.PC + if(DMOnly,"",SpellDescription)+"</div></div>"]
[h:output.GM = output.GM + SpellDescription+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]

[h,MACRO("OpenEffectsFrame@Lib:pm.a5e.Core"): ""]