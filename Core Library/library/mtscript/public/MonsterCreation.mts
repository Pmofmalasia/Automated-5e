[h:monsterCreationHTML = "<tr id='rowMonsterName'><th><label for='DisplayName'>Creature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:creatureTypeArray = pm.GetCreatureTypes()]
[h:creatureTypeOptions = ""]
[h,foreach(tempType,creatureTypeArray): creatureTypeOptions = creatureTypeOptions + "<option value='"+json.get(tempType,"Name")+"'>"+json.get(tempType,"DisplayName")+"</option>"]
[h:creatureTypeOptions = creatureTypeOptions + "<option value='Multiple'>Multiple</option>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureType'><th><label for='CreatureType'>Monster Name:</label></th><td><select id='CreatureType' name='CreatureType' onchange='creatureTypeSelectionChanges()'>"+creatureTypeOptions+"</select></td></tr>"]

[h:"<!-- TODO: Add creature subtype selection for first entry of creaturetypeoptions once created -->"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureSubtype'><th><label for='CreatureSubtype'>Monster Name:</label></th><td><select id='CreatureSubtype' name='CreatureSubtype'></select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowAlignmentOrder'><th><label for='orderChoice'>Order:</label></th><td>
    <select id='orderChoice' name='orderChoice'>
        <option value='Lawful'>Lawful</option>
        <option value='Neutral'>Neutral</option>
        <option value='Chaotic'>Chaotic</option>
    </select>
</td></tr>
<tr id='rowAlignmentMorality'><th><label for='moralityChoice'>Morality:</label></th><td>
    <select id='moralityChoice' name='moralityChoice'>
        <option value='Good'>Good</option>
        <option value='Neutral'>Neutral</option>
        <option value='Evil'>Evil</option>
    </select>
</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowMaxHP'><th><label for='MaxHP'>Monster Name:</label></th><td><select id='CreatureSubtype' name='CreatureSubtype'></select></td></tr>"]

[h:html.dialog5("Monster Creation","lib://pm.a5e.core/CreateMonster.html?cachelib=false","value="+base64.encode(monsterCreationHTML))]