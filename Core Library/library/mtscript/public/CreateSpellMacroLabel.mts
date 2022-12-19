[h:Spell = macro.args]

[h:SpellData = pm.a5e.GetSpecificSpell(Spell)]
[h:MainSpellData = json.get(SpellData,0)]
[h:CastTimeUnits = json.get(json.get(MainSpellData,"CastTime"),"Units")]
[h:CastTimeValue = json.get(json.get(MainSpellData,"CastTime"),"Value")]
[h:CastTimeNote = if(or(CastTimeUnits=="",lower(CastTimeUnits)=="action"),""," <b>("+CastTimeValue+" "+CastTimeUnits+")</b>")]
[h:macro.return = json.get(MainSpellData,"DisplayName")+" ("+json.get(MainSpellData,"Level")+")"+CastTimeNote]