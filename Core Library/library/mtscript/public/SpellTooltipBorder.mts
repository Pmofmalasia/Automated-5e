[h:AllSpellData = macro.args]
[h:ParentToken = json.get(AllSpellData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:Flavor = json.get(AllSpellData,"Flavor")]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:SpellLevel = json.get(json.get(SpellData,0),"Level")]
[h:DMOnly = (getProperty("a5e.stat.Allegiance") == "Enemy")]

[h:AllSpellData = json.set(AllSpellData,"SpellData",SpellData)]
[h,macro("SpellTooltip@Lib:pm.a5e.Core"): AllSpellData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:SpellSource = json.get(macro.return,"Source")]
[h:SpellDescription = json.get(macro.return,"Description")]
[h:SpellDisplayName = json.get(macro.return,"DisplayName")]

[h:ClassFeatureData = json.set("",
    "DMOnly",DMOnly,
    "Class","Spell",
    "ClassForDisplay","zzSpell",
    "ColorSubtype",json.set("","Source",SpellSource,"Level",SpellLevel),
    "Name",pm.RemoveSpecial(SpellName),
    "DisplayName",SpellDisplayName,
    "Effect",SpellDescription,
    "abilityTable",json.remove(abilityTable,0)
)]
[r:pm.TooltipOutput(ClassFeatureData)]