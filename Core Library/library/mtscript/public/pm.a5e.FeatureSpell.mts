[h:AllSpellData = arg(1)]
[h:abilityEffect = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:pm.SpellData = json.set(AllSpellData,"SpellData",SpellData,"ParentToken",ParentToken)]

[h,if(IsTooltip),CODE:{
    [h,MACRO("SpellTooltip@Lib:pm.a5e.Core"): pm.SpellData]
    [h:ReturnData = macro.return]

    [h:spellDataTable = json.get(ReturnData,"Table")]
    [h,if(abilityEffect!=""): spellDataTable = json.append(spellDataTable,pm.a5e.CreateBasicTableLine(json.get(currentFeatureInfo,"DisplayName"),abilityEffect))]

    [h:abilityTable = json.merge(abilityTable,spellDataTable)]
    [h:abilityEffect = json.get(ReturnData,"Description")]
};{
    [h,MACRO("Spellcasting@Lib:pm.a5e.Core"): pm.SpellData]
    [h:ReturnData = macro.return]

    [h:spellDataTable = json.get(ReturnData,"Table")]
    [h,if(abilityEffect!=""): spellDataTable = json.append(spellDataTable,pm.a5e.CreateBasicTableLine(json.get(currentFeatureInfo,"DisplayName"),abilityEffect))]

    [h:abilityTable = json.merge(abilityTable,spellDataTable)]
    [h:abilityEffect = json.get(ReturnData,"Description")]

    [h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",json.get(ReturnData,"Effect"),"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

    [h:pm.a5e.EffectData = macro.return]
}]
