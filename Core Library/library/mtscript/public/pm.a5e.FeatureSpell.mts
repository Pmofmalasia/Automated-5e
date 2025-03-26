[h:AllSpellData = arg(1)]
[h:FeatureDescription = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:pm.SpellData = json.set(AllSpellData,"SpellData",SpellData,"ParentToken",ParentToken)]

[h,if(IsTooltip),CODE:{
    [h,MACRO("SpellTooltip@Lib:pm.a5e.Core"): pm.SpellData]
    [h:ReturnData = macro.return]

    [h:spellDataTable = json.get(ReturnData,"Table")]
    [h,if(FeatureDescription!=""): spellDataTable = json.append(spellDataTable,pm.a5e.CreateBasicTableLine(json.get(currentFeatureInfo,"DisplayName"),FeatureDescription))]

    [h:abilityTable = json.merge(abilityTable,spellDataTable)]
    [h:FeatureFullDescription = json.get(ReturnData,"FullDescription")]
    [h:FeatureAbridgedDescription = json.get(ReturnData,"AbridgedDescription")]
};{
    [h,MACRO("Spellcasting@Lib:pm.a5e.Core"): pm.SpellData]
    [h:ReturnData = macro.return]

    [h:spellDataTable = json.get(ReturnData,"Table")]
    [h,if(FeatureDescription!=""): spellDataTable = json.append(spellDataTable,pm.a5e.CreateBasicTableLine(json.get(currentFeatureInfo,"DisplayName"),FeatureDescription))]

    [h:abilityTable = json.merge(abilityTable,spellDataTable)]
    [h:FeatureDescription = json.get(ReturnData,"Description")]
    [h:FeatureAbridgedDescription = json.get(ReturnData,"AbridgedDescription")]

	[h:newEffectData = json.path.put(json.get(ReturnData,"Effect"),"\$[*]","SpellData",json.get(ReturnData,"SpellData"))]
    [h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",newEffectData,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

    [h:pm.a5e.EffectData = macro.return]
}]