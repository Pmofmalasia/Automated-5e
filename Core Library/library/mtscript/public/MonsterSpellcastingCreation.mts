[h:PriorMonsterData = macro.args]
[h:ParentToken = json.get(PriorMonsterData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:monsterCreationHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'><tr id='rowisInnateSpellcasting'><th><label for='isInnateSpellcasting'>Has Innate Spellcasting:</label></th><td><input type='checkbox' id='isInnateSpellcasting' name='isInnateSpellcasting' onchange='createInnateInfo()'></td></tr><tr id='rowisSlotSpellcasting'><th><label for='isSlotSpellcasting'>Has Spellcasting With Spell Slots:</label></th><td><input type='checkbox' id='isSlotSpellcasting' name='isSlotSpellcasting' onchange='createSlotInfo()'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "</tr><tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("MonsterSpellcastingCreation","lib://pm.a5e.core/MonsterSpellcastingCreation.html?cachelib=false","value="+base64.encode(monsterCreationHTML)+"; closebutton=0; width=500; height=800")]