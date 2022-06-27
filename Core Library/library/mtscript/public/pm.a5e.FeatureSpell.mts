[h:pm.SpellData = json.set(arg(1),"MonsterCast",0,"NeedsBorder",0)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,MACRO(json.get(pm.SpellData,"SpellName")+" ("+json.get(pm.SpellData,"sLevel")+")@Lib:Complete Spellbook"): pm.SpellData]
[h:ReturnData = macro.return]

[h:spellDataTable = json.get(ReturnData,"Table")]
[h,if(abilityEffect!=""): spellDataTable = json.append(spellDataTable,pm.a5e.CreateBasicTableLine(json.get(currentFeatureInfo,"DisplayName"),abilityEffect))]

[h:abilityTable = json.merge(abilityTable,spellDataTable)]
[h:abilityEffect = json.get(ReturnData,"Effect")]