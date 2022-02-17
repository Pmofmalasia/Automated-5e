[h:abilityInfo = arg(0)]
[h:pm.SpellData = json.set(arg(1),"MonsterCast",0,"NeedsBorder",0)]
[h:abilityEffect = arg(2)]

[h,MACRO(json.get(pm.SpellData,"SpellName")+" ("+json.get(pm.SpellData,"sLevel")+")@Lib:Complete Spellbook"):pm.SpellData]
[h:ReturnData = macro.return]

[h:abilityTable = json.get(ReturnData,"Table")]
[h,if(abilityEffect!=""): abilityTable = json.append(abilityTable,pm.AbilityText(abilityInfo,json.get(abilityInfo,"DisplayName"),abilityEffect))]

[h:macro.return = json.set(ReturnData,"Table",abilityTable)]