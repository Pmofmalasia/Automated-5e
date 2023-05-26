[h:monsterCreationHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+currentToken()+"'><tr id='rowWeaponName'><th><label for='DisplayName'>Weapon Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpecialEffects'><th><label for='SpecialEffects'>Has Special Effects?</label></th><td><select id='SpecialEffects' name='SpecialEffects' onchange='chooseSpecialEffectNumber()'><option value='None'>None</option><option value='SameSubeffect'>Occur on Hit</option><option value='NewSubeffect'>Additional Resolution on Hit</option><option value='Mixed'>Mix of Both</option></select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("MonsterWeaponCreation","lib://pm.a5e.core/MonsterWeaponCreation.html?cachelib=false","value="+base64.encode(monsterCreationHTML)+"; closebutton=0; width=450; height=1050")]